import { Edition, Person, Publisher, Text } from "@prisma/client"
import axios from "axios"
import { Dispatch, SetStateAction, useMemo } from "react"
import Select from "react-select"

export default function SelectEdition({
  editions,
  setEditions,
  editionId,
  setEditionId,
  text,
}: {
  editions: (Edition & { publisher?: Publisher; texts: Text[] })[]
  setEditions: Dispatch<SetStateAction<Edition[]>>
  editionId?: string
  setEditionId: (value?: string) => void
  text: Text & { authors: Person[] }
}) {
  const editionOptions = useMemo(
    () =>
      editions
        // only show editions that contain the current text
        .filter((edition) => edition.texts.find((et) => et.id === text.id))
        .map((edition) => {
          let label: string = edition.type
          if (edition.publisher && edition.year)
            label += ` (${edition.publisher.name}, ${edition.year})`
          else if (edition.publisher) label += ` (${edition.publisher.name})`
          else if (edition.year) label += ` (${edition.year})`
          return { label, value: edition.id }
        }),
    [editions],
  )
  return (
    <Select
      options={[
        { label: "→ create new from Text", value: "create" },
        ...editionOptions,
      ]}
      onChange={async (option) => {
        if (option.value === "create") {
          // "auto" option -> create edition as close to current text as possible
          const edition = await axios.post("/api/edition", {
            title: text.title,
            subtitle: text.subtitle || undefined,
            year: text.year || undefined,
            authorIds: text.authors.map((a) => a.id),
            translatorIds: [],
            editorIds: [],
            textIds: [text.id],
          })
          setEditions((x) => [...x, { ...edition.data, texts: [text] }])
          setEditionId(edition.data.id)
          // opens a new tab to edit the person (which will close when done)
          window.open(`/edit/edition/${edition.data.id}?from=quote`, "_blank")
        } else setEditionId(option.value)
      }}
      value={
        editionOptions.find((edition) => editionId?.includes(edition.value)) ??
        null
      }
    />
  )
}
