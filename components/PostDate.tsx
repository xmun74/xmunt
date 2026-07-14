import styled from 'styled-components'
import formatPostDate from '@lib/formatDate'

const Container = styled.div`
  text-align: end;
  font-size: 12px;
  font-weight: 400;
  opacity: 0.55;
`

export default function PostDate({ date }: { date: string }) {
  return <Container>{formatPostDate(date)}</Container>
}
