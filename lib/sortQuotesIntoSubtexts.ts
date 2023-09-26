// TODO make faster by manipulating IDs instead of objects?

import { QuoteProp } from "@/app/view/Quote"
import { Citation, Quote, Subtext } from "@prisma/client"
import compareCitations, { comparePlaces } from "./compareCitations"
import { SortableCitation } from "./SortableCitation"
import compareQuotes from "./compareQuotes"
import { typeOfPlace } from "./compareCitations"
import parseRoman, { arabicToRoman } from "./parseRoman"

export type SubtextProp = Subtext & {
  citations: Citation[]
}

export type SubtextBucket = {
  subtext?: SubtextProp
  quotes: QuoteProp[]
}

/**
 * The sorting problem is nearly intractable in the general case,
 * so we consider the case where all citations are within the same
 * Thing. This allows us to create a framework into which we can
 * later sort the remaining quotes based on the locations of some
 * with multiple citations.
 *
 * Simplifes *even further* by only considering ONE citation per
 * item. TODO put quotes into every subtext where they are cited??
 *
 * Note: citations without a start are not considered to be valid
 *
 * @returns the ID of the most commonly cited Thing, plus four lists
 * of {quotes, subtexts} that {do, don't} have a relevant citation;
 * items in those that do contain only one single relevant citation
 */
export function simplifyToMostCommonThing(
  quotes: QuoteProp[],
  subtexts: SubtextProp[],
): {
  thingId: string
  quotesNotInThing: QuoteProp[]
  subtextsNotInThing: SubtextProp[]
  // note: could probably trim object quite a bit here
  quotesInThing: (QuoteProp & { citation: Citation })[]
  subtextsInThing: (SubtextProp & { citation: Citation })[]
} {
  const thingFrequencies: Record<string, number> = {}
  quotes.forEach((quote) => {
    quote.sources.forEach((source) => {
      source.citations.forEach((citation) => {
        const thingId = citation.thingId
        thingFrequencies[thingId] = (thingFrequencies[thingId] || 0) + 1
      })
    })
  })
  const thingId = Object.entries(thingFrequencies).sort(
    ([, a], [, b]) => b - a,
  )[0][0]
  const quotesInThing = []
  const quotesNotInThing = []
  quotes.forEach((quote) => {
    // mine quote to try to find one relevant citation
    let citation: Citation | undefined = undefined
    for (let si = 0; si < quote.sources.length && !citation; si++) {
      const source = quote.sources[si]
      for (let ci = 0; ci < source.citations.length && !citation; ci++) {
        const c = source.citations[ci]
        if (c.thingId === thingId && c.start) citation = c
      }
    }
    if (!citation) return quotesNotInThing.push(quote)
    // note: could clean up object here
    quotesInThing.push({ ...quote, citation })
  })
  const subtextsInThing = []
  const subtextsNotInThing = []
  subtexts.forEach((subtext) => {
    // mine subtext to try to find one relevant citation
    const citation = subtext.citations.find(
      (citation) => citation.thingId === thingId && citation.start,
    )
    if (!citation) return subtextsNotInThing.push(subtext)
    // note: could clean up object here
    subtextsInThing.push({ ...subtext, citation })
  })
  return {
    thingId,
    quotesInThing,
    quotesNotInThing,
    subtextsInThing,
    subtextsNotInThing,
  }
}

export function justBeforeCitation(
  citation: SortableCitation,
): SortableCitation | undefined {
  if (citation.start == null) return undefined
  // midway down the page? the last section ends on this page
  if (citation.startLine != null && citation.startLine > 1)
    return { end: citation.start }
  // otherwise, the last section ends on the previous page
  if (typeOfPlace(citation.start) === "arabic")
    return { end: +citation.start - 1 + "" }
  if (typeOfPlace(citation.start) === "roman")
    // might be a problem here if it starts on page "i"
    return { end: arabicToRoman(parseRoman(citation.start) - 1) }
  throw new Error("subtext sorting doesn't support timestamps yet")
}

export function justAfterCitation(
  citation: SortableCitation,
): SortableCitation | undefined {
  if (citation.end == null) return undefined
  if (typeOfPlace(citation.end) === "arabic")
    return { start: +citation.end + 1 + "" }
  if (typeOfPlace(citation.end) === "roman")
    return { start: arabicToRoman(parseRoman(citation.end) + 1) }
  console.log(citation)
  throw new Error("subtext sorting doesn't support timestamps yet")
}

