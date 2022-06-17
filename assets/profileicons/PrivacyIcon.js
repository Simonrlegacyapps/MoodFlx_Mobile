import * as React from "react"
import Svg, { Path } from "react-native-svg"
import Colors from "../../Src/Constants/Colors/Colors"

const PrivacyIcon = () => {
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
                d="M12 0C8.26 0 5.25 3.058 5.25 6.857V8C4.01 8 3 9.027 3 10.286v11.428C3 22.974 4.01 24 5.25 24h13.5c1.24 0 2.25-1.027 2.25-2.286V10.286C21 9.026 19.99 8 18.75 8V6.857C18.75 3.058 15.74 0 12 0zm0 2.286c2.562 0 4.5 1.968 4.5 4.571V8h-9V6.857c0-2.603 1.938-4.571 4.5-4.571zm0 11.428c1.24 0 2.25 1.027 2.25 2.286 0 1.259-1.01 2.286-2.25 2.286S9.75 17.259 9.75 16c0-1.259 1.01-2.286 2.25-2.286z"
                fill={Colors.blackColorCode}
                opacity={0.2}
            />
        </Svg>
    )
}

export default PrivacyIcon