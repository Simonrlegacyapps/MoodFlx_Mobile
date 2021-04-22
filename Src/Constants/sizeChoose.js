import React from 'react';
import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window')

export const dynamicSize = (size) => {
    const percentage = (size / 812) * 100
    return (percentage * height) / 100
}

import { Platform, Dimensions, PixelRatio } from 'react-native';

export const PLATFORM = {
  ANDROID: 'android',
  IOS: 'ios',
  MATERIAL: 'material',
  WEB: 'web'
};


export const isIphoneX =
  Platform.OS === PLATFORM.IOS &&
  (height === 812 ||
    width === 812 ||
    height === 896 ||
    width === 896);

export const iPhoneXPadding = {
    portrait: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 34,
        paddingTop: 44,
    },
    landscape: {
        paddingLeft: 44,
        paddingRight: 44,
        paddingBottom: 24,
        paddingTop: 0,
    }
}


  //Guideline sizes are based on standard ~5" screen mobile device
  const guidelineBaseWidth = 375;
  const guidelineBaseHeight = 812;
  
  export const horizontalScale = size => (width / guidelineBaseWidth) * size;
  export const verticalScale = size => (height / guidelineBaseHeight) * size;
  const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;