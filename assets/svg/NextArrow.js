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

export default function NextArrow(props) {
  const xml = `
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.41683 4.34989C9.99676 4.70889 9.99676 5.29095 9.41683 5.64995L3.49794 9.314C3.21945 9.4864 2.84174 9.58325 2.44789 9.58325C1.62775 9.58325 0.962891 9.17168 0.962891 8.66397L0.96289 1.33587C0.96289 1.09206 1.11934 0.858235 1.39784 0.685837C1.97776 0.326836 2.91801 0.326836 3.49794 0.685837L9.41683 4.34989Z" fill="#7265E3"/>
    </svg>
    `;

  return (
    <SvgXml xml={xml} width={props.width ?? getFontSize(10)} height={props.height ?? getFontSize(10)} />
  );
}
