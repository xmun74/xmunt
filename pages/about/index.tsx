import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const AboutContainer = styled.div`
  height: 100vh;
`
const AboutTitle = styled.div`
  font-weight: 100;
  font-size: 50px;
  margin-bottom: 50px;
`
const Content = styled.div`
  line-height: 1.7;
`

export default function About() {
  return (
    <AboutContainer>
      <AboutTitle>taegyeong</AboutTitle>
      <Content>
        Frontend Developer 입니다
        <br /> using React, Typescript, styled-components
      </Content>
    </AboutContainer>
  )
}
