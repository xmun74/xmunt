import Head from 'next/head'
import DOMAIN from '../constants/domain'
import pageConfig from '../lib/config'
import { PostType } from '../lib/types'

interface SeoPostProps {
  post?: PostType
  mode: 'post' | 'default'
}

export default function Seo({ post, mode }: SeoPostProps) {
  return post && mode === 'post' ? (
    <Head>
      {/* HTML Meta Tags */}
      <title>{`${post?.title} | ${pageConfig.title}`}</title>
      <meta name="description" content={`${pageConfig.title}`} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Facebook Meta Tags */}
      <meta
        property="og:url"
        content={`https://xmunt.vercel.app/blog/${post?.slug}`}
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:site_name"
        content={`${post?.title} | ${pageConfig.title}`}
      />
      <meta
        property="og:title"
        content={`${post?.title} | ${pageConfig.title}`}
      />
      <meta property="og:description" content={post?.description} />
      <meta property="og:image" content={`${DOMAIN}${post?.coverImage}`} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="xmunt.vercel.app" />
      <meta
        property="twitter:url"
        content={`https://xmunt.vercel.app/blog/${post?.slug}`}
      />
      <meta
        name="twitter:title"
        content={`${post?.title} | ${pageConfig.title}`}
      />
      <meta name="twitter:description" content={post?.description} />
      <meta name="twitter:image" content={`${pageConfig.siteImg}`} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content={`${post?.category}`} />
    </Head>
  ) : (
    <Head>
      {/* HTML Meta Tags */}
      <title>문태경 Blog</title>
      <meta name="description" content={`${pageConfig.description}`} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Facebook Meta Tags */}
      <meta property="og:url" content="https://xmunt.vercel.app/" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={`${pageConfig.title}`} />
      <meta property="og:title" content={`${pageConfig.title}`} />
      <meta
        property="og:description"
        content="꾸준히 성장해가는 문태경 블로그입니다."
      />
      <meta property="og:image" content={`${pageConfig.siteImg}`} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="xmunt.vercel.app" />
      <meta property="twitter:url" content="https://xmunt.vercel.app/" />
      <meta name="twitter:title" content={`${pageConfig.title}`} />
      <meta name="twitter:description" content={`${pageConfig.description}`} />
      <meta name="twitter:image" content={`${pageConfig.siteImg}`} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content="블로그" />
    </Head>
  )
}
