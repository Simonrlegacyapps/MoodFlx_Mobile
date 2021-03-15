import * as React from "react"
import Svg, { G, Path, Defs } from "react-native-svg"

const QuestionMarkIcon = (props) => {
    return (
        <Svg
            width={props.width}
            height={props.height}
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <G filter="url(#prefix__filter0_b)">
                <Path
                    d="M17.684 0h20.632C48.083 0 56 7.917 56 17.684v20.632C56 48.083 48.083 56 38.316 56H17.684C7.917 56 0 48.083 0 38.316V17.684C0 7.917 7.917 0 17.684 0z"
                    fill="#fff"
                    fillOpacity={0.3}
                />
            </G>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M40 28c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-13.312-4.475a2.4 2.4 0 013.616 2.073v.002c0 .563-.438 1.15-1.266 1.701a7.26 7.26 0 01-1.495.754l-.02.006a1.2 1.2 0 00.76 2.277l-.379-1.139c.38 1.139.38 1.139.381 1.138h.002l.005-.002.013-.004.041-.015.14-.051a9.662 9.662 0 001.884-.967c.972-.648 2.333-1.861 2.334-3.697a4.8 4.8 0 00-9.328-1.6 1.2 1.2 0 102.264.797 2.4 2.4 0 011.048-1.273zM28 32.8a1.2 1.2 0 000 2.4h.012a1.2 1.2 0 100-2.4H28z"
                fill="#fff"
            />
            <Defs></Defs>
        </Svg>
    )
}

export default QuestionMarkIcon
