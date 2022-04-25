import * as React from "react"
import Svg, { Path } from "react-native-svg"
import Colors from "../../Src/Constants/Colors/Colors"

const PickImageIcon = ({ w, h }) => {
    return (
        <Svg
            width={w ? w : 48}
            height={h ? h : 48}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M15.158 0h17.684C41.214 0 48 6.786 48 15.158v17.684C48 41.214 41.214 48 32.842 48H15.158C6.786 48 0 41.214 0 32.842V15.158C0 6.786 6.786 0 15.158 0z"
                fill={Colors.blueTextColor}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M28.341 14.154a4 4 0 003.28 1.71H33c1.657 0 3 1.282 3 2.863v12.41C36 32.716 34.657 34 33 34H15c-1.657 0-3-1.282-3-2.864V18.727c0-1.581 1.343-2.863 3-2.863h1.38a4 4 0 003.279-1.71l.509-.729c.185-.266.498-.425.832-.425h6c.334 0 .647.16.832.425l.51.729zM18 25a6 6 0 1012 0 6 6 0 00-12 0zm10 0a4 4 0 11-8 0 4 4 0 018 0z"
                fill="#fff"
            />
        </Svg>
    )
}

export default PickImageIcon
