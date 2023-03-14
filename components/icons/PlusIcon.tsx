import * as React from 'react'
import { SVGProps } from 'react'

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      className="plus"
      style={{
        width: 16,
        height: 16,
        display: 'block',
        fill: 'currentColor',
        flexShrink: 0,
        backfaceVisibility: 'hidden',
      }}
      {...props}
    >
      <path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 0 0-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 0 0-.739.722v5.529h-5.37a.746.746 0 0 0-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z" />
    </svg>
  )
}

export default PlusIcon
