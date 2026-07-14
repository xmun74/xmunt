'use client'

import { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import useIntersect from '@lib/hooks/useIntersect'
import PostDate from '@components/PostDate'
import { blogsApi } from '@lib/apis'
import { PostType } from '@lib/types'
import { themeColor } from '@styles/theme'

const SectionHeader = styled.div`
  margin-bottom: 1.25rem;
`

const SectionTitle = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  color: ${themeColor.text1};
`

const SectionDesc = styled.p`
  margin-top: 0.3rem;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: ${themeColor.text4};
`

const PostContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`

const PostItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  transition: background 160ms ease;

  &:hover {
    background: ${themeColor.hoverBg};
  }
`
const PostTitle = styled.h2`
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5;
  color: ${themeColor.text1};
  letter-spacing: -0.01em;
`
const PostDesc = styled.div`
  color: ${themeColor.text4};
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`
const PostWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;

  > div:last-child {
    flex: none;
  }
`

const LoadingText = styled.div`
  padding: 1rem 0;
  text-align: center;
  font-size: 0.8rem;
  color: ${themeColor.text4};
`

type BlogPageProps = {
  initialBlogs: PostType[]
  initialPage: number
  initialHasNextPage: boolean
  totalCount: number
}

export default function BlogPage({
  initialBlogs,
  initialPage,
  initialHasNextPage,
  totalCount,
}: BlogPageProps) {
  const [blogs, setBlogs] = useState<PostType[]>(initialBlogs)
  const [isLoading, setIsLoading] = useState(false)
  const pageRef = useRef(initialPage)
  const nextPageRef = useRef(initialHasNextPage)
  const isLoadingRef = useRef(false)
  const PAGE_SIZE = 8

  const fetchNextData = useCallback(async () => {
    if (isLoadingRef.current || !nextPageRef.current) return

    isLoadingRef.current = true
    setIsLoading(true)

    const { contents, pageNumber, isLastPage } = await blogsApi.getBlogs(
      pageRef.current,
      PAGE_SIZE
    )

    setBlogs((prev) => [...prev, ...contents])
    pageRef.current = pageNumber + 1
    nextPageRef.current = !isLastPage
    isLoadingRef.current = false
    setIsLoading(false)
  }, [])

  const target = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target)
    if (nextPageRef.current && !isLoadingRef.current) {
      await fetchNextData()
    }
  })

  return (
    <>
      <SectionHeader>
        <SectionTitle>블로그</SectionTitle>
        <SectionDesc>기록한 글 {totalCount}개</SectionDesc>
      </SectionHeader>
      <PostContainer>
        {blogs.map(({ slug, title, description, date }) => (
          <Link as={`/blog/${slug}`} href={`/blog/${slug}`} key={slug}>
            <PostItem>
              <PostWrapper>
                <PostTitle>{title}</PostTitle>
                <PostDate date={date} />
              </PostWrapper>
              <PostDesc>{description}</PostDesc>
            </PostItem>
          </Link>
        ))}
      </PostContainer>
      <div ref={target}>
        {isLoading && <LoadingText>불러오는 중…</LoadingText>}
      </div>
    </>
  )
}
