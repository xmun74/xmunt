import { useEffect, useState } from 'react'
import styled, { CSSProperties } from 'styled-components'
import Link from 'next/link'
import Seo from '@components/Seo'
import useIntersect from '@lib/hooks/useIntersect'
import Heading from '@components/common/Heading'
import PostDate from '@components/PostDate'
import { blogsApi } from '@lib/apis'
import { getAllPosts } from '@lib/posts'
import { PostType } from '@lib/types'
import { themeColor } from '@styles/theme'

const PostContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;

  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`

const PostItem = styled.div`
  position: relative;
  height: 110px;
  border-radius: 5px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  &:hover {
    background-color: ${themeColor.hoverBg};
    transition: 0.1s ease-in-out;
  }
`
const PostTitle = styled.h1`
  font-weight: 700;
  font-size: 20px;
  line-height: 1.7rem;
  color: ${themeColor.text1};
`
const PostDesc = styled.div`
  color: ${themeColor.text2};
  opacity: 0.5;
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.3rem;
`
const PostWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

type Props = {
  allPosts: PostType[]
}

export default function Blog({ allPosts }: Props) {
  const [blogs, setBlogs] = useState<PostType[]>([])
  const [page, setPage] = useState(0)
  const [nextPage, setNextPage] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const PAGE_SIZE = 8

  const fetchNextData = async () => {
    setIsLoading(true)
    const { contents, pageNumber, isLastPage } = await blogsApi.getBlogs(
      page,
      PAGE_SIZE
    )
    setBlogs([...blogs, ...contents])
    setPage(pageNumber + 1)
    setNextPage(!isLastPage)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchNextData()
  }, [])

  const target = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target)
    if (nextPage && !isLoading) {
      fetchNextData()
    }
  })

  return (
    <>
      <Seo mode="default" />
      {/* <Heading title={`Posts ${blogs.length}`} /> */}
      <PostContainer>
        {blogs &&
          blogs?.map(({ slug, title, description, date }) => (
            <Link as={`/blog/${slug}`} href={`/blog/${slug}`} key={title}>
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
      <div ref={target}>{isLoading && <div>Loading...</div>}</div>
    </>
  )
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'slug',
    'title',
    'description',
    'coverImage',
    'date',
    'category',
    'tags',
  ])

  return {
    props: { allPosts },
    revalidate: 10,
  }
}
