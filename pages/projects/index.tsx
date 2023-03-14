import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import Heading from '../../components/common/Heading'
import Seo from '../../components/Seo'

const ProjectContainer = styled.div`
  font-weight: 100;
  height: 100vh;
`
const ProjectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
`

const ProjectItem = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  img {
    object-fit: cover;
    border-radius: 15px;
  }
  &:hover {
    opacity: 0.6;
    transition: 0.15s ease-in-out;
  }
`

const ProjectLists = [
  {
    title: 'xmunt blog',
    href: '/',
    imgSrc: '/images/projects/dailyclub.png',
    description: '개인 블로그 제작',
  },
  {
    title: '데일리클럽',
    href: 'http://dailyclub.site/',
    imgSrc: '/images/projects/dailyclub.png',
    description: '데일리클럽 프로젝트',
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
            <Link href={el.href} key={el.title}>
              <ProjectItem>
                <Image
                  src={el.imgSrc}
                  alt={el.description}
                  draggable={false}
                  fill
                  // width={200}
                  // height={200}
                  sizes="320 640 750"
                />
              </ProjectItem>
            </Link>
          ))}
      </ProjectWrapper>
    </ProjectContainer>
  )
}
