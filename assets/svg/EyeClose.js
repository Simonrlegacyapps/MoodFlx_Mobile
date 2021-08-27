import * as React from "react"
import Svg, { Path, Rect } from 'react-native-svg'

function EyeClose({ w, h }) {
    return (
        <Svg
        width={23}
        height={16}
        viewBox="0 0 23 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M21.257 6.962c.474.62.474 1.457 0 2.076C19.764 10.987 16.182 15 12 15c-4.182 0-7.764-4.013-9.257-5.962a1.692 1.692 0 010-2.076C4.236 5.013 7.818 1 12 1c4.182 0 7.764 4.013 9.257 5.962v0z"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12 11a3 3 0 100-6 3 3 0 000 6z"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path fill="#fff" d="M0 11.493L21.585 1l1.312 2.698L1.312 14.191z" />
        </Svg>
    )
}

export default EyeClose