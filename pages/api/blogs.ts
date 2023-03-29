import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllPosts } from '../../lib/posts'
import { CachedPost } from './search'
// import { cachedPosts } from '../../cache/post'

type Data = {
  contents: CachedPost[]
  pageNumber: number
  totalCount: number
  totalPages: number
  isLastPage: boolean
  isFirstPage: boolean
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
  const { query } = req
  // console.log(`${req.method} 쿼리: `, req.query) //

  const page = Number(query.page)
  const size = Number(query.size)

  const contents = posts.slice(page * size, (page + 1) * size)
  const totalCount = posts.length
  const totalPages = Math.round(totalCount / size)
  const isLastPage = totalPages <= page
  const isFirstPage = page === 0

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({
    contents,
    pageNumber: page,
    totalCount,
    totalPages,
    isLastPage,
    isFirstPage,
  })
}
