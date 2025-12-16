import styled from 'styled-components'
import PreviewContent from '@components/PreviewContent'
import Seo from '@components/Seo'
import { getRecentPosts } from '@lib/posts'
import { PostType } from '@lib/types'

const HomeContainer = styled.div``

type Props = {
  recentPosts: PostType[]
}

export default function Home({ recentPosts }: Props) {
  const converted = recentPosts?.map(
    ({ slug, title, date, coverImage, description }) => ({
      href: `/blog/${slug}`,
      title: title || 'Post',
      date,
      imgUrl: coverImage,
      description,
    })
  )

  const previewPosts = [...converted]
  return (
    <>
      <Seo mode="default" />
      <HomeContainer>
        <PreviewContent previewPosts={previewPosts} />
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
