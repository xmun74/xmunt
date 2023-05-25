import { useEffect, useState } from 'react'
import styled, { CSSProperties } from 'styled-components'
import Link from 'next/link'
import Heading from '../../components/common/Heading'
import PostDate from '../../components/PostDate'
import Seo from '../../components/Seo'
import { blogsApi } from '../../lib/apis'
import useIntersect from '../../lib/hooks/useIntersect'
import useScrollRestoration from '../../lib/hooks/useScrollRestoration'
import { getAllPosts } from '../../lib/posts'
import { PostType } from '../../lib/types'
import { themeColor } from '../../styles/theme'
// import VirtualizedList from '../../components/VirtualizedList'
// import { getSessionStorage, setSessionStorage } from '../../lib/webStorage'

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
    height: 1%;
    top: 0;
    right: 0;
    z-index: -1;
    background-color: ${themeColor.text1};
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
  line-height: 1.7rem;

  &::after {
    position: absolute;
    content: '';
    width: 0;
    height: 1%;
    top: 0;
    right: 0;
    z-index: -1;
    background-color: ${themeColor.text1};
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
const PostDesc = styled.div`
  color: ${themeColor.text2};
  opacity: 0.5;
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.3rem;
`

type Props = {
  allPosts: PostType[]
}

interface ItemProps {
  index: number
  style: CSSProperties | undefined
}

export default function Blog({ allPosts }: Props) {
  const [blogs, setBlogs] = useState<PostType[]>([])
  const [page, setPage] = useState(0)
  const [nextPage, setNextPage] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const PAGE_SIZE = 8

  useScrollRestoration({ page, setPage })

  const fetchData = async () => {
    setIsLoading(true)
    const { contents, pageNumber, isLastPage } = await blogsApi.getBlogs(
      page,
      PAGE_SIZE,
    )
    // const cachePage = getSessionStorage('page')
    // if (cachePage) {
    //   console.log(cachePage)
    //   setPage(cachePage)
    // }
    setBlogs([...blogs, ...contents])
    setPage(pageNumber + 1)
    setNextPage(!isLastPage)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const target = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target)
    if (nextPage && !isLoading) {
      fetchData()
    }
  })
  const lastEleRef = target

  const renderListItem = ({ index, style }: ItemProps) => {
    let lastEle
    if (index < blogs.length) {
      lastEle = null
    } else {
      lastEle = lastEleRef
    }
    return (
      <Link
        as={`/blog/${blogs[index].slug}`}
        href={`/blog/${blogs[index].slug}`}
        key={blogs[index].title}
        className="item"
        style={style}
        // {index >== blogs.length ? ref={target}:''}
        // ref={lastEle}
      >
        <PostItem>
          <div>
            <PostTitle>{blogs[index].title}</PostTitle>
            <PostDesc>{blogs[index].description}</PostDesc>
          </div>
          <PostDate date={blogs[index].date} />
        </PostItem>
      </Link>
    )
  }

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
      {/* {blogs && (
        <VirtualizedList
          numItems={blogs && blogs.length}
          windowHeight={600}
          itemHeight={170}
          renderItem={renderListItem}
        />
      )} */}

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
