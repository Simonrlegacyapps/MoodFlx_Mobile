import * as React from "react"
import Svg, {
  G,
  Path,
  Defs,
  Line,
  LinearGradient,
  Stop,
  Mask,
  Rect,
} from 'react-native-svg';

const BulbIcon = (props) => {
  return (
    <Svg
      width={props.width ?? 137}
      height={props.height ?? 165}
      viewBox="0 0 137 165"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path d="M57.4941 157.643C59.246 161.847 63.4501 165 68.3547 165C73.2594 165 77.4634 161.847 79.2153 157.643H57.4941Z" fill="#344A5E" />
      <Path d="M81.3184 157.993H55.7436C52.2401 157.993 49.4375 155.191 49.4375 151.687V125.062H87.6245V151.687C87.6245 155.19 84.8215 157.993 81.3184 157.993Z" fill="#344A5E" />
      <Path d="M87.2721 138.374H49.4356C47.3336 138.374 45.582 136.623 45.582 134.521C45.582 132.419 47.3336 130.667 49.4356 130.667H87.2721C89.3742 130.667 91.1258 132.419 91.1258 134.521C91.1258 136.623 89.3742 138.374 87.2721 138.374Z" fill="#415A6B" />
      <Path d="M87.2692 150.634H49.4327C47.3307 150.634 45.5791 148.883 45.5791 146.781C45.5791 144.679 47.3307 142.927 49.4327 142.927H87.2692C89.3712 142.927 91.1228 144.679 91.1228 146.781C91.1228 148.883 89.3712 150.634 87.2692 150.634Z" fill="#415A6B" />
      <Mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="20" y="22" width="125" height="150">
        <Path d="M87.6285 125.412C89.7306 118.406 93.9346 112.099 99.5401 107.194C110.05 98.4359 116.707 85.1232 116.707 70.409C116.707 43.0826 93.9349 20.6609 65.9077 22.0623C41.0335 23.1133 20.7138 44.1336 20.0132 69.0075C19.6627 84.4226 26.3193 98.0858 37.1799 107.194C43.1355 112.099 47.3396 118.405 49.4416 125.412H87.6285Z" fill="#DFE0E4" />
      </Mask>
      <G mask="url(#mask0)">
        <Path d="M87.6285 125.412C89.7306 118.406 93.9346 112.099 99.5401 107.194C110.05 98.4359 116.707 85.1232 116.707 70.409C116.707 43.0826 93.9349 20.6609 65.9077 22.0623C41.0335 23.1133 20.7138 44.1336 20.0132 69.0075C19.6627 84.4226 26.3193 98.0858 37.1799 107.194C43.1355 112.099 47.3396 118.405 49.4416 125.412H87.6285Z" fill="#DFE0E4" />
        <Rect x="5" y="22" width="126" height="104" fill="url(#paint0_linear)" />
      </G>
      <Line x1="69" y1="4.37112e-08" x2="69" y2="14" stroke={props.stroke ? props.stroke : "#F6D27E"} strokeWidth="2" />
      <Line x1="137" y1="72" x2="123" y2="72" stroke={props.stroke ? props.stroke : "#F6D27E"} strokeWidth="2" />

      <Line x1="117.644" y1="23.2706" x2="107.744" y2="33.1701" stroke={props.stroke ? props.stroke : "#F6D27E"} strokeWidth="2" />
      <Line x1="116.229" y1="120.144" x2="106.33" y2="110.244" stroke={props.stroke ? props.stroke : "#F6D27E"} strokeWidth="2" />
      <Line x1="14" y1="72" x2="-8.74228e-08" y2="72" stroke={props.stroke ? props.stroke : "#F6D27E"} strokeWidth="2" />
      <Line x1="30.67" y1="110.244" x2="20.7705" y2="120.144" stroke={props.stroke ? props.stroke : "#F6D27E"} strokeWidth="2" />
      <Line x1="29.2558" y1="33.17" x2="19.3563" y2="23.2705" stroke={props.stroke ? props.stroke : "#F6D27E"} strokeWidth="2" />
      <Defs>
        <LinearGradient id="paint0_linear" x1="68" y1="22" x2="68" y2="126" gradientUnits="userSpaceOnUse">
          <Stop offset="0.0408726" stopColor={props.stroke ? props.stroke : "#FAE6B7"} />
          <Stop offset="1" stopColor={props.stroke ? props.stroke : "#F3B21B"} />
        </LinearGradient>
      </Defs>
    </Svg>

  )
}


export default BulbIcon;
