/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {SvgXml} from 'react-native-svg';
import {View} from 'react-native';

export function BitCoinIcon(props) {
  const xml = `
    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.57512 8.1651C4.57512 9.8701 5.95512 11.2501 7.66012 11.2501C9.36512 11.2501 10.7451 9.8701 10.7451 8.1651C10.7451 6.4601 9.36512 5.08008 7.66012 5.08008C7.58012 5.08008 7.50512 5.08509 7.42012 5.09009C5.90512 5.20509 4.69512 6.41508 4.58012 7.93008C4.58012 8.00508 4.57512 8.0801 4.57512 8.1651Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.24992 4.83548C1.24992 6.54048 2.62992 7.9205 4.33492 7.9205H4.57992C4.69492 6.4055 5.90492 5.19548 7.41992 5.08048V4.83548C7.41992 3.13048 6.03992 1.75049 4.33492 1.75049C2.62992 1.75049 1.24992 3.13048 1.24992 4.83548Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg> 
  `;

  return (
    <View style={props.style}>
      <SvgXml
        xml={xml}
        width={props.w ? props.w : 12}
        height={props.h ? props.h : 12}
      />
    </View>
  );
}
