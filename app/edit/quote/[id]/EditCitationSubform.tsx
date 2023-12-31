import { z } from "zod"
import citationSchema from "./citationSchema"
import { Thing, ThingType, Person, Publisher, Text } from "@prisma/client"
import { Dispatch, SetStateAction } from "react"
import SelectThing from "../../SelectThing"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function EditCitationSubform({
  i,
  j,
  citation,
  setCitation,
  things,
  setThings,
  text,
}: {
  i: number
  j: number
  things: (Thing & { publisher?: Publisher; texts?: Text[] })[]
  setThings: Dispatch<SetStateAction<Thing[]>>
  citation: z.infer<typeof citationSchema>
  setCitation: (citation: z.infer<typeof citationSchema>) => void
  text: Pick<Text, "title" | "subtitle" | "year"> & {
    authors: Person[]
    id?: string
  }
}) {
  const thing = things.find((thing) => thing.id === citation.thingId)
  let markerType: "page" | "time" | "none" | "any"
  switch (thing?.type) {
    case ThingType.HARDCOVER:
    case ThingType.PAPERBACK:
    case ThingType.LEATHERBOUND:
    case ThingType.PDF:
      markerType = "page"
      break
    case ThingType.VIDEO_RECORDING:
    case ThingType.AUDIO_RECORDING:
      markerType = "time"
      break
    case ThingType.WEBSITE:
      markerType = "none"
      break
    default:
      markerType = "any"
  }

  return (
    <div key={j} className="border-4 border-neutral-300 my-2 p-2">
      <div className="flex flex-row gap-4 items-end">
        <FormItem className="flex-grow">
          <FormLabel>Thing</FormLabel>
          <FormControl>
            <SelectThing
              things={things}
              setThings={setThings}
              thingId={citation.thingId}
              setThingId={(thingId) => setCitation({ ...citation, thingId })}
              text={text}
            />
          </FormControl>
        </FormItem>
        <Button
          variant="destructive"
          onClick={(e) => {
            e.preventDefault()
            setCitation(undefined)
          }}
        >
          Remove
        </Button>
      </div>

      {markerType !== "none" && (
        <div className="flex flex-row justify-evenly gap-4">
          <FormItem>
            <FormLabel>
              Start{" "}
              {markerType === "page"
                ? "page"
                : markerType === "time"
                ? "time"
                : "page/time"}
            </FormLabel>
            <FormControl>
              <Input
                value={citation.start ?? ""}
                setValue={(start) => setCitation({ ...citation, start })}
              />
            </FormControl>
          </FormItem>
          {markerType !== "time" && (
            <FormItem>
              <FormLabel>
                Start line{markerType === "any" && " (if applicable)"}
              </FormLabel>
              <FormControl>
                <Input
                  value={citation.startLine ?? ""}
                  setValueAsNumber={(startLine) => {
                    if (startLine === 0 || Number.isNaN(startLine))
                      startLine = undefined
                    setCitation({ ...citation, startLine })
                  }}
                />
              </FormControl>
            </FormItem>
          )}{" "}
          <FormItem>
            <FormLabel>End, if different</FormLabel>
            <FormControl>
              <Input
                value={citation.end ?? ""}
                setValue={(end) => setCitation({ ...citation, end })}
              />
            </FormControl>
          </FormItem>
        </div>
      )}
    </div>
  )
}
