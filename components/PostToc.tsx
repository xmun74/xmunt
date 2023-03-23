import styled from 'styled-components'
import { themeColor } from '../styles/theme'
import CopyLinkBtn from './button/CopyLinkBtn'
import IconBtn from './common/IconBtn'
import CopyLinkIcon from './icons/CopyLinkIcon'
import DownArrowIcon from './icons/DownArrowIcon'
import UpArrowIcon from './icons/UpArrowIcon'

const TocContainer = styled.div`
  display: none;
  position: fixed;
  top: 100px;
  right: 30px;
  bottom: 0;
  width: 15%;
  height: 60%; //
  overflow-y: auto;
  padding: 1rem;

  border: 1px solid ${themeColor.inlineCode};
  @media screen and (min-width: 1150px) {
    display: none;
    /* display: flex; */
    flex-direction: column;
    justify-content: space-between;
    border-radius: 5px;
  }
`
const TocContent = styled.div``
const BtnContainer = styled.div`
  display: flex;
  justify-content: space-around;
  border-radius: 15px;
  background-color: ${themeColor.inlineCode};
  padding: 0.5rem;
`

export default function PostToc({ postToc }: { postToc: any }) {
  return (
    <TocContainer>
      <TocContent>{postToc}</TocContent>
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
