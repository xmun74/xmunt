'use client'

import styled from 'styled-components'
import PreviewContent from '@components/PreviewContent'
import { PostType } from '@lib/types'

const HomeContainer = styled.div``

type Props = {
  recentPosts: PostType[]
}

export default function HomePage({ recentPosts }: Props) {
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
    <HomeContainer>
      <PreviewContent previewPosts={previewPosts} />
    </HomeContainer>
  )
}
