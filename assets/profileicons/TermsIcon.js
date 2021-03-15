import * as React from "react"
import Svg, { Path } from "react-native-svg"

const TermsIcon = () => {
    return (
        <Svg
            width={18}
            height={24}
            viewBox="0 0 18 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 4a4 4 0 014-4h10a4 4 0 014 4v16a4 4 0 01-4 4H4a4 4 0 01-4-4V4zm2.5 2a1 1 0 011-1h10a1 1 0 110 2h-10a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2h-6z"
                fill="#CBCCCF"
            />
        </Svg>
    )
}

export default TermsIcon