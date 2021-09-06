import * as React from "react"
import Svg, {Circle, Path, Text} from 'react-native-svg';
import {getFontSize} from '../../Src/Constants/sizeChoose';

function MedalPopUp({w, h, type}) {
    return (
        <Svg
        width={100}
        height={100}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        
      >
        <Circle cx={50} cy={50} r={50} fill="#4C5980" />
        <Path
          d="M35.355 27.778a4.167 4.167 0 014.167-4.167h1.923v24.36h-6.09V27.777zM57.685 23.61h1.924a4.167 4.167 0 014.166 4.168V47.97h-6.09V23.61zM46.52 23.611h6.09V47.97h-6.09z"
          fill="#fff"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M49.565 76.388c11.21 0 20.299-9.088 20.299-20.299 0-11.21-9.088-20.299-20.3-20.299-11.21 0-20.298 9.088-20.298 20.3 0 11.21 9.088 20.298 20.299 20.298z"
          fill="#FFE609"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M49.565 70.3c7.848 0 14.21-6.363 14.21-14.21 0-7.848-6.362-14.21-14.21-14.21-7.848 0-14.21 6.362-14.21 14.21 0 7.847 6.362 14.21 14.21 14.21z"
          fill="#FFBD20"
        />
        <Text
          x="50"
          y="61"
          stroke="#FFFFFF"
          fill="#FFFFFF"
          fontSize={`${getFontSize(13)}`}
          fontWeight="bold"
          textAnchor="middle">
          {type?.toUpperCase?.() ?? 'N'}
        </Text>
        {/* <Path
          d="M45.188 63.222a.481.481 0 01-.325-.126.481.481 0 01-.127-.325V51.035a.44.44 0 01.127-.325.48.48 0 01.325-.127h1.914c.3 0 .505.115.614.343l4.405 6.934v-6.825a.44.44 0 01.127-.325.48.48 0 01.325-.127h2.166a.44.44 0 01.325.127.44.44 0 01.127.325v11.718a.504.504 0 01-.127.343.44.44 0 01-.325.126h-1.932a.646.646 0 01-.596-.343l-4.405-6.68v6.572a.48.48 0 01-.126.325.44.44 0 01-.325.126h-2.167z"
          fill="#fff"
        /> */}
      </Svg>
    )
  }

export default MedalPopUp