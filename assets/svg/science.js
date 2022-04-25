import * as React from "react"
import Svg, { Circle, Path } from 'react-native-svg'
import Colors from "../../Src/Constants/Colors/Colors"

function Science({w,h, color}) {
    return (
        <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      
    >
      <Path
        d="M24.919 26.718a2.658 2.658 0 100-5.316 2.658 2.658 0 000 5.316z"
        stroke={color ? color : Colors.greyColorCode}
        strokeWidth={2.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M24.918 44c4.037 0 7.31-8.925 7.31-19.934 0-11.01-3.273-19.935-7.31-19.935-4.037 0-7.31 8.925-7.31 19.934 0 11.01 3.273 19.935 7.31 19.935z"
        stroke={color ? color : Colors.greyColorCode}
        strokeWidth={2.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M42.181 34.026c2.018-3.496-4.074-10.792-13.608-16.297-9.535-5.505-18.9-7.133-20.918-3.637-2.019 3.495 4.074 10.792 13.608 16.297 9.534 5.505 18.9 7.133 20.918 3.637z"
        stroke={color ? color : Colors.greyColorCode}
        strokeWidth={2.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.657 34.038c2.019 3.495 11.384 1.867 20.918-3.638C38.11 24.895 44.202 17.6 42.184 14.103c-2.019-3.496-11.384-1.867-20.918 3.638-9.534 5.504-15.627 12.8-13.609 16.297z"
        stroke={color ? color : Colors.greyColorCode}
        strokeWidth={2.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
    )
  }

export default Science