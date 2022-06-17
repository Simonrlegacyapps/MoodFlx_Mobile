import * as React from "react"
import Svg, { Circle, Defs, Image, Path, Pattern, Use } from 'react-native-svg'
import Colors from "../../Src/Constants/Colors/Colors"

function ScienceG({w,h, color}) {
    return (
      <Svg
        width={72}
      height={72}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      
    >
      <Circle cx={36} cy={36} r={36} fill={Colors.greyTwo} />
      <Path
        d="M30.728 39.167h-7.395a3.176 3.176 0 00-3.166 3.166v9.5h10.56V39.167z"
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M38.106 32.833h-4.228A3.176 3.176 0 0030.712 36v15.833h10.56V36a3.166 3.166 0 00-3.166-3.167z"
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M48.667 43.917h-7.395v7.916h10.561v-4.75a3.176 3.176 0 00-3.166-3.166z"
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M36.823 20.277l.84 1.679c.11.237.411.459.664.49l1.52.254c.966.158 1.204.87.507 1.552l-1.188 1.187c-.205.206-.316.586-.253.855l.333 1.457c.269 1.156-.349 1.599-1.362.997l-1.425-.839c-.253-.158-.68-.158-.934 0l-1.425.84c-1.014.601-1.631.158-1.362-.998l.333-1.457c.063-.269-.048-.665-.254-.855l-1.171-1.172c-.697-.696-.475-1.393.506-1.551l1.52-.254c.254-.047.555-.269.665-.49l.84-1.679c.459-.918 1.187-.918 1.646-.015z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      </Svg>
    )
  }

export default ScienceG