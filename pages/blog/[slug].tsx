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

const HeaderContainer = styled.div`
  margin-bottom: 70px;
`
const PostTitle = styled.div`
  font-weight: 800;
  font-size: 36px;
  margin-bottom: 20px;
`

export default function Detail({
  post,
  mdx,
}: {
  post: PostType
  mdx: MDXRemoteSerializeResult
}) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <div>Loading...</div>
  }
  return (
    <main>
      <Seo post={post} mode="post" />
      <HeaderContainer>
        <PostTitle>{post.title}</PostTitle>
        <PostDate date={post.date} />
      </HeaderContainer>
      <PostBody mdx={mdx} />
      <Giscus />
    </main>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
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
  return {
    props: {
      post: {
        ...postData,
      },
      mdx,
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
