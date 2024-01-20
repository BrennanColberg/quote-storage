"use server"

import prisma from "@/prisma/prisma"
import _ContributionGraph from "./_ContributionGraph"

export default async function ContributionGraph() {
  const contributions = await prisma.quote.findMany({
    select: { createdAt: true },
  })

  return <_ContributionGraph contributions={contributions} />
}
