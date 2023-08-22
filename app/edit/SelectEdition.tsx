import { Edition, Person, Text } from "@prisma/client"
import axios from "axios"
import { Dispatch, SetStateAction, useMemo } from "react"
import CreatableSelect from "react-select/creatable"

export default function SelectEdition({
  editions,
  setEditions,
  editionId,
  setEditionId,
  text,
}: {
  editions: Edition[]
  setEditions: Dispatch<SetStateAction<Edition[]>>
  editionId?: string
  setEditionId: (value?: string) => void
  text: Text & { authors: Person[] }
}) {
  const editionOptions = useMemo(
    () =>
      editions.map((edition) => ({ value: edition.id, label: edition.title })),
    [editions],
  )
  return (
    <CreatableSelect
      options={[{ label: "[AUTO]", value: "auto" }, ...editionOptions]}
      onChange={async (option) => {
        if (option.value === "auto") {
          // "auto" option -> create edition as close to current text as possible
          const edition = await axios.post("/api/edition", {
            title: text.title,
            subtitle: text.subtitle,
            year: text.year,
            authorIds: text.authors.map((a) => a.id),
            translatorIds: [],
            editorIds: [],
            textIds: [text.id],
          })
          setEditions((x) => [...x, edition.data])
          setEditionId(edition.data.id)
          // opens a new tab to edit the person (which will close when done)
          window.open(`/edit/edition/${edition.data.id}?from=quote`, "_blank")
        } else setEditionId(option.value)
      }}
      value={
        editionOptions.find((edition) => editionId?.includes(edition.value)) ??
        null
      }
      onCreateOption={async (inputValue) => {
        const edition = await axios.post("/api/edition", {
          title: inputValue,
          authorIds: text.authors.map((a) => a.id),
          translatorIds: [],
          editorIds: [],
          textIds: [text.id],
        })
        setEditions((x) => [...x, edition.data])
        setEditionId(edition.data.id)
        // opens a new tab to edit the person (which will close when done)
        window.open(`/edit/edition/${edition.data.id}?from=quote`, "_blank")
      }}
    />
  )
}
