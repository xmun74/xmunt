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
      <AboutTitle>taegyeong mun</AboutTitle>
      <Content>
        I am interested in solving problems and helping others. <br />
        and my heart beats when I do creative work. <br />
        also mainly use React, Typescript, styled-components for front-end
        development.
      </Content>
    </AboutContainer>
  )
}
