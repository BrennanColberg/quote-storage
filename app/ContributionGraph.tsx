"use server"

import prisma from "@/prisma/prisma"
import { Activity, Level } from "react-activity-calendar"
import _ContributionGraph from "./_ContributionGraph"

export default async function ContributionGraph() {
  const contributions = await prisma.quote.findMany({
    select: { createdAt: true },
  })

  const countPerDate: { [key: string]: number } = {}
  let maxCount = 0
  let firstDate = ""
  let lastDate = ""
  contributions.forEach((contribution) => {
    const date = new Date(contribution.createdAt)
    // get ISO-format date according to local timezone
    // in order to bucket contributions by date
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const dateStr = `${year}-${month}-${day}`
    countPerDate[dateStr] = (countPerDate[dateStr] ?? 0) + 1
    firstDate = !firstDate || dateStr > firstDate ? dateStr : firstDate
    lastDate = !lastDate || dateStr < lastDate ? dateStr : lastDate
    maxCount = Math.max(maxCount, countPerDate[dateStr])
  })

  const data: Activity[] = Object.entries(countPerDate).map(
    ([date, count]) => ({
      date,
      count,
      level: Math.ceil((count / maxCount) * 4) as Level,
    }),
  )

  return <_ContributionGraph data={data} />
}
