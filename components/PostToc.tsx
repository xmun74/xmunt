import Link from 'next/link'
import styled from 'styled-components'
import { themeColor } from '../styles/theme'
import CopyLinkBtn from './button/CopyLinkBtn'
import ScrollDownBtn from './button/ScrollDownBtn'
import ScrollUpBtn from './button/ScrollUpBtn'

const TocContainer = styled.div`
  position: fixed;
  right: 0px;
  bottom: 0;
  overflow-y: auto;
  padding: 1rem;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #bab9b98c;
    border-radius: 20px;
    scrollbar-width: thin;
  }
  @media screen and (min-width: 1150px) {
    right: 30px;
    top: 80px;
    width: 16.5%;
  }
`
const TocContent = styled.div`
  display: none;
  font-size: 0.8rem;
  margin-bottom: 1.5rem;
  @media screen and (min-width: 1150px) {
    display: flex;
    flex-direction: column;
  }
`
const TocAnchor = styled(Link)<{ level: number }>`
  display: block;
  margin-bottom: 1rem;
  opacity: 0.55;
  &:hover {
    opacity: 1;
  }
  padding-left: ${({ level }) => (level > 1 ? '10px' : '0')};
`
const BtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  background-color: ${themeColor.inlineCode};
  padding: 0.3rem;
  @media screen and (min-width: 1150px) {
    flex-direction: row;
    justify-content: space-around;
    padding: 0.5rem;
  }
`

export interface PostTocProps {
  text: string
  href: string
  level: number
}

export default function PostToc({ postToc }: { postToc: PostTocProps[] }) {
  return (
    <TocContainer>
      <TocContent>
        {postToc &&
          postToc.map((el: any) => (
            <TocAnchor key={el.text} href={`#${el.href}`} level={el.level}>
              {el.text}
            </TocAnchor>
          ))}
      </TocContent>
      <BtnContainer>
        <CopyLinkBtn />
        <ScrollUpBtn />
        <ScrollDownBtn />
      </BtnContainer>
    </TocContainer>
  )
}
