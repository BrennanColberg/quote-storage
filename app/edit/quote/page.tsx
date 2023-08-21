import { PrismaClient } from "@prisma/client"
import { EditQuoteForm } from "./EditQuoteForm"

export default async function EditQuotePage() {
  const prisma = new PrismaClient()
  const [persons] = await Promise.all([prisma.person.findMany()])
  return <EditQuoteForm persons={persons} />
}
