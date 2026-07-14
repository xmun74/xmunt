import { SVGProps } from 'react'

function PacmanIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.7" />
      <circle
        cx="12"
        cy="9.8"
        r="2.9"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M6.4 18.1C7.7 15.8 9.6 14.6 12 14.6C14.4 14.6 16.3 15.8 17.6 18.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default PacmanIcon
