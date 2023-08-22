import { z } from "zod"
import sourceSchema from "./sourceSchema"
import SelectText from "../SelectText"
import { Dispatch, SetStateAction } from "react"
import { Edition, Person, Text } from "@prisma/client"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import EditCitationSubform from "./EditCitationSubform"

export default function EditSourceSubform({
  source,
  setSource,
  editions,
  setEditions,
  texts,
  setTexts,
  i,
  authorIds,
}: {
  source: z.infer<typeof sourceSchema>
  i: number
  setSource: (source: z.infer<typeof sourceSchema>) => void
  texts: (Text & { authors: Person[] })[]
  setTexts: Dispatch<SetStateAction<Text[]>>
  authorIds: string[]
  editions: Edition[]
  setEditions: Dispatch<SetStateAction<Edition[]>>
}) {
  return (
    <div className="border-4 border-neutral-400 p-2 rounded-md">
      <h3 className="text-center font-semibold text-xl text-neutral-400">
        Source {i + 1}
      </h3>
      <FormItem>
        <FormLabel>Text</FormLabel>
        <FormControl>
          <SelectText
            authorIds={authorIds}
            textId={source.textId}
            setTextId={(textId) => setSource({ ...source, textId })}
            texts={texts}
            setTexts={setTexts}
          />
        </FormControl>
      </FormItem>

      <div className="items-top flex space-x-2 my-4">
        <Checkbox
          id="primary"
          checked={source.primary}
          onCheckedChange={(state) =>
            setSource({ ...source, primary: state === true })
          }
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="primary"
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            This text is the <b>primary source</b> for this quote.
          </label>
        </div>
      </div>

      {source.citations.map((citation, j) => (
        <EditCitationSubform
          textId={source.textId}
          citation={citation}
          i={i}
          j={j}
          key={j}
          setCitation={(citation) => {
            const newCitations = [...source.citations]
            newCitations[j] = citation
            setSource({ ...source, citations: newCitations })
          }}
          editions={editions}
          setEditions={setEditions}
          authorIds={
            // we prefer to base editions on the text's authors
            // (TODO auto-update when a text's details are edited)
            texts
              .find((text) => text.id === source.textId)
              ?.authors.map((author) => author.id) ??
            // but if that's not available we'll use the quote's authors
            authorIds
          }
        />
      ))}

      {source.textId && (
        <Button
          variant="outline"
          size="lg"
          className="mt-4"
          onClick={(e) => {
            e.preventDefault()
            setSource({
              ...source,
              citations: [...(source.citations ?? []), {}],
            })
          }}
        >
          Add citation
        </Button>
      )}
    </div>
  )
}
