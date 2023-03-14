import Link from 'next/link'
import styled from 'styled-components'
import Heading from '../components/common/Heading'
import PlusIcon from '../components/icons/PlusIcon'
import PreviewContent from '../components/PreviewContent'
import Seo from '../components/Seo'

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

export default function Home() {
  const previewPosts = [
    {
      href: '/blog/preview',
      title:
        'NextJs + TS 셋팅 - eslint, prettier, styled-components (husky, lint-staged, airbnb)',
      date: '2023-02-07',
      imgUrl: '/images/defaultImg.jpeg',
    },
    {
      href: '/blog/preview',
      title: 'Next.js + TS 초기 셋팅1',
      date: '2023-02-07',
      imgUrl: '',
    },
    {
      href: '/blog/preview',
      title: 'Next.js + TS 초기 셋팅2',
      date: '2023-02-07',
      imgUrl: '',
    },
  ]
  return (
    <>
      <Seo mode="default" />
      <HomeContainer>
        <Heading title="Featured Posts" />
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
