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
import personSchema from "./personSchema"
import { Person } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

export default function EditPersonForm({
  person: initialPerson,
}: {
  person?: Person
}) {
  const searchParams = useSearchParams()
  const closeOnSubmit = searchParams.has("from")
  const [showYears, setShowYears] = useState(true)

  const form = useForm<z.infer<typeof personSchema>>({
    resolver: zodResolver(personSchema),
    defaultValues: initialPerson
      ? {
          name: initialPerson.name,
          shortName: initialPerson.shortName ?? "",
          yearBorn: initialPerson.yearBorn ?? undefined,
          yearDied: initialPerson.yearDied ?? undefined,
          bio: initialPerson.bio ?? "",
          notes: initialPerson.notes ?? "",
          fictional: initialPerson.fictional,
        }
      : {
          name: "",
          shortName: "",
          yearBorn: "",
          yearDied: "",
          bio: "",
          notes: "",
          fictional: false,
        },
  })

  async function onSubmit(values: z.infer<typeof personSchema>) {
    if (initialPerson) {
      // edit
      await axios.put("/api/person", { ...values, id: initialPerson.id })
      if (closeOnSubmit) return window.close()
      alert("Updated person!")
      location.reload()
    } else {
      // create
      await axios.post("/api/person", values)
      alert("Created person!")
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input field={field} />
                </FormControl>
                <FormDescription>
                  Name of the person, as fully as is typical.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shortName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Name</FormLabel>
                <FormControl>
                  <Input field={field} />
                </FormControl>
                <FormDescription>
                  How you'd refer to them inline, if different.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          rules={{ required: false }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input field={field} />
              </FormControl>
              <FormDescription>
                A short description of the person; what they are most
                prominently known for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fictional"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="items-top flex space-x-2 my-4">
                  <Checkbox
                    id="fictional"
                    checked={field.value}
                    onCheckedChange={(state) => {
                      form.setValue("fictional", state === true)
                      setShowYears(state !== true)
                      if (state === true) {
                        form.setValue("yearBorn", "")
                        form.setValue("yearDied", "")
                      }
                    }}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="fictional"
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      This person is a fictional character.
                    </label>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showYears && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="yearBorn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Born</FormLabel>
                  <FormControl>
                    <Input field={field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Omit if not precisely known. BC = negative.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearDied"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Died (if applicable)</FormLabel>
                  <FormControl>
                    <Input field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

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
