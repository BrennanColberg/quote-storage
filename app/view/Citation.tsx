import { Citation, Thing, Publisher, Text } from "@prisma/client"
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

export function CitationComponent({
  citation,
  text,
}: {
  citation: CitationProp
  text: Text
}) {
  const pages = citationLocation(citation)

  const items = [
    // render title if it's different from the text
    citation.thing.title !== text.title && `"${citation.thing.title}"`,
    citation.thing.publisher?.name,
    citation.thing.year,
    citation.thing.volume && `vol. ${citation.thing.volume}`,
  ].filter((x) => x)
  const endText = items.length ? ` (${items.join(", ")})` : ""
  return (
    <li className="text-neutral-400">
      {pages}
      {endText}
    </li>
  )
}

export function CitationList({
  citations,
  type = "ul",
  text,
}: {
  citations: CitationProp[]
  text: Text
  type?: "ul" | "ol" | null
}) {
  const lis = citations.map((citation) => (
    <CitationComponent citation={citation} text={text} />
  ))
  if (type === "ul") return <ul>{lis}</ul>
  if (type === "ol") return <ul>{lis}</ul>
  return <>{lis}</>
}
