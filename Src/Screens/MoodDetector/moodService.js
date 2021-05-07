import {
  Dimensions
} from 'react-native';
import { hapticsConfigs } from '../../Constants/constants';
import { horizontalScale, iPhoneXPadding, isIphoneX, verticalScale } from '../../Constants/sizeChoose';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const regularWheelSize = 74
export const mediumWheelSize = regularWheelSize * 2.5;
export const largeWheelSize = regularWheelSize * 3.5;
let scrollerWheelSize = regularWheelSize;
export const mediumPressDuration = 1.5;
export const longPressDuration = 2.5;

export const setScrollerWheelSize = (size) => {
  scrollerWheelSize = size
}

export const getScrollerWheelSize = (size) => scrollerWheelSize;
// height - 132
// width - 93.75

export const initialEmotionTextData = {  //i am using
  "top": null,
  "left": null,
  "text": "Slide finger",
  "color": "#bfcfdc",
  "img": ""
}

let emotionsTextData = {
  "sad": {  //0
    "top": [verticalScale(169), verticalScale(301)],
    "left": [horizontalScale(0), horizontalScale(93.75)],
    "text": "Sad",
    "color": "#1B5083",
    "img": ""
  },
  "flat": {  //1
    "top": [verticalScale(301), verticalScale(433)],
    "left": [horizontalScale(0), horizontalScale(93.75)],
    "text": "Flat",
    "color": "#00407A",
    "img": ""
  },
  "wired": {  //2
    "top": [verticalScale(433), verticalScale(565)],
    "left": [horizontalScale(0), horizontalScale(93.75)],
    "text": "Wired",
    "color": "#B87F04",
    "img": ""
  },
  "anxious": {  //3
    "top": [verticalScale(565), verticalScale(697)],
    "left": [horizontalScale(0), horizontalScale(93.75)],
    "text": "Anxious",
    "color": "#DA9602",
    "img": ""
  },
  "angry": {  //4
    "top": [verticalScale(169), verticalScale(301)],
    "left": [horizontalScale(93.75), horizontalScale(187.5)],
    "text": "Angry",
    "color": "#A0181F",
    "img": ""
  },
  "rattled": {  //5
    "top": [verticalScale(302), verticalScale(433)],
    "left": [horizontalScale(93.75), horizontalScale(187.5)],
    "text": "Rattled",
    "color": "#8F151C",
    "img": ""
  },
  "spent": {  //6
    "top": [verticalScale(434), verticalScale(565)],
    "left": [horizontalScale(93.75), horizontalScale(187.5)],
    "text": "Spent",
    "color": "#2A7CA7",
    "img": ""
  },
  "tired": {  //7
    "top": [verticalScale(566), verticalScale(697)],
    "left": [horizontalScale(93.75), horizontalScale(187.5)],
    "text": "Tired",
    "color": "#50A4D3",
    "img": ""
  },
  "pumped": {  //8
    "top": [verticalScale(169), verticalScale(301)],
    "left": [horizontalScale(187.5), horizontalScale(281.25)],
    "text": "Pumped",
    "color": "#699400",
    "img": ""
  },
  "stoked": {  //9
    "top": [verticalScale(301), verticalScale(433)],
    "left": [horizontalScale(187.5), horizontalScale(281.25)],
    "text": "Stoked",
    "color": "#118F00",
    "img": ""
  },
  "sharp": {  //10
    "top": [verticalScale(433), verticalScale(565)],
    "left": [horizontalScale(187.5), horizontalScale(281.25)],
    "text": "Sharp",
    "color": "#BBA502",
    "img": ""
  },
  "alert": {  //11
    "top": [verticalScale(565), verticalScale(697)],
    "left": [horizontalScale(187.5), horizontalScale(281.25)],
    "text": "Alert",
    "color": "#E0C400",
    "img": ""
  },
  "excited": {  //12
    "top": [verticalScale(169), verticalScale(301)],
    "left": [horizontalScale(281.25), horizontalScale(375)],
    "text": "Excited",
    "color": "#72A602",
    "img": ""
  },
  "happy": {  //13
    "top": [verticalScale(302), verticalScale(433)],
    "left": [horizontalScale(281.25), horizontalScale(375)],
    "text": "Happy",
    "color": "#3EA135",
    "img": ""
  },
  "chilled": {  //14
    "top": [verticalScale(434), verticalScale(565)],
    "left": [horizontalScale(281.25), horizontalScale(375)],
    "text": "Chilled",
    "color": "#4FD99C",
    "img": ""
  },
  "content": {  //15
    "top": [verticalScale(566), verticalScale(697)],
    "left": [horizontalScale(281.25), horizontalScale(375)],
    "text": "Content",
    "color": "#87E8C3",
    "img": ""
  },
}



