import { useState } from 'react'
import useTimeout from '../../lib/hooks/useTimeout'
import { themeColor } from '../../styles/theme'
import IconBtn from '../common/IconBtn'
import Tooltip from '../common/Tooltip'
import CheckIcon from '../icons/CheckIcon'
import CopyLinkIcon from '../icons/CopyLinkIcon'

export default function CopyLinkBtn() {
  const [copied, setCopied] = useState(false)
  const [tooltipMessage, setTooltipMessage] = useState('')
  const [tooltipEmoji, setTooltipEmoji] = useState<string | undefined>()
  const [showTooltip, setShowTooltip] = useState(false)

  useTimeout(copied, () => setCopied(false), 1500)

  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTooltipMessage('링크가 복사됐습니다.')
      setTooltipEmoji('✅')
      setShowTooltip(true)
    } catch (err) {
      console.log(err)
      setTooltipMessage('링크 복사에 실패했습니다.')
      setTooltipEmoji(undefined)
      setShowTooltip(true)
    }
  }

  const handleTooltipHide = () => {
    setShowTooltip(false)
  }

  return (
    <>
      <IconBtn aria-label="copy-link" onClick={handleCopyLink}>
        {copied === true ? (
          <CheckIcon fill={`${themeColor.text1}`} />
        ) : (
          <CopyLinkIcon fill={`${themeColor.text1}`} />
        )}
      </IconBtn>
      <Tooltip
        message={tooltipMessage}
        show={showTooltip}
        duration={2000}
        onHide={handleTooltipHide}
        emoji={tooltipEmoji}
      />
    </>
  )
}
