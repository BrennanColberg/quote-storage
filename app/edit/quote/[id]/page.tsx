import { PrismaClient } from "@prisma/client"
import { EditQuoteForm } from "./EditQuoteForm"
import { notFound } from "next/navigation"

export default async function EditQuotePage({
  params: { id },
}: {
  params: { id: string }
}) {
  const prisma = new PrismaClient()
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { authors: true, sources: { include: { citations: true } } },
  })
  if (!quote) notFound()
  return <EditQuoteForm quote={quote} />
}
