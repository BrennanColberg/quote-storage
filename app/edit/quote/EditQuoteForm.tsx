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
import { useRef, useState } from "react"
import axios from "axios"
import { Edition, Person, Text } from "@prisma/client"
import quoteSchema from "./quoteSchema"
import SelectPerson from "../SelectPerson"
import EditSourceSubform from "./EditSourceSubform"
import useOptions from "../useOptions"

export function EditQuoteForm() {
  const [persons, setPersons] = useState<Person[]>([])
  useOptions("person", setPersons)
  const [texts, setTexts] = useState<(Text & { authors: Person[] })[]>([])
  useOptions("text", setTexts)
  const [editions, setEditions] = useState<Edition[]>([])
  useOptions("edition", setEditions)

  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      content: "",
      authorIds: [],
      notes: "",
      sources: [],
    },
  })

  const contentRef = useRef<HTMLTextAreaElement>(null)
  async function onSubmit(values: z.infer<typeof quoteSchema>) {
    console.log(values)
    await axios.post("/api/quote", values)

    // reset things that are different between "adjacent" quotes
    form.resetField("content")
    form.resetField("notes")

    // refocus on content to start entering next quote
    contentRef.current.focus()
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
                <Textarea
                  placeholder="In the beginning..."
                  field={field}
                  ref={contentRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="sources"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                  {field.value.map((source, i) => (
                    <EditSourceSubform
                      editions={editions}
                      setEditions={setEditions}
                      key={i}
                      authorIds={form.getValues().authorIds}
                      texts={texts}
                      setTexts={setTexts}
                      source={source}
                      i={i}
                      setSource={(newSource) => {
                        let newSources = [...field.value]
                        newSources[i] = newSource
                        newSources = newSources.filter((x) => x !== undefined)
                        form.setValue("sources", newSources)
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
                  form.setValue("sources", [
                    ...field.value,
                    { citations: [], primary: false },
                  ])
                }}
              >
                Add source
              </Button>
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
