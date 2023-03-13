import Link from 'next/link'
import styled from 'styled-components'
import { themeColor } from '../../styles/theme'
import LeftArrowIcon from '../icons/LeftArrowIcon'
import RightArrowIcon from '../icons/RightArrowIcon'

const RecentPostContainer = styled.div`
  display: flex;
  margin-bottom: 5rem;
`
const RecentPostContent = styled(Link)`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 600;
  &:last-child {
    justify-content: flex-end;
  }
  &:hover {
    opacity: 0.8;
  }
  @media screen and (max-width: 767px) {
    font-size: 12px;
  }
`

export type RecentPostProps = {
  prevPost: string
  nextPost: string
}

export default function RecentPost({ prevPost, nextPost }: RecentPostProps) {
  return (
    <RecentPostContainer>
      <RecentPostContent href="/">
        <LeftArrowIcon width={25} fill={`${themeColor.text1}`} />
        {prevPost}
      </RecentPostContent>
      <RecentPostContent href="/">
        {nextPost}
        <RightArrowIcon width={25} fill={`${themeColor.text1}`} />
      </RecentPostContent>
    </RecentPostContainer>
  )
}
