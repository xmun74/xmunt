import styled from 'styled-components'
import Heading from '@components/common/Heading'
import Seo from '@components/Seo'
import Image from 'next/image'

const TitleWrapper = styled.div`
  position: relative;
`
const NoteContainer = styled.div`
  font-weight: 100;
`
const HeadingWrapper = styled.div`
  position: absolute;
  top: 6px;
  left: 60px;
`
const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
`
const NoteList = styled.div`
  padding-top: 80px;
`

export default function Note() {
  return (
    <NoteContainer>
      <Seo mode="default" />
      <TitleWrapper>
        <ImageWrapper>
          <Image
            src="/images/icons/memo.png"
            alt="Note Icon"
            width={60}
            height={60}
          />
        </ImageWrapper>
        <HeadingWrapper>
          <Heading title="Note" />
        </HeadingWrapper>
      </TitleWrapper>

      <NoteList>아직 작성된 Note가 없습니다...</NoteList>
    </NoteContainer>
  )
}
