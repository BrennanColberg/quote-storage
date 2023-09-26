import { Person, Source, Text } from "@prisma/client"
import { CitationProp, CitationList } from "./Citation"
import Link from "next/link"

// TODO maybe move elsewhere?
export type TextProp = Text & {
  authors: Person[]
}

export type SourceProp = Source & {
  text: TextProp
  citations: CitationProp[]
}

export function SourceComponent({
  source,
  excludeTexts,
  excludeAuthors,
}: {
  source: SourceProp
  excludeTexts?: string[]
  excludeAuthors?: string[]
}) {
  if (excludeTexts?.includes(source.textId))
    return <CitationList citations={source.citations} type={null} />

  // show authors afterwards, if any exist
  // TODO store and retrieve author order
  let authors = source.text.authors
    .filter((author) => !excludeAuthors?.includes(author.id))
    // TODO make these authors links via list-of-links thingy
    .map((author) => author.name)
    .join(", ")
  if (authors) authors = ` (${authors})`

  return (
    <li className="text-neutral-400">
      <Link href={`/view/text/${source.text.id}`}>{source.text.title}</Link>
      {authors}
      <CitationList citations={source.citations} />
    </li>
  )
}

export function SourceList({
  sources,
  excludeTexts,
  excludeAuthors,
  type = "ul",
}: {
  sources: SourceProp[]
  excludeTexts?: string[]
  excludeAuthors?: string[]
  type?: "ul" | "ol" | null
}) {
  const lis = sources.map((source) => (
    <SourceComponent
      source={source}
      excludeTexts={excludeTexts}
      excludeAuthors={excludeAuthors}
    />
  ))
  if (type === "ul") return <ul>{lis}</ul>
  if (type === "ol") return <ul>{lis}</ul>
  return <>{lis}</>
}
