import AddButton from "@/components/AddButton"
import EditButton from "@/components/EditButton"
import prisma from "@/prisma/prisma"
import { cookies } from "next/headers"
import Link from "next/link"
import _ContributionGraph from "./_ContributionGraph"
import ContributionGraph from "./ContributionGraph"

export default async function Page() {
  cookies() // calling this forces dynamic rerendering

  const [
    texts,
    { _count: quoteCount },
    personCount,
    { _count: thingCount },
    { _count: textCount },
  ] = await Promise.all([
    prisma.text.findMany({ include: { authors: true } }),
    prisma.quote.aggregate({ _count: true }),
    prisma.person.groupBy({ by: ["fictional"], _count: true }),
    prisma.thing.aggregate({ _count: true }),
    prisma.text.aggregate({ _count: true }),
  ])
  const fictionalPersonCount = personCount.find((e) => e.fictional)?._count ?? 0
  const realPersonCount = personCount.find((e) => !e.fictional)?._count ?? 0

  return (
    <main>
      <div className="flex flex-row gap-2">
        <AddButton type="text" />
        <AddButton type="quote" />
        <AddButton type="person" />
      </div>
      <h3>Statistics</h3>
      <ul>
        <li>
          this system stores <b>{quoteCount} quotes</b>
        </li>
        <li>
          from <b>{realPersonCount} real people</b> (and{" "}
          <b>{fictionalPersonCount} fictional ones</b>)
        </li>
        <li>
          over <b>{thingCount} copies</b>
        </li>
        <li>
          of <b>{textCount} texts</b>
        </li>
      </ul>
      <br />
      {/* @ts-ignore because of server component nonsense */}
      <ContributionGraph />
      <br />
      <h3>Texts</h3>
      <ul>
        {texts.map((text) => (
          <li key={text.id}>
            <EditButton type="text" id={text.id} />
            <Link href={`/view/text/${text.id}`}>
              {text.title} (
              {text.authors.map((author) => author.name).join(", ")})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
