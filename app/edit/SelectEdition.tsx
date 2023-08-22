import { Edition } from "@prisma/client"
import axios from "axios"
import { Dispatch, SetStateAction, useMemo } from "react"
import CreatableSelect from "react-select/creatable"

export default function SelectEdition({
  editions,
  setEditions,
  editionId,
  setEditionId,
  authorIds,
  textId,
}: {
  editions: Edition[]
  setEditions: Dispatch<SetStateAction<Edition[]>>
  editionId?: string
  setEditionId: (value?: string) => void
  authorIds: string[]
  textId: string
}) {
  const editionOptions = useMemo(
    () =>
      editions.map((edition) => ({ value: edition.id, label: edition.title })),
    [editions],
  )
  return (
    <CreatableSelect
      options={editionOptions}
      onChange={(option) => setEditionId(option.value)}
      value={
        editionOptions.find((edition) => editionId?.includes(edition.value)) ??
        null
      }
      onCreateOption={async (inputValue) => {
        const edition = await axios.post("/api/edition", {
          title: inputValue,
          authorIds: authorIds,
          textId,
        })
        setEditions((x) => [...x, edition.data])
        setEditionId(edition.data.id)
        // opens a new tab to edit the person (which will close when done)
        window.open(`/edit/edition/${edition.data.id}?from=quote`, "_blank")
      }}
    />
  )
}
