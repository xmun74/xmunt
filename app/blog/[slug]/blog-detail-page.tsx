import styled from 'styled-components'
import { themeColor } from '@styles/theme'
import formatPostDate from '@lib/formatDate'
import getReadingMinutes from '@lib/readingTime'
import CalendarIcon from '@components/icons/CalendarIcon'
import ClockIcon from '@components/icons/ClockIcon'
import PostBody from '@components/PostBody'
import Giscus from '@components/Giscus'
import { PostType } from '@lib/types'
import AuthorInfo from '@components/common/AuthorInfo'
import RecentPost, { RecentPostProps } from '@components/common/RecentPost'
import Tag from '@components/common/Tag'
import PostToc, { PostTocProps } from '@components/PostToc'

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
`
const PostTitle = styled.h1`
  font-weight: 700;
  font-size: 1.75rem;
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: ${themeColor.text1};
  margin-bottom: 1.25rem;
  @media screen and (max-width: 767px) {
    font-size: 1.4rem;
  }
`
const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${themeColor.inlineCode};
`
const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`
const MetaRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  flex: none;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${themeColor.text4};
`
const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`

export default function BlogDetailPage({
  post,
  content,
  recentPostProps,
  postToc,
}: {
  post: PostType
  content: string
  recentPostProps: RecentPostProps
  postToc: PostTocProps[]
}) {
  const readingMinutes = getReadingMinutes(content)

  return (
    <main>
      <HeaderContainer>
        <PostTitle>{post.title}</PostTitle>
        <PostInfo>
          <TagList>
            {Array.isArray(post.tags) &&
              post?.tags.map((tag) => <Tag tag={tag} key={tag} />)}
          </TagList>
          <MetaRight>
            <MetaItem>
              <CalendarIcon />
              {formatPostDate(post.date)}
            </MetaItem>
            <MetaItem>
              <ClockIcon />
              {readingMinutes}분 분량
            </MetaItem>
          </MetaRight>
        </PostInfo>
      </HeaderContainer>
      <PostBody source={content} />
      <PostToc postToc={postToc} />
      <AuthorInfo />
      <RecentPost {...recentPostProps} />
      <Giscus />
    </main>
  )
}
