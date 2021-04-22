import {
    Dimensions
  } from 'react-native';
import { horizontalScale, iPhoneXPadding, isIphoneX, verticalScale } from '../../Constants/sizeChoose';
  const { width, height } = Dimensions.get('window');
  
  
  export const emotionsTextData = {
    "exited": {  //1
      "top": [verticalScale(317), verticalScale(342)],
      "left": [horizontalScale(257), horizontalScale(282)],
      "text": "Exited",
      "color": "#8ac803",
      "img": "exited"
    },
    "happy": {  //2
      "top": [verticalScale(232), verticalScale(257)],
      "left": [horizontalScale(228), horizontalScale(253)],
      "text": "Happy",
      "color": "#4fc644",
      "img": ""
    },
    "stoked": {  //3
      "top": [verticalScale(365), verticalScale(390)],
      "left": [horizontalScale(237), horizontalScale(262)],
      "text": "Stoked",
      "color": "#14aa00",
      "img": ""
    },
    "pumped": {  //4
      "top": [verticalScale(360), verticalScale(385)],
      "left": [horizontalScale(307), horizontalScale(332)],
      "text": "Pumped",
      "color": "#7daf00",
      "img": ""
    },
    "content": {  //5
      "top": [verticalScale(626), verticalScale(651)],
      "left": [horizontalScale(301), horizontalScale(326)],
      "text": "Content",
      "color": "#c9f4e3",
      "img": ""
    },
    "alert": {  //7
      "top": [verticalScale(633), verticalScale(658)],
      "left": [horizontalScale(227), horizontalScale(252)],
      "text": "Alert",
      "color": "#ffe52e",
      "img": ""
    },
    "chilled": {  //6
      "top": [verticalScale(490), verticalScale(515)],
      "left": [horizontalScale(226), horizontalScale(251)],
      "text": "Chilled",
      "color": "#96e8c4",
      "img": ""
    },
    "sharp": {  //7
      "top": [verticalScale(484), verticalScale(509)],
      "left": [horizontalScale(305), horizontalScale(330)],
      "text": "Sharp",
      "color": "#e6cb02",
      "img": ""
    },
    "anxious": {  //8
      "top": [verticalScale(628), verticalScale(653)],
      "left": [horizontalScale(49), horizontalScale(74)],
      "text": "Anxious",
      "color": "#fdbb29",
      "img": ""
    },
    "tired": {  //9
      "top": [verticalScale(616), verticalScale(641)],
      "left": [horizontalScale(123), horizontalScale(148)],
      "text": "Tired",
      "color": "#9ecce6",
      "img": ""
    },
    "wired": {  //10
      "top": [verticalScale(486), verticalScale(511)],
      "left": [horizontalScale(43), horizontalScale(68)],
      "text": "Wired",
      "color": "#e29b03",
      "img": ""
    },
    "spent": {  //11
      "top": [verticalScale(490), verticalScale(515)],
      "left": [horizontalScale(123), horizontalScale(148)],
      "text": "Spent",
      "color": "#47a2d1",
      "img": ""
    },
    "sad": {  //12
      "top": [verticalScale(369), verticalScale(394)],
      "left": [horizontalScale(113), horizontalScale(138)],
      "text": "Sad",
      "color": "#2773be",
      "img": ""
    },
    "angry": {  //13
      "top": [verticalScale(234), verticalScale(259)],
      "left": [horizontalScale(45), horizontalScale(70)],
      "text": "Angry",
      "color": "#fe322c",
      "img": ""
    },
    "furious": {  //14
      "top": [verticalScale(360), verticalScale(385)],
      "left": [horizontalScale(48), horizontalScale(73)],
      "text": "Furious",
      "color": "#e40002",
      "img": ""
    },
    "flat": {  //15
      "top": [verticalScale(234), verticalScale(259)],
      "left": [horizontalScale(123), horizontalScale(148)],
      "text": "Flat",
      "color": "#00569d",
      "img": ""
    },
  }
  
  export const getEmotionsTextData = (top, left, emotionData = null) => {
    if (top >= emotionsTextData.exited.top[0] && top <= emotionsTextData.exited.top[1] && left >= emotionsTextData.exited.left[0] && left <= emotionsTextData.exited.left[1]) {
      return emotionsTextData.exited;
    }
    if (top >= emotionsTextData.happy.top[0] && top <= emotionsTextData.happy.top[1] && left >= emotionsTextData.happy.left[0] && left <= emotionsTextData.happy.left[1]) {
      return emotionsTextData.happy;
    }
    if (top >= emotionsTextData.stoked.top[0] && top <= emotionsTextData.stoked.top[1] && left >= emotionsTextData.stoked.left[0] && left <= emotionsTextData.stoked.left[1]) {
      return emotionsTextData.stoked;
    }
    if (top >= emotionsTextData.pumped.top[0] && top <= emotionsTextData.pumped.top[1] && left >= emotionsTextData.pumped.left[0] && left <= emotionsTextData.pumped.left[1]) {
      return emotionsTextData.pumped;
    }
    if (top >= emotionsTextData.content.top[0] && top <= emotionsTextData.content.top[1] && left >= emotionsTextData.content.left[0] && left <= emotionsTextData.content.left[1]) {
      return emotionsTextData.content;
    }
    if (top >= emotionsTextData.alert.top[0] && top <= emotionsTextData.alert.top[1] && left >= emotionsTextData.alert.left[0] && left <= emotionsTextData.alert.left[1]) {
      return emotionsTextData.alert;
    }
    if (top >= emotionsTextData.chilled.top[0] && top <= emotionsTextData.chilled.top[1] && left >= emotionsTextData.chilled.left[0] && left <= emotionsTextData.chilled.left[1]) {
      return emotionsTextData.chilled;
    }
    if (top >= emotionsTextData.sharp.top[0] && top <= emotionsTextData.sharp.top[1] && left >= emotionsTextData.sharp.left[0] && left <= emotionsTextData.sharp.left[1]) {
      return emotionsTextData.sharp;
    }
    if (top >= emotionsTextData.anxious.top[0] && top <= emotionsTextData.anxious.top[1] && left >= emotionsTextData.anxious.left[0] && left <= emotionsTextData.anxious.left[1]) {
      return emotionsTextData.anxious;
    }
    if (top >= emotionsTextData.tired.top[0] && top <= emotionsTextData.tired.top[1] && left >= emotionsTextData.tired.left[0] && left <= emotionsTextData.tired.left[1]) {
      return emotionsTextData.tired;
    }
    if (top >= emotionsTextData.wired.top[0] && top <= emotionsTextData.wired.top[1] && left >= emotionsTextData.wired.left[0] && left <= emotionsTextData.wired.left[1]) {
      return emotionsTextData.wired;
    }
    if (top >= emotionsTextData.spent.top[0] && top <= emotionsTextData.spent.top[1] && left >= emotionsTextData.spent.left[0] && left <= emotionsTextData.spent.left[1]) {
      return emotionsTextData.spent;
    }
    if (top >= emotionsTextData.sad.top[0] && top <= emotionsTextData.sad.top[1] && left >= emotionsTextData.sad.left[0] && left <= emotionsTextData.sad.left[1]) {
      return emotionsTextData.sad;
    }
    if (top >= emotionsTextData.angry.top[0] && top <= emotionsTextData.angry.top[1] && left >= emotionsTextData.angry.left[0] && left <= emotionsTextData.angry.left[1]) {
      return emotionsTextData.angry;
    }
    if (top >= emotionsTextData.furious.top[0] && top <= emotionsTextData.furious.top[1] && left >= emotionsTextData.furious.left[0] && left <= emotionsTextData.furious.left[1]) {
      return emotionsTextData.furious;
    }
    if (top >= emotionsTextData.flat.top[0] && top <= emotionsTextData.flat.top[1] && left >= emotionsTextData.flat.left[0] && left <= emotionsTextData.flat.left[1]) {
      return emotionsTextData.flat;
    }
  
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
 
 const getScrollerOffset = (screenSize = window, scrollerWheelSize) => {
   const isLandscape = screenSize.width > screenSize.height;
   const extraVerticalPadding = isLandscape && Platform.OS === 'android' ? 0 : 0;
   const paddingHorizontal = isLandscape ? getLandscapePaddingHorizontal() : getPortraitPaddingHorizontal();
   const paddingVertical = isLandscape ? getLandscapePaddingVertical() : getPortraitPaddingVertical();
   const xMin = 0;
   const xMax = screenSize.width - scrollerWheelSize - paddingHorizontal;
   const yMinPadding = (Platform.OS === 'ios' && !isLandscape) ? (isIphoneX ? 44 : 20) : 0;
   const yMinWithHeader = ((isIphoneX && !isLandscape) ? 88 : 55) - yMinPadding;
   const yMinWithoutHeader = 0;
   const yMaxWithControls = screenSize.height - paddingVertical - scrollerWheelSize - extraVerticalPadding;
   const yMaxWithoutControls = screenSize.height - paddingVertical - scrollerWheelSize - extraVerticalPadding;
   return {
     xMin,
     xMax,
     yMinWithHeader,
     yMinWithoutHeader,
     yMaxWithControls,
     yMaxWithoutControls
   }
 }
 
 const getInitialLocalY = (screenSize = window) => {
   return getScrollerOffset(screenSize).yMinWithoutHeader;
 }
 const getInitialLocalX = (screenSize = window) => {
   return getScrollerOffset(screenSize).xMax;
 }