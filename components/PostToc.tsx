import styled from 'styled-components'
import { themeColor } from '../styles/theme'

const TocContainer = styled.div`
  display: none;
  position: fixed;
  top: 100px;
  right: 30px;
  bottom: 0;
  width: 15%;
  height: 60%; //
  overflow-y: auto;
  padding: 2rem;
  margin-left: 2rem;

  background-color: ${themeColor.inlineCode};
  color: red;
  @media screen and (min-width: 1150px) {
    display: none;
    /* display: block; */
  }
`

export default function PostToc({ postToc }: { postToc: any }) {
  return <TocContainer>{postToc}</TocContainer>
}