export const setEmotionsTextData = (top, left, height, width) => {
  // console.log('setEmotionTextData called');
  // console.log('top: ', top, ' left: ', left, ' height: ', height, ' width: ', width, ' screenHeight: ', screenHeight, ' screenWidth: ', screenWidth);
  if (top === undefined || left === undefined || height === undefined || width === undefined) {
    return;
  }
  const blockWidth = width / 4;
  const blockHeight = height / 4;
  // console.log('top: ', top, ' left: ', left, ' height: ', height, ' width: ', width, ' blockWidth: ', blockWidth, 'blockHeight: ', blockHeight, ' screenHeight: ', screenHeight, ' screenWidth: ', screenWidth);
  const [h1, h2, h3, h4, h5] = [top, top + blockHeight, top + (blockHeight * 2), top + (blockHeight * 3), top + height];
  const [w1, w2, w3, w4, w5] = [left, left + blockWidth, left + (blockWidth * 2), left + (blockWidth * 3), left + width]
  function getTopForIndex(idx) {
    if (idx === 0 || idx === 4 || idx === 8 || idx === 12) {
      return [h1, h2];
    } else if (idx === 1 || idx === 5 || idx === 9 || idx === 13) {
      return [h2, h3];
    } else if (idx === 2 || idx === 6 || idx === 10 || idx === 14) {
      return [h3, h4];
    } else if (idx === 3 || idx === 7 || idx === 11 || idx === 15) {
      return [h4, h5];
    }
  }
  function getLeftForIndex(idx) {
    if (idx === 0 || idx === 1 || idx === 2 || idx === 3) {
      return [w1, w2];
    } else if (idx === 4 || idx === 5 || idx === 6 || idx === 7) {
      return [w2, w3];
    } else if (idx === 8 || idx === 9 || idx === 10 || idx === 11) {
      return [w3, w4];
    } else if (idx === 12 || idx === 13 || idx === 14 || idx === 15) {
      return [w4, w5];
    }
  }
  Object.keys(emotionsTextData).forEach((e, idx) => {
    let [y1, y2] = getTopForIndex(idx);
    let [x1, x2] = getLeftForIndex(idx);
    emotionsTextData[e].top = [Math.round(y1), Math.round(y2)];
    emotionsTextData[e].left = [Math.round(x1), Math.round(x2)];
    // emotionsTextData[e].top = [parseFloat(y1.toFixed(2)), parseFloat(y2.toFixed(2))];
    // emotionsTextData[e].left = [parseFloat(x1.toFixed(2)), parseFloat(x2.toFixed(2))];
  })
  // console.log('emotionTextData', emotionsTextData);
}

