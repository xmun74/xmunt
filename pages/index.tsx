import Link from 'next/link'
import styled from 'styled-components'
import Heading from '@components/common/Heading'
import PlusIcon from '@components/icons/PlusIcon'
import PreviewContent from '@components/PreviewContent'
import Seo from '@components/Seo'
import { getRecentPosts } from '@lib/posts'
import { PostType } from '@lib/types'

const HomeContainer = styled.div`
  height: 100vh;
`

const BlogLink = styled(Link)`
  font-size: 16px;
  font-weight: 500;
  margin-top: 30px;
  &:hover {
    color: #ff5500;
    transition: 0.15s ease-in-out;
  }
  display: inline-block;
`
const BlogLinkWrap = styled.div`
  display: flex;
`

type Props = {
  recentPosts: PostType[]
}

export default function Home({ recentPosts }: Props) {
  console.log('여여', recentPosts)

  const converted = recentPosts?.map(({ slug, title, date, coverImage }) => ({
    href: `/blog/${slug}`,
    title: title || 'Post',
    date,
    imgUrl: coverImage,
  }))

  const previewPosts = [...converted]
  return (
    <>
      <Seo mode="default" />
      <HomeContainer>
        <Heading title="Posts" />
        <PreviewContent previewPosts={previewPosts} />
        <BlogLink href="/blog">
          <BlogLinkWrap>
            More other posts &nbsp;
            <PlusIcon />
          </BlogLinkWrap>
        </BlogLink>
      </HomeContainer>
    </>
  )
}
export const getStaticProps = async () => {
  const recentPosts = getRecentPosts([
    'slug',
    'title',
    'description',
    'coverImage',
    'date',
    'category',
    'tags',
  ])

  return {
    props: { recentPosts },
    revalidate: 10,
  }
}
