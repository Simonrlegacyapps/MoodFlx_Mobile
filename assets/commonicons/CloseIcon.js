import * as React from "react"
import Svg, { Path } from "react-native-svg"

const CloseIcon = (props) => {
    return (
        <Svg
            width={props.width}
            height={props.height}
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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M28 26.48l4.856-4.855a1.604 1.604 0 112.269 2.27l-4.856 4.855 4.856 4.856a1.604 1.604 0 11-2.27 2.269L28 31.019l-4.856 4.856a1.604 1.604 0 11-2.269-2.27l4.856-4.855-4.856-4.856a1.604 1.604 0 112.27-2.269L28 26.481z"
                fill="#fff"
            />
        </Svg>
    )
}

export default CloseIcon