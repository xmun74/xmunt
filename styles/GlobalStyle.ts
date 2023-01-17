import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

const lightTheme = `
  --text: black;
  --background: white;
`
const darkTheme = `
  --color-text: white;
  --color-background: black;
`

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  /* body {
    ${lightTheme};
  }
  @media (prefers-color-scheme: dark) {
    body {
      ${darkTheme};
    }
  }
  body[data-theme='light']{
    ${lightTheme};
  }
  body[data-theme='dark']{
    ${darkTheme};
  } */

  body {
    background-color: ${({ theme }) => theme.bg1};
    color:${({ theme }) => theme.text}
  }
  button {
    cursor: pointer;
    background-color: inherit;
  }
  a {
    text-decoration:none;
    color:inherit;
  }
`
export default GlobalStyle
