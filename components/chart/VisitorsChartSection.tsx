import { getCachedAnalytics, hasGaEnv } from '@lib/analytics'
import VisitorsChart from './VisitorsChart'

// async 서버 컴포넌트: GA 데이터를 초기 렌더에 포함시켜 클라이언트 fetch 워터폴 제거.
// <Suspense>로 감싸 사용하면 콜드 캐시(GA 1~3초)가 페이지 전체를 막지 않고 차트만 스트리밍된다.
export default async function VisitorsChartSection() {
  if (!hasGaEnv()) return null

  try {
    const summary = await getCachedAnalytics()
    return <VisitorsChart initialSummary={summary} />
  } catch (error) {
    // 서버 조회 실패 시 조용히 숨김 (기존 클라이언트 hasError → null 동작과 동일)
    console.error('GA4 초기 로드 실패:', error)
    return null
  }
}
