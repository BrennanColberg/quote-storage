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
import editionSchema from "./editionSchema"
import { Person, Edition, EditionType, Publisher, Text } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import SelectPerson from "../../SelectPerson"
import Select from "react-select"
import SelectText from "../../SelectText"
import SelectPublisher from "../../SelectPublisher"

export default function EditEditionForm({
  edition: initialEdition,
  persons: initialPersons,
  texts: initialTexts,
  publishers: initialPublishers,
}: {
  edition?: Edition & {
    authors: Person[]
    editors: Person[]
    translators: Person[]
    publisher?: Publisher
    texts: Text[]
  }
  persons: Person[]
  texts: Text[]
  publishers: Publisher[]
}) {
  const [persons, setPersons] = useState(initialPersons)
  const [texts, setTexts] = useState(initialTexts)
  const [publishers, setPublishers] = useState(initialPublishers)

  const searchParams = useSearchParams()
  const closeOnSubmit = searchParams.has("from")

  console.log("initial edition", initialEdition)
  const form = useForm<z.infer<typeof editionSchema>>({
    resolver: zodResolver(editionSchema),
    defaultValues: initialEdition
      ? {
          title: initialEdition.title,
          subtitle: initialEdition.subtitle ?? "",
          year: initialEdition.year ?? "",
          publisherId: initialEdition.publisher?.id ?? "",
          authorIds: initialEdition.authors.map((a) => a.id),
          editorIds: initialEdition.editors.map((a) => a.id),
          translatorIds: initialEdition.translators.map((a) => a.id),
          textIds: initialEdition.texts.map((a) => a.id),
          notes: initialEdition.notes ?? "",
          type: initialEdition.type,
          url: initialEdition.url ?? "",
        }
      : {
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

  async function onSubmit(values: z.infer<typeof editionSchema>) {
    console.log(values)
    if (initialEdition) {
      // edit
      await axios.put("/api/edition", { ...values, id: initialEdition.id })
      if (closeOnSubmit) return window.close()
      alert("Updated edition!")
      location.reload()
    } else {
      // create
      await axios.post("/api/edition", values)
      alert("Created edition!")
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
                    options={Object.values(EditionType).map((type) => ({
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
                  <SelectPerson
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
                  <SelectPerson
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
                  <SelectPerson
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
                <SelectText
                  authorIds={form.getValues("authorIds")}
                  textId={field.value[0]}
                  setTextId={(textId) => form.setValue("textIds", [textId])}
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
