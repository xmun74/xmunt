import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { themeColor } from '../../styles/theme'

const TooltipContainer = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%)
    translateY(${(props) => (props.$show ? '0' : '-120px')});
  border: 1px solid ${themeColor.inlineCode};
  background-color: ${themeColor.gnbBackDrop};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: ${themeColor.text1};
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 8px 24px -12px #6666664b;
  z-index: 9999;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  svg {
    flex: none;
  }

  @media screen and (max-width: 767px) {
    padding: 0.5rem 0.9rem;
    font-size: 0.75rem;
  }
`

interface TooltipProps {
  message: string
  show: boolean
  duration?: number
  onHide?: () => void
  icon?: React.ReactNode
}

export default function Tooltip({
  message,
  show,
  duration = 2000,
  onHide,
  icon,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
        if (onHide) {
          setTimeout(() => onHide(), 300) // 애니메이션 완료 후 콜백
        }
      }, duration)
    } else {
      setIsVisible(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [show, duration, onHide])

  if (!mounted || (!show && !isVisible)) return null

  // backdrop-filter 등이 있는 조상은 position: fixed의 기준이 되므로 body에 직접 렌더링
  return createPortal(
    <TooltipContainer $show={isVisible}>
      {icon}
      {message}
    </TooltipContainer>,
    document.body
  )
}
