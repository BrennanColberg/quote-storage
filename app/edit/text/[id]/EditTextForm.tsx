"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import textSchema from "./textSchema"
import { Person, Text } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import SelectPerson from "../../SelectPerson"

export default function EditTextForm({
  text: initialText,
  persons: initialPersons,
}: {
  text?: Text & { authors: Person[] }
  persons: Person[]
}) {
  const [persons, setPersons] = useState(initialPersons)

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
        }
      : { title: "", subtitle: "", year: "", notes: "", authorIds: [] },
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
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
