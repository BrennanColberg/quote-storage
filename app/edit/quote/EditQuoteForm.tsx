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
import CreatableSelect from "react-select/creatable"
import { useMemo, useState } from "react"
import axios from "axios"
import { Person } from "@prisma/client"
import quoteSchema from "./quoteSchema"

export function EditQuoteForm({
  persons: initialPersons,
}: {
  persons: Person[]
}) {
  const [persons, setPersons] = useState(initialPersons)
  const personOptions = useMemo(
    () => persons.map((person) => ({ value: person.id, label: person.name })),
    [persons],
  )

  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      content: "",
      authorId: undefined,
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof quoteSchema>) {
    await axios.post("/api/quote", values)
    alert("Created quote!")
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-xl mx-auto mt-5"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="In the beginning..." field={field} />
              </FormControl>
              <FormDescription>
                This "is" the quote, as you'd say or refer to it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <CreatableSelect
                  options={personOptions}
                  onChange={(newValue) => {
                    field.onChange({ target: { value: newValue.value } })
                  }}
                  value={
                    personOptions.find(
                      (person) => person.value === field.value,
                    ) ?? null
                  }
                  onCreateOption={async (inputValue) => {
                    const person = await axios.post("/api/person", {
                      name: inputValue,
                    })
                    setPersons((x) => [...x, person.data])
                    field.onChange({ target: { value: person.data.id } })
                    // opens a new tab to edit the person (which will close when done)
                    window.open(
                      `/edit/person/${person.data.id}?from=quote`,
                      "_blank",
                    )
                  }}
                />
              </FormControl>
              <FormDescription>Who said this?</FormDescription>
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
