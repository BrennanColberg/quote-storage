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
import publisherSchema from "./publisherSchema"
import { Publisher } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import GoogleButton from "../../GoogleButton"

export default function EditPublisherForm({
  publisher: initialPublisher,
}: {
  publisher?: Publisher
}) {
  const searchParams = useSearchParams()
  const closeOnSubmit = searchParams.has("from")

  const form = useForm<z.infer<typeof publisherSchema>>({
    resolver: zodResolver(publisherSchema),
    defaultValues: initialPublisher
      ? {
          name: initialPublisher.name,
          url: initialPublisher.url ?? "",
          location: initialPublisher.location ?? "",
          notes: initialPublisher.notes ?? "",
        }
      : {
          name: "",
          url: "",
          location: "",
          notes: "",
        },
  })

  async function onSubmit(values: z.infer<typeof publisherSchema>) {
    if (initialPublisher) {
      // edit
      await axios.put("/api/publisher", { ...values, id: initialPublisher.id })
      if (closeOnSubmit) return window.close()
      alert("Updated publisher!")
      location.reload()
    } else {
      // create
      await axios.post("/api/publisher", values)
      alert("Created publisher!")
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="flex flex-row">
                  <Input field={field} />
                  <GoogleButton query={`${form.getValues("name")} location`} />
                </div>
              </FormControl>
              <FormDescription>
                The city/state/country they are based in (for citation purposes)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
