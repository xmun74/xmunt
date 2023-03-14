import { useRouter } from 'next/router'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import styled from 'styled-components'
import { getAllPosts, getPostBySlug } from '../../lib/api'
import Seo from '../../components/Seo'
import PostBody from '../../components/PostBody'
import PostDate from '../../components/PostDate'
import serializedMdx from '../../lib/mdx'
import Giscus from '../../components/Giscus'
import { PostType } from '../../lib/types'
import AuthorInfo from '../../components/common/AuthorInfo'
import RecentPost, { RecentPostProps } from '../../components/common/RecentPost'
import Tag from '../../components/common/Tag'
import PostToc from '../../components/PostToc'

const HeaderContainer = styled.div`
  margin-bottom: 70px;
`
const PostTitle = styled.div`
  font-weight: 800;
  font-size: 36px;
  margin-bottom: 20px;
  @media screen and (max-width: 767px) {
    font-size: 28px;
  }
`

export default function Detail({
  post,
  mdx,
  recentPostProps,
  postToc,
}: {
  post: PostType
  mdx: MDXRemoteSerializeResult
  recentPostProps: RecentPostProps
  postToc: any //
}) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <div>Loading...</div>
  }
  return (
    <main>
      <Seo post={post} mode="post" />
      {/* Post Header */}
      <HeaderContainer>
        <PostTitle>{post.title}</PostTitle>
        <PostDate date={post.date} />
      </HeaderContainer>
      {/* Post Body */}
      <PostBody mdx={mdx} />
      <PostToc postToc={postToc} />
      {/* Post Footer */}
      {Array.isArray(post.tags) &&
        post?.tags.map((tag) => <Tag tag={tag} key={tag} />)}
      <AuthorInfo />
      <RecentPost {...recentPostProps} />
      <Giscus />
    </main>
  )
}

type Params = {
  params: {
    slug: string
    date: string
  }
}

export async function getStaticProps({ params }: Params) {
  const allPosts = getAllPosts(['slug', 'date', 'title'])
  const postIdx = allPosts.findIndex((allP) => allP.slug === params.slug)

  if (postIdx === -1) {
    return { notFound: true }
  }

  const postData = getPostBySlug(params.slug, [
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
  ])
  const mdx = await serializedMdx(postData.content)
  const recentPostProps = {
    prevPost: allPosts[postIdx + 1] ?? null,
    nextPost: allPosts[postIdx - 1] ?? null,
  }
  const postToc = '목차입니다'
  return {
    props: {
      post: {
        ...postData,
      },
      mdx,
      recentPostProps,
      postToc,
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])
  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
