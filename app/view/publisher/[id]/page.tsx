import EditButton from "@/components/EditButton"
import prisma from "@/prisma/prisma"
import { notFound } from "next/navigation"

export default async function ViewPublisherPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const publisher = await prisma.publisher.findUnique({
    where: { id },
    include: {
      things: true,
    },
  })
  if (!publisher) notFound()

  return (
    <main>
      <EditButton type="publisher" id={id} />
      <pre>{JSON.stringify(publisher, null, 2)}</pre>
    </main>
  )
}
