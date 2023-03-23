import * as React from 'react'
import { SVGProps } from 'react'

function CopyLinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
      width={20}
      height={20}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        d="m122.3 71.4 19.8-19.8a44.1 44.1 0 0 1 62.3 62.3l-28.3 28.2a43.9 43.9 0 0 1-62.2 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={12}
      />
      <path
        d="m133.7 184.6-19.8 19.8a44.1 44.1 0 0 1-62.3-62.3l28.3-28.2a43.9 43.9 0 0 1 62.2 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={12}
      />
    </svg>
  )
}

export default CopyLinkIcon
