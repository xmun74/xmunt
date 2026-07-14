'use client'

import Image from 'next/image'
import styled from 'styled-components'
import { themeColor } from '@styles/theme'

const SectionHeader = styled.div`
  margin-bottom: 1.25rem;
`
const SectionTitle = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  color: ${themeColor.text1};
`
const SectionDesc = styled.p`
  margin-top: 0.3rem;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: ${themeColor.text4};
`

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;

  @media screen and (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const GalleryItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 0.75rem;
  background: ${themeColor.hoverBg};

  img {
    object-fit: cover;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.05);
  }
`

const EmptyMsg = styled.p`
  color: ${themeColor.text4};
  font-size: 0.8rem;
  padding: 2rem 0;
  text-align: center;
`

const galleryImages: Array<{
  src: string
  alt: string
}> = []

export default function GalleryPage() {
  return (
    <div>
      <SectionHeader>
        <SectionTitle>갤러리</SectionTitle>
        <SectionDesc>사진 {galleryImages.length}장</SectionDesc>
      </SectionHeader>

      {galleryImages.length === 0 ? (
        <EmptyMsg>아직 등록된 사진이 없습니다.</EmptyMsg>
      ) : (
        <GalleryGrid>
          {galleryImages.map((image) => (
            <GalleryItem key={image.src}>
              <Image
                src={image.src}
                alt={image.alt}
                draggable={false}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </GalleryItem>
          ))}
        </GalleryGrid>
      )}
    </div>
  )
}
