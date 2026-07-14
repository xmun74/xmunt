'use client'

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
  margin-bottom: 1.5rem;
  @media screen and (min-width: 1150px) {
    display: flex;
    flex-direction: column;
    padding-left: 0.9rem;
    border-left: 1px solid ${themeColor.inlineCode};
  }
`
const TocLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${themeColor.text1};
  margin-bottom: 0.75rem;
`
const TocAnchor = styled(Link)<{ level: number }>`
  display: block;
  margin-bottom: 0.7rem;
  font-size: 0.78rem;
  line-height: 1.4;
  color: ${themeColor.text4};
  transition: color 160ms ease;
  &:hover {
    color: ${themeColor.text1};
  }
  padding-left: ${({ level }) => (level > 1 ? '10px' : '0')};
`
const BtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  width: fit-content;
  padding: 0.25rem;
  border: 1px solid ${themeColor.inlineCode};
  border-radius: 999px;
  background-color: ${themeColor.gnbBackDrop};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  @media screen and (min-width: 1150px) {
    flex-direction: row;
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
        <TocLabel>목차</TocLabel>
        {postToc &&
          postToc.map((el) => (
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
