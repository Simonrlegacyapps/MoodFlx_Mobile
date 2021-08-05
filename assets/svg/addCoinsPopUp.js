import * as React from "react"
import Svg, { Defs, G, Path },  from 'react-native-svg'

function AddCoinsPopup({w, h}) {
    return (
        <Svg
        width={72}
        height={41}
        viewBox="0 0 72 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <G filter="url(#prefix__filter0_d)">
          <Path
            d="M8 4a2 2 0 012-2h52a2 2 0 012 2v16a2 2 0 01-2 2H45.273a8 8 0 00-4.84 1.63l-3.223 2.45a2 2 0 01-2.42 0l-3.223-2.45a8 8 0 00-4.84-1.63H10a2 2 0 01-2-2V4z"
            fill="#7265E3"
          />
        </G>
        <Defs>
          <Filter
            id="prefix__filter0_d"
            x={0}
            y={0}
            width={72}
            height={40.488}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy={6} />
            <feGaussianBlur stdDeviation={4} />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </Filter>
        </Defs>
      </Svg>
    )
  }

export default AddCoinsPopup
