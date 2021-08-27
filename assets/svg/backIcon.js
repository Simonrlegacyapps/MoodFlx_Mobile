import * as React from "react"
import Svg, { Path, Rect } from 'react-native-svg'

function BackIcon({ w, h }) {
    return (
        <Svg
            width={w?w:24}
            height={h?h:24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"

        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.258 11.8l7.653 7.778c.506.513.438 1.287-.152 1.727-.59.44-1.478.38-1.983-.133l-8.437-8.575a1.108 1.108 0 010-1.594l8.437-8.575c.505-.514 1.393-.573 1.983-.133.59.44.658 1.214.152 1.727L9.258 11.8z"
                fill="#9C9EB9"
            />
        </Svg>
    )
}

export default BackIcon