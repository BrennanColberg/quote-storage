import { Thing, Person, Publisher, Text } from "@prisma/client"
import axios from "axios"
import { Dispatch, SetStateAction, useMemo } from "react"
import Select from "react-select"

export default function SelectThing({
  things,
  setThings,
  thingId,
  setThingId,
  text,
}: {
  things: (Thing & { publisher?: Publisher; texts?: Text[] })[]
  setThings: Dispatch<SetStateAction<Thing[]>>
  thingId?: string
  setThingId: (value?: string) => void
  text?: Pick<Text, "title" | "subtitle" | "year"> & {
    authors: Person[]
    id?: string
  }
}) {
  const thingOptions = useMemo(
    () =>
      things
        // only show things that contain the current text
        .filter(
          (thing) => !text.id || thing.texts.find((et) => et.id === text?.id),
        )
        .map((thing) => {
          let label: string = thing.type
          if (!text.id) label = `"${thing.title}" ${label}`
          if (thing.publisher && thing.year)
            label += ` (${thing.publisher.name}, ${thing.year})`
          else if (thing.publisher) label += ` (${thing.publisher.name})`
          else if (thing.year) label += ` (${thing.year})`
          if (thing.volume) label += ` vol. ${thing.volume}`
          return { label, value: thing.id }
        }),
    [things],
  )
  return (
    <Select
      options={[
        { label: "→ create new from Text", value: "create" },
        ...thingOptions,
      ]}
      onChange={async (option) => {
        if (option.value === "create") {
          // "auto" option -> create thing as close to current text as possible
          const thing = await axios.post("/api/thing", {
            title: text.title,
            subtitle: text.subtitle || undefined,
            year: text.year || undefined,
            authorIds: text.authors.map((a) => a.id),
            translatorIds: [],
            editorIds: [],
            textIds: text.id ? [text.id] : [],
          })
          setThings((x) => [...x, { ...thing.data, texts: [text] }])
          setThingId(thing.data.id)
          // opens a new tab to edit the person (which will close when done)
          window.open(`/edit/thing/${thing.data.id}?from=quote`, "_blank")
        } else setThingId(option.value)
      }}
      value={
        thingOptions.find((thing) => thingId?.includes(thing.value)) ?? null
      }
    />
  )
}
