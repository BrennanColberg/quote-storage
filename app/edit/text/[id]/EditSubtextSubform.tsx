import { z } from "zod"
import subtextSchema from "./subtextSchema"
import { Person, Publisher, Text, Thing } from "@prisma/client"
import { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import EditCitationSubform from "../../quote/[id]/EditCitationSubform"
import { v4 as uuid } from "uuid"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function EditSubtextSubform({
  subtext,
  setSubtext,
  things,
  text,
  setThings,
  i,
}: {
  subtext: z.infer<typeof subtextSchema>
  i: number
  setSubtext: (subtext?: z.infer<typeof subtextSchema>) => void
  text: Pick<Text, "title" | "subtitle" | "year"> & {
    authors: Person[]
    id: string
  }
  things: (Thing & { publisher?: Publisher })[]
  setThings: Dispatch<SetStateAction<Thing[]>>
}) {
  return (
    <div className="border-4 border-neutral-400 p-2 rounded-md">
      {/* title */}
      {/* ordinal */}

      <div className="flex flex-row gap-4 items-end">
        <FormItem className="w-24">
          <FormLabel>Ordinal (#)</FormLabel>
          <FormControl>
            <Input
              value={subtext.ordinal ?? ""}
              setValue={(ordinal) =>
                setSubtext({ ...subtext, ordinal: ordinal || undefined })
              }
            />
          </FormControl>
        </FormItem>
        <FormItem className="flex-grow">
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input
              value={subtext.title ?? ""}
              setValue={(title) => setSubtext({ ...subtext, title })}
            />
          </FormControl>
        </FormItem>
        <Button
          variant="destructive"
          onClick={(e) => {
            e.preventDefault()
            setSubtext(undefined)
          }}
        >
          Remove
        </Button>
      </div>

      <FormItem>
        <FormLabel>Notes</FormLabel>
        <FormControl>
          <Textarea
            value={subtext.notes}
            onChange={(e) => setSubtext({ ...subtext, notes: e.target.value })}
          />
        </FormControl>
      </FormItem>

      {subtext.citations.map((citation, j) => (
        <EditCitationSubform
          citation={citation}
          i={i}
          j={j}
          key={j}
          setCitation={(citation) => {
            let newCitations = [...subtext.citations]
            newCitations[j] = citation
            newCitations = newCitations.filter((x) => x !== undefined)
            setSubtext({ ...subtext, citations: newCitations })
          }}
          things={things}
          setThings={setThings}
          text={text}
        />
      ))}

      <Button
        variant="outline"
        size="lg"
        className="mt-4"
        onClick={(e) => {
          e.preventDefault()
          setSubtext({
            ...subtext,
            citations: [...(subtext.citations ?? []), { id: uuid() }],
          })
        }}
      >
        Add citation
      </Button>
    </div>
  )
}
