import type { Metadata } from 'next'
import Layout from '@components/Layout'
import BlogPage from './blog-page'

export const revalidate = 10

export const metadata: Metadata = {
  title: 'Blog',
}

export default function Blog() {
  return (
    <Layout>
      <BlogPage />
    </Layout>
  )
}
