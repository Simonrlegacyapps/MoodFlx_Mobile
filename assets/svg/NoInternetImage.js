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

export function NoInternetImage(props) {
  const xml = `
    <svg width="257" height="257" viewBox="0 0 257 257" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M128.5 257C199.469 257 257 199.469 257 128.5C257 57.5314 199.469 0 128.5 0C57.5314 0 0 57.5314 0 128.5C0 199.469 57.5314 257 128.5 257Z" fill="#EFEFEF"/>
    <mask id="mask0_4445:889" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="257" height="257">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M128.5 257C199.469 257 257 199.469 257 128.5C257 57.5314 199.469 0 128.5 0C57.5314 0 0 57.5314 0 128.5C0 199.469 57.5314 257 128.5 257Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_4445:889)">
    <path d="M55.4194 121.354C55.4194 110.309 64.3737 101.354 75.4194 101.354H180.581C191.626 101.354 200.581 110.309 200.581 121.354V245.76H55.4194V121.354Z" fill="#030047"/>
    <path d="M63.2173 137.289C63.2173 133.975 65.9036 131.289 69.2173 131.289H186.783C190.096 131.289 192.783 133.975 192.783 137.289V260.321H63.2173V137.289Z" fill="white"/>
    <path opacity="0.522972" fill-rule="evenodd" clip-rule="evenodd" d="M113.845 119.206C114.632 119.206 115.27 118.568 115.27 117.78C115.27 116.993 114.632 116.354 113.845 116.354C113.058 116.354 112.419 116.993 112.419 117.78C112.419 118.568 113.058 119.206 113.845 119.206Z" fill="white"/>
    <rect opacity="0.522972" x="117.419" y="116.354" width="21.3775" height="2.37651" rx="1.18826" fill="#F4F6FA"/>
    <rect x="69" y="165" width="117.036" height="41" rx="8" fill="#EFEFEF"/>
    <rect opacity="0.5" x="110" y="177.886" width="55.9091" height="5.33" rx="2.665" fill="#9693B5"/>
    <rect opacity="0.5" x="110" y="188.108" width="29.8182" height="5.33" rx="2.665" fill="#9693B5"/>
    <mask id="mask1_4445:889" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="74" y="171" width="28" height="28">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M74.9636 171.709H101.828V198.574H74.9636V171.709Z" fill="white"/>
    </mask>
    <g mask="url(#mask1_4445:889)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M101.828 185.141C101.828 192.559 95.8147 198.573 88.396 198.573C80.9772 198.573 74.9636 192.559 74.9636 185.141C74.9636 177.722 80.9772 171.708 88.396 171.708C95.8147 171.708 101.828 177.722 101.828 185.141Z" fill="#BFC1CE"/>
    </g>
    </g>
    <g opacity="0.9">
    <path d="M105 35L153 83" stroke="#030047" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M141.194 56.5713C143.31 57.604 145.288 58.8971 147.084 60.4205" stroke="#030047" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M110.917 60.4212C114.745 57.22 119.354 55.0898 124.273 54.2471" stroke="#030047" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M125.667 41.0466C131.202 40.6007 136.77 41.2744 142.038 43.0276C147.307 44.7808 152.168 47.5775 156.332 51.2508" stroke="#030047" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M101.668 51.2505C105.252 48.083 109.361 45.5652 113.81 43.8105" stroke="#030047" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M120.035 69.6182C122.658 67.7549 125.795 66.7539 129.012 66.7539C132.23 66.7539 135.367 67.7549 137.99 69.6182" stroke="#030047" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M129 79.667H129.025" stroke="#030047" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    </svg>  
    `;

  return (
    <SvgXml xml={xml} width={props.width ?? getFontSize(257)} height={props.height ?? getFontSize(257)} />
  );
}
