import axios from "axios"
import NewQuoteForm from "./NewQuoteForm"
import { Person, PrismaClient } from "@prisma/client"

export default async function AddQuote() {
  const prisma = new PrismaClient()
  const persons = await prisma.person.findMany()

  return <NewQuoteForm persons={persons} />
}
