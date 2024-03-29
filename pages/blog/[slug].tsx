import { useRouter } from 'next/router'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import styled from 'styled-components'
import { getAllPosts, getPostBySlug, getPostToc } from '@lib/posts'
import Seo from '@components/Seo'
import PostBody from '@components/PostBody'
import PostDate from '@components/PostDate'
import serializedMdx from '@lib/mdx'
import Giscus from '@components/Giscus'
import { PostType } from '@lib/types'
import AuthorInfo from '@components/common/AuthorInfo'
import RecentPost, { RecentPostProps } from '@components/common/RecentPost'
import Tag from '@components/common/Tag'
import PostToc, { PostTocProps } from '@components/PostToc'

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 70px;
`
const PostTitle = styled.div`
  font-weight: 800;
  font-size: 36px;
  margin-bottom: 50px;
  @media screen and (max-width: 767px) {
    font-size: 28px;
  }
`
const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 50px;
  border-bottom: 1px solid lightgray;
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
  postToc: PostTocProps[]
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
        <PostInfo>
          <div>
            {Array.isArray(post.tags) &&
              post?.tags.map((tag) => <Tag tag={tag} key={tag} />)}
          </div>
          <PostDate date={post.date} />
        </PostInfo>
      </HeaderContainer>
      {/* Post Body */}
      <PostBody mdx={mdx} />
      <PostToc postToc={postToc} />
      {/* Post Footer */}
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
  const postToc = getPostToc(postData.content)
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
