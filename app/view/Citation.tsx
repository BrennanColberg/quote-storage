import { Citation, Thing, Publisher } from "@prisma/client"
import Link from "next/link"

/** show page/pages/line that this was taken from */
// TODO handle page-based, time-based citations differently
function citationLocation({
  start,
  end,
  startLine,
}: Citation): string | undefined {
  // multiple pages
  if (start && end) return `pp. ${start}-${end}`
  // // one page (with known line)
  // if (start && startLine) return `p. ${start} line ${startLine}`
  // one page, no known line
  if (start) return `p. ${start}`
}

export type CitationProp = Citation & {
  thing: Thing & { publisher?: Publisher }
}

export function CitationComponent({ citation }: { citation: CitationProp }) {
  const pages = citationLocation(citation)

  const items = [citation.thing.publisher?.name, citation.thing.year].filter(
    (x) => x,
  )
  const endText = items.length ? <> ({items})</> : ""
  return (
    <li>
      {pages}
      {endText}
    </li>
  )
}

export function CitationList({
  citations,
  type = "ul",
}: {
  citations: CitationProp[]
  type?: "ul" | "ol" | null
}) {
  const lis = citations.map((citation) => (
    <CitationComponent citation={citation} />
  ))
  if (type === "ul") return <ul>{lis}</ul>
  if (type === "ol") return <ul>{lis}</ul>
  return <>{lis}</>
}
