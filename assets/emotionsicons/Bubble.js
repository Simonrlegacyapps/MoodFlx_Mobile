import * as React from 'react';
import {Text} from 'react-native';
import Svg, {Path, G, Defs, Fe} from 'react-native-svg';

const BubbleIcon = () => {
  return (
    <Svg
      width="115"
      height="64"
      viewBox="0 0 115 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G filter="url(#filter0_d)">
        <Path
          d="M8 9.99999C8 5.58172 11.5817 2 16 2H99C103.418 2 107 5.58172 107 10V32.4C107 36.8183 103.418 40.4 99 40.4H72.7375C70.9778 40.4 69.2672 40.9802 67.8706 42.0507L58.7167 49.0674C57.9989 49.6176 57.0011 49.6176 56.2833 49.0674L47.1294 42.0507C45.7328 40.9802 44.0222 40.4 42.2625 40.4H16C11.5817 40.4 8 36.8183 8 32.4V9.99999Z"
          fill="white"
        />
      </G>
      <Text>Hi</Text>
    </Svg>
  );
};

export default BubbleIcon;
