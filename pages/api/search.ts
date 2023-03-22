import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllPosts } from '../../lib/api'
import { cachedPosts } from '../../cache/post'

export type CachedPost = {
  slug: string
  title: string
  content?: string
}

type Data = {
  results: CachedPost[]
}

const posts = cachedPosts as CachedPost[]
/* const posts =
  process.env.NODE_ENV === 'production'
    ? (cachedPosts as CachedPost[])
    :   getAllPosts(['slug', 'title', 'content']) as CachedPost[] */

export default function searchHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { query, method } = req

  const results = query.q
    ? posts.filter((post) =>
        post.title.toLowerCase().includes(query.q!.toString()),
      )
    : []

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ results }))

  // console.log(`${method} 쿼리: `, req.query.q, results)
}
