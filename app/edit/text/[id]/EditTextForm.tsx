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
import { Person, Text, TextType } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import SelectPerson from "../../SelectPerson"
import Select from "react-select"
import useOptions from "../../useOptions"
import GoogleButton from "../../GoogleButton"

export default function EditTextForm({
  text: initialText,
}: {
  text?: Text & { authors: Person[] }
}) {
  const [persons, setPersons] = useState<Person[]>([])
  useOptions("person", setPersons)

  const searchParams = useSearchParams()
  const closeOnSubmit = searchParams.has("from")

  const form = useForm<z.infer<typeof textSchema>>({
    resolver: zodResolver(textSchema),
    defaultValues: initialText
      ? {
          title: initialText.title,
          subtitle: initialText.subtitle ?? "",
          year: initialText.year ?? "",
          notes: initialText.notes ?? "",
          authorIds: initialText.authors.map((a) => a.id),
          type: initialText.type,
        }
      : {
          title: "",
          subtitle: "",
          year: "",
          notes: "",
          authorIds: [],
          type: null,
        },
  })

  async function onSubmit(values: z.infer<typeof textSchema>) {
    if (initialText) {
      // edit
      await axios.put("/api/text", { ...values, id: initialText.id })
      if (closeOnSubmit) return window.close()
      alert("Updated text!")
      location.reload()
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="authorIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
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
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year first published</FormLabel>
                <FormControl>
                  <div className="flex flex-row">
                    <Input field={field} />
                    <GoogleButton
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
