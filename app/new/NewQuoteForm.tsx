"use client"

import { Textarea } from "@/components/ui/textarea"
import { Person } from "@prisma/client"
import axios from "axios"
import { useMemo, useState } from "react"
import CreatableSelect from "react-select/creatable"

export default function NewQuoteForm({
  persons: initialPersons,
}: {
  persons: Person[]
}) {
  const [persons, setPersons] = useState<Person[]>(initialPersons)
  const personOptions = useMemo(
    () => persons.map((person) => ({ value: person.id, label: person.name })),
    [persons],
  )

  const [text, setText] = useState("")

  const [personId, setPersonId] = useState(null)

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await axios.post("/api/quotes", {
          text,
          authorIds: personId ? [personId] : [],
        })
        setText("")
      }}
    >
      <Textarea
        name="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* authors */}
      <CreatableSelect
        options={personOptions}
        onChange={(newValue) => {
          console.log(newValue)
          setPersonId(newValue.value)
        }}
        value={personOptions.find((person) => person.value === personId)}
        onCreateOption={async (inputValue) => {
          const person = await axios.post("/api/persons", { name: inputValue })
          setPersons((x) => [...x, person.data])
          setPersonId(person.data.id)
        }}
      />

      <button type="submit">Add Quote</button>
    </form>
  )
}
