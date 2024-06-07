import * as React from "react"
import Svg, { Path } from "react-native-svg"
import Colors from "../../Src/Constants/Colors/Colors"

const HomeActiveIcon = ({isVitalityUser}) => {

    const iconSize = {
        width: isVitalityUser ? 29 : 18,
        height: isVitalityUser ? 31 : 19,
      };
    return (
        <Svg
            width={iconSize.width}
            height={iconSize.height}
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.589 1.077a.808.808 0 00-1.178 0L.254 10.204a1 1 0 00-.254.667v6.592c0 .717.576 1.299 1.286 1.299h3.857c.71 0 1.286-.582 1.286-1.299V12.27c0-.716.576-1.298 1.285-1.298h2.572c.71 0 1.285.582 1.285 1.298v5.194c0 .716.576 1.298 1.286 1.298h3.857c.71 0 1.286-.582 1.286-1.299v-6.592a1 1 0 00-.254-.667L9.589 1.077z"
                fill={Colors.blackColorCode}
            />
        </Svg>
    )
}

export default HomeActiveIcon