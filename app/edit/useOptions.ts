import axios from "axios"
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react"
import useSWR from "swr"

async function fetcher<T>(name: string) {
  const response = await axios.get<T[]>(`/api/${name}`)
  return response.data
}

export default function useOptions<T>(
  name: string,
  set?: Dispatch<SetStateAction<T[]>>,
): T[] {
  const { data, error } = useSWR<T[]>(name, fetcher)
  if (error) throw error
  const result = useMemo(() => data ?? [], [data])
  useEffect(() => set?.(result), [result])
  return result
}
