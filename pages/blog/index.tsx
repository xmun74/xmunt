import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'
import Heading from '../../components/common/Heading'
import PostDate from '../../components/PostDate'
import Seo from '../../components/Seo'
import { blogsApi } from '../../lib/apis'
import useIntersect from '../../lib/hooks/useIntersect'
import { getAllPosts } from '../../lib/posts'
import { PostType } from '../../lib/types'
import { themeColor } from '../../styles/theme'

const PostContainer = styled.div`
  padding-top: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;

  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`

const PostItem = styled.div`
  position: relative;
  height: 170px;
  border-radius: 5px;
  padding: 20px 20px 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &::after {
    position: absolute;
    content: '';
    width: 0;
    height: 3%;
    top: 0;
    right: 0;
    z-index: -1;
    background-color: ${themeColor.bg2};
    border-radius: 5px;
    transition: all 0.1s ease;
  }
  &:hover {
    transition: 0.1s ease-in-out;
  }
  &:hover:after {
    left: 0;
    width: 100%;
  }
  &:active {
    top: 2px;
  }
`
const PostTitle = styled.h1`
  font-weight: 700;
  font-size: 24px;
  padding-bottom: 10px;
`
const PostDesc = styled.div`
  color: ${themeColor.text2};
`

type Props = {
  allPosts: PostType[]
}

export default function Blog({ allPosts }: Props) {
  const [blogs, setBlogs] = useState([])
  const [page, setPage] = useState(0)
  const [nextPage, setNextPage] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    const { contents, pageNumber, isLastPage } = await blogsApi.getBlogs(
      page,
      8,
    )
    setBlogs(blogs.concat(contents))
    setPage(pageNumber + 1)
    setNextPage(!isLastPage)
    setIsLoading(false)
  }

  const target = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target)
    if (nextPage && !isLoading) {
      fetchData()
    }
  })

  return (
    <>
      <Seo mode="default" />
      <Heading title={`Posts ${blogs.length}`} />
      <PostContainer>
        {blogs &&
          blogs?.map(({ slug, title, description, date }) => (
            <Link as={`/blog/${slug}`} href={`/blog/${slug}`} key={title}>
              <PostItem>
                <div>
                  <PostTitle>{title}</PostTitle>
                  <PostDesc>{description}</PostDesc>
                </div>
                <PostDate date={date} />
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
    revalidate: 10, // 10초 후 새 요청오면 페이지 새로 생성
  }
}
