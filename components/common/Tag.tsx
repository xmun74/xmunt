import styled from 'styled-components'
import { themeColor } from '../../styles/theme'

const TagLink = styled.div`
  display: inline-block;
  font-size: 0.75rem;
  padding: 4px 10px;
  color: ${themeColor.text4};
  background-color: ${themeColor.inlineCode};
  border-radius: 999px;
`

export default function Tag({ tag }: { tag: string }) {
  return <TagLink>{tag}</TagLink>
}
