import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { QuoteList, QuoteProp } from "../../Quote"
import { SourceProp, TextProp } from "../../Source"
import { CitationProp } from "../../Citation"

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
      things: { include: { publisher: true } },
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

  // make simple version of text with just authors
  const _textProp: Partial<TextProp> & typeof text = { ...text }
  delete _textProp.sources
  delete _textProp.things
  const textProp: TextProp = _textProp

  const quoteProps: QuoteProp[] = []
  for (const source of text.sources) {
    // add thing to each citation to make it a valid CitationProp
    const citationProps: CitationProp[] = source.citations.map((citation) => ({
      ...citation,
      thing: text.things.find((e) => e.id === citation.thingId),
    }))
    // prep the source to be a valid SourceProp
    const _sourceProp: SourceProp & typeof source = {
      ...source,
      citations: citationProps,
      text: textProp,
    }
    delete _sourceProp.quote
    const sourceProp: SourceProp = _sourceProp
    // check if quote is already in props
    const quote = quoteProps.find((quote) => quote.id === source.quote.id)
    // if it is, add the source to the quote
    if (quote) quote.sources.push(sourceProp)
    // if it isn't, add the quote to the props
    else quoteProps.push({ ...source.quote, sources: [sourceProp] })
  }

  return (
    <main>
      <h1>{text.title}</h1>
      {text.subtitle && <h2>{text.subtitle}</h2>}
      {text.authors.length > 0 && (
        <h3>{text.authors.map((author) => author.name).join(", ")}</h3>
      )}

      <br />

      <h3>My Things</h3>
      <ul className=" list-inside list-disc">
        {text.things.map((thing) => (
          <li key={thing.id}>
            <a href={`/view/thing/${thing.id}`}>
              {thing.type.charAt(0).toUpperCase()}
              {thing.type.substring(1).toLowerCase()} ({thing.publisher?.name},{" "}
              {thing.year})
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
      <QuoteList quotes={quoteProps} excludeTexts={[text.id]} />
    </main>
  )
}