export const getEmotionsTextData = (y, x, emotionData = null, userData) => {
  let top = Math.round(y);
  let left = Math.round(x);
  // console.log('top: ', top, 'left: ', left,)
  if (top > emotionsTextData.sad.top[0] && top < emotionsTextData.sad.top[1] && left > emotionsTextData.sad.left[0] && left < emotionsTextData.sad.left[1]) {
    return { ...emotionsTextData.sad, img: userData?.AllMoods?.[0]?.icon };
  }
  if (top > emotionsTextData.flat.top[0] && top < emotionsTextData.flat.top[1] && left > emotionsTextData.flat.left[0] && left < emotionsTextData.flat.left[1]) {
    return { ...emotionsTextData.flat, img: userData?.AllMoods?.[1]?.icon };
  }
  if (top > emotionsTextData.wired.top[0] && top < emotionsTextData.wired.top[1] && left > emotionsTextData.wired.left[0] && left < emotionsTextData.wired.left[1]) {
    return { ...emotionsTextData.wired, img: userData?.AllMoods?.[2]?.icon };
  }
  if (top > emotionsTextData.anxious.top[0] && top < emotionsTextData.anxious.top[1] && left > emotionsTextData.anxious.left[0] && left < emotionsTextData.anxious.left[1]) {
    // console.log('anxious left: ', left, ' anxious: ', emotionsTextData.anxious, ' gestureState: ', gestureState)
    return { ...emotionsTextData.anxious, img: userData?.AllMoods?.[3]?.icon };
  }
  if (top > emotionsTextData.angry.top[0] && top < emotionsTextData.angry.top[1] && left > emotionsTextData.angry.left[0] && left < emotionsTextData.angry.left[1]) {
    return { ...emotionsTextData.angry, img: userData?.AllMoods?.[4]?.icon };
  }
  if (top > emotionsTextData.rattled.top[0] && top < emotionsTextData.rattled.top[1] && left > emotionsTextData.rattled.left[0] && left < emotionsTextData.rattled.left[1]) {
    return { ...emotionsTextData.rattled, img: userData?.AllMoods?.[5]?.icon };
  }
  if (top > emotionsTextData.spent.top[0] && top < emotionsTextData.spent.top[1] && left > emotionsTextData.spent.left[0] && left < emotionsTextData.spent.left[1]) {
    return { ...emotionsTextData.spent, img: userData?.AllMoods?.[6]?.icon };
  }
  if (top > emotionsTextData.tired.top[0] && top < emotionsTextData.tired.top[1] && left > emotionsTextData.tired.left[0] && left < emotionsTextData.tired.left[1]) {
    // console.log('tired left: ', left, ' tired: ', emotionsTextData.tired, ' gestureState: ', gestureState)
    return { ...emotionsTextData.tired, img: userData?.AllMoods?.[7]?.icon };
  }
  if (top > emotionsTextData.pumped.top[0] && top < emotionsTextData.pumped.top[1] && left > emotionsTextData.pumped.left[0] && left < emotionsTextData.pumped.left[1]) {
    // console.log('pumped left: ', left, ' pumped: ', emotionsTextData.pumped, ' gestureState: ', gestureState)
    return { ...emotionsTextData.pumped, img: userData?.AllMoods?.[8]?.icon };
  }
  if (top > emotionsTextData.stoked.top[0] && top < emotionsTextData.stoked.top[1] && left > emotionsTextData.stoked.left[0] && left < emotionsTextData.stoked.left[1]) {
    return { ...emotionsTextData.stoked, img: userData?.AllMoods?.[9]?.icon };
  }
  if (top > emotionsTextData.sharp.top[0] && top < emotionsTextData.sharp.top[1] && left > emotionsTextData.sharp.left[0] && left < emotionsTextData.sharp.left[1]) {
    return { ...emotionsTextData.sharp, img: userData?.AllMoods?.[10]?.icon };
  }
  if (top > emotionsTextData.alert.top[0] && top < emotionsTextData.alert.top[1] && left > emotionsTextData.alert.left[0] && left < emotionsTextData.alert.left[1]) {
    return { ...emotionsTextData.alert, img: userData?.AllMoods?.[11]?.icon };
  }
  if (top > emotionsTextData.excited.top[0] && top < emotionsTextData.excited.top[1] && left > emotionsTextData.excited.left[0] && left < emotionsTextData.excited.left[1]) {
    // console.log('excited left: ', left, ' excited: ', emotionsTextData.excited, ' gestureState: ', gestureState)
    return { ...emotionsTextData.excited, img: userData?.AllMoods?.[12]?.icon };
  }
  if (top > emotionsTextData.happy.top[0] && top < emotionsTextData.happy.top[1] && left > emotionsTextData.happy.left[0] && left < emotionsTextData.happy.left[1]) {
    return { ...emotionsTextData.happy, img: userData?.AllMoods?.[13]?.icon };
  }
  if (top > emotionsTextData.chilled.top[0] && top < emotionsTextData.chilled.top[1] && left > emotionsTextData.chilled.left[0] && left < emotionsTextData.chilled.left[1]) {
    return { ...emotionsTextData.chilled, img: userData?.AllMoods?.[14]?.icon };
  }
  if (top > emotionsTextData.content.top[0] && top < emotionsTextData.content.top[1] && left > emotionsTextData.content.left[0] && left < emotionsTextData.content.left[1]) {
    return { ...emotionsTextData.content, img: userData?.AllMoods?.[15]?.icon };
  }
  //rattled
  return emotionData;
}

const isIphoneXFlag = isIphoneX;
const getLandscapePaddingHorizontal = () => {
  return (isIphoneXFlag ? (iPhoneXPadding.landscape.paddingLeft + iPhoneXPadding.landscape.paddingRight) : 0);
}
const getPortraitPaddingHorizontal = () => {
  return isIphoneXFlag ? (iPhoneXPadding.portrait.paddingLeft + iPhoneXPadding.portrait.paddingRight) : 0;
}
const getLandscapePaddingVertical = () => {
  return isIphoneXFlag ? (iPhoneXPadding.landscape.paddingBottom + iPhoneXPadding.landscape.paddingTop) : 0;
}
const getPortraitPaddingVertical = () => {
  return (isIphoneXFlag ? (iPhoneXPadding.portrait.paddingBottom + iPhoneXPadding.portrait.paddingTop) : 0);
}

