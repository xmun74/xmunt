import styled from 'styled-components'
import { themeColor } from '../../styles/theme'

const TagLink = styled.div`
  display: inline-block;
  padding: 10px;
  background-color: ${themeColor.inlineCode};
  border-radius: 5px;
  margin-right: 5px;
  &:hover {
    opacity: 0.7;
  }
  @media screen and (max-width: 767px) {
    font-size: 12px;
  }
`

export default function Tag({ tag }: { tag: string }) {
  return <TagLink>{tag}</TagLink>
}
