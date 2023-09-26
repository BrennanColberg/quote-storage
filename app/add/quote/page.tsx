import prisma from "@/prisma/prisma"
import { EditQuoteForm } from "../../edit/quote/[id]/EditQuoteForm"

export default async function AddQuotePage({
  searchParams: { text: textId },
}: {
  searchParams: { text?: string }
}) {
  if (!textId) return <EditQuoteForm />
  const text = await prisma.text.findUnique({
    where: { id: textId },
    include: { authors: true, things: true },
  })
  return <EditQuoteForm text={text} />
}
