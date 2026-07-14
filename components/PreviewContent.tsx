import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { themeColor } from '../styles/theme'

const PostWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`

const PostItem = styled.div`
  overflow: hidden;
  cursor: pointer;
  border: 1px solid ${themeColor.inlineCode};
  border-radius: 0.75rem;
  background: ${themeColor.bg1};
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px -12px rgba(0, 0, 0, 0.25);
  }
`

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.9rem 1.1rem 1.1rem;
  gap: 0.3rem;
`

const PreviewImg = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  background: linear-gradient(
    135deg,
    ${themeColor.accent1} 0%,
    ${themeColor.bg1} 100%
  );
  overflow: hidden;
  border-bottom: 1px solid ${themeColor.inlineCode};

  img {
    object-fit: cover;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ${PostItem}:hover & img {
    transform: scale(1.05);
  }

  @media screen and (max-width: 767px) {
    height: 170px;
  }
`

const PreviewTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  color: ${themeColor.text1};
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  letter-spacing: -0.01em;
`

const PreviewDate = styled.div`
  font-size: 0.75rem;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  color: ${themeColor.text4};
  margin-top: auto;
  padding-top: 4px;
`
const PreviewDescription = styled.div`
  font-size: 0.8rem;
  color: ${themeColor.text4};
  line-height: 1.7;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`

const EmptyImagePlaceholder = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(
    135deg,
    ${themeColor.accent1} 0%,
    ${themeColor.bg1} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid ${themeColor.inlineCode};

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
    height: 170px;
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
