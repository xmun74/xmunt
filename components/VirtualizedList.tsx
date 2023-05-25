import React, { useState } from 'react'
import styled, { CSSProperties } from 'styled-components'

const Outer = styled.div<{ windowHeight: number }>`
  height: ${(props) => props.windowHeight}px;
  overflow-y: scroll;
`
const Inner = styled.div`
  /* padding-top: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;

  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
  } */
`

interface ListProps {
  numItems: number
  itemHeight: number
  renderItem: (props: { index: number; style: CSSProperties }) => JSX.Element
  windowHeight: number
}

function VirtualizedList({
  numItems,
  itemHeight,
  renderItem,
  windowHeight,
}: ListProps) {
  const [scrollTop, setScrollTop] = useState(0)

  const innerHeight = numItems * itemHeight
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    numItems - 1, // don't render past the end of the list
    Math.floor((scrollTop + windowHeight) / itemHeight),
  )

  const items = []
  for (let i = startIndex; i <= endIndex; i += 1) {
    if (i < numItems - 1) {
      items.push(
        renderItem({
          index: i,
          style: {
            position: 'absolute',
            transform: `translateY(${i * itemHeight}px)`, // reflow막으려고
            width: '100%',
          },
        }),
      )
    }
    items.push(
      renderItem({
        index: i,
        style: {
          position: 'absolute',
          transform: `translateY(${i * itemHeight}px)`, // reflow막으려고
          width: '100%',
        },
        // ref
      }),
    )
  }

  const onScroll = (e: React.UIEvent<HTMLDivElement>) =>
    setScrollTop(e.currentTarget.scrollTop)

  return (
    <Outer className="outer" onScroll={onScroll} windowHeight={windowHeight}>
      <Inner
        className="innerWrapper"
        style={{ position: 'relative', minHeight: `${innerHeight}px` }}
      >
        {items}
      </Inner>
    </Outer>
  )
}
export default VirtualizedList
