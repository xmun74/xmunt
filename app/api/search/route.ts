import { NextResponse } from 'next/server'
import { cachedPosts } from '@cache/post'
import { getAllPosts } from '@lib/posts'
import type { CachedPost } from '@lib/types'

const posts =
  process.env.NODE_ENV === 'production'
    ? (cachedPosts as CachedPost[])
    : (getAllPosts(['slug', 'title', 'content']) as CachedPost[])

export function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase()
    const results = query
      ? posts.filter((post) => post.title.toLowerCase().includes(query))
      : []

    return NextResponse.json({ results })
  } catch (err) {
    console.log('failed', err)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
