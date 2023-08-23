import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"

export default async function ViewTextPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const prisma = new PrismaClient()
  const text = await prisma.text.findUnique({
    where: { id },
    include: {
      authors: true,
      editions: { include: { publisher: true } },
      sources: {
        include: {
          quote: {
            include: {
              authors: true,
              // // only include authors that aren't the current text's authors
              // authors: { where: { texts: { none: { id } } } },
            },
          },
          citations: true,
        },
      },
    },
  })
  if (!text) notFound()
  return (
    <main>
      <h1>{text.title}</h1>
      {text.subtitle && <h2>{text.subtitle}</h2>}
      {text.authors.length > 0 && (
        <h3>{text.authors.map((author) => author.name).join(", ")}</h3>
      )}

      <br />

      <h3>My Editions</h3>
      <ul className=" list-inside list-disc">
        {text.editions.map((edition) => (
          <li key={edition.id}>
            <a href={`/view/edition/${edition.id}`}>
              {edition.type.charAt(0).toUpperCase()}
              {edition.type.substring(1).toLowerCase()} (
              {edition.publisher.name}, {edition.year})
            </a>
          </li>
        ))}
      </ul>

      <br />

      {text.notes && (
        <>
          <h3>Notes</h3>
          <p>{text.notes}</p>
        </>
      )}

      <br />

      <h3>Quotes</h3>
      <div>
        {/* TODO transform into quotes->sources before rendering */}
        {text.sources
          .sort((a, b) => {
            // TODO turn into proper comparator of citation location
            const page = +a.citations[0].start - +b.citations[0].start
            if (page) return page
            const line = a.citations[0].startLine - b.citations[0].startLine
            return line
          })
          .map((source) => (
            <div key={source.id} className="mb-6 mt-3">
              <blockquote className="border-l-4 pl-2 text-neutral-500 max-h-64 overflow-y-scroll pr-1">
                {source.quote.content}
              </blockquote>
              {/* TODO authors */}
              {/* ({source.quote.authors
              .filter((author) => !text.authors.find((a) => a.id === author.id))
              .map((author) => author.name)
              .join(", ")}) */}
              <ul>
                {source.citations.map((citation) => {
                  const edition = text.editions.find(
                    (e) => e.id === citation.editionId,
                  )
                  let pages
                  if (citation.start && citation.end)
                    pages = `pp. ${citation.start}-${citation.end}`
                  else if (citation.start) pages = `p. ${citation.start}`
                  return (
                    <li key={citation.id}>
                      {pages} ({edition.publisher.name}, {edition.year})
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
      </div>
    </main>
  )
}
