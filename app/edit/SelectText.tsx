import { Text } from "@prisma/client"
import axios from "axios"
import { Dispatch, SetStateAction, useMemo } from "react"
import CreatableSelect from "react-select/creatable"

export default function SelectText({
  texts,
  setTexts,
  textId,
  setTextId,
  authorIds,
}: {
  texts: Text[]
  setTexts: Dispatch<SetStateAction<Text[]>>
  textId?: string
  setTextId: (value?: string) => void
  authorIds: string[]
}) {
  const textOptions = useMemo(
    () => texts.map((text) => ({ value: text.id, label: text.title })),
    [texts],
  )

  return (
    <CreatableSelect
      options={textOptions}
      onChange={(option) => setTextId(option.value)}
      value={textOptions.find((text) => textId?.includes(text.value)) ?? null}
      onCreateOption={async (inputValue) => {
        const text = await axios.post("/api/text", {
          title: inputValue,
          authorIds: authorIds,
        })
        setTexts((x) => [...x, text.data])
        setTextId(text.data.id)
        // opens a new tab to edit the person (which will close when done)
        window.open(`/edit/text/${text.data.id}?from=quote`, "_blank")
      }}
    />
  )
}