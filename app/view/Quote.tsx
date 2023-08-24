import { Person, Quote } from "@prisma/client"
import { SourceList, SourceProp } from "./Source"
import ReactMarkdown from "react-markdown"
import isUserAuthenticated from "@/lib/isUserAuthenticated"
import EditButton from "@/components/EditButton"
import compareQuotes from "@/lib/compareQuotes"

export type QuoteProp = Quote & {
  sources: SourceProp[]
  authors: Person[]
}

export function QuoteComponent({
  quote,
  excludeTexts,
}: {
  quote: QuoteProp
  excludeTexts?: string[]
}) {
  return (
    <div className="mb-6 mt-3">
      <EditButton type="quote" id={quote.id} />
      <blockquote className="border-l-4 pl-2 text-neutral-500 max-h-64 overflow-y-scroll pr-1">
        <ReactMarkdown>{quote.content.replace(/\n+/g, "\n\n")}</ReactMarkdown>
      </blockquote>

      {/* TODO authors */}
      {/* ({source.quote.authors
  .filter((author) => !text.authors.find((a) => a.id === author.id))
  .map((author) => author.name)
  .join(", ")}) */}

      <SourceList sources={quote.sources} excludeTexts={excludeTexts} />
    </div>
  )
}

export function QuoteList({
  quotes,
  excludeTexts,
  sort = true,
}: {
  quotes: QuoteProp[]
  excludeTexts?: string[]
  sort?: boolean
}) {
  if (sort) quotes.sort(compareQuotes)
  return (
    <div>
      {quotes.map((quote) => (
        <div key={quote.id}>
          <QuoteComponent quote={quote} excludeTexts={excludeTexts} />
        </div>
      ))}
    </div>
  )
}