import {
  Dimensions
} from 'react-native';
import { horizontalScale, iPhoneXPadding, isIphoneX, verticalScale } from '../../Constants/sizeChoose';
const { width, height } = Dimensions.get('window');

export const scrollerWheelSize = horizontalScale(74);
height - 132
width - 93.75

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
  "exited": {  //12
    "top": [verticalScale(169), verticalScale(301)],
    "left": [horizontalScale(281.25), horizontalScale(375)],
    "text": "Exited",
    "color": "#72A602",
    "img": "exited"
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
  if(!top || !left || !height || !width){
    return;
  }
  const blockWidth = width / 4;
  const blockHeight = height / 4;
  const [h1, h2, h3, h4, h5] = [top, top + blockHeight, top + (blockHeight * 2), top + (blockHeight * 3), top + height];
  const [w1, w2, w3, w4, w5] = [left, left + blockWidth, left + (blockWidth * 2), left + (blockWidth * 3), left + width]
  function getTopForIndex(idx) {
    if(idx === 0 || idx === 4 || idx === 8 || idx === 12){
      return [h1, h2];
    } else if(idx === 1 || idx === 5 || idx === 9 || idx === 13){
      return [h2, h3];
    } else if(idx === 2 || idx === 6 || idx === 10 || idx === 14){
      return [h3, h4];
    } else if(idx === 3 || idx === 7 || idx === 11 || idx === 15){
      return [h4, h5];
    }
  }
  function getLeftForIndex(idx) {
    if(idx === 0 || idx === 1 || idx === 2 || idx === 3){
      return [w1, w2];
    } else if(idx === 4 || idx === 5 || idx === 6 || idx === 7){
      return [w2, w3];
    } else if(idx === 8 || idx === 9 || idx === 10 || idx === 11){
      return [w3, w4];
    } else if(idx === 12 || idx === 13 || idx === 14 || idx === 15){
      return [w4, w5];
    }
  }
  Object.keys(emotionsTextData).forEach((e, idx) => {
    emotionsTextData[e].top = getTopForIndex(idx);
    emotionsTextData[e].left = getLeftForIndex(idx);
  })

}

