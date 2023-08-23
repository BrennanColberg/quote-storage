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
  setSource: (source?: z.infer<typeof sourceSchema>) => void
  texts: (Text & { authors: Person[] })[]
  setTexts: Dispatch<SetStateAction<Text[]>>
  authorIds: string[]
  editions: Edition[]
  setEditions: Dispatch<SetStateAction<Edition[]>>
}) {
  return (
    <div className="border-4 border-neutral-400 p-2 rounded-md">
      <h3 className="text-center font-semibold text-xl text-neutral-400">
        Source {i + 1}{" "}
        <Button
          variant="destructive"
          onClick={(e) => {
            e.preventDefault()
            setSource(undefined)
          }}
          className="h-6 ml-2"
        >
          Remove
        </Button>
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
          id={`primary-${i}`}
          checked={source.primary}
          onCheckedChange={(state) =>
            setSource({ ...source, primary: state === true })
          }
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor={`primary-${i}`}
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            This text is the <b>primary source</b> for this quote.
          </label>
        </div>
      </div>

      {source.citations.map((citation, j) => (
        <EditCitationSubform
          citation={citation}
          i={i}
          j={j}
          key={j}
          setCitation={(citation) => {
            let newCitations = [...source.citations]
            newCitations[j] = citation
            newCitations = newCitations.filter((x) => x !== undefined)
            setSource({ ...source, citations: newCitations })
          }}
          editions={editions}
          setEditions={setEditions}
          text={texts.find((text) => text.id === source.textId)}
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
