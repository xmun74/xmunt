import Link from 'next/link'
import styled from 'styled-components'
import { themeColor } from '../../styles/theme'
import LeftArrowIcon from '../icons/LeftArrowIcon'
import RightArrowIcon from '../icons/RightArrowIcon'

const RecentPostContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 4rem;
`
const RecentPostContent = styled(Link)<{ $align: 'prev' | 'next' }>`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.9rem 1.1rem;
  border-radius: 0.75rem;
  grid-column: ${({ $align }) => ($align === 'prev' ? 1 : 2)};
  align-items: ${({ $align }) =>
    $align === 'prev' ? 'flex-start' : 'flex-end'};
  transition: background 160ms ease;

  &:hover {
    background: ${themeColor.hoverBg};
  }
`
const DirectionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: ${themeColor.text4};
`
const PostTitle = styled.div`
  max-width: 100%;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.5;
  color: ${themeColor.text1};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;

  @media screen and (max-width: 767px) {
    font-size: 0.8rem;
  }
`

interface RecentProps {
  slug: string
  date: string
  title?: string
}
export type RecentPostProps = {
  prevPost: RecentProps | null
  nextPost: RecentProps | null
}

export default function RecentPost({ prevPost, nextPost }: RecentPostProps) {
  return (
    <RecentPostContainer className="recentPost-link">
      {prevPost && (
        <RecentPostContent href={prevPost?.slug ?? '/'} $align="prev">
          <DirectionLabel>
            <LeftArrowIcon width={14} height={14} fill="currentColor" />
            이전 글
          </DirectionLabel>
          <PostTitle>{prevPost.title}</PostTitle>
        </RecentPostContent>
      )}
      {nextPost && (
        <RecentPostContent href={nextPost?.slug ?? '/'} $align="next">
          <DirectionLabel>
            다음 글
            <RightArrowIcon width={14} height={14} fill="currentColor" />
          </DirectionLabel>
          <PostTitle>{nextPost.title}</PostTitle>
        </RecentPostContent>
      )}
    </RecentPostContainer>
  )
}
