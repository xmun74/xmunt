import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { themeColor } from '../../styles/theme'

const TooltipContainer = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%)
    translateY(${(props) => (props.$show ? '0' : '-100px')});
  background-color: ${themeColor.box1};
  color: ${themeColor.text1};
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: ${themeColor.boxShadow};
  z-index: 9999;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 6px;

  @media screen and (max-width: 767px) {
    padding: 10px 16px;
    font-size: 12px;
  }
`

const Emoji = styled.span`
  font-size: 16px;
  line-height: 1;

  @media screen and (max-width: 767px) {
    font-size: 14px;
  }
`

interface TooltipProps {
  message: string
  show: boolean
  duration?: number
  onHide?: () => void
  emoji?: string
}

export default function Tooltip({
  message,
  show,
  duration = 2000,
  onHide,
  emoji,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  if (!show && !isVisible) return null

  return (
    <TooltipContainer $show={isVisible}>
      {emoji && <Emoji>{emoji}</Emoji>}
      {message}
    </TooltipContainer>
  )
}
