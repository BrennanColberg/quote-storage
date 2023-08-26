import prisma from "@/prisma/prisma"
import { notFound } from "next/navigation"
import { QuoteComponent } from "../../Quote"
import EditButton from "@/components/EditButton"

export default async function ViewQuotePage({
  params: { id },
}: {
  params: { id: string }
}) {
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      authors: true,
      sources: {
        include: {
          // TODO import fewer things in future
          text: { include: { authors: true } },
          citations: { include: { thing: { include: { publisher: true } } } },
        },
      },
    },
  })
  if (!quote) notFound()

  return (
    <main>
      <QuoteComponent quote={quote} />
      <pre>{JSON.stringify(quote, null, 2)}</pre>
    </main>
  )
}
