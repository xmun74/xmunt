import Link from 'next/link'
import styled from 'styled-components'
import { themeColor } from '../styles/theme'
import CopyLinkBtn from './button/CopyLinkBtn'
import IconBtn from './common/IconBtn'
import DownArrowIcon from './icons/DownArrowIcon'
import UpArrowIcon from './icons/UpArrowIcon'

const TocContainer = styled.div`
  display: none;
  position: fixed;
  top: 100px;
  right: 30px;
  bottom: 0;
  width: 15%;
  overflow-y: auto;
  padding: 1rem;

  @media screen and (min-width: 1150px) {
    /* display: none; */
    display: flex;
    flex-direction: column;
    border-radius: 5px;
  }
`
const TocContent = styled.div`
  font-size: 0.8rem;
  margin-bottom: 1.5rem;
`
const TocAnchor = styled(Link)<{ level: number }>`
  display: block;
  margin-bottom: 1rem;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
  padding-left: ${({ level }) => (level > 1 ? '10px' : '0')};
`
const BtnContainer = styled.div`
  display: flex;
  justify-content: space-around;
  border-radius: 15px;
  background-color: ${themeColor.inlineCode};
  padding: 0.5rem;
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
        <IconBtn
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <UpArrowIcon fill={`${themeColor.text1}`} />
        </IconBtn>
        <IconBtn
          onClick={() =>
            document
              .querySelector('.recentPost-link')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <DownArrowIcon fill={`${themeColor.text1}`} />
        </IconBtn>
      </BtnContainer>
    </TocContainer>
  )
}
