import * as React from "react"
import Svg, { Mask, Circle, G, Path } from "react-native-svg"

const ProfilePlaceholder = (props) => {
  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 176 176"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Mask
        id="prefix__a"
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={176}
        height={176}
      >
        <Circle cx={88} cy={88} r={88} fill="#F4F6FA" />
      </Mask>
      <G mask="url(#prefix__a)" fill="#CBCCCF">
        <Path d="M153 141v-11.667c0-6.188-3.424-12.123-9.519-16.499C137.386 108.458 129.12 106 120.5 106h-65c-8.62 0-16.886 2.458-22.981 6.834C26.424 117.21 23 123.145 23 129.333V141" />
        <Path d="M153 141v-11.667c0-6.188-3.424-12.123-9.519-16.499C137.386 108.458 129.12 106 120.5 106h-65c-8.62 0-16.886 2.458-22.981 6.834C26.424 117.21 23 123.145 23 129.333V179h130v-38zM88 91c17.121 0 31-14.103 31-31.5S105.121 28 88 28c-17.12 0-31 14.103-31 31.5S70.88 91 88 91z" />
      </G>
    </Svg>
  )
}

export default ProfilePlaceholder