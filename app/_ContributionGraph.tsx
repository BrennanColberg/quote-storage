"use client"
// note: date computations are all done on client to match their timezone
//       (because server-side-rendering this code executes it in UTC)

import { useMemo } from "react"
import ActivityCalendar, { Activity, Level } from "react-activity-calendar"

function localISODate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function _ContributionGraph({
  contributions,
}: {
  contributions: { createdAt: Date }[]
}) {
  const data: Activity[] = useMemo(() => {
    const countPerDate: { [key: string]: number } = {}
    let maxCount = 0

    contributions.forEach((contribution) => {
      const date = new Date(contribution.createdAt)
      // get ISO-format date according to local timezone
      // in order to bucket contributions by date
      const dateStr = localISODate(date)
      countPerDate[dateStr] = (countPerDate[dateStr] ?? 0) + 1
      maxCount = Math.max(maxCount, countPerDate[dateStr])
    })

    // add today if not present
    const today = localISODate(new Date())
    if (!(today in countPerDate)) countPerDate[today] = 0

    const data: Activity[] = Object.entries(countPerDate).map(
      ([date, count]) => ({
        date,
        count,
        level: Math.ceil((count / maxCount) * 4) as Level,
      }),
    )

    return data.sort((a, b) => a.date.localeCompare(b.date))
  }, [])

  return <ActivityCalendar data={data} showWeekdayLabels colorScheme="light" />
}
