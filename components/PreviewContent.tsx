import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { themeColor } from '../styles/theme'

const PostWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 60px 24px;
  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`

const PostItem = styled.div`
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  gap: 5px;

  @media screen and (max-width: 767px) {
    padding: 16px 0px;
  }
`

const PreviewImg = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: linear-gradient(
    135deg,
    ${themeColor.accent1} 0%,
    ${themeColor.bg1} 100%
  );
  overflow: hidden;

  img {
    object-fit: cover;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ${PostItem}:hover & img {
    transform: scale(1.05);
  }

  @media screen and (max-width: 767px) {
    height: 180px;
  }
`

const PreviewTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  color: ${themeColor.text1};
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  letter-spacing: -0.01em;

  @media screen and (max-width: 767px) {
    font-size: 16px;
    -webkit-line-clamp: 2;
  }
`

const PreviewDate = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${themeColor.text4};
  margin-top: auto;
  padding-top: 4px;
`
const PreviewDescription = styled.div`
  font-size: 14px;
  color: ${themeColor.text4};
  line-height: 1.7;
`

const EmptyImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(
    135deg,
    ${themeColor.accent1} 0%,
    ${themeColor.bg1} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: ${themeColor.text3};
    opacity: 0.1;
  }

  @media screen and (max-width: 767px) {
    height: 180px;
  }
`

interface PreviewProps {
  href: string
  title: string
  date: string
  imgUrl?: string
  description?: string
}
export default function PreviewContent({
  previewPosts,
}: {
  previewPosts: Array<PreviewProps>
}) {
  const convertDate = (date: string) => {
    return date.replaceAll('-', '.')
  }
  return (
    <PostWrap>
      {previewPosts &&
        previewPosts.map((el) => (
          <PostItem key={el.title}>
            <Link
              href={el.href}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              {el.imgUrl && el.imgUrl !== '' ? (
                <PreviewImg>
                  <Image
                    src={el.imgUrl}
                    alt={el.title}
                    draggable={false}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={false}
                  />
                </PreviewImg>
              ) : (
                <EmptyImagePlaceholder />
              )}
              <PostContent>
                <PreviewDate>{convertDate(el.date)}</PreviewDate>
                <PreviewTitle>{el.title}</PreviewTitle>
                <PreviewDescription>{el.description}</PreviewDescription>
              </PostContent>
            </Link>
          </PostItem>
        ))}
    </PostWrap>
  )
}
