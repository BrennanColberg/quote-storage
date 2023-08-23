import { Citation, Edition, Publisher } from "@prisma/client"
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
  edition: Edition & { publisher?: Publisher }
}

export function CitationComponent({ citation }: { citation: CitationProp }) {
  const pages = citationLocation(citation)

  const publisher = citation.edition.publisher ? (
    <Link href={`/view/publisher/${citation.edition.publisher.id}`}>
      {citation.edition.publisher.name}
    </Link>
  ) : null

  return (
    <li>
      {pages} ({publisher}, {citation.edition.year})
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
