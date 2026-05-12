'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export const GA_TRACKING_ID = `G-ZK3Y3LT3RD`

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag?.('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (
  action: string,
  {
    event_category,
    event_label,
    value,
  }: {
    event_category?: string
    event_label?: string
    value?: number
  }
) => {
  window.gtag?.('event', action, {
    event_category,
    event_label,
    value,
  })
}

// page view
export const useGtag = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return

    const query = searchParams?.toString() ?? ''
    pageview(query ? `${pathname}?${query}` : pathname)
  }, [pathname, searchParams])
}
