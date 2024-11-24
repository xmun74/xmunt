import styled from 'styled-components'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { themeColor } from '../styles/theme'

const Content = styled.article`
  position: relative;
  width: 100%;
  margin-bottom: 100px;
  line-height: 2;
  font-family: 'Noto Sans KR', sans-serif;
  /* white-space: pre; */
  h1,
  h2,
  h3,
  h4 {
    margin-bottom: 5px;
    scroll-margin-top: 5rem;
    /* rehype-autolink-headings */
    &:hover {
      .anchor {
        position: absolute;
        margin-left: -1em;
        padding-right: 0.5em;
        cursor: pointer;
        @media screen and (max-width: 767px) {
          margin-left: -0.61em;
        }
        &::after {
          content: '#';
          font-weight: 200;
        }
        &:hover {
          opacity: 0.7;
          border: none;
        }
      }
    }
    :not(pre) > code {
      background-color: transparent;
      font-family: unset;
      font-size: 100%;
      font-weight: inherit;
    }
  }
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-top: 50px;
  }
  h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-top: 26px;
  }
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 22px;
  }
  h4 {
    font-size: 1.125rem;
    font-weight: 700;
    margin-top: 20px;
  }
  strong,
  b {
    font-weight: 700;
  }
  p {
    font-size: 1rem;
  }
  img {
    max-width: 100%;
    margin-bottom: auto 10px;
    pointer-events: none;
  }
  blockquote {
    padding-left: 10px;
    border-left: 10px solid;
    border-left-color: ${themeColor.accent2};
  }
  ul,
  ol {
    list-style-position: inline;
    line-height: 2.2;
    padding-inline-start: 1.5em;
    font-size: 1rem;
  }
  ul {
    list-style-type: disc;
    li {
      &::marker {
        color: ${themeColor.accent2};
      }
      ul {
        list-style-type: circle;
        ul {
          list-style-type: square;
        }
      }
    }
  }
  ol {
    list-style-type: decimal;
  }
  a {
    color: #fa620a;
    &:hover {
      border-bottom: 1px solid;
    }
  }
  .rehype-code-title {
    margin-top: 1rem;
    margin-bottom: -0.7rem;
    padding: 0.18em 0.8em;
    font-size: 0.9rem;
    font-family: Consolas, 'Andale Mono WT', 'Andale Mono', 'Lucida Console',
      'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono',
      'Liberation Mono', 'Nimbus Mono L', Monaco, 'Courier New', Courier,
      monospace;
    background-color: #50525c;
    color: white;
    z-index: 0;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
  }
  img {
    max-width: 100%;
    height: auto;
    margin-top: 1rem;
  }
  hr {
    background: #c8c8c8;
    height: 1px;
    border: 0;
    margin: 3rem 0;
  }
`

export default function PostBody({ mdx }: { mdx: MDXRemoteSerializeResult }) {
  return (
    <Content>
      <MDXRemote {...mdx} />
    </Content>
  )
}
