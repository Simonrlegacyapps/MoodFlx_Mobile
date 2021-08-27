import * as React from "react"
import Svg, { Path } from 'react-native-svg'

function Line({ w, h }) {
    return (
        <Svg
        width={1}
        height={12}
        viewBox="0 0 1 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path stroke="#E0E0E0" d="M.5 0v12" />
        </Svg>
    )
}

export default Line