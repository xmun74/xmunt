import { useEffect } from 'react'

export default function useTimeout(
  state: unknown,
  callback: () => void,
  delay: number
) {
  useEffect(() => {
    const timer = setTimeout(callback, delay)

    return () => clearTimeout(timer)
  }, [state])
}
