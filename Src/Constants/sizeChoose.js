import React from 'react';
import { Platform, Dimensions, PixelRatio } from 'react-native';

const { height, width } = Dimensions.get('window')
import { hasNotch } from 'react-native-device-info';

export const dynamicSize = (size) => {
  const percentage = (size / 812) * 100
  return (percentage * height) / 100
}

export const metrics = {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
}

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
    width === 896 ||
    hasNotch());

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
export function getFontSize(size) {
  const newSize = horizontalScale(size)
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export function getLineHeight(fontSize) {
  const multiplier = (fontSize > 20) ? 1.5 : 1;
  return parseInt(fontSize + (fontSize * multiplier), 10);
}