export const getScrollerOffset = (screenSize = window, scrollerWheelSize, scrollerContainerSize, toolTipSize, blocksSize) => {
  const isLandscape = screenSize.width > screenSize.height;
  const extraVerticalPadding = Platform.OS === 'android' ? verticalScale(0) : 0;
  const paddingHorizontal = isLandscape ? getLandscapePaddingHorizontal() : getPortraitPaddingHorizontal();
  const paddingVertical = isLandscape ? getLandscapePaddingVertical() : getPortraitPaddingVertical();
  const paddingTop = isIphoneXFlag ? (isLandscape ? iPhoneXPadding.landscape.paddingTop : iPhoneXPadding.portrait.paddingTop) : 0;
  const paddingBottom = isIphoneXFlag ? (isLandscape ? iPhoneXPadding.landscape.paddingBottom : iPhoneXPadding.portrait.paddingBottom) : 0;
  // scrollerContainerSize.height = 117.1;
  // scrollerContainerSize.width = 104.7;
  // console.log('getScrollerOffset => screenSize: ', screenSize, ' scrollerWheelSize: ', scrollerWheelSize, ' scrollerContainerSize: ', scrollerContainerSize, ' toolTipSize: ', toolTipSize, ' blocksSize: ', blocksSize);
  // console.log('getScrollerOffset paddingTop', paddingTop)
  // console.log('getScrollerOffset paddingVertical', paddingVertical)
  const toolTipHeight = toolTipSize.height - 10;
  const scrollerHeight = toolTipHeight + scrollerWheelSize;
  const scrollerWidth = toolTipSize.width > scrollerWheelSize ? toolTipSize.width : scrollerWheelSize;
  const bubbleCenterOffsetTop = toolTipHeight + (scrollerWheelSize / 2);
  // console.log('getScrollerOffset scrollerHeight', scrollerHeight)
  const yMin = blocksSize?.top - paddingTop - extraVerticalPadding - bubbleCenterOffsetTop;
  const yMax = yMin + (blocksSize?.height ?? 0);
  const xMin = 0 - scrollerWidth / 2;
  const xMax = screenSize.width - (scrollerWidth / 2) - paddingHorizontal;
  const initialX = ((blocksSize.width - blocksSize.left) / 2) - (scrollerWidth / 2);
  const initialY = yMin + (blocksSize.height / 2);
  return {
    xMin,
    xMax,
    yMin,
    yMax,
    initialX,
    initialY,
    scrollerWidth,
    toolTipHeight,
    scrollerHeight,
    bubbleCenterOffsetTop
  }
}

export const getHapticStats = (y, blocksSize, offsetSize) => {
  let hapticType = '';
  let timeInterval = -1;
  let percentage = 0;
  if (y < blocksSize.top) {
    return { hapticType, timeInterval, percentage };
  } else if (y > (blocksSize.top + blocksSize.height)) {
    return { hapticType, timeInterval, percentage };
  }
  const yPosInBlock = y - blocksSize.top;
  const blockSizeHalf = blocksSize.height / 2;
  percentage = 100 - Math.round((yPosInBlock / blockSizeHalf) * 100);
  let interval = (100 - (Math.abs(percentage))) / 1000;
  let fifteenPercent = ((interval * 1000) * 15) / 100;
  if (percentage > 0 && percentage <= 27) {
    hapticType = hapticsConfigs.car.light;
    timeInterval = ((0.2 * 1000) + (interval * 1000)) / 1000;;
  } else if (percentage > 27 && percentage <= 54) {
    hapticType = hapticsConfigs.car.medium;
    timeInterval = ((0.2 * 1000) + (interval * 1000)) / 1000;;
  } else if (percentage > 54 && percentage <= 100) {
    // hapticType = hapticsConfigs.car.high;
    hapticType = hapticsConfigs.car.medium;
    timeInterval = ((0.01 * 1000) + (interval * 1000)) / 1000;;
    // timeInterval = ((interval * 1000) + fifteenPercent) / 1000;
  } else if (percentage < 0 && percentage >= -27) {
    hapticType = hapticsConfigs.heartBeat.light;
    timeInterval = ((0.7 * 1000) + (interval * 1000)) / 1000;
  } else if (percentage < -27 && percentage >= -54) {
    hapticType = hapticsConfigs.heartBeat.light;
    timeInterval = ((0.6 * 1000) + (interval * 1000)) / 1000;
  } else if (percentage < -54 && percentage >= -100) {
    hapticType = hapticsConfigs.heartBeat.light;
    timeInterval = ((0.5 * 1000) + (interval * 1000)) / 1000;
  }
  // console.log('getHapticStats percentage', percentage);
  // console.log('getHapticStats hapticType', hapticType);
  // console.log('getHapticStats timeInterval', timeInterval);
  return { hapticType, timeInterval, percentage };
}
