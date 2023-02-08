import Link from 'next/link'
import styled from 'styled-components'
import { getAllPosts } from '../lib/api'
import { themeColor } from '../styles/theme'

const PostContainer = styled.div`
  padding-top: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;

  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`

const AllPostsTitle = styled.div`
  font-size: 42px;
  font-weight: 800;
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
    height: 100%;
    top: 0;
    right: 0;
    z-index: -1;
    background-color: ${themeColor.bg2};
    border-radius: 5px;
    transition: all 0.3s ease;
  }
  &:hover {
    transition: 0.3s ease-in-out;
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
  font-weight: 600;
  font-size: 24px;
  padding-bottom: 10px;
`
const PostDesc = styled.div`
  color: ${themeColor.text2};
`
const PostDate = styled.div`
  text-align: end;
  font-size: 12px;
  font-weight: 400;
  color: ${themeColor.text2};
`

type PostType = {
  slug: string
  title: string
  date: string
  description: string
  coverImage: string
  excerpt: string
  content: string
}
type Props = {
  allPosts: PostType[]
}

export default function Blog({ allPosts }: Props) {
  return (
    <>
      <AllPostsTitle>Posts {allPosts.length}</AllPostsTitle>
      <PostContainer>
        {allPosts.map(({ slug, title, description, coverImage, date }) => (
          <Link as={`/blog/${slug}`} href={`/blog/${slug}`} key={title}>
            <PostItem>
              <div>
                <PostTitle>{title}</PostTitle>
                <PostDesc>{description}</PostDesc>
              </div>
              <PostDate>{date}</PostDate>
            </PostItem>
          </Link>
        ))}
      </PostContainer>
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
  ])

  return {
    props: { allPosts },
  }
}
