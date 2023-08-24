import { _EditButton } from "./_EditButton"
import isUserAuthenticated from "@/lib/isUserAuthenticated"

export default function EditButton({ type, id }: { type: string; id: string }) {
  if (!isUserAuthenticated()) return null
  return <_EditButton type={type} id={id} />
}
