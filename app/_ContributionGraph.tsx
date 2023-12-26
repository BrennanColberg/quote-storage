"use client"
import ActivityCalendar, { Activity } from "react-activity-calendar"

export default function _ContributionGraph({ data }: { data: Activity[] }) {
  return (
    <ActivityCalendar
      data={data}
      hideTotalCount
      hideColorLegend
      colorScheme="light"
    />
  )
}
