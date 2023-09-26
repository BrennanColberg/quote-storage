import EditButton from "@/components/EditButton"
import prisma from "@/prisma/prisma"
import { notFound } from "next/navigation"
import { QuoteList } from "../../Quote"
import { Person } from "@prisma/client"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"

// converts a number stored as string to "A.D." or "B.C." (if negative)
function renderYear(year: string) {
  const yearNum = parseInt(year)
  if (yearNum > 0) return `${yearNum} AD`
  if (yearNum < 0) return `${Math.abs(yearNum)} BC`
  return year
}

function largestAchievedAge(person: Person) {
  if (!person.yearBorn) return null
  const lastYear = parseInt(person.yearDied) || new Date().getFullYear()
  return lastYear - parseInt(person.yearBorn)
}

export default async function ViewPersonPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      textsAuthored: true,
      textsCharactered: true,
      quotes: {
        include: {
          authors: true,
          sources: {
            include: {
              text: { include: { authors: true } },
              citations: {
                include: { thing: { include: { publisher: true } } },
              },
            },
          },
        },
      },
      thingsAuthored: true,
      thingsEdited: true,
      thingsTranslated: true,
    },
  })
  if (!person) notFound()

  return (
    <main>
      <EditButton type="person" id={id} />
      <h1>{person.name}</h1>
      {!person.fictional && (person.yearBorn || person.yearDied) && (
        <h3>
          {person.yearBorn && (
            <span>born in {renderYear(person.yearBorn)}; </span>
          )}
          {person.yearDied ? (
            <span>died in {renderYear(person.yearDied)}</span>
          ) : (
            "still alive"
          )}
          {person.yearBorn && <span> (age ~{largestAchievedAge(person)})</span>}
        </h3>
      )}
      <p>{person.bio}</p>
      {/* years lived (+ if they're still alive) */}
      {/* whether they're fictional */}

      {/* notes about them */}
      {/* what texts/things they contributed to */}
      {/* what texts they are a character in */}
      {/* wikipedia link */}
      {/* twitter link */}
      {person.notes && (
        <>
          <br />
          <h3>Notes</h3>
          <ReactMarkdown className="notes">{person.notes}</ReactMarkdown>
        </>
      )}
      {person.quotes.length > 0 && (
        <>
          <br />
          <h3>Quotes</h3>
          <QuoteList
            quotes={person.quotes}
            // excludeTexts={[text.id]}
            excludeAuthors={[person.id]}
          />
        </>
      )}
    </main>
  )
}
