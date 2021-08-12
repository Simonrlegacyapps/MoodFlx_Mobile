import * as React from "react"
import Svg, { Circle, Path } from 'react-native-svg'

function Lock({w,h, color}) {
    return (
        <Svg
        width={72}
        height={72}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/Svg"
        
      >
        <Circle cx={36} cy={36} r={36} fill="#4C5980" />
        <Path
          d="M26.5 32.833v-3.166c0-5.241 1.583-9.5 9.5-9.5s9.5 4.259 9.5 9.5v3.166M36 46.292a3.958 3.958 0 100-7.917 3.958 3.958 0 000 7.917z"
          stroke="#fff"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M43.917 51.833H28.083c-6.333 0-7.916-1.583-7.916-7.916V40.75c0-6.333 1.583-7.917 7.916-7.917h15.834c6.333 0 7.916 1.584 7.916 7.917v3.167c0 6.333-1.583 7.916-7.916 7.916z"
          stroke="#fff"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    )
  }

export default Lock