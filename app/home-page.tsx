'use client'

import styled from 'styled-components'
import PreviewContent from '@components/PreviewContent'
import VisitorsChart from '@components/chart/VisitorsChart'
import { PostType } from '@lib/types'
import { themeColor } from '@styles/theme'

const HomeContainer = styled.div``

const SectionHeader = styled.div`
  margin-bottom: 1.25rem;
`

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${themeColor.text1};
`

const SectionDesc = styled.p`
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: ${themeColor.text4};
`

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
      <VisitorsChart />
      <SectionHeader>
        <SectionTitle>최근 포스트</SectionTitle>
        <SectionDesc>새로 올라온 글</SectionDesc>
      </SectionHeader>
      <PreviewContent previewPosts={previewPosts} />
    </HomeContainer>
  )
}
