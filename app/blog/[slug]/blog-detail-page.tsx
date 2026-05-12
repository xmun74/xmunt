import styled from 'styled-components'
import PostBody from '@components/PostBody'
import PostDate from '@components/PostDate'
import Giscus from '@components/Giscus'
import { PostType } from '@lib/types'
import AuthorInfo from '@components/common/AuthorInfo'
import RecentPost, { RecentPostProps } from '@components/common/RecentPost'
import Tag from '@components/common/Tag'
import PostToc, { PostTocProps } from '@components/PostToc'

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 70px;
`
const PostTitle = styled.div`
  font-weight: 800;
  font-size: 36px;
  margin-bottom: 50px;
  @media screen and (max-width: 767px) {
    font-size: 28px;
  }
`
const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 50px;
  border-bottom: 1px solid lightgray;
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
  return (
    <main>
      <HeaderContainer>
        <PostTitle>{post.title}</PostTitle>
        <PostInfo>
          <div>
            {Array.isArray(post.tags) &&
              post?.tags.map((tag) => <Tag tag={tag} key={tag} />)}
          </div>
          <PostDate date={post.date} />
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
