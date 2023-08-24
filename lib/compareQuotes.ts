import { Citation, Quote, Source } from "@prisma/client"
import compareCitations from "./compareCitations"

export type QuoteWithCitations = Quote & {
  sources: (Source & { citations: Citation[] })[]
}

export default function compareQuotes(
  a: QuoteWithCitations,
  b: QuoteWithCitations,
): number {
  // find citations in both quotes that have the same thingId
  const aCitations = a.sources.flatMap((source) => source.citations)
  const bCitations = b.sources.flatMap((source) => source.citations)
  const aThingIds = aCitations.map((citation) => citation.thingId)
  const bThingIds = bCitations.map((citation) => citation.thingId)
  const commonThingIds = aThingIds.filter((thingId) =>
    bThingIds.includes(thingId),
  )

  // no overlapping citations = incomparable = "equal"
  if (commonThingIds.length === 0) return 0

  // all overlapping comparisons must match...
  // (TODO option to prioritize comparisons from a given thing/text?)
  const comparisons = commonThingIds.map((thingId) => {
    const aCitation = aCitations.find((c) => c.thingId === thingId)
    const bCitation = bCitations.find((c) => c.thingId === thingId)
    return Math.sign(compareCitations(aCitation, bCitation))
  })
  const result = comparisons[0]
  if (comparisons.every((c) => c === result)) return result
  // ...otherwise they're "equal"
  else return 0
}
