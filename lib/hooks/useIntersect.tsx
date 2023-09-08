import { useCallback, useEffect, useRef } from 'react'

interface IntersectionObserverInit {
  root?: Element | Document | null
  rootMargin?: string
  threshold?: number | number[]
}

type IntersectHandler = (
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver
) => void

const defaultOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
}

export default function useIntersect(
  onIntersect: IntersectHandler,
  options?: IntersectionObserverInit
) {
  const target = useRef<HTMLDivElement>(null)

  const callback = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect(entry, observer)
        }
      })
    },
    [onIntersect]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      ...defaultOptions,
      ...options,
    })
    if (target.current) {
      observer.observe(target.current as Element)
    }
    return () => observer && observer.disconnect()
  }, [target, callback, options])

  return target
}
