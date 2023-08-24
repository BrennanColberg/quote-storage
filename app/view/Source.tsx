import { Person, Source, Text } from "@prisma/client"
import { CitationProp, CitationList } from "./Citation"

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
}: {
  source: SourceProp
  excludeTexts?: string[]
}) {
  if (excludeTexts?.includes(source.textId))
    return <CitationList citations={source.citations} type={null} />

  // show authors afterwards, if any exist
  // TODO store and retrieve author order
  let authors = source.text.authors.map((author) => author.name).join(", ")
  if (authors) authors = ` (${authors})`

  return (
    <li className="text-neutral-400">
      {source.text.title}
      {authors}
      <CitationList citations={source.citations} />
    </li>
  )
}

export function SourceList({
  sources,
  excludeTexts,
  type = "ul",
}: {
  sources: SourceProp[]
  excludeTexts?: string[]
  type?: "ul" | "ol" | null
}) {
  const lis = sources.map((source) => (
    <SourceComponent source={source} excludeTexts={excludeTexts} />
  ))
  if (type === "ul") return <ul>{lis}</ul>
  if (type === "ol") return <ul>{lis}</ul>
  return <>{lis}</>
}
