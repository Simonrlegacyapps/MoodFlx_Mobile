import * as React from "react"
import Svg, { Path } from 'react-native-svg'

function Rings({w, h}) {
    return (
      <Svg
        width={w?w:14}
        height={h?h:14}
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        
      >
        <Path
          d="M5.338 8.942c0 1.99 1.61 3.6 3.599 3.6 1.99 0 3.6-1.61 3.6-3.6 0-1.989-1.61-3.599-3.6-3.599-.093 0-.18.006-.28.012a3.602 3.602 0 00-3.313 3.313c0 .088-.006.175-.006.274z"
          stroke="#FB8D09"
          strokeWidth={1.2}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M1.459 5.058c0 1.989 1.61 3.599 3.6 3.599h.285a3.602 3.602 0 013.313-3.314v-.285c0-1.99-1.61-3.6-3.599-3.6-1.99 0-3.6 1.61-3.6 3.6z"
          stroke="#FB8D09"
          strokeWidth={1.2}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    )
  }

export default Rings
