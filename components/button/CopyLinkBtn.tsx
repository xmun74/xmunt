import { useState } from 'react'
import styled from 'styled-components'
import useTimeout from '../../lib/hooks/useTimeout'
import { themeColor } from '../../styles/theme'
import IconBtn from '../common/IconBtn'
import CheckIcon from '../icons/CheckIcon'
import CopyLinkIcon from '../icons/CopyLinkIcon'

const BtnContainer = styled.div``
export default function CopyLinkBtn() {
  const [copied, setCopied] = useState(false)

  useTimeout(copied, () => setCopied(false), 1500)

  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      alert('링크가 복사됐습니다.')
    } catch (err) {
      console.log(err)
      alert('링크 복사에 실패했습니다.')
    }
  }
  return (
    <IconBtn aria-label="copy-link" onClick={handleCopyLink}>
      {copied === true ? (
        <CheckIcon fill={`${themeColor.text1}`} />
      ) : (
        <CopyLinkIcon fill={`${themeColor.text1}`} />
      )}
    </IconBtn>
  )
}
