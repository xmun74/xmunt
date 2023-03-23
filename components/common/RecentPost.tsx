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
  flex: 1;
  &:hover {
    opacity: 0.7;
  }
`
const PostTitle = styled.div`
  flex: 1;
  line-height: 1.2rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  &:first-child {
    text-align: right;
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
    <RecentPostContainer className="recentPost-link">
      {prevPost && (
        <RecentPostContent href={prevPost?.slug ?? '/'}>
          <LeftArrowIcon width={20} height={20} fill={`${themeColor.text1}`} />
          <PostTitle>{prevPost.title}</PostTitle>
        </RecentPostContent>
      )}
      <div />
      {nextPost && (
        <RecentPostContent href={nextPost?.slug ?? '/'}>
          <PostTitle>{nextPost.title}</PostTitle>
          <RightArrowIcon width={20} height={20} fill={`${themeColor.text1}`} />
        </RecentPostContent>
      )}
    </RecentPostContainer>
  )
}
