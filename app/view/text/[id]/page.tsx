import { notFound } from "next/navigation"
import { QuoteList, QuoteProp } from "../../Quote"
import { SourceProp, TextProp } from "../../Source"
import { CitationProp } from "../../Citation"
import prisma from "@/prisma/prisma"
import Link from "next/link"
import EditButton from "@/components/EditButton"
import { ThingLink } from "../../Thing"
import AddButton from "@/components/AddButton"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import listOfLinks from "@/lib/listOfLinks"

export default async function ViewTextPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const text = await prisma.text.findUnique({
    where: { id },
    include: {
      authors: true,
      characters: true,
      things: { include: { publisher: true } },
      sources: {
        include: {
          quote: {
            include: {
              authors: true,
              subjects: true,
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

  const authors = listOfLinks(
    text.authors.map((author) => ({
      href: `/view/person/${author.id}`,
      text: author.name,
    })),
  )

  return (
    <main>
      {/* TODO autofill author/text/edition */}
      <AddButton type="quote" urlSuffix={"?text=" + text.id} />

      <h1>
        <EditButton type="text" id={text.id} />
        {text.title}
      </h1>
      {text.subtitle && <h2>{text.subtitle}</h2>}
      {authors.length > 0 && <h3>{authors}</h3>}

      <br />

      <h3>My Copies</h3>
      <ul className=" list-inside list-disc">
        {text.things.map((thing) => (
          <li key={thing.id}>
            <EditButton type="thing" id={thing.id} />
            <ThingLink thing={thing} excludeTitle={text.title} />
          </li>
        ))}
      </ul>

      <br />

      <h3>Characters</h3>
      <ul>
        {text.characters.map((character) => (
          <li key={character.id}>
            <EditButton type="person" id={character.id} />
            <Link href={`/view/person/${character.id}`}>{character.name}</Link>
            {character.bio && (
              <span className="font-light text-neutral-500">
                {" "}
                – {character.bio}
              </span>
            )}
          </li>
        ))}
      </ul>

      {text.notes && (
        <>
          <br />
          <h3>Notes</h3>
          <ReactMarkdown className="notes">{text.notes}</ReactMarkdown>
        </>
      )}

      <br />

      <h3>Quotes</h3>
      <QuoteList
        quotes={quoteProps}
        excludeTexts={[text.id]}
        excludeAuthors={text.authors.map((a) => a.id)}
      />
    </main>
  )
}
