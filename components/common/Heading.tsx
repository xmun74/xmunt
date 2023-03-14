import styled from 'styled-components'

const HeadingContent = styled.h1`
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 30px;
`

export default function Heading({ title }: { title: string }) {
  return <HeadingContent>{title}</HeadingContent>
}
