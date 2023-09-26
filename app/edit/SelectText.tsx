import { Person, Text } from "@prisma/client"
import axios from "axios"
import { Dispatch, SetStateAction, useMemo } from "react"
import CreatableSelect from "react-select/creatable"
import { validate as isUuid } from "uuid"

export default function SelectText({
  texts,
  setTexts,
  textId,
  setTextId,
  authorIds,
}: {
  texts: Text[]
  setTexts: Dispatch<SetStateAction<(Text & { authors: Person[] })[]>>
  textId?: string
  setTextId: (value?: string) => void
  authorIds: string[]
}) {
  const textOptions = useMemo(
    () =>
      texts.map((text) => {
        let label = text.title
        if (text.subtitle) label += `: ${text.subtitle}`
        if (!isUuid(text.id)) label += ` [${text.id}]`
        return { value: text.id, label }
      }),
    [texts],
  )

  return (
    <CreatableSelect
      options={textOptions}
      onChange={(option) => setTextId(option.value)}
      value={textOptions.find((text) => textId === text.value) ?? null}
      onCreateOption={async (inputValue) => {
        const text = await axios.post<Text>("/api/text", {
          title: inputValue,
          authorIds: authorIds,
        })
        setTexts((x) => [...x, { ...text.data, authors: [] }])
        setTextId(text.data.id)
        // opens a new tab to edit the person (which will close when done)
        window.open(`/edit/text/${text.data.id}?from=quote`, "_blank")
      }}
    />
  )
}
