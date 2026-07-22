import { unstable_cache } from 'next/cache'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import dayjs from 'dayjs'
import type { AnalyticsSummary, DailyStat } from '@lib/types'

const DAYS = 90
// GA4 출시(2020-10) 이전 데이터는 존재할 수 없으므로 전체 기간의 안전한 시작점
const ALL_TIME_START = '2020-01-01'

export const hasGaEnv = () =>
  Boolean(
    process.env.GA4_PROPERTY_ID &&
    process.env.GA_CLIENT_EMAIL &&
    process.env.GA_PRIVATE_KEY
  )

const fetchAnalytics = async (): Promise<AnalyticsSummary> => {
  const client = new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GA_CLIENT_EMAIL,
      private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
  })

  const property = `properties/${process.env.GA4_PROPERTY_ID}`

  const [[dailyResponse], [totalsResponse]] = await Promise.all([
    client.runReport({
      property,
      dateRanges: [{ startDate: `${DAYS - 1}daysAgo`, endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }),
    // 전체 누적: 일별 합산은 방문자 중복 제거가 안 되므로 별도 쿼리
    client.runReport({
      property,
      dateRanges: [{ startDate: ALL_TIME_START, endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
    }),
  ])

  // GA는 데이터 없는 날을 생략하므로 0으로 채워 연속된 축을 만든다
  const byDate = new Map<string, DailyStat>()
  dailyResponse.rows?.forEach((row) => {
    const raw = row.dimensionValues?.[0]?.value ?? '' // YYYYMMDD
    const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
    byDate.set(date, {
      date,
      visitors: Number(row.metricValues?.[0]?.value ?? 0),
      views: Number(row.metricValues?.[1]?.value ?? 0),
    })
  })

  const today = dayjs()
  const daily = Array.from({ length: DAYS }, (_, i) => {
    const date = today.subtract(DAYS - 1 - i, 'day').format('YYYY-MM-DD')
    return byDate.get(date) ?? { date, visitors: 0, views: 0 }
  })

  const totalsRow = totalsResponse.rows?.[0]
  const totals = {
    visitors: Number(totalsRow?.metricValues?.[0]?.value ?? 0),
    views: Number(totalsRow?.metricValues?.[1]?.value ?? 0),
  }

  return { daily, totals }
}

// GA 쿼터 보호: 성공 응답을 1시간 캐시 (실패는 캐시되지 않음)
// 서버 컴포넌트(초기 SSR)와 API 라우트(클라이언트 fallback)가 같은 캐시를 공유
export const getCachedAnalytics = unstable_cache(
  fetchAnalytics,
  ['ga4-analytics'],
  { revalidate: 3600 }
)
