'use client'

import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { PanelBlock } from '@lib/notes'

/* ── Desktop: right-fixed panel ──────────────────────────── */
const PanelShell = styled.aside`
  display: none;

  @media screen and (min-width: 1400px) {
    display: block;
    position: fixed;
    top: 80px;
    left: calc(50% + 292px);
    width: 360px;
    height: calc(100vh - 100px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 4px;
    background: rgba(255, 255, 255, 0.03);
  }
`

const PanelCore = styled.div`
  height: 100%;
  background: #0d0d0d;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.06);
`

const TabBar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px 0;
  gap: 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 5px 12px;
  font-size: 0.72rem;
  color: ${({ $active }) => ($active ? '#e4e4e7' : '#52525b')};
  background: ${({ $active }) =>
    $active ? 'rgba(255,255,255,0.1)' : 'transparent'};
  border-radius: 6px 6px 0 0;
  border: none;
  cursor: pointer;
  font-family: Consolas, 'Courier New', monospace;
  white-space: nowrap;
  transition:
    color 200ms,
    background 200ms;
  &:hover {
    color: #e4e4e7;
  }
`

const CopyBtn = styled.button`
  margin-left: auto;
  flex-shrink: 0;
  padding: 3px 10px;
  font-size: 0.68rem;
  color: #52525b;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  cursor: pointer;
  font-family: Consolas, monospace;
  transition:
    color 200ms,
    border-color 200ms;
  &:hover {
    color: #e4e4e7;
    border-color: rgba(255, 255, 255, 0.25);
  }
`

const CodeArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  pre {
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.65;
    white-space: pre-wrap;
    word-break: break-word;
  }
  code {
    font-family: Consolas, 'Courier New', monospace;
  }
`

/* ── Mobile: inline below prose ────────────────────────────── */
const MobilePanel = styled.div`
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media screen and (min-width: 1400px) {
    display: none;
  }
`

const MobileFileLabel = styled.div`
  font-size: 0.72rem;
  font-family: Consolas, monospace;
  margin-bottom: 0.4rem;
  padding: 0.18em 0.8em;
  background: #50525c;
  color: white;
  border-radius: 4px 4px 0 0;
  display: inline-block;
`

export default function NoteCodePanel({ blocks }: { blocks: PanelBlock[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (!blocks.length) return null

  const active = blocks[activeIdx]

  const handleCopy = () => {
    navigator.clipboard
      .writeText(active.code)
      .then(() => {
        setCopied(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {
        // clipboard write failed (page not focused or non-secure context)
      })
  }

  return (
    <>
      {/* Desktop fixed panel */}
      <PanelShell>
        <PanelCore>
          <TabBar>
            {blocks.map((b, i) => (
              <Tab
                key={`${b.filename}-${b.code.length}`}
                type="button"
                $active={i === activeIdx}
                onClick={() => setActiveIdx(i)}
              >
                {b.filename}
              </Tab>
            ))}
            <CopyBtn type="button" onClick={handleCopy}>
              {copied ? 'copied!' : 'copy'}
            </CopyBtn>
          </TabBar>
          <CodeArea>
            <pre>
              <code>{active.code}</code>
            </pre>
          </CodeArea>
        </PanelCore>
      </PanelShell>

      {/* Mobile inline panel */}
      <MobilePanel>
        {blocks.map((b) => (
          <div key={`${b.filename}-${b.code.length}`}>
            <MobileFileLabel>{b.filename}</MobileFileLabel>
            <CodeArea>
              <pre>
                <code>{b.code}</code>
              </pre>
            </CodeArea>
          </div>
        ))}
      </MobilePanel>
    </>
  )
}
