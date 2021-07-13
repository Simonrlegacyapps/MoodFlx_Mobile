import * as React from "react"
import Svg, { Path } from 'react-native-svg'

function Insights({ w, h }) {
    return (
        <Svg
            width={w ? w : 56}
            height={h ? h : 56}
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"

        >
            <Path
                d="M17.684 0h20.632C48.083 0 56 7.917 56 17.684v20.632C56 48.083 48.083 56 38.316 56H17.684C7.917 56 0 48.083 0 38.316V17.684C0 7.917 7.917 0 17.684 0z"
                fill="#171B21"
                fillOpacity={0.4}
            />
            <Path
                d="M17 16v21.833A1.167 1.167 0 0018.167 39H41v-2.333H19.333V16H17z"
                fill="#fff"
            />
            <Path
                d="M32.828 28.448a1.18 1.18 0 00.878.216 1.172 1.172 0 00.77-.473l4.912-6.78-1.907-1.403-4.217 5.82-3.092-2.276a1.177 1.177 0 00-1.31-.057 1.177 1.177 0 00-.338.314l-4.912 6.78 1.907 1.403 4.217-5.82 3.092 2.276z"
                fill="#fff"
            />
        </Svg>
    )
}

export default Insights
