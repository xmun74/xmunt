import styled from 'styled-components'
import dayjs from 'dayjs'
import { themeColor } from '../styles/theme'
import 'dayjs/locale/ko'

dayjs.locale('ko')

const Container = styled.div`
  text-align: end;
  font-size: 12px;
  font-weight: 400;
  color: ${themeColor.text2};
`

export default function PostDate({ date }: { date: string }) {
  const result = dayjs(date).format('YYYY.MM.DD ddd')

  return <Container>{result}</Container>
}
