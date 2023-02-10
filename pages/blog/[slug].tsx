import { useRouter } from 'next/router'
import { getAllPosts, getPostBySlug } from '../../lib/api'
import Seo from '../../components/Seo'
import PostBody from '../../components/PostBody'
import PostDate from '../../components/PostDate'

interface PostType {
  slug: string
  title: string
  description: string
  coverImage: string
  date: string
  content: string
}

export default function Detail({ post }: { post: PostType }) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <Seo title={post.title} />
      <h1>{post.title}&</h1>
      <PostDate date={post.date} />
      <PostBody content={post.content} />
    </div>
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
  ])
  // const content = await markdownToHtml(postData.content || '')
  return {
    props: {
      post: {
        ...postData,
        // content,
      },
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
