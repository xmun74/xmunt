import { SVGProps } from 'react'

function GalleryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="9.2"
        cy="9.8"
        r="1.4"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M4.8 16.6L9.2 12.8L12.8 16L15.4 13.6L19.2 17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default GalleryIcon
