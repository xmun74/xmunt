'use client'

import { sendGAEvent } from '@next/third-parties/google'
import { useReportWebVitals } from 'next/web-vitals'

const CORE_WEB_VITALS = new Set(['CLS', 'INP', 'LCP'])

type ReportWebVitals = Parameters<typeof useReportWebVitals>[0]

const reportWebVitals: ReportWebVitals = ({
  name,
  id,
  value,
  delta,
  rating,
}) => {
  if (!CORE_WEB_VITALS.has(name)) return

  sendGAEvent('event', name, {
    value: delta,
    metric_id: id,
    metric_value: value,
    metric_delta: delta,
    metric_rating: rating,
    page_location: window.location.href,
  })
}

export default function WebVitalsReporter() {
  useReportWebVitals(reportWebVitals)

  return null
}
