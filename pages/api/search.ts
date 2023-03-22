/* eslint @typescript-eslint/no-var-requires: "off" */
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllPosts } from '../../lib/api'
import { cachedPosts } from '../../cache/post'

const cachedPost = require('../../cache/post').cachedPosts

export type CachedPost = {
  slug: string
  title: string
  content?: string
}

type Data = {
  results: CachedPost[]
}

const posts = cachedPost as CachedPost[]
/* const posts =
  process.env.NODE_ENV === 'production'
    ? (cachedPosts as CachedPost[])
    :   getAllPosts(['slug', 'title', 'content']) as CachedPost[] */

export default function searchHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { query, method } = req

  try {
    const results = query.q
      ? posts.filter((post) =>
          post.title.toLowerCase().includes(query.q!.toString()),
        )
      : []
    res.setHeader('Content-Type', 'application/json')
    // res.statusCode = 200
    // res.end(JSON.stringify({ results }))
    res.status(200).json({ results })
  } catch (err) {
    res.statusCode = 500
    console.log('failed', err)
  }

  // console.log(`${method} 쿼리: `, req.query.q, results)
}
