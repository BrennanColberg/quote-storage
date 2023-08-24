import { Person } from "@prisma/client"
import axios from "axios"
import { Dispatch, SetStateAction, useMemo } from "react"
import CreatableSelect from "react-select/creatable"

export default function SelectPersons({
  persons,
  setPersons,
  personIds,
  setPersonIds,
}: {
  persons: Person[]
  setPersons: Dispatch<SetStateAction<Person[]>>
  personIds: string[]
  setPersonIds: (value: string[]) => void
}) {
  const personOptions = useMemo(
    () => persons.map((person) => ({ value: person.id, label: person.name })),
    [persons],
  )

  return (
    <CreatableSelect
      isMulti
      options={personOptions}
      onChange={(selectedOptions) =>
        setPersonIds(selectedOptions.map((option) => option.value))
      }
      value={personOptions.filter((person) => personIds.includes(person.value))}
      onCreateOption={async (inputValue) => {
        const person = await axios.post("/api/person", {
          name: inputValue,
        })
        setPersons((x) => [...x, person.data])
        setPersonIds([...personIds, person.data.id])
        // opens a new tab to edit the person (which will close when done)
        window.open(`/edit/person/${person.data.id}?from=quote`, "_blank")
      }}
    />
  )
}
