import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Profile = ({isVitalityUser}) => {

    const iconSize = {
        width:isVitalityUser ? 43 : 24,
        height:isVitalityUser ? 43 :25,
      }
    return (
        <Svg
            width={iconSize.width}
            height={iconSize.height}
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.25 7.743c0 2.37 1.903 4.291 4.25 4.291s4.25-1.921 4.25-4.291S14.847 3.45 12.5 3.45 8.25 5.372 8.25 7.743zm11.892 12.875c.469 0 .85-.385.85-.859 0 0 .282-6.008-8.492-6.008-8.774 0-8.491 6.008-8.491 6.008 0 .474.38.859.849.859h15.284z"
                fill="#D6D9E0"
            />
        </Svg>
    )
}

export default Profile
