import { z } from "zod"
import sourceSchema from "./sourceSchema"
import SelectText from "../SelectText"
import { Dispatch, SetStateAction } from "react"
import { Text } from "@prisma/client"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

export default function EditSourceSubform({
  source,
  setSource,
  texts,
  setTexts,
  i,
  authorIds,
}: {
  source: z.infer<typeof sourceSchema>
  i: number
  setSource: (source: z.infer<typeof sourceSchema>) => void
  texts: Text[]
  setTexts: Dispatch<SetStateAction<Text[]>>
  authorIds: string[]
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

      {/* <Button
        variant="outline"
        size="lg"
        onClick={(e) => {
          e.preventDefault()
          setSource({ ...source, citations: [...(source.citations ?? []), {}] })
        }}
      >
        Add citation
      </Button> */}
    </div>
  )
}
