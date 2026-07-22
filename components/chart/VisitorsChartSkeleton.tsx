import type { CSSProperties } from 'react'

// VisitorsChart와 동일한 카드 치수를 예약해 스트리밍 교체 시 레이아웃 이동(CLS)을 막는다.
// 서버 렌더용이라 styled-components 없이 CSS 변수(var(--*))로 테마에 대응한다.
const card: CSSProperties = {
  marginBottom: '3rem',
  padding: '1.25rem 1.25rem 1rem',
  border: '1px solid var(--inlineCode)',
  borderRadius: '0.75rem',
  background: 'var(--bg1)',
}

const bar = (
  width: string,
  height: string,
  extra?: CSSProperties
): CSSProperties => ({
  width,
  height,
  borderRadius: '0.4rem',
  background: 'var(--inlineCode)',
  animation: 'vcSkeletonPulse 1.4s ease-in-out infinite',
  ...extra,
})

export default function VisitorsChartSkeleton() {
  return (
    <section style={card} aria-hidden="true">
      <style>{`
        @keyframes vcSkeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>

      {/* 헤더: 제목/설명 + 기간 선택 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
        >
          <div style={bar('7rem', '1rem')} />
          <div style={bar('11rem', '0.8rem')} />
        </div>
        <div style={bar('9rem', '1.9rem', { borderRadius: '999px' })} />
      </div>

      {/* 누적 수치 */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.25rem' }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}
        >
          <div style={bar('5rem', '0.75rem')} />
          <div style={bar('4rem', '0.9rem')} />
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}
        >
          <div style={bar('5rem', '0.75rem')} />
          <div style={bar('4rem', '0.9rem')} />
        </div>
      </div>

      {/* 차트 영역 (실제 240px와 동일) */}
      <div style={bar('100%', '240px', { borderRadius: '0.5rem' })} />

      {/* 범례 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.25rem',
          marginTop: '0.75rem',
        }}
      >
        <div style={bar('6rem', '0.75rem')} />
        <div style={bar('6rem', '0.75rem')} />
      </div>
    </section>
  )
}
