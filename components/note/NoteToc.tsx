import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { themeColor } from '../../styles/theme'

export interface TocItem {
  text: string
  href: string
  level: number
}

const TocContainer = styled.nav<{ $hasCodePanel: boolean }>`
  display: none;

  @media screen and (min-width: 1400px) {
    display: block;
    position: fixed;
    top: 96px;
    left: ${({ $hasCodePanel }) =>
      $hasCodePanel ? 'calc(50% - 472px)' : 'calc(50% - 572px)'};
    width: 180px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    padding-right: 8px;
    transition: left 400ms cubic-bezier(0.32, 0.72, 0, 1);
    &::-webkit-scrollbar {
      width: 3px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(128, 128, 128, 0.3);
      border-radius: 3px;
    }
  }
`

const TocAnchor = styled(Link)<{ $active: boolean; $level: number }>`
  display: block;
  font-size: 0.78rem;
  margin-bottom: 0.875rem;
  padding-left: ${({ $level }) => ($level > 1 ? '12px' : '4px')};
  border-left: 2px solid
    ${({ $active }) => ($active ? themeColor.accent2 : 'transparent')};
  opacity: ${({ $active }) => ($active ? 1 : 0.45)};
  color: ${themeColor.text3};
  line-height: 1.4;
  transition: opacity 300ms cubic-bezier(0.32, 0.72, 0, 1),
    border-color 300ms cubic-bezier(0.32, 0.72, 0, 1);
  &:hover {
    opacity: 0.75;
  }
`

interface Props {
  items: TocItem[]
  hasCodePanel: boolean
}

export default function NoteToc({ items, hasCodePanel }: Props) {
  const [activeHref, setActiveHref] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!items.length) return undefined

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting)
        if (!intersecting.length) return
        const topmost = intersecting.reduce((prev, cur) =>
          cur.boundingClientRect.top < prev.boundingClientRect.top ? cur : prev
        )
        setActiveHref(topmost.target.id)
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    items.forEach(({ href }) => {
      const el = document.getElementById(href)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <TocContainer $hasCodePanel={hasCodePanel}>
      {items.map((item) => (
        <TocAnchor
          key={item.href}
          href={`#${item.href}`}
          $active={activeHref === item.href}
          $level={item.level}
        >
          {item.text}
        </TocAnchor>
      ))}
    </TocContainer>
  )
}
