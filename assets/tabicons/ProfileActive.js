import * as React from "react"
import Svg, { Path } from "react-native-svg"
import Colors from "../../Src/Constants/Colors/Colors"

const ProfileActive = () => {
    return (
        <Svg
            width={17}
            height={18}
            viewBox="0 0 17 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.25 4.743c0 2.37 1.903 4.291 4.25 4.291s4.25-1.921 4.25-4.291S10.847.45 8.5.45 4.25 2.372 4.25 4.743zm11.892 12.875c.469 0 .85-.385.85-.859 0 0 .282-6.008-8.492-6.008-8.774 0-8.491 6.008-8.491 6.008 0 .474.38.859.849.859h15.284z"
                fill={Colors.blackColorCode}
            />
        </Svg>
    )
}

export default ProfileActive
