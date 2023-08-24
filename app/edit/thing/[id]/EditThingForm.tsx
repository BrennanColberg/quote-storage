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
import thingSchema from "./thingSchema"
import { Person, Thing, ThingType, Publisher, Text } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import SelectPersons from "../../SelectPersons"
import Select from "react-select"
import SelectPublisher from "../../SelectPublisher"
import useOptions from "../../useOptions"
import SelectTexts from "../../SelectTexts"
import { generateID } from "@/lib/id"

export default function EditThingForm({
  thing: initialThing,
}: {
  thing?: Thing & {
    authors: Person[]
    editors: Person[]
    translators: Person[]
    publisher?: Publisher
    texts: Text[]
  }
}) {
  const [persons, setPersons] = useState<Person[]>([])
  useOptions("person", setPersons)
  const [texts, setTexts] = useState<Text[]>([])
  useOptions("text", setTexts)
  const [publishers, setPublishers] = useState<Publisher[]>([])
  useOptions("publisher", setPublishers)

  const searchParams = useSearchParams()
  const closeOnSubmit = searchParams.has("from")

  const form = useForm<z.infer<typeof thingSchema>>({
    resolver: zodResolver(thingSchema),
    defaultValues: initialThing
      ? {
          id: initialThing.id,
          title: initialThing.title,
          subtitle: initialThing.subtitle ?? "",
          year: initialThing.year ?? "",
          publisherId: initialThing.publisher?.id ?? "",
          authorIds: initialThing.authors.map((a) => a.id),
          editorIds: initialThing.editors.map((a) => a.id),
          translatorIds: initialThing.translators.map((a) => a.id),
          textIds: initialThing.texts.map((a) => a.id),
          notes: initialThing.notes ?? "",
          type: initialThing.type,
          url: initialThing.url ?? "",
        }
      : {
          id: generateID(),
          title: "",
          subtitle: "",
          year: "",
          publisherId: "",
          authorIds: [],
          editorIds: [],
          translatorIds: [],
          notes: "",
          type: null,
          url: "",
        },
  })

  async function onSubmit(values: z.infer<typeof thingSchema>) {
    if (initialThing) {
      // edit
      await axios.put(`/api/thing?id=${initialThing.id}`, values)
      if (closeOnSubmit) return window.close()
      alert("Updated thing!")
      location.assign(`/edit/thing/${values.id}`)
    } else {
      // create
      await axios.post("/api/thing", values)
      alert("Created thing!")
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

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    options={Object.values(ThingType).map((type) => ({
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
            name="publisherId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publisher</FormLabel>
                <FormControl>
                  <SelectPublisher
                    publishers={publishers}
                    setPublishers={setPublishers}
                    setPublisherId={(publisherId) =>
                      form.setValue("publisherId", publisherId)
                    }
                    publisherId={field.value}
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
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="editorIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Editor(s)</FormLabel>
                <FormControl>
                  <SelectPersons
                    personIds={field.value}
                    setPersonIds={(value) => form.setValue("editorIds", value)}
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
            name="translatorIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Translator(s)</FormLabel>
                <FormControl>
                  <SelectPersons
                    personIds={field.value}
                    setPersonIds={(value) =>
                      form.setValue("translatorIds", value)
                    }
                    persons={persons}
                    setPersons={setPersons}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="textIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text(s)</FormLabel>
              <FormControl>
                <SelectTexts
                  authorIds={form.getValues("authorIds")}
                  textIds={field.value}
                  setTextIds={(textIds) => form.setValue("textIds", textIds)}
                  texts={texts}
                  setTexts={setTexts}
                />
              </FormControl>
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
