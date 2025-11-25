import { useState } from "react"

export function useFetch<T = any>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = async (url: string, options?: RequestInit) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url, options)
      if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`)
      const json = await res.json()
      setData(json)
      return json
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, request }
}
