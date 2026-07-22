'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import styled from 'styled-components'
import { analyticsApi } from '@lib/apis'
import { useThemeContext } from '@lib/theme-context'
import type { AnalyticsSummary } from '@lib/types'
import { themeColor } from '@styles/theme'

const SERIES = {
  views: { label: '조회수' },
  visitors: { label: '방문자수' },
} as const

// 파스텔 톤은 표면 밝기에 따라 요구 스텝이 달라서 테마별로 별도 선정
// (각각 해당 표면에서 색각이상 분리도·채도·밝기 밴드 검증 통과값)
const PALETTE = {
  light: { views: '#eb9d66', visitors: '#6ea8e8' },
  dark: { views: '#d07c3f', visitors: '#4f94e0' },
} as const

const RANGES = [
  { days: 90, label: '3개월' },
  { days: 30, label: '30일' },
  { days: 7, label: '7일' },
] as const

const Card = styled.section`
  margin-bottom: 3rem;
  padding: 1.25rem 1.25rem 1rem;
  border: 1px solid ${themeColor.inlineCode};
  border-radius: 0.75rem;
  background: ${themeColor.bg1};
`

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
`

const Title = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${themeColor.text1};
`

const Desc = styled.p`
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: ${themeColor.text4};
`

const RangeGroup = styled.div`
  display: flex;
  gap: 0.15rem;
  padding: 0.15rem;
  border: 1px solid ${themeColor.inlineCode};
  border-radius: 999px;
`

const RangeBtn = styled.button<{ $active: boolean }>`
  border: none;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  white-space: nowrap;
  color: ${(props) => (props.$active ? themeColor.text1 : themeColor.text4)};
  background: ${(props) =>
    props.$active ? themeColor.inlineCode : 'transparent'};
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
    color: ${themeColor.text1};
  }
`

const TotalsRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.25rem;
`

const TotalItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const TotalLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: ${themeColor.text4};
`

const TotalValue = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${themeColor.text1};
`

const ChartBox = styled.div`
  width: 100%;
  height: 240px;

  /* 마우스 클릭 시 포커스 아웃라인 제거 (키보드 포커스 표시는 유지) */
  .recharts-wrapper:focus:not(:focus-visible),
  .recharts-surface:focus:not(:focus-visible) {
    outline: none;
  }
`

const LegendRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 0.75rem;
`

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: ${themeColor.text4};
`

const LegendCount = styled.span`
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: ${themeColor.text1};
`

const LegendSwatch = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: ${(props) => props.$color};
`

const TooltipCard = styled.div`
  padding: 0.6rem 0.75rem;
  border: 1px solid ${themeColor.inlineCode};
  border-radius: 0.5rem;
  background: ${themeColor.bg1};
  box-shadow: 0 4px 16px -6px rgba(0, 0, 0, 0.25);
  font-size: 0.75rem;
  color: ${themeColor.text1};
`

const TooltipDate = styled.div`
  margin-bottom: 0.4rem;
  font-weight: 600;
`

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  margin-top: 0.2rem;
`

const TooltipName = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${themeColor.text4};
`

const TooltipValue = styled.span`
  font-variant-numeric: tabular-nums;
  font-weight: 600;
`

type ChartTooltipProps = {
  active?: boolean
  label?: string
  payload?: {
    dataKey?: string | number
    value?: number | string
    color?: string
  }[]
}

function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <TooltipCard>
      <TooltipDate>{dayjs(label).format('M월 D일 (dd)')}</TooltipDate>
      {payload.map((entry) => {
        const key = entry.dataKey as keyof typeof SERIES
        return (
          <TooltipRow key={key}>
            <TooltipName>
              <LegendSwatch $color={entry.color ?? 'currentColor'} />
              {SERIES[key].label}
            </TooltipName>
            <TooltipValue>{Number(entry.value).toLocaleString()}</TooltipValue>
          </TooltipRow>
        )
      })}
    </TooltipCard>
  )
}

type Props = {
  // 서버에서 미리 받아 주입하면 클라이언트 fetch 워터폴을 건너뛴다
  initialSummary?: AnalyticsSummary | null
}

export default function VisitorsChart({ initialSummary = null }: Props) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(
    initialSummary
  )
  const [hasError, setHasError] = useState(false)
  const [rangeDays, setRangeDays] = useState<number>(RANGES[0].days)
  const { theme } = useThemeContext()
  const palette = PALETTE[theme]

  useEffect(() => {
    // 서버에서 이미 주입됐으면 재요청 불필요
    if (initialSummary) return

    let cancelled = false

    analyticsApi
      .getDailyStats()
      .then((data: AnalyticsSummary) => {
        if (!cancelled) setSummary(data)
      })
      .catch(() => {
        if (!cancelled) setHasError(true)
      })

    return () => {
      cancelled = true
    }
  }, [initialSummary])

  const visibleData = summary?.daily.slice(-rangeDays) ?? []
  // 하단 범례에 표시하는 기간 내 합계 (상단은 GA 전체 누적)
  const rangeTotals = visibleData.reduce(
    (acc, day) => ({
      views: acc.views + day.views,
      visitors: acc.visitors + day.visitors,
    }),
    { views: 0, visitors: 0 }
  )

  if (hasError) return null

  return (
    <Card aria-label="방문자수·조회수 차트">
      <CardHeader>
        <div>
          <Title>방문자 통계</Title>
          <Desc>
            전체 누적과 최근 {RANGES.find((r) => r.days === rangeDays)?.label}{' '}
            추이
          </Desc>
        </div>
        <RangeGroup role="group" aria-label="기간 선택">
          {RANGES.map((range) => (
            <RangeBtn
              key={range.days}
              type="button"
              $active={rangeDays === range.days}
              onClick={() => setRangeDays(range.days)}
            >
              {range.label}
            </RangeBtn>
          ))}
        </RangeGroup>
      </CardHeader>

      <TotalsRow>
        {(Object.keys(SERIES) as (keyof typeof SERIES)[]).map((key) => (
          <TotalItem key={key}>
            <TotalLabel>
              <LegendSwatch $color={palette[key]} />
              누적 {SERIES[key].label}
            </TotalLabel>
            <TotalValue>
              {summary ? summary.totals[key].toLocaleString() : '—'}
            </TotalValue>
          </TotalItem>
        ))}
      </TotalsRow>

      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={visibleData}
            margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
          >
            <defs>
              <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={palette.views} stopOpacity={0.5} />
                <stop
                  offset="95%"
                  stopColor={palette.views}
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.visitors}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={palette.visitors}
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--inlineCode)"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: 'var(--text4)', fontSize: 11 }}
              tickFormatter={(value: string) => dayjs(value).format('M월 D일')}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'var(--text4)', strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke={palette.views}
              strokeWidth={2}
              fill="url(#fillViews)"
              activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--bg1)' }}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke={palette.visitors}
              strokeWidth={2}
              fill="url(#fillVisitors)"
              activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--bg1)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartBox>

      <LegendRow>
        {(Object.keys(SERIES) as (keyof typeof SERIES)[]).map((key) => (
          <LegendItem key={key}>
            <LegendSwatch $color={palette[key]} />
            {SERIES[key].label}
            <LegendCount>
              {summary ? rangeTotals[key].toLocaleString() : '—'}
            </LegendCount>
          </LegendItem>
        ))}
      </LegendRow>
    </Card>
  )
}
