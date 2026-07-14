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
  const [tooltipSuccess, setTooltipSuccess] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useTimeout(copied, () => setCopied(false), 1500)

  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTooltipMessage('링크를 복사했습니다')
      setTooltipSuccess(true)
      setShowTooltip(true)
    } catch (err) {
      console.log(err)
      setTooltipMessage('복사에 실패했습니다. 다시 시도해주세요')
      setTooltipSuccess(false)
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
        icon={tooltipSuccess ? <CheckIcon width={15} height={15} /> : undefined}
      />
    </>
  )
}
