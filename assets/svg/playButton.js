import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function PlayButton({w, h}) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10 20C4.48 19.994.006 15.52 0 10v-.2C.11 4.305 4.635-.072 10.13 0c5.497.074 9.904 4.569 9.868 10.065C19.962 15.562 15.497 20 10 20zM8 5.5v9l6-4.5-6-4.5z"
        fill="#CBCCCF"
      />
    </Svg>
  );
}

export default PlayButton;
