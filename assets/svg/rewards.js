import * as React from "react"
import Svg, { Path } from 'react-native-svg'
import Colors from "../../Src/Constants/Colors/Colors"

function Rewards({ w, h, color }) {
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M24.25 31.5V35"
        stroke={color ? color : Colors.greyColorCode}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.917 40.667h16.666V39c0-1.833-1.5-3.333-3.333-3.333h-10A3.343 3.343 0 0015.917 39v1.667z"
        stroke={color ? color : Colors.greyColorCode}
        strokeWidth={2.5}
        strokeMiterlimit={10}
      />
      <Path
        d="M14.25 40.667h20M24 30.667A11.658 11.658 0 0112.333 19v-5A6.665 6.665 0 0119 7.333h10A6.665 6.665 0 0135.667 14v5c0 6.45-5.217 11.667-11.667 11.667z"
        stroke={color ? color : Colors.greyColorCode}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.117 23.417c-1.25-.4-2.35-1.134-3.217-2-1.5-1.667-2.5-3.667-2.5-6a4.126 4.126 0 014.167-4.167h1.083a6.26 6.26 0 00-.5 2.5v5c0 1.667.35 3.233.967 4.667zM34.883 23.417c1.25-.4 2.35-1.134 3.217-2 1.5-1.667 2.5-3.667 2.5-6a4.126 4.126 0 00-4.167-4.167H35.35c.333.767.5 1.617.5 2.5v5c0 1.667-.35 3.233-.967 4.667z"
        stroke={color ? color : Colors.greyColorCode}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default Rewards;