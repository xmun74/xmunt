import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllPosts } from '../../lib/posts'
import { CachedPost } from './search'
// import { cachedPosts } from '../../cache/post'

type Data = {
  results: CachedPost[]
}

const posts = getAllPosts([
  'slug',
  'title',
  'date',
  'description',
]) as CachedPost[]

// const posts =
//   process.env.NODE_ENV === 'production'
//     ? (cachedPosts as CachedPost[])
//     : (getAllPosts(['slug', 'title', 'date']) as CachedPost[])

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { query, method } = req
  // console.log(`${method} 쿼리: `, req.query.q, results)

  const results = posts
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ results })
}
