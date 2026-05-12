import { NextResponse } from 'next/server'
import { getAllPosts } from '@lib/posts'
import type { CachedPost } from '@lib/types'

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

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const page = Number(searchParams.get('page'))
  const size = Number(searchParams.get('size'))

  const contents = posts.slice(page * size, (page + 1) * size)
  const totalCount = posts.length
  const totalPages = Math.round(totalCount / size)
  const isLastPage = totalPages <= page
  const isFirstPage = page === 0

  return NextResponse.json<Data>({
    contents,
    pageNumber: page,
    totalCount,
    totalPages,
    isLastPage,
    isFirstPage,
  })
}
