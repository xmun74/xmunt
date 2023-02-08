import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'
import { themeColor, themes } from './theme'

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  body {
    background-color: ${themeColor.bg1};
    color: ${themeColor.text1};
    height: 100%;
  }

  body {
    ${themes.light}
  }
  
  @media (prefers-color-scheme: dark) {
    body {
      ${themes.dark}
    }
  }
  
  body[data-theme='light'] {
    ${themes.light};
  }
  
  body[data-theme='dark'] {
    ${themes.dark};
  }
  
  button {
    cursor: pointer;
    background-color: inherit;
    color: ${themeColor.text1};
  }
  a {
    text-decoration:none;
    color:inherit;
  }
`
export default GlobalStyle
