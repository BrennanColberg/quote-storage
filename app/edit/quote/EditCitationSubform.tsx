import { z } from "zod"
import citationSchema from "./citationSchema"
import { Edition, Person, Text } from "@prisma/client"
import { Dispatch, SetStateAction } from "react"
import SelectEdition from "../SelectEdition"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"

export default function EditCitationSubform({
  i,
  j,
  citation,
  setCitation,
  editions,
  setEditions,
  text,
}: {
  i: number
  j: number
  editions: Edition[]
  setEditions: Dispatch<SetStateAction<Edition[]>>
  citation: z.infer<typeof citationSchema>
  setCitation: (citation: z.infer<typeof citationSchema>) => void
  text: Text & { authors: Person[] }
}) {
  return (
    <div key={j} className="border-4 border-neutral-300">
      <h4 className="text-center font-lg text-neutral-300 font-bold">
        Citation {i + 1}.{j + 1}
      </h4>

      {/* Edition */}
      <FormItem>
        <FormLabel>Edition</FormLabel>
        <FormControl>
          <SelectEdition
            editions={editions}
            setEditions={setEditions}
            editionId={citation.editionId}
            setEditionId={(editionId) => {
              console.log("setting edition id", editionId)
              setCitation({ ...citation, editionId })
            }}
            text={text}
          />
        </FormControl>
      </FormItem>

      {/* Page */}

      {/* Line */}
    </div>
  )
}
