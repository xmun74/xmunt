import { NextResponse } from 'next/server'
import { getPaginatedPosts } from '@lib/posts'
import type { CachedPost, PaginatedResponse } from '@lib/types'

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const page = Number(searchParams.get('page'))
  const size = Number(searchParams.get('size'))
  const data = getPaginatedPosts<CachedPost>(
    ['slug', 'title', 'date', 'description'],
    page,
    size
  )

  return NextResponse.json<PaginatedResponse<CachedPost>>(data)
}
