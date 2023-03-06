import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { themeColor } from '../styles/theme'

const PostWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 40px;
  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
    grid-gap: 3rem;
    min-height: 500px;
  }
`
const PostItem = styled.div`
  background-color: ${themeColor.box1};
  color: ${themeColor.text1};
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
  margin: 25px 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  @media screen and (max-width: 767px) {
    -webkit-line-clamp: 2;
  }
`
const PreviewDate = styled.div`
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 20px;
  margin-right: 20px;
  color: ${themeColor.text2};
  text-align: end;
`
const PreviewImg = styled.div`
  img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
  }
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
        previewPosts.map((el) => (
          <PostItem key={el.title}>
            <Link href={el.href} style={{ height: '100%' }}>
              <PreviewTitle>{el.title}</PreviewTitle>
              <PreviewDate>{el.date}</PreviewDate>
              {el.imgUrl !== '' ? (
                <PreviewImg>
                  <Image
                    src={el.imgUrl}
                    alt={el.title}
                    width={300}
                    height={300}
                    draggable={false}
                    priority
                  />
                </PreviewImg>
              ) : (
                <div />
              )}
            </Link>
          </PostItem>
        ))}
    </PostWrap>
  )
}
