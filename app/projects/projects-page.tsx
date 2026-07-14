'use client'

import Image from 'next/image'
import Link from 'next/link'
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

const ProjectWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`

const ProjectItem = styled.div`
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

const ProjectImg = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-bottom: 1px solid ${themeColor.inlineCode};

  img {
    object-fit: cover;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ${ProjectItem}:hover & img {
    transform: scale(1.05);
  }

  @media screen and (max-width: 767px) {
    height: 170px;
  }
`

const ProjectContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.9rem 1.1rem 1.1rem;
`

const ProjectTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: ${themeColor.text1};
`

const ProjectInfo = styled.p`
  font-size: 0.8rem;
  color: ${themeColor.text4};
  line-height: 1.7;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`

const EmptyMsg = styled.p`
  color: ${themeColor.text4};
  font-size: 0.8rem;
  padding: 2rem 0;
  text-align: center;
`

const ProjectLists: Array<{
  title: string
  href: string
  imgSrc: string
  description: string
}> = []

export default function ProjectsPage() {
  return (
    <div>
      <SectionHeader>
        <SectionTitle>프로젝트</SectionTitle>
        {/* <SectionDesc>{ProjectLists.length}개</SectionDesc> */}
      </SectionHeader>

      {ProjectLists.length === 0 ? (
        <EmptyMsg>아직 등록된 프로젝트가 없습니다.</EmptyMsg>
      ) : (
        <ProjectWrapper>
          {ProjectLists.map((el) => (
            <Link href={el.href} key={el.title} target="_blank">
              <ProjectItem>
                <ProjectImg>
                  <Image
                    src={el.imgSrc}
                    alt={el.description}
                    draggable={false}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </ProjectImg>
                <ProjectContent>
                  <ProjectTitle>{el.title}</ProjectTitle>
                  <ProjectInfo>{el.description}</ProjectInfo>
                </ProjectContent>
              </ProjectItem>
            </Link>
          ))}
        </ProjectWrapper>
      )}
    </div>
  )
}
