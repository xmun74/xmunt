import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllPosts } from '@lib/posts'
import { CachedPost } from './search'
// import { cachedPosts } from '@cache/post'

type Data = {
  contents: CachedPost[]
  pageNumber: number
  totalCount: number
  totalPages: number
  isLastPage: boolean
  isFirstPage: boolean
}

/** test */
// const posts = [
//   { slug: 'giscus', title: 'post 1', date: 'post 1', description: 'post 1' },
//   { slug: 'giscus', title: 'post 2', date: 'post 1', description: 'post 1' },
//   { slug: 'giscus', title: 'post 3', date: 'post 1', description: 'post 1' },
//   { slug: 'giscus', title: 'post 4', date: 'post 1', description: 'post 1' },
//   { slug: 'giscus', title: 'post 5', date: 'post 5', description: 'post 1' },
//   { slug: 'giscus', title: 'post 6', date: 'post 6', description: 'post 1' },
//   { slug: 'giscus', title: 'post 7', date: 'post 7', description: 'post 1' },
//   { slug: 'giscus', title: 'post 8', date: 'post 8', description: 'post 1' },
//   { slug: 'giscus', title: 'post 9', date: 'post 9', description: 'post 1' },
//   { slug: 'giscus', title: 'post 10', date: 'post 10', description: 'post 1' },
//   { slug: 'giscus', title: 'post 11', date: 'post 11', description: 'post11' },
//   { slug: 'giscus', title: 'post 12', date: 'post 12', description: 'post12' },
//   { slug: 'giscus', title: 'post 13', date: 'post 13', description: 'post13' },
//   { slug: 'giscus', title: 'post 14', date: 'post 14', description: 'post14' },
//   { slug: 'giscus', title: 'post 15', date: 'post 15', description: 'post15' },
//   { slug: 'giscus', title: 'post 16', date: 'post 16', description: 'post16' },
//   { slug: 'giscus', title: 'post 17', date: 'post 17', description: 'post17' },
//   { slug: 'giscus', title: 'post 18', date: 'post 18', description: 'post18' },
//   { slug: 'giscus', title: 'post 19', date: 'post 19', description: 'post19' },
//   { slug: 'giscus', title: 'post 20', date: 'post 20', description: 'post20' },
//   { slug: 'giscus', title: 'post 21', date: 'post 21', description: 'post21' },
//   { slug: 'giscus', title: 'post 22', date: 'post 22', description: 'post22' },
// ]

/** saved */
const posts = getAllPosts([
  'slug',
  'title',
  'date',
  'description',
]) as CachedPost[]

/** cached */
// const posts =
//   process.env.NODE_ENV === 'production'
//     ? (cachedPosts as CachedPost[])
//     : (getAllPosts(['slug', 'title', 'date']) as CachedPost[])

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query } = req

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
