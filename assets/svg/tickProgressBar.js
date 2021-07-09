import * as React from "react"
import Svg, { Path } from 'react-native-svg'

function TickProgressBar({ w, h }) {
    return (
        <Svg
            width={w ? w : 8}
            height={h ? h : 6}
            viewBox="0 0 8 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"

        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.729 1.684A1 1 0 006.583.09c-.12.054-.229.132-.319.227l-3.092 3.29-1.528-1.353a1.005 1.005 0 00-1.643.812c.01.259.123.504.311.683l2.257 2a1.005 1.005 0 001.397-.063l3.763-4z"
                fill="#8C80F8"
            />
        </Svg>
    )
}

export default TickProgressBar
