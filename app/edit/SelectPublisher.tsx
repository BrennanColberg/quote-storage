import { Publisher } from "@prisma/client"
import axios from "axios"
import { Dispatch, SetStateAction, useMemo } from "react"
import CreatableSelect from "react-select/creatable"

export default function SelectPublisher({
  publishers,
  setPublishers,
  publisherId,
  setPublisherId,
}: {
  publishers: Publisher[]
  setPublishers: Dispatch<SetStateAction<Publisher[]>>
  publisherId?: string
  setPublisherId: (value?: string) => void
}) {
  const publisherOptions = useMemo(
    () =>
      publishers.map((publisher) => ({
        value: publisher.id,
        label: publisher.name,
      })),
    [publishers],
  )

  return (
    <CreatableSelect
      options={publisherOptions}
      onChange={(option) => setPublisherId(option.value)}
      value={
        publisherOptions.find(
          (publisher) => publisherId?.includes(publisher.value),
        ) ?? null
      }
      onCreateOption={async (inputValue) => {
        const publisher = await axios.post<Publisher>("/api/publisher", {
          name: inputValue,
        })
        setPublishers((x) => [...x, { ...publisher.data }])
        setPublisherId(publisher.data.id)
        // opens a new tab to edit the publisher (which will close when done)
        window.open(`/edit/publisher/${publisher.data.id}?from=quote`, "_blank")
      }}
    />
  )
}
