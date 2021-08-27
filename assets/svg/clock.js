import * as React from "react"
import Svg, { Path, Rect } from 'react-native-svg'

function Clock({ w, h }) {
    return (
        <Svg
        width={w?w:12}
        height={h?h:12}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        
      >
        <Path
          d="M11 6c0 2.76-2.24 5-5 5S1 8.76 1 6s2.24-5 5-5 5 2.24 5 5z"
          stroke="#F65765"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M7.855 7.59l-1.55-.925c-.27-.16-.49-.545-.49-.86v-2.05"
          stroke="#F65765"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        </Svg>
    )
}

export default Clock