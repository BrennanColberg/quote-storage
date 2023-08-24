import { PrismaClient } from "@prisma/client"
import EditThingForm from "./EditThingForm"

export default async function EditThingPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const prisma = new PrismaClient()
  const thing = await prisma.thing.findUniqueOrThrow({
    where: { id },
    include: {
      authors: true,
      publisher: true,
      editors: true,
      translators: true,
      texts: true,
    },
  })
  return <EditThingForm thing={thing} />
}
