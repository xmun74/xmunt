import { useRouter } from 'next/router'
import Seo from '../../components/Seo'
import { getAllPosts, getPostBySlug } from '../../lib/api'
import markdownToHtml from '../../lib/markdownToHtml'

export default function Detail({ post }: { post: any }) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <Seo title={post.title} />
      <h1>{post.title}&</h1>
      <h4>{post.date}</h4>
      <div dangerouslySetInnerHTML={{ __html: post.content }}>
        {/* {post.content} */}
      </div>
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
  const content = await markdownToHtml(postData.content || '')
  return {
    props: {
      post: {
        ...postData,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug']) //  [ { slug: 'pre-rendering' }, { slug: 'preview' } ]

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
