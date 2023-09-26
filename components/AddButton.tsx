import { _AddButton } from "./_AddButton"
import isUserAuthenticated from "@/lib/isUserAuthenticated"

export default function AddButton({
  type,
  urlSuffix,
}: {
  type: string
  urlSuffix?: string
}) {
  if (!isUserAuthenticated()) return null
  return <_AddButton type={type} urlSuffix={urlSuffix} />
}
