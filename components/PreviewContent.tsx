import styled from 'styled-components'
import { themeColor } from '../styles/theme'

const PostWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 40px;
`
const PostItem = styled.div`
  background-color: ${themeColor.box1};
  color: ${themeColor.text1};
  padding: 25px;
  border-radius: 7px;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
  &:hover {
    box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 15%);
    transition: all 0.3s;
    transform: translateY(-10px);
  }
  &:nth-child(1) {
    grid-row: 1 / span 2;
  }
`
function PreviewContent() {
  return (
    <PostWrap>
      <PostItem>안녕</PostItem>
      <PostItem>안녕하세요</PostItem>
      <PostItem>감사합니다</PostItem>
    </PostWrap>
  )
}
export default PreviewContent
