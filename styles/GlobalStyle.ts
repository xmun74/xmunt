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
    font-family:
      'Pretendard Variable',
      Pretendard,
      -apple-system,
      BlinkMacSystemFont,
      system-ui,
      Roboto,
      'Helvetica Neue',
      'Segoe UI',
      'Apple SD Gothic Neo',
      'Noto Sans KR',
      'Malgun Gothic',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      sans-serif;
    line-height: normal;
  }
  /* 페이지 높이에 따라 스크롤바가 생겼다 사라지며 레이아웃이 흔들리지 않도록 항상 공간 확보 */
  html {
    overflow-y: scroll;
  }

  body, html{
    @media screen and (max-width: 767px) {
      overflow-x: hidden;
    }
  }

  /* 스크롤바 전체 기본 꾸미기 */
  body::-webkit-scrollbar {
    width: 8px;
    color: red;
  }

  /* 스크롤바 막대 꾸미기 */
  body::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 8px;
    background-color: #bab9b98c;
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
  /* 언어 클래스 없는 코드블록도 모노스페이스 유지 (styled-reset의 font: inherit 방어) */
  pre,
  pre code {
    font-family: Consolas, Monaco, 'Andale Mono', monospace;
  }
  :not(pre) > code {
    font-family: Consolas, Monaco, 'Andale Mono', monospace;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    background-color: ${themeColor.inlineCode};
    font-size: 85%;
    font-weight: 400;
  }

`
export default GlobalStyle
