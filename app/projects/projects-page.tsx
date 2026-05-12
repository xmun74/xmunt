'use client'

import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import Heading from '@components/common/Heading'

const ProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 100px;
`
const ProjectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;

  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`

const ProjectImg = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  &:hover {
    opacity: 0.6;
    box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 15%);
    -webkit-box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 15%);
    -moz-box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 15%);
    transform: translateY(-3px);
    transition: all 0.2s ease-in-out;
  }
  img {
    object-fit: cover;
    border-radius: 15px;
  }
`
const ProjectTitle = styled.div`
  font-weight: 400;
  margin: 10px 0;
`
const ProjectInfo = styled.div`
  font-weight: 100;
  font-size: 12px;
`

const ProjectLists: Array<{
  title: string
  href: string
  imgSrc: string
  description: string
}> = []

const TitleWrapper = styled.div`
  position: relative;
  display: flex;
`
const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`
const HeadingWrapper = styled.div`
  position: absolute;
  top: 6px;
  left: 60px;
`

export default function ProjectsPage() {
  return (
    <ProjectContainer>
      <TitleWrapper>
        <ImageWrapper>
          <Image
            src="/images/icons/planet.png"
            alt="Projects Icon"
            width={60}
            height={60}
          />
        </ImageWrapper>
        <HeadingWrapper>
          <Heading title="Projects" />
        </HeadingWrapper>
      </TitleWrapper>

      <ProjectWrapper>
        {ProjectLists &&
          ProjectLists.map((el) => (
            <Link href={el.href} key={el.title} target="_blank">
              <ProjectImg>
                <Image
                  src={el.imgSrc}
                  alt={el.description}
                  draggable={false}
                  fill
                  sizes="320 640 750"
                />
              </ProjectImg>
              <ProjectTitle>{el.title}</ProjectTitle>
              <ProjectInfo>{el.description}</ProjectInfo>
            </Link>
          ))}
      </ProjectWrapper>
    </ProjectContainer>
  )
}
