/* eslint @typescript-eslint/no-var-requires: "off" */
import type { NextApiRequest, NextApiResponse } from 'next'
import { cachedPosts } from '@cache/post'
import { getAllPosts } from '@lib/posts'

export type CachedPost = {
  slug: string
  title: string
  content?: string
}
type Data = {
  results: CachedPost[]
}

const posts =
  process.env.NODE_ENV === 'production'
    ? (cachedPosts as CachedPost[])
    : (getAllPosts(['slug', 'title', 'content']) as CachedPost[])

export default function searchHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query, method } = req

  try {
    const results = query.q
      ? posts.filter((post) =>
          post.title.toLowerCase().includes(query.q!.toString())
        )
      : []
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ results })
  } catch (err) {
    res.statusCode = 500
    console.log('failed', err)
  }

  // console.log(`${method} 쿼리: `, req.query.q, results)
}
