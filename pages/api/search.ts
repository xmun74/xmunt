import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllPosts } from '../../lib/api'

export type CachedPost = {
  slug: string
  title: string
  content: string
}

type Data = {
  results: CachedPost[]
}

const posts = getAllPosts(['slug', 'title', 'content']) as CachedPost[]

export default function searchHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { query, method } = req

  const results = query.q
    ? posts.filter((post) =>
        post.title.toLowerCase().includes(query.q!.toString()),
      )
    : posts

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ results })

  // console.log(`${method} 쿼리: `, req.query.q)
}
