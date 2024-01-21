"use server"

import prisma from "@/prisma/prisma"
import _ContributionGraph from "./_ContributionGraph"

export default async function ContributionGraph() {
  const contributions = await Promise.all([
    prisma.quote.findMany({ select: { createdAt: true } }),
    prisma.text.findMany({ select: { createdAt: true } }),
    prisma.subtext.findMany({ select: { createdAt: true } }),
    prisma.thing.findMany({ select: { createdAt: true } }),
    prisma.person.findMany({ select: { createdAt: true } }),
    prisma.publisher.findMany({ select: { createdAt: true } }),
  ]).then((results) => results.flat())

  return <_ContributionGraph contributions={contributions} />
}
