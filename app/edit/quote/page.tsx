import { PrismaClient } from "@prisma/client"
import { EditQuoteForm } from "./EditQuoteForm"

export default async function EditQuotePage() {
  const prisma = new PrismaClient()
  const [persons, texts] = await Promise.all([
    prisma.person.findMany(),
    prisma.text.findMany(),
  ])
  return <EditQuoteForm persons={persons} texts={texts} />
}
