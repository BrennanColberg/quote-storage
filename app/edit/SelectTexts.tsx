import { Person, Text } from "@prisma/client"
import axios from "axios"
import { Dispatch, SetStateAction, useMemo } from "react"
import CreatableSelect from "react-select/creatable"

export default function SelectTexts({
  texts,
  setTexts,
  textIds,
  setTextIds,
  authorIds,
}: {
  texts: Text[]
  setTexts: Dispatch<SetStateAction<(Text & { authors: Person[] })[]>>
  textIds: string[]
  setTextIds: (value: string[]) => void
  authorIds: string[]
}) {
  const textOptions = useMemo(
    () => texts.map((text) => ({ value: text.id, label: text.title })),
    [texts],
  )

  return (
    <CreatableSelect
      isMulti
      options={textOptions}
      onChange={(options) => setTextIds(options.map((option) => option.value))}
      value={textOptions.filter((text) => textIds.includes(text.value)) ?? null}
      onCreateOption={async (inputValue) => {
        const text = await axios.post<Text>("/api/text", {
          title: inputValue,
          authorIds: authorIds,
        })
        setTexts((x) => [...x, { ...text.data, authors: [] }])
        setTextIds([...textIds, text.data.id])
        // opens a new tab to edit the person (which will close when done)
        window.open(`/edit/text/${text.data.id}?from=quote`, "_blank")
      }}
    />
  )
}
