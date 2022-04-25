import * as React from "react"
import Svg, { Circle, Path } from 'react-native-svg'
import Colors from "../../Src/Constants/Colors/Colors"

function Anonimity({w,h, color}) {
    return (
        <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      
    >
      <Circle
        cx={14.074}
        cy={33.721}
        r={6.279}
        stroke={color ? color : Colors.blueTextColor}
        strokeWidth={2.5}
      />
      <Circle
        cx={33.809}
        cy={33.721}
        r={6.279}
        stroke={color ? color : Colors.blueTextColor}
        strokeWidth={2.5}
      />
      <Path d="M20.353 32.824h7.176" stroke={color ?color : Colors.blueTextColor} strokeWidth={2.5} />
      <Path
        d="M6 20.809a1.25 1.25 0 000 2.5v-2.5zm35.882 2.5a1.25 1.25 0 000-2.5v2.5zm-6.535-8.23l-1.19.379 1.19-.379zM6 23.31h4.32v-2.5H6v2.5zm5.52-.9l1.976-6.795-2.4-.699L9.12 21.71l2.4.698zm8.458-11.659h7.744v-2.5h-7.744v2.5zm-9.659 12.559h27.244v-2.5H10.32v2.5zm27.244 0h4.32v-2.5h-4.32v2.5zm-3.407-7.851l2.216 6.979 2.383-.756-2.216-6.98-2.383.757zm-6.433-4.708a6.75 6.75 0 016.433 4.708l2.383-.757a9.25 9.25 0 00-8.817-6.451v2.5zm-14.226 4.864a6.75 6.75 0 016.48-4.864v-2.5a9.25 9.25 0 00-8.88 6.665l2.4.699z"
        fill={color ? color : Colors.blueTextColor}
      />
    </Svg>
    )
  }

export default Anonimity