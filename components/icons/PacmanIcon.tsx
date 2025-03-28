function PacmanIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width={18}
      height={18}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_416_49)">
        <path
          d="M17.0711 2.92893C15.6725 1.53041 13.8907 0.577999 11.9509 0.192147C10.0111 -0.193705 8.00043 0.00432864 6.17316 0.761205C4.3459 1.51808 2.78412 2.79981 1.6853 4.4443C0.586489 6.08879 -2.98641e-07 8.02219 0 10C2.98642e-07 11.9778 0.58649 13.9112 1.6853 15.5557C2.78412 17.2002 4.34591 18.4819 6.17317 19.2388C8.00043 19.9957 10.0111 20.1937 11.9509 19.8079C13.8907 19.422 15.6725 18.4696 17.0711 17.0711L10 10L17.0711 2.92893Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_416_49">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default PacmanIcon
