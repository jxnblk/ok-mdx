import React from 'react'

export default ({
  size = 192
}) =>
  <svg
    viewBox='-12 -12 24 24'
    width={size}
    height={size}
    fill='currentcolor'
  >
    <circle
      fill='none'
      stroke='currentcolor'
      strokeWidth={1/4}
      r={11}
    />
    <circle
      fill='none'
      stroke='currentcolor'
      strokeWidth={1/8}
      r={11.5}
      opacity={1/2}
    />
    <text
      fontFamily='Menlo, monospace'
      fontSize='4'
      textAnchor='middle'
      alignmentBaseline='middle'
      y={-1/3}
    >
      ok
    </text>
  </svg>
