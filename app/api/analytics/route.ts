import { NextResponse } from 'next/server'
import { getCachedAnalytics, hasGaEnv } from '@lib/analytics'
import type { AnalyticsSummary } from '@lib/types'

export async function GET() {
  if (!hasGaEnv()) {
    return NextResponse.json(
      {
        error:
          'GA4 환경변수(GA4_PROPERTY_ID, GA_CLIENT_EMAIL, GA_PRIVATE_KEY)가 설정되지 않았습니다.',
      },
      { status: 500 }
    )
  }

  try {
    return NextResponse.json<AnalyticsSummary>(await getCachedAnalytics(), {
      // Vercel Edge가 s-maxage를 존중 → 함수 호출을 시간당 1회 수준으로 감소.
      // GA unstable_cache(1h)와 주기를 맞추고, 짧은 SWR로 만료 순간의 GA 콜드콜(1~3초)이 사용자에게 노출되지 않게 스테일을 잠깐만 허용.
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('GA4 runReport 실패:', error)
    return NextResponse.json(
      { error: 'GA4 데이터를 불러오지 못했습니다.' },
      { status: 500 }
    )
  }
}
