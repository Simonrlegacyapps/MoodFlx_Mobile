import * as React from "react"
import Svg, { Path } from "react-native-svg"

const MicIcon = () => {
    return (
        <Svg
            width={17}
            height={21}
            viewBox="0 0 17 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.25 4.565C12.25 2.287 10.422.44 8.167.44S4.083 2.288 4.083 4.565v7.216c0 2.277 1.829 4.123 4.084 4.123s4.083-1.846 4.083-4.123V4.565zm3.063 6.185c-.564 0-1.021.461-1.021 1.03 0 3.417-2.743 6.186-6.125 6.186-3.383 0-6.125-2.77-6.125-6.185 0-.57-.457-1.031-1.021-1.031C.457 10.75 0 11.21 0 11.78c0 4.555 3.656 8.247 8.167 8.247 4.51 0 8.166-3.692 8.166-8.246 0-.57-.457-1.031-1.02-1.031z"
                fill="#D6D9E0"
            />
        </Svg>
    )
}

export default MicIcon
