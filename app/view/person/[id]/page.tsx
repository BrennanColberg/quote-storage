import EditButton from "@/components/EditButton"
import prisma from "@/prisma/prisma"
import { notFound } from "next/navigation"

export default async function ViewPersonPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      textsAuthored: true,
      textsCharactered: true,
      quotes: {
        include: {
          sources: {
            include: { text: true, citations: { include: { thing: true } } },
          },
        },
      },
      thingsAuthored: true,
      thingsEdited: true,
      thingsTranslated: true,
    },
  })
  if (!person) notFound()

  return (
    <main>
      <EditButton type="person" id={id} />
      <pre>{JSON.stringify(person, null, 2)}</pre>
    </main>
  )
}
