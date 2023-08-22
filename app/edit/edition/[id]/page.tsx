import { PrismaClient } from "@prisma/client"
import EditEditionForm from "./EditEditionForm"

export default async function EditEditionPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const prisma = new PrismaClient()
  const [edition, persons, texts, publishers] = await Promise.all([
    prisma.edition.findUniqueOrThrow({
      where: { id },
      include: {
        authors: true,
        publisher: true,
        editors: true,
        translators: true,
        texts: true,
      },
    }),
    prisma.person.findMany(),
    prisma.text.findMany(),
    prisma.publisher.findMany(),
  ])
  return (
    <EditEditionForm
      edition={edition}
      persons={persons}
      texts={texts}
      publishers={publishers}
    />
  )
}