type Bucket<
  S extends { citation: SortableCitation },
  Q extends { citation: SortableCitation },
> = {
  citation: SortableCitation
  subtext?: S
  quotes: Q[]
}

export function bucketsOfAndBetweenSubtexts<
  S extends { citation: SortableCitation },
>(subtexts: S[]): { citation: SortableCitation; subtext?: S; quotes: any[] }[] {
  const buckets: Bucket<S, any>[] = [{ quotes: [], citation: {} }]
  subtexts.forEach((subtext) => {
    // delete last bucket if it starts at/after this subtext's start
    const lastBucket = buckets[buckets.length - 1]
    if (
      lastBucket.citation.start &&
      // checks if the last bucket starts AT OR AFTER this subtext
      compareCitations(lastBucket.citation, subtext.citation, false) >= 0
    ) {
      console.log(
        lastBucket.citation,
        subtext.citation,
        compareCitations(lastBucket.citation, subtext.citation, false),
      )
      console.log("deleting redundant bucket", buckets.pop())
    } else {
      // otherwise adjust it to end just *before* this subtext
      buckets[buckets.length - 1].citation.end = justBeforeCitation(
        subtext.citation,
      )?.end
    }
    // add a new bucket for this subtext
    buckets.push({ subtext, quotes: [], citation: subtext.citation })
    // add a new trailing open-ended bucket
    const afterCitation = justAfterCitation(subtext.citation)
    if (afterCitation) buckets.push({ quotes: [], citation: afterCitation })
  })
  return buckets
}

export function isQuoteInsideBucket<
  S extends { citation: SortableCitation },
  Q extends { citation: SortableCitation },
>(quote: Q, bucket: Bucket<S, Q>): boolean {
  // quote must be at or after bucket start
  if (
    bucket.citation.start &&
    // checks if bucket start is AFTER the quote start
    compareCitations(bucket.citation, quote.citation, false) > 0
  )
    return false
  // quote must be before or at bucket end
  if (comparePlaces(bucket.citation.end, quote.citation.start) < 0) return false
  return true
}

/**
 * Sorts quotes into buckets based on which subtext they are "within".
 * This will be used to render the quotes of a text based on location.
 *
 * Params must each have a single citation, all of which are within
 * the same Thing, like the output from `simplifyToMostCommonThing`.
 */
export function bucketQuotesBySubtext<
  S extends { citation: SortableCitation },
  Q extends { citation: SortableCitation },
>(subtexts: S[], quotes: Q[]): { subtext?: S; quotes: Q[] }[] {
  // first, sort subtexts in textual order
  subtexts.sort((a, b) => compareCitations(a.citation, b.citation))

  // create a "bucket" for each subtext
  const buckets = bucketsOfAndBetweenSubtexts(subtexts)

  console.log("BEFORE CULLING", buckets)

  // sort quotes into buckets
  quotes.forEach((quote) => {
    // find the last bucket that this quote starts after
    let i = 0
    while (
      // we're not at the end
      i < buckets.length - 1 &&
      // this quote isn't inside the bucket
      !isQuoteInsideBucket(quote, buckets[i])
    )
      // keep going
      i++
    buckets[i].quotes.push(quote)
  })

  return buckets
    .filter((bucket) => bucket.subtext || bucket.quotes.length > 0)
    .map((bucket) => {
      delete bucket.citation
      return bucket
    })
}

/**
 * Given a list of quotes and subtexts, chunks the former based on
 * which subtext they are most immediately inside. Any quotes without
 * a subtext are place between the nearer subtexts before/after them,
 * inside a separate list / "fake" subtext.
 *
 * Note: only sorts entries that are cited within the most common thing.
 * Note: does not consider recursively-nested subtexts at this time.
 * Note: this algorithm is NOT yet optimized in the slightest.
 */
export default function sortQuotesIntoSubtexts(
  quotes: QuoteProp[],
  subtexts: SubtextProp[],
): SubtextBucket[] {
  // simplify to the case of one shared Thing
  const {
    quotesInThing,
    subtextsInThing,
    quotesNotInThing,
    subtextsNotInThing, // useless (for now?)
  } = simplifyToMostCommonThing(quotes, subtexts)

  const buckets = bucketQuotesBySubtext(subtextsInThing, quotesInThing)

  return buckets
  // return [...buckets, { quotes: quotesNotInThing.sort(compareQuotes) }]
}
