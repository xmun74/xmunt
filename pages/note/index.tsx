import styled from 'styled-components'
import Heading from '@components/common/Heading'
import Seo from '@components/Seo'

const NoteContainer = styled.div`
  font-weight: 100;
  height: 100vh;
`

export default function Note() {
  return (
    <NoteContainer>
      <Seo mode="default" />
      <Heading title="Note" />
      아직 작성된 Note가 없습니다...
    </NoteContainer>
  )
}
