import Link from 'next/link'
import styled from 'styled-components'
import { themeColor } from '../styles/theme'

const PostWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 40px;
`
const PostItem = styled.div`
  background-color: ${themeColor.box1};
  color: ${themeColor.text1};
  padding: 25px;
  height: 100%;
  border-radius: 7px;
  cursor: pointer;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
  &:hover {
    box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 15%);
    transition: all 0.3s;
    transform: translateY(-10px);
  }
  &:nth-child(1) {
    grid-row: 1 / span 2;
  }
`
const PreviewTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
`
const PreviewDate = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${themeColor.text2};
  text-align: end;
`

interface PreviewProps {
  href: string
  title: string
  date: string
  imgUrl: string
}
export default function PreviewContent({
  previewPosts,
}: {
  previewPosts: Array<PreviewProps>
}) {
  return (
    <PostWrap>
      {previewPosts &&
        previewPosts.map((el, idx) => (
          <PostItem key={el.title}>
            <Link href={el.href} style={{ display: 'block', height: '100%' }}>
              <PreviewTitle>{el.title}</PreviewTitle>
              <PreviewDate>{el.date}</PreviewDate>
            </Link>
          </PostItem>
        ))}
    </PostWrap>
  )
}