export const getEmotionsTextData = (top, left, emotionData = null, userData) => {
  if (top >= emotionsTextData.sad.top[0] && top <= emotionsTextData.sad.top[1] && left >= emotionsTextData.sad.left[0] && left <= emotionsTextData.sad.left[1]) {
    return { ...emotionsTextData.sad, img: userData?.AllMoods?.[0]?.icon };
  }
  if (top >= emotionsTextData.flat.top[0] && top <= emotionsTextData.flat.top[1] && left >= emotionsTextData.flat.left[0] && left <= emotionsTextData.flat.left[1]) {
    return { ...emotionsTextData.flat, img: userData?.AllMoods?.[1]?.icon };
  }
  if (top >= emotionsTextData.wired.top[0] && top <= emotionsTextData.wired.top[1] && left >= emotionsTextData.wired.left[0] && left <= emotionsTextData.wired.left[1]) {
    return { ...emotionsTextData.wired, img: userData?.AllMoods?.[2]?.icon };
  }
  if (top >= emotionsTextData.anxious.top[0] && top <= emotionsTextData.anxious.top[1] && left >= emotionsTextData.anxious.left[0] && left <= emotionsTextData.anxious.left[1]) {
    return { ...emotionsTextData.anxious, img: userData?.AllMoods?.[3]?.icon };
  }
  if (top >= emotionsTextData.angry.top[0] && top <= emotionsTextData.angry.top[1] && left >= emotionsTextData.angry.left[0] && left <= emotionsTextData.angry.left[1]) {
    return { ...emotionsTextData.angry, img: userData?.AllMoods?.[4]?.icon };
  }
  if (top >= emotionsTextData.rattled.top[0] && top <= emotionsTextData.rattled.top[1] && left >= emotionsTextData.rattled.left[0] && left <= emotionsTextData.rattled.left[1]) {
    return { ...emotionsTextData.rattled, img: userData?.AllMoods?.[5]?.icon };
  }
  if (top >= emotionsTextData.spent.top[0] && top <= emotionsTextData.spent.top[1] && left >= emotionsTextData.spent.left[0] && left <= emotionsTextData.spent.left[1]) {
    return { ...emotionsTextData.spent, img: userData?.AllMoods?.[6]?.icon };
  }
  if (top >= emotionsTextData.tired.top[0] && top <= emotionsTextData.tired.top[1] && left >= emotionsTextData.tired.left[0] && left <= emotionsTextData.tired.left[1]) {
    return { ...emotionsTextData.tired, img: userData?.AllMoods?.[7]?.icon };
  }
  if (top >= emotionsTextData.pumped.top[0] && top <= emotionsTextData.pumped.top[1] && left >= emotionsTextData.pumped.left[0] && left <= emotionsTextData.pumped.left[1]) {
    return { ...emotionsTextData.pumped, img: userData?.AllMoods?.[8]?.icon };
  }
  if (top >= emotionsTextData.stoked.top[0] && top <= emotionsTextData.stoked.top[1] && left >= emotionsTextData.stoked.left[0] && left <= emotionsTextData.stoked.left[1]) {
    return { ...emotionsTextData.stoked, img: userData?.AllMoods?.[9]?.icon };
  }
  if (top >= emotionsTextData.sharp.top[0] && top <= emotionsTextData.sharp.top[1] && left >= emotionsTextData.sharp.left[0] && left <= emotionsTextData.sharp.left[1]) {
    return { ...emotionsTextData.sharp, img: userData?.AllMoods?.[10]?.icon };
  }
  if (top >= emotionsTextData.alert.top[0] && top <= emotionsTextData.alert.top[1] && left >= emotionsTextData.alert.left[0] && left <= emotionsTextData.alert.left[1]) {
    return { ...emotionsTextData.alert, img: userData?.AllMoods?.[11]?.icon };
  }
  if (top >= emotionsTextData.exited.top[0] && top <= emotionsTextData.exited.top[1] && left >= emotionsTextData.exited.left[0] && left <= emotionsTextData.exited.left[1]) {
    return { ...emotionsTextData.exited, img: userData?.AllMoods?.[12]?.icon };
  }
  if (top >= emotionsTextData.happy.top[0] && top <= emotionsTextData.happy.top[1] && left >= emotionsTextData.happy.left[0] && left <= emotionsTextData.happy.left[1]) {
    return { ...emotionsTextData.happy, img: userData?.AllMoods?.[13]?.icon };
  }
  if (top >= emotionsTextData.chilled.top[0] && top <= emotionsTextData.chilled.top[1] && left >= emotionsTextData.chilled.left[0] && left <= emotionsTextData.chilled.left[1]) {
    return { ...emotionsTextData.chilled, img: userData?.AllMoods?.[14]?.icon };
  }
  if (top >= emotionsTextData.content.top[0] && top <= emotionsTextData.content.top[1] && left >= emotionsTextData.content.left[0] && left <= emotionsTextData.content.left[1]) {
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

export const getScrollerOffset = (screenSize = window, scrollerWheelSize, scrollerContainerSize, blocksSize) => {
  const isLandscape = screenSize.width > screenSize.height;
  const extraVerticalPadding = isLandscape && Platform.OS === 'android' ? 0 : 0;
  const paddingHorizontal = isLandscape ? getLandscapePaddingHorizontal() : getPortraitPaddingHorizontal();
  const paddingVertical = isLandscape ? getLandscapePaddingVertical() : getPortraitPaddingVertical();
  console.log('getScrollerOffset scrollContainerSize', scrollerContainerSize)
  console.log('getScrollerOffset blocksSize', blocksSize)
  console.log('getScrollerOffset scrollerWheelSize', scrollerWheelSize)
  const yMin = blocksSize?.top;
  const yMax = (blocksSize?.top ?? 0) + (blocksSize?.height ?? 0) - (scrollerContainerSize?.height ?? 0);
  const xMin = 0;
  const xMax = screenSize.width - scrollerWheelSize - paddingHorizontal;
  const initialX = xMax / 2;
  const initialY = yMax / 2;
  return {
    xMin,
    xMax,
    yMin,
    yMax,
    initialX,
    initialY
  }
}

export const getInitialLocalY = (screenSize = window, scrollerWheelSize, scrollerContainerSize, blocksSize) => {
  return getScrollerOffset(screenSize, scrollerWheelSize, scrollerContainerSize, blocksSize).initialY;
}
export const getInitialLocalX = (screenSize = window, scrollerWheelSize, scrollerContainerSize, blocksSize) => {
  return getScrollerOffset(screenSize, scrollerWheelSize, scrollerContainerSize, blocksSize).initialX;
}