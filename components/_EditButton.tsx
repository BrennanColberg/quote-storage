"use client"

import { Button } from "./ui/button"

export function _EditButton({ type, id }: { type: string; id: string }) {
  return (
    <Button
      variant="outline"
      className="absolute -left-20"
      size="sm"
      onClick={(e) => {
        e.preventDefault()
        window.open(`/edit/${type}/${id}?from=view`)
      }}
    >
      Edit
    </Button>
  )
}
