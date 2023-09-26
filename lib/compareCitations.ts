import { Citation } from "@prisma/client"
import parseRoman from "./parseRoman"
import { compareTimestamps, parseTimestamp } from "./timestamp"
import { SortableCitation } from "./SortableCitation"

export function typeOfPlace(
  place: string,
): "arabic" | "roman" | "timestamp" | undefined {
  if (!place) return undefined
  place = place.trim()
  if (place.match(/^[0-9]+$/)) return "arabic"
  if (place.match(/^[ivx]+$/i)) return "roman"
  if (place.match(/^(?:[0-9]{1,2}:)+[0-9]{1,2}$/)) return "timestamp"
  return undefined
}

// compares places that can either be roman numeral, arabic numeral, or timestamp
export function comparePlaces(a: string, b: string): number {
  const aType = typeOfPlace(a)
  const bType = typeOfPlace(b)
  // anything that doesn't have its type defined comes last
  if (aType === undefined || bType === undefined) {
    if (aType === bType) return 0 // both undefined? equal
    return aType === undefined ? 1 : -1
  }
  // if both are roman, compare
  if (aType === "roman" && bType === "roman")
    return parseRoman(a) - parseRoman(b)
  if (aType === "arabic" && bType === "arabic") return parseInt(a) - parseInt(b)
  // any roman numeral is less than any arabic numeral
  if (aType === "roman" && bType === "arabic") return -1
  if (aType === "arabic" && bType === "roman") return 1
  // if just one is a timestamp, both are marked equal (incomparable)
  if (aType === "timestamp" && bType !== "timestamp") return 0
  if (aType !== "timestamp" && bType === "timestamp") return 0
  // both are timestamps, compare
  return compareTimestamps(parseTimestamp(a), parseTimestamp(b))
}

export default function compareCitations(
  a: SortableCitation & { thingId?: string },
  b: SortableCitation & { thingId?: string },
  endAsTiebreaker = true,
) {
  // citations cannot be compared if they aren't in the same Thing
  if (a.thingId && b.thingId && a.thingId !== b.thingId) return 0

  // if they both have a start, sort by start
  const startCompare = comparePlaces(a.start, b.start)
  if (startCompare !== 0) return startCompare

  // if the starts are the same and they both have a line, sort by line
  const lineCompare =
    a.startLine !== undefined && b.startLine !== undefined
      ? a.startLine - b.startLine
      : 0
  if (lineCompare !== 0) return lineCompare

  // if the starts/lines are equal and ends are different, sort by end (undefined = start)
  if (!endAsTiebreaker) return 0
  const endCompare = comparePlaces(a.end ?? a.start, b.end ?? b.start)
  if (endCompare !== 0) return endCompare

  return 0
}
