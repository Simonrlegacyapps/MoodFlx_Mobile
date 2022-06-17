import * as React from 'react';
import Svg, {
  G,
  Path,
  Defs,
  Line,
  LinearGradient,
  Stop,
  Mask,
  Rect,
  SvgXml,
} from 'react-native-svg';
import {getFontSize} from '../../Src/Constants/sizeChoose';

export default function PreviousArrow(props) {
  const xml = `
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M1.39762 4.34989C0.817693 4.70889 0.817693 5.29095 1.39762 5.64995L7.31651 9.314C7.595 9.4864 7.97272 9.58325 8.36656 9.58325C9.18671 9.58325 9.85156 9.17168 9.85156 8.66397L9.85156 1.33587C9.85156 1.09206 9.69511 0.858235 9.41662 0.685837C8.83669 0.326836 7.89644 0.326836 7.31651 0.685837L1.39762 4.34989Z" fill="#7265E3"/>
    </svg> 
    `;

  return (
    <SvgXml xml={xml} width={props.width ?? getFontSize(10)} height={props.height ?? getFontSize(10)} />
  );
}
