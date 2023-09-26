import { EditQuoteForm } from "./EditQuoteForm"
import { notFound } from "next/navigation"
import prisma from "@/prisma/prisma"

export default async function EditQuotePage({
  params: { id },
}: {
  params: { id: string }
}) {
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      authors: true,
      subjects: true,
      sources: { include: { citations: true } },
    },
  })
  if (!quote) notFound()
  return <EditQuoteForm quote={quote} />
}
