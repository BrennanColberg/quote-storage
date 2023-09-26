import { Person, Quote } from "@prisma/client"
import { SourceList, SourceProp } from "./Source"
import ReactMarkdown from "react-markdown"
import EditButton from "@/components/EditButton"
import compareQuotes from "@/lib/compareQuotes"
import listOfLinks from "@/lib/listOfLinks"

export type QuoteProp = Quote & {
  sources: SourceProp[]
  authors: Person[]
  subjects: Person[]
}

export function QuoteComponent({
  quote,
  excludeTexts = [],
  excludeAuthors = [],
  excludeSubjects = [],
}: {
  quote: QuoteProp
  excludeTexts?: string[]
  excludeAuthors?: string[]
  excludeSubjects?: string[]
}) {
  const authors = quote.authors.filter((a) => !excludeAuthors.includes(a.id))
  const subjects = quote.subjects.filter((a) => !excludeSubjects.includes(a.id))
  return (
    <div className="mb-6 mt-3">
      <EditButton type="quote" id={quote.id} />
      <blockquote className="border-l-4 pl-2 text-neutral-600 max-h-64 overflow-y-scroll pr-1">
        <ReactMarkdown>{quote.content.replace(/\n+/g, "\n\n")}</ReactMarkdown>
      </blockquote>

      {authors.length > 0 && (
        <li className="text-neutral-500">
          {subjects.length > 0 && "by "}
          {listOfLinks(
            authors.map((author) => ({
              href: `/view/person/${author.id}`,
              text: author.name,
            })),
          )}
        </li>
      )}

      {subjects.length > 0 && (
        <li className="text-neutral-500">
          about{" "}
          {listOfLinks(
            subjects.map((subject) => ({
              href: `/view/person/${subject.id}`,
              text: subject.name,
            })),
          )}
        </li>
      )}

      <SourceList
        sources={quote.sources}
        excludeTexts={excludeTexts}
        excludeAuthors={excludeAuthors}
      />
    </div>
  )
}

export function QuoteList({
  quotes,
  excludeTexts,
  excludeAuthors,
  excludeSubjects,
  sort = true,
}: {
  quotes: QuoteProp[]
  excludeTexts?: string[]
  excludeAuthors?: string[]
  excludeSubjects?: string[]
  sort?: boolean
}) {
  if (sort) quotes.sort(compareQuotes)
  return (
    <div>
      {quotes.map((quote) => (
        <div key={quote.id}>
          <QuoteComponent
            quote={quote}
            excludeTexts={excludeTexts}
            excludeAuthors={excludeAuthors}
            excludeSubjects={excludeSubjects}
          />
        </div>
      ))}
    </div>
  )
}
