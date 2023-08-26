import EditButton from "@/components/EditButton"
import prisma from "@/prisma/prisma"
import { notFound } from "next/navigation"

export default async function ViewThingPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const thing = await prisma.thing.findUnique({
    where: { id },
    include: {
      texts: true,
      authors: true,
      editors: true,
      translators: true,
      publisher: true,
      citations: { include: { source: { include: { quote: true } } } },
    },
  })
  if (!thing) notFound()

  return (
    <main>
      <EditButton type="thing" id={id} />
      <pre>{JSON.stringify(thing, null, 2)}</pre>
    </main>
  )
}
