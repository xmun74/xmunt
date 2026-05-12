import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Layout from '@components/Layout'
import DOMAIN from '@constants/domain'
import pageConfig from '@lib/config'
import { getAllPosts, getPostBySlug, getPostToc } from '@lib/posts'
import { PostType } from '@lib/types'
import BlogDetailPage from './blog-detail-page'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = getAllPosts(['slug']) as unknown as PostType[]
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const post = getPostBySlug(slug, [
      'slug',
      'title',
      'description',
      'coverImage',
      'category',
    ]) as unknown as PostType

    const title = post.title ?? pageConfig.title
    const description = post.description ?? pageConfig.description
    const image = post.coverImage
      ? `${DOMAIN}${post.coverImage}`
      : pageConfig.siteImg
    const url = `/blog/${post.slug}`

    return {
      title,
      description,
      openGraph: {
        url,
        type: 'website',
        siteName: `${title} | ${pageConfig.title}`,
        title: `${title} | ${pageConfig.title}`,
        description,
        images: [image],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | ${pageConfig.title}`,
        description,
        images: [image],
      },
      other: {
        'twitter:label1': 'Category',
        'twitter:data1': post.category ?? '',
      },
    }
  } catch {
    return {
      title: pageConfig.title,
      description: pageConfig.description,
    }
  }
}

export default async function Detail({ params }: PageProps) {
  const { slug } = await params
  const allPosts = getAllPosts([
    'slug',
    'date',
    'title',
  ]) as unknown as PostType[]
  const postIdx = allPosts.findIndex((allP) => allP.slug === slug)

  if (postIdx === -1) {
    notFound()
  }

  const postData = getPostBySlug(slug, [
    'slug',
    'title',
    'description',
    'coverImage',
    'date',
    'content',
    'image',
    'content',
    'category',
    'tags',
  ]) as unknown as PostType
  const recentPostProps = {
    prevPost: allPosts[postIdx + 1] ?? null,
    nextPost: allPosts[postIdx - 1] ?? null,
  }
  const postToc = getPostToc(postData.content ?? '')

  return (
    <Layout>
      <BlogDetailPage
        post={postData}
        content={postData.content ?? ''}
        recentPostProps={recentPostProps}
        postToc={postToc}
      />
    </Layout>
  )
}
