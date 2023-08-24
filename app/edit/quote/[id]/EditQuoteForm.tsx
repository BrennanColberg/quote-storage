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
import { useRef, useState } from "react"
import axios from "axios"
import {
  Citation,
  Thing,
  Person,
  Publisher,
  Quote,
  Source,
  Text,
} from "@prisma/client"
import quoteSchema from "./quoteSchema"
import SelectPersons from "../../SelectPersons"
import EditSourceSubform from "./EditSourceSubform"
import useOptions from "../../useOptions"
import { useSearchParams } from "next/navigation"
import { v4 as uuid } from "uuid"

export function EditQuoteForm({
  quote: initialQuote,
}: {
  quote?: Quote & {
    authors: Person[]
    sources: (Source & { citations: Citation[] })[]
  }
}) {
  const searchParams = useSearchParams()
  const closeOnSubmit = searchParams.has("from")

  const [persons, setPersons] = useState<Person[]>([])
  useOptions("person", setPersons)
  const [texts, setTexts] = useState<(Text & { authors: Person[] })[]>([])
  useOptions("text", setTexts)
  const [things, setThings] = useState<
    (Thing & { publisher?: Publisher; texts: Text[] })[]
  >([])
  useOptions("thing", setThings)

  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: initialQuote
      ? {
          content: initialQuote.content,
          authorIds: initialQuote.authors.map((a) => a.id),
          notes: initialQuote.notes ?? "",
          sources: initialQuote.sources.map((source) => ({
            id: source.id,
            textId: source.textId,
            primary: source.primary,
            citations: source.citations.map((citation) => ({
              id: citation.id,
              thingId: citation.thingId,
              start: citation.start ?? "",
              startLine: citation.startLine ?? undefined,
              end: citation.end ?? "",
            })),
          })),
        }
      : {
          content: "",
          authorIds: [],
          notes: "",
          sources: [],
        },
  })

  const contentRef = useRef<HTMLTextAreaElement>(null)
  async function onSubmit(values: z.infer<typeof quoteSchema>) {
    if (!initialQuote) {
      await axios.post("/api/quote", values)

      // reset things that are different between "adjacent" quotes
      form.resetField("content")
      form.resetField("notes")
      form.setValue(
        "sources",
        form.getValues("sources").map((source) => ({
          ...source,
          citations: source.citations.map((citation) => ({
            ...citation,
            // remove start/end info from citations
            start: undefined,
            startLine: undefined,
            end: undefined,
          })),
        })),
      )

      // refocus on content to start entering next quote
      contentRef.current.focus()
      // scroll to top
      window.scrollTo(0, 0)
    } else {
      await axios.put("/api/quote", { ...values, id: initialQuote.id })
      if (closeOnSubmit) return window.close()
      alert("Quote updated!")
      location.reload()
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
          name="sources"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                  {field.value.map((source, i) => (
                    <EditSourceSubform
                      things={things}
                      setThings={setThings}
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
                    { citations: [], primary: false, id: uuid() },
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
