import type { Metadata } from 'next'
import Layout from '@components/Layout'
import { getPaginatedPosts } from '@lib/posts'
import type { PostType } from '@lib/types'
import BlogPage from './blog-page'

export const revalidate = 10
const PAGE_SIZE = 8

export const metadata: Metadata = {
  title: 'Blog',
}

export default function Blog() {
  const initialData = getPaginatedPosts<PostType>(
    ['slug', 'title', 'date', 'description'],
    0,
    PAGE_SIZE
  )

  return (
    <Layout>
      <BlogPage
        initialBlogs={initialData.contents}
        initialPage={initialData.pageNumber + 1}
        initialHasNextPage={!initialData.isLastPage}
        totalCount={initialData.totalCount}
      />
    </Layout>
  )
}
