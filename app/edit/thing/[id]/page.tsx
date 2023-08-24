import EditThingForm from "./EditThingForm"
import prisma from "@/prisma/prisma"

export default async function EditThingPage({
  params: { id },
}: {
  params: { id: string }
}) {
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
