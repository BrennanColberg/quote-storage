"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import textSchema from "./textSchema"
import {
  Citation,
  Person,
  Publisher,
  Subtext,
  Text,
  TextType,
  Thing,
} from "@prisma/client"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import SelectPersons from "../../SelectPersons"
import Select from "react-select"
import useOptions from "../../useOptions"
import SearchButton from "../../SearchButton"
import { generateID } from "@/lib/id"
import { v4 as uuid } from "uuid"
import EditSubtextSubform from "./EditSubtextSubform"

export default function EditTextForm({
  text: initialText,
}: {
  text?: Text & {
    authors: Person[]
    characters: Person[]
    subtexts: (Subtext & { citations: Citation[] })[]
  }
}) {
  const [persons, setPersons] = useState<Person[]>([])
  useOptions("person", setPersons)
  const [things, setThings] = useState<
    (Thing & { publisher?: Publisher; texts: Text[] })[]
  >([])
  useOptions("thing", setThings)

  const searchParams = useSearchParams()
  const closeOnSubmit = searchParams.has("from")

  const form = useForm<z.infer<typeof textSchema>>({
    resolver: zodResolver(textSchema),
    defaultValues: initialText
      ? {
          id: initialText.id,
          title: initialText.title,
          subtitle: initialText.subtitle ?? "",
          year: initialText.year ?? "",
          notes: initialText.notes ?? "",
          authorIds: initialText.authors.map((a) => a.id),
          characterIds: initialText.characters.map((a) => a.id),
          type: initialText.type,
          subtexts: initialText.subtexts.map((subtext) => ({
            id: subtext.id,
            title: subtext.title,
            ordinal: subtext.ordinal ?? "",
            notes: subtext.notes ?? "",
            citations: subtext.citations.map((citation) => ({
              id: citation.id,
              thingId: citation.thingId,
              start: citation.start ?? "",
              startLine: citation.startLine ?? undefined,
              end: citation.end ?? "",
            })),
          })),
        }
      : {
          id: generateID(),
          title: "",
          subtitle: "",
          year: "",
          notes: "",
          authorIds: [],
          characterIds: [],
          type: null,
          subtexts: [],
        },
  })
  console.log(form.getValues())

  async function onSubmit(values: z.infer<typeof textSchema>) {
    if (initialText) {
      // edit
      await axios.put(`/api/text?id=${initialText.id}`, values)
      if (closeOnSubmit) return window.close()
      alert("Updated text!")
      location.assign(`/edit/text/${values.id}`)
    } else {
      // create
      await axios.post("/api/text", values)
      alert("Created text!")
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-xl mx-auto mt-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="authorIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author(s)</FormLabel>
                <FormControl>
                  <SelectPersons
                    personIds={field.value}
                    setPersonIds={(value) => form.setValue("authorIds", value)}
                    persons={persons}
                    setPersons={setPersons}
                    allowFictional={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year first published</FormLabel>
                <FormControl>
                  <div className="flex flex-row">
                    <Input field={field} />
                    <SearchButton
                      query={`${form.getValues("title")} year first published`}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="characterIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Characters</FormLabel>
              <FormControl>
                <SelectPersons
                  personIds={field.value}
                  setPersonIds={(value) => form.setValue("characterIds", value)}
                  persons={persons}
                  setPersons={setPersons}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
                  options={Object.values(TextType).map((type) => ({
                    label: type,
                    value: type,
                  }))}
                  value={
                    field.value && { value: field.value, label: field.value }
                  }
                  onChange={(type) =>
                    form.setValue("type", type?.value ?? null)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* subtext add/edit form */}
        <FormField
          control={form.control}
          name="subtexts"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                  {field.value.map((subtext, i) => (
                    <EditSubtextSubform
                      text={{
                        id: "",
                        title: "",
                        subtitle: "",
                        year: "",
                        authors: form
                          .getValues()
                          .authorIds.map((id) =>
                            persons.find((p) => p.id === id),
                          ),
                        ...form.getValues(),
                        // don't include ID if creating a new text!
                        // because the link when creating a thing will fail
                        ...{ id: initialText?.id },
                      }}
                      things={things}
                      setThings={setThings}
                      key={i}
                      subtext={subtext}
                      i={i}
                      setSubtext={(newSubtext) => {
                        let newSubtexts = [...field.value]
                        newSubtexts[i] = newSubtext
                        newSubtexts = newSubtexts.filter((x) => x !== undefined)
                        form.setValue("subtexts", newSubtexts)
                      }}
                    />
                  ))}
                </>
              </FormControl>
              <Button
                variant="secondary"
                size="lg"
                onClick={(e) => {
                  e.preventDefault()
                  form.setValue("subtexts", [
                    ...field.value,
                    { citations: [], id: generateID(), title: "" },
                  ])
                }}
              >
                Add subtext
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
