import Link from 'next/link'
import styled from 'styled-components'
import { themeColor } from '../../styles/theme'
import LeftArrowIcon from '../icons/LeftArrowIcon'
import RightArrowIcon from '../icons/RightArrowIcon'

const RecentPostContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5rem;
`
const RecentPostContent = styled(Link)`
  display: flex;
  align-items: center;
  font-weight: 600;
  &:hover {
    opacity: 0.7;
  }
  @media screen and (max-width: 767px) {
    font-size: 12px;
  }
`

interface RecentProps {
  slug: string
  date: string
  title: string
}
export type RecentPostProps = {
  prevPost: RecentProps
  nextPost: RecentProps
}

export default function RecentPost({ prevPost, nextPost }: RecentPostProps) {
  return (
    <RecentPostContainer>
      {prevPost && (
        <RecentPostContent href={prevPost?.slug ?? '/'}>
          <LeftArrowIcon width={25} fill={`${themeColor.text1}`} />
          {prevPost.title}
        </RecentPostContent>
      )}
      <div />
      {nextPost && nextPost?.title && (
        <RecentPostContent href={nextPost?.slug ?? '/'}>
          {nextPost.title}
          <RightArrowIcon width={25} fill={`${themeColor.text1}`} />
        </RecentPostContent>
      )}
    </RecentPostContainer>
  )
}
