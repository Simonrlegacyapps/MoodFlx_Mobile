import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

function Eye({w, h}) {
  return (
    <Svg
      width={22}
      height={16}
      viewBox="0 0 22 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M20.257 6.962c.474.62.474 1.457 0 2.076C18.764 10.987 15.182 15 11 15c-4.182 0-7.764-4.013-9.257-5.962a1.692 1.692 0 010-2.076C3.236 5.013 6.818 1 11 1c4.182 0 7.764 4.013 9.257 5.962v0z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 11a3 3 0 100-6 3 3 0 000 6z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Eye;
