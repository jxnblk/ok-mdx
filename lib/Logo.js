import React from 'react'

export default ({
  size = 96
}) =>
  <svg
    viewBox='-12 -12 24 24'
    width={size}
    height={size}
    fill='currentcolor'
  >
    <circle
      strokeWidth={1/4}
      r={11}
    />
    <circle
      fill='none'
      stroke='currentcolor'
      strokeWidth={1/4}
      r={11.75}
      opacity={3/4}
    />
    <text
      fontFamily='Menlo, monospace'
      fontSize='5'
      textAnchor='middle'
      alignmentBaseline='middle'
      fill='black'
    >
      ok
    </text>
  </svg>
