import * as React from "react"
import Svg, { Path } from "react-native-svg"

const UnlockIcon = () => {
    return (
        <Svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M12.667 7.333H3.333C2.597 7.333 2 7.93 2 8.667v4.666c0 .737.597 1.334 1.333 1.334h9.334c.736 0 1.333-.597 1.333-1.334V8.667c0-.737-.597-1.334-1.333-1.334z"
                fill="#fff"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M5 7V4.779c0-.688.278-1.353.781-1.864a3.135 3.135 0 011.945-.9 3.237 3.237 0 012.102.526A2.763 2.763 0 0111 4.224"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default UnlockIcon