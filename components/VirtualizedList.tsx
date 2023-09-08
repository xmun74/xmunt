import { useState } from 'react'
import styled, { CSSProperties } from 'styled-components'

const Outer = styled.div<{ windowHeight: number }>`
  max-height: ${(props) => props.windowHeight}px;
  overflow-y: auto;
  overscroll-behavior-y: contain;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #bab9b97a;
    border-radius: 15px;
    scrollbar-width: thin;
  }
`
const Inner = styled.div``

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
    numItems - 1,
    Math.floor((scrollTop + windowHeight) / itemHeight)
  )

  const items = []
  for (let i = startIndex; i <= endIndex; i += 1) {
    items.push(
      renderItem({
        index: i,
        style: {
          position: 'absolute',
          transform: `translateY(${i * itemHeight}px)`,
          width: '100%',
        },
      })
    )
  }
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

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
