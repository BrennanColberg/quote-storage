"use client"

import { Button } from "./ui/button"

export default function EditButton({ type, id }: { type: string; id: string }) {
  return (
    <Button
      variant="outline"
      className="absolute -left-20"
      onClick={(e) => {
        e.preventDefault()
        window.open(`/edit/${type}/${id}?from=view`)
      }}
    >
      Edit
    </Button>
  )
}
