import * as React from "react"
import Svg, { Path } from "react-native-svg"

const FaqIcon = () => {
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zM10.688 7.525a2.4 2.4 0 013.616 2.073V9.6c0 .563-.438 1.15-1.266 1.701a7.26 7.26 0 01-1.495.754l-.02.007a1.2 1.2 0 00.76 2.276l-.379-1.138c.38 1.138.38 1.138.381 1.137h.002l.005-.002.013-.004.042-.015.139-.051a9.662 9.662 0 001.884-.967c.972-.648 2.333-1.861 2.334-3.697A4.8 4.8 0 007.376 8a1.2 1.2 0 002.264.797 2.4 2.4 0 011.048-1.273zM12 16.8a1.2 1.2 0 000 2.4h.012a1.2 1.2 0 100-2.4H12z"
                fill="#CBCCCF"
            />
        </Svg>
    )
}

export default FaqIcon
