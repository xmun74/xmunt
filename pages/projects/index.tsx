import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import Heading from '../../components/common/Heading'
import Seo from '../../components/Seo'

const ProjectContainer = styled.div`
  height: 100vh;
`
const ProjectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
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
`

const ProjectLists = [
  {
    title: '문태경 BLOG',
    href: 'https://github.com/xmun74/xmunt',
    imgSrc: '/images/projects/xmuntblog.png',
    description: '개인 블로그 제작',
  },
  {
    title: '데일리클럽',
    href: 'https://github.com/codestates-seb/dailyclub',
    imgSrc: '/images/projects/dailyclub.png',
    description: '일회성 동호회 모임 사이트',
  },
]

export default function Projects() {
  return (
    <ProjectContainer>
      <Seo mode="default" />
      <Heading title="Projects" />
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
