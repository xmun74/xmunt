import { Suspense } from 'react'
import Layout from '@components/Layout'
import VisitorsChartSection from '@components/chart/VisitorsChartSection'
import VisitorsChartSkeleton from '@components/chart/VisitorsChartSkeleton'
import { getRecentPosts } from '@lib/posts'
import { PostType } from '@lib/types'
import HomePage from './home-page'

export const revalidate = 10

export default function Home() {
  const recentPosts = getRecentPosts([
    'slug',
    'title',
    'description',
    'coverImage',
    'date',
    'category',
    'tags',
  ]) as unknown as PostType[]

  return (
    <Layout>
      <HomePage
        recentPosts={recentPosts}
        chart={
          <Suspense fallback={<VisitorsChartSkeleton />}>
            <VisitorsChartSection />
          </Suspense>
        }
      />
    </Layout>
  )
}
