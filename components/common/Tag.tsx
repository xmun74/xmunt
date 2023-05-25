import styled from 'styled-components'
import { themeColor } from '../../styles/theme'

const TagLink = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  padding: 7px 10px;
  background-color: ${themeColor.inlineCode};
  border-radius: 15px;
  margin-right: 5px;

  @media screen and (max-width: 767px) {
    font-size: 12px;
  }
`

export default function Tag({ tag }: { tag: string }) {
  return <TagLink>{tag}</TagLink>
}
