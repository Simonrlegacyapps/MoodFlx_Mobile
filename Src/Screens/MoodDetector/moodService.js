import { Dimensions } from 'react-native';
import { hapticsConfigs, hapticsTopFlags } from '../../Constants/constants';
import {
  horizontalScale,
  iPhoneXPadding,
  isIphoneX,
  verticalScale,
} from '../../Constants/sizeChoose';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const regularWheelSize = 74;
export const mediumWheelSize = regularWheelSize * 2.5;
export const largeWheelSize = regularWheelSize * 3.5;
let scrollerWheelSize = regularWheelSize;
export const longPressPopupDuration = 0.2;
export const mediumPressDuration = 0.8;
export const longPressDuration = 1;
let isLeftHapticsEnabled = false;
let isRightHapticsEnabled = false;
let jawsThemeCount = 0;
let circusThemeCount = 0;

export const setScrollerWheelSize = (size) => {
  scrollerWheelSize = size;
};

export const getScrollerWheelSize = () => scrollerWheelSize;

export const setIsHapticsEnabledFlag = ({ isEnabled, directionFlag }) => {
  console.log('setIsHapticsEnabledFlag =>', isEnabled, directionFlag);
  if (directionFlag === hapticsTopFlags.both) {
    jawsThemeCount = 0;
    circusThemeCount = 0;
    isLeftHapticsEnabled = false;
    isRightHapticsEnabled = false;
  } else if (directionFlag === hapticsTopFlags.left) {
    isLeftHapticsEnabled = isEnabled;
    !isEnabled && (jawsThemeCount = 0);
  } else if (directionFlag === hapticsTopFlags.right) {
    isRightHapticsEnabled = isEnabled;
    !isEnabled && (circusThemeCount = 0);
  }
};

export const getIsHapticsEnabled = (isLeft) =>
  isLeft ? isLeftHapticsEnabled : isRightHapticsEnabled;

export const regularWheelSizeArray = [
  regularWheelSize * 0.25,
  regularWheelSize * 0.5,
  regularWheelSize * 0.75,
  regularWheelSize,
];

export const mediumWheelSizeArray = [
  mediumWheelSize * 0.2,
  mediumWheelSize * 0.45,
  mediumWheelSize * 0.7,
  mediumWheelSize,
];

export const largeWheelSizeArray = [
  largeWheelSize * 0.15,
  largeWheelSize * 0.35,
  largeWheelSize * 0.65,
  largeWheelSize,
];
// height - 132
// width - 93.75

export const initialEmotionTextData = {
  //i am using
  top: null,
  left: null,
  name: 'Slide finger',
  color: '#bfcfdc',
  img: '',
};

let emotionsTextData = {
  upset: {
    //0
    top: [verticalScale(169), verticalScale(301)],
    left: [horizontalScale(0), horizontalScale(93.75)],
    name: 'Upset',
    color: '#1B5083',
    img: '',
  },
  anxious: {
    //1
    top: [verticalScale(301), verticalScale(433)],
    left: [horizontalScale(0), horizontalScale(93.75)],
    name: 'Anxious',
    color: '#00407A',
    img: '',
  },
  sad: {
    //2
    top: [verticalScale(433), verticalScale(565)],
    left: [horizontalScale(0), horizontalScale(93.75)],
    name: 'Sad',
    color: '#B87F04',
    img: '',
  },
  tired: {
    //3
    top: [verticalScale(565), verticalScale(697)],
    left: [horizontalScale(0), horizontalScale(93.75)],
    name: 'Tired',
    color: '#DA9602',
    img: '',
  },
  cranky: {
    //4
    top: [verticalScale(169), verticalScale(301)],
    left: [horizontalScale(93.75), horizontalScale(187.5)],
    name: 'Cranky',
    color: '#A0181F',
    img: '',
  },
  wired: {
    //5
    top: [verticalScale(302), verticalScale(433)],
    left: [horizontalScale(93.75), horizontalScale(187.5)],
    name: 'Wired',
    color: '#8F151C',
    img: '',
  },
  flat: {
    //6
    top: [verticalScale(434), verticalScale(565)],
    left: [horizontalScale(93.75), horizontalScale(187.5)],
    name: 'Flat',
    color: '#2A7CA7',
    img: '',
  },
  spent: {
    //7
    top: [verticalScale(566), verticalScale(697)],
    left: [horizontalScale(93.75), horizontalScale(187.5)],
    name: 'Spent',
    color: '#50A4D3',
    img: '',
  },
  pumped: {
    //8
    top: [verticalScale(169), verticalScale(301)],
    left: [horizontalScale(187.5), horizontalScale(281.25)],
    name: 'Pumped',
    color: '#699400',
    img: '',
  },
  stoked: {
    //9
    top: [verticalScale(301), verticalScale(433)],
    left: [horizontalScale(187.5), horizontalScale(281.25)],
    name: 'Stoked',
    color: '#118F00',
    img: '',
  },
  cool: {
    //10
    top: [verticalScale(433), verticalScale(565)],
    left: [horizontalScale(187.5), horizontalScale(281.25)],
    name: 'Cool',
    color: '#BBA502',
    img: '',
  },
  chilled: {
    //11
    top: [verticalScale(565), verticalScale(697)],
    left: [horizontalScale(187.5), horizontalScale(281.25)],
    name: 'Chilled',
    color: '#E0C400',
    img: '',
  },
  excited: {
    //12
    top: [verticalScale(169), verticalScale(301)],
    left: [horizontalScale(281.25), horizontalScale(375)],
    name: 'Excited',
    color: '#72A602',
    img: '',
  },
  happy: {
    //13
    top: [verticalScale(302), verticalScale(433)],
    left: [horizontalScale(281.25), horizontalScale(375)],
    name: 'Happy',
    color: '#3EA135',
    img: '',
  },
  content: {
    //14
    top: [verticalScale(434), verticalScale(565)],
    left: [horizontalScale(281.25), horizontalScale(375)],
    name: 'Content',
    color: '#4FD99C',
    img: '',
  },
  relaxed: {
    //15
    top: [verticalScale(566), verticalScale(697)],
    left: [horizontalScale(281.25), horizontalScale(375)],
    name: 'Relaxed',
    color: '#87E8C3',
    img: '',
  },
};

export const setEmotionsTextData = (top, left, height, width, allMoods) => {
  // console.log('setEmotionTextData called');
  // console.log('top: ', top, ' left: ', left, ' height: ', height, ' width: ', width, ' screenHeight: ', screenHeight, ' screenWidth: ', screenWidth);
  if (
    top === undefined ||
    left === undefined ||
    height === undefined ||
    width === undefined ||
    !Array.isArray(allMoods) ||
    allMoods.length < 16
  ) {
    // console.log(
    //   'setEmotionsTextData ===> false',
    //   ' top ---: ',
    //   top,
    //   ' left====: ',
    //   left,
    //   ' height=====: ',
    //   height,
    //   ' width====: ',
    //   width,
    //   'allMoods ===>',
    //   'allMoods',
    // );
    return;
  }
  const blockWidth = width / 4;
  const blockHeight = height / 4;
  // console.log('top: ', top, ' left: ', left, ' height: ', height, ' width: ', width, ' blockWidth: ', blockWidth, 'blockHeight: ', blockHeight, ' screenHeight: ', screenHeight, ' screenWidth: ', screenWidth);
  const [h1, h2, h3, h4, h5] = [
    top,
    top + blockHeight,
    top + blockHeight * 2,
    top + blockHeight * 3,
    top + height,
  ];
  const [w1, w2, w3, w4, w5] = [
    left,
    left + blockWidth,
    left + blockWidth * 2,
    left + blockWidth * 3,
    left + width,
  ];
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
  let data = {};
  let flag = true;
  allMoods.forEach((e, idx) => {
    if (typeof e?.name !== 'string') {
      flag = false;
    } else {
      data[e.name] = e;
    }
  });
  if (flag === true) {
    emotionsTextData = null;
    emotionsTextData = {...data};
  }
  Object.keys(emotionsTextData).forEach((e, idx) => {
    let [y1, y2] = getTopForIndex(idx);
    let [x1, x2] = getLeftForIndex(idx);
    emotionsTextData[e].top = [Math.round(y1), Math.round(y2)];
    emotionsTextData[e].left = [Math.round(x1), Math.round(x2)];
    // emotionsTextData[e].top = [parseFloat(y1.toFixed(2)), parseFloat(y2.toFixed(2))];
    // emotionsTextData[e].left = [parseFloat(x1.toFixed(2)), parseFloat(x2.toFixed(2))];
  });
  // console.log('emotionTextData', emotionsTextData);
};

export const getEmotionsTextData = (y, x, emotionData = null, userData) => {
  let top = Math.round(y);
  let left = Math.round(x);
  // console.log('top: ', top, 'left: ', left,)
  if (
    typeof userData?.AllMoods?.[0]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[0].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[0].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[0].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[0].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[0].name]};
  }
  if (
    typeof userData?.AllMoods?.[1]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[1].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[1].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[1].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[1].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[1].name]};
  }
  if (
    typeof userData?.AllMoods?.[2]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[2].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[2].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[2].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[2].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[2].name]};
  }
  if (
    typeof userData?.AllMoods?.[3]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[3].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[3].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[3].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[3].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[3].name]};
  }
  if (
    typeof userData?.AllMoods?.[4]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[4].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[4].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[4].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[4].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[4].name]};
  }
  if (
    typeof userData?.AllMoods?.[5]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[5].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[5].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[5].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[5].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[5].name]};
  }
  if (
    typeof userData?.AllMoods?.[6]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[6].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[6].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[6].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[6].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[6].name]};
  }
  if (
    typeof userData?.AllMoods?.[7]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[7].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[7].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[7].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[7].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[7].name]};
  }
  if (
    typeof userData?.AllMoods?.[8]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[8].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[8].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[8].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[8].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[8].name]};
  }
  if (
    typeof userData?.AllMoods?.[9]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[9].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[9].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[9].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[9].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[9].name]};
  }
  if (
    typeof userData?.AllMoods?.[10]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[10].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[10].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[10].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[10].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[10].name]};
  }
  if (
    typeof userData?.AllMoods?.[11]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[11].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[11].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[11].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[11].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[11].name]};
  }
  if (
    typeof userData?.AllMoods?.[12]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[12].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[12].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[12].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[12].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[12].name]};
  }
  if (
    typeof userData?.AllMoods?.[13]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[13].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[13].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[13].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[13].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[13].name]};
  }
  if (
    typeof userData?.AllMoods?.[14]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[14].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[14].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[14].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[14].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[14].name]};
  }
  if (
    typeof userData?.AllMoods?.[15]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[15].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[15].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[15].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[15].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[15].name]};
  }
  //rattled
  return emotionData;
};

const isIphoneXFlag = isIphoneX;
const getLandscapePaddingHorizontal = () => {
  return isIphoneXFlag
    ? iPhoneXPadding.landscape.paddingLeft +
    iPhoneXPadding.landscape.paddingRight
    : 0;
};
const getPortraitPaddingHorizontal = () => {
  return isIphoneXFlag
    ? iPhoneXPadding.portrait.paddingLeft + iPhoneXPadding.portrait.paddingRight
    : 0;
};
const getLandscapePaddingVertical = () => {
  return isIphoneXFlag
    ? iPhoneXPadding.landscape.paddingBottom +
    iPhoneXPadding.landscape.paddingTop
    : 0;
};

const getPortraitPaddingVertical = () => {
  return isIphoneXFlag
    ? iPhoneXPadding.portrait.paddingBottom + iPhoneXPadding.portrait.paddingTop
    : 0;
};

const getLandscapePaddingTop = () => {
  return isIphoneXFlag ? iPhoneXPadding.landscape.paddingTop : 0;
};

const getPortraitPaddingTop = () => {
  return isIphoneXFlag ? iPhoneXPadding.portrait.paddingTop : 0;
};

export const getScrollerOffset = (
  screenSize = window,
  scrollerWheelSize,
  scrollerContainerSize,
  toolTipSize,
  blocksSize,
  screenContainerSize,
) => {
  const isLandscape = screenSize.width > screenSize.height;
  const extraVerticalPadding = Platform.OS === 'android' ? verticalScale(0) : 0;
  const paddingHorizontal = isLandscape
    ? getLandscapePaddingHorizontal()
    : getPortraitPaddingHorizontal();
  const paddingVertical = isLandscape
    ? getLandscapePaddingVertical()
    : getPortraitPaddingVertical();
  const paddingTop = isLandscape
    ? getLandscapePaddingTop()
    : getPortraitPaddingTop();
  // const paddingTop = isIphoneXFlag ? (isLandscape ? iPhoneXPadding.landscape.paddingTop : iPhoneXPadding.portrait.paddingTop) : 0;
  // const paddingTop = isIphoneXFlag ? (isLandscape ? iPhoneXPadding.landscape.paddingTop : screenContainerSize.top) : 0;
  // const paddingBottom = isIphoneXFlag ? (isLandscape ? iPhoneXPadding.landscape.paddingBottom : iPhoneXPadding.portrait.paddingBottom) : 0;
  // console.log('offset paddingTop', paddingTop, isIphoneXFlag);
  // scrollerContainerSize.height = 117.1;
  // scrollerContainerSize.width = 104.7;
  // console.log('getScrollerOffset => screenSize: ', screenSize, ' scrollerWheelSize: ', scrollerWheelSize, ' scrollerContainerSize: ', scrollerContainerSize, ' toolTipSize: ', toolTipSize, ' blocksSize: ', blocksSize);
  // console.log('getScrollerOffset paddingTop', paddingTop)
  // console.log('getScrollerOffset paddingVertical', paddingVertical)
  const toolTipHeight = toolTipSize.height - 10;
  const scrollerHeight = toolTipHeight + scrollerWheelSize;
  const scrollerWidth =
    toolTipSize.width > scrollerWheelSize
      ? toolTipSize.width
      : scrollerWheelSize;
  const bubbleCenterOffsetTop = toolTipHeight + scrollerWheelSize / 2;
  // console.log('getScrollerOffset scrollerHeight', scrollerHeight)
  const yMin = blocksSize?.top - extraVerticalPadding - bubbleCenterOffsetTop;
  const yMax = yMin + (blocksSize?.height ?? 0);
  const xMin = 0 - scrollerWidth / 2;
  const xMax = screenSize.width - scrollerWidth / 2 - paddingHorizontal;
  const initialX = (blocksSize.width - blocksSize.left) / 2 - scrollerWidth / 2;
  const initialY = yMin + blocksSize.height / 2;
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
    bubbleCenterOffsetTop,
  };
};

export const getHapticStats = (y, x, blocksSize, offsetSize) => {
  let hapticType = '';
  let timeInterval = -1;
  let percentage = 0;
  let isLeft = false;
  if (y < blocksSize.top) {
    return { hapticType, timeInterval, percentage, isLeft };
  } else if (y > blocksSize.top + blocksSize.height) {
    return { hapticType, timeInterval, percentage, isLeft };
  }
  const yPosInBlock = y - blocksSize.top;
  const blockSizeHalf = blocksSize.height / 2;
  percentage = 100 - Math.round((yPosInBlock / blockSizeHalf) * 100);
  let interval = (100 - Math.abs(percentage)) / 1000;
  let fifteenPercent = (interval * 1000 * 15) / 100;
  if (percentage > 0 && percentage <= 27) {
    hapticType = hapticsConfigs.car.light;
    timeInterval = (0.2 * 1000 + interval * 1000) / 1000;
  } else if (percentage > 27 && percentage <= 54) {
    hapticType = hapticsConfigs.car.medium;
    timeInterval = (0.2 * 1000 + interval * 1000) / 1000;
  } else if (percentage > 54 && percentage <= 100) {
    // hapticType = hapticsConfigs.car.high;
    hapticType = hapticsConfigs.car.medium;
    timeInterval = (0.01 * 1000 + interval * 1000) / 1000;
    // timeInterval = ((interval * 1000) + fifteenPercent) / 1000;
  } else if (percentage < 0 && percentage >= -27) {
    hapticType = hapticsConfigs.heartBeat.light;
    timeInterval = (0.7 * 1000 + interval * 1000) / 1000;
  } else if (percentage < -27 && percentage >= -54) {
    hapticType = hapticsConfigs.heartBeat.light;
    timeInterval = (0.6 * 1000 + interval * 1000) / 1000;
  } else if (percentage < -54 && percentage >= -100) {
    hapticType = hapticsConfigs.heartBeat.light;
    timeInterval = (0.5 * 1000 + interval * 1000) / 1000;
  }
  // console.log('getHapticStats percentage', percentage);
  // console.log('getHapticStats hapticType', hapticType);
  // console.log('getHapticStats timeInterval', timeInterval);
  if (x < screenWidth / 2) {
    isLeft = true;
  }
  return { hapticType, timeInterval, percentage, isLeft };
};

export const playHapticJawsTheme = (callback) => {
  setIsHapticsEnabledFlag({
    isEnabled: false,
    directionFlag: hapticsTopFlags.right,
  });
  if (!getIsHapticsEnabled(true)) {
    return;
  }
  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: true,
  };

  let timeoutId = null;
  let c = 0;
  function playHaptics(count) {
    if (!getIsHapticsEnabled(true)) {
      return;
    }
    if (c === 0) {
      ReactNativeHapticFeedback.trigger(hapticsConfigs.car.high, hapticOptions);
      c++;
    }
    if (c <= count) {
      let playHapticsTimeoutId = setTimeout(() => {
        if (getIsHapticsEnabled(true)) {
          ReactNativeHapticFeedback.trigger(
            hapticsConfigs.car.high,
            hapticOptions,
          );
        }
        clearTimeout(playHapticsTimeoutId);
        playHapticsTimeoutId = null;
        c++;
        playHaptics(count);
      }, 700);
    }
  }

  if (jawsThemeCount <= 3) {
    timeoutId = setTimeout(() => {
      if (getIsHapticsEnabled(true)) {
        c = 0;
        playHaptics(8);
        jawsThemeCount++;
      }
      clearTimeout(timeoutId);
      timeoutId = null;
      callback?.();
    }, (jawsThemeCount === 0 ? 0 : 1) * 1000);
  } else {
    timeoutId = setTimeout(() => {
      if (getIsHapticsEnabled(true)) {
        c = 0;
        playHaptics(3);
        jawsThemeCount++;
      }
      clearTimeout(timeoutId);
      timeoutId = null;
      callback?.();
    }, (jawsThemeCount === 4 ? 1.2 : 0.5) * 1000);
  }
};

export const playHapticCircusTheme = (callback) => {
  setIsHapticsEnabledFlag({
    isEnabled: false,
    directionFlag: hapticsTopFlags.left,
  });
  if (!getIsHapticsEnabled(false)) {
    return;
  }
  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: true,
  };

  let timeoutId = null;
  let c = 0;
  function playHaptics(count) {
    // for (let i = 0; i <= count; i++) {
    //   ReactNativeHapticFeedback.trigger(hapticsConfigs.car.high, hapticOptions);
    // }
    if (!getIsHapticsEnabled(false)) {
      return;
    }
    if (c === 0) {
      ReactNativeHapticFeedback.trigger(hapticsConfigs.car.high, hapticOptions);
      c++;
    }
    if (c <= count) {
      let playHapticsTimeoutId = setTimeout(() => {
        if (getIsHapticsEnabled(false)) {
          ReactNativeHapticFeedback.trigger(
            hapticsConfigs.car.high,
            hapticOptions,
          );
        }
        clearTimeout(playHapticsTimeoutId);
        playHapticsTimeoutId = null;
        c++;
        playHaptics(count);
      }, 700);
    }
  }

  if (circusThemeCount <= 1 || circusThemeCount >= 3) {
    timeoutId = setTimeout(() => {
      if (getIsHapticsEnabled(false)) {
        c = 0;
        playHaptics(1);
        if (circusThemeCount === 6) {
          circusThemeCount = -1;
        } else if (circusThemeCount === -1) {
          circusThemeCount = 1;
        } else {
          circusThemeCount++;
        }
      }
      clearTimeout(timeoutId);
      timeoutId = null;
      callback?.();
    }, (circusThemeCount === 0 ? 0 : circusThemeCount === -1 ? 0.6 : circusThemeCount === 3 ? 0.7 : 0.5) * 1000);
  } else {
    timeoutId = setTimeout(() => {
      if (getIsHapticsEnabled(false)) {
        c = 0;
        playHaptics(5);
        circusThemeCount++;
      }
      clearTimeout(timeoutId);
      timeoutId = null;
      callback?.();
    }, 0.5 * 1000);
  }

  // timeoutId = setTimeout(() => {
  //   if (getIsHapticsEnabled(false)) {
  //     playHaptics(2);
  //     circusThemeCount++;
  //     circusThemeCount === 6 && (circusThemeCount = 1);
  //   }
  //   clearTimeout(timeoutId);
  //   timeoutId = null;
  //   callback?.();
  // }, (circusThemeCount === 0 ? 0 : (circusThemeCount >= 4 && circusThemeCount <= 7) ? 0.2 : 0.6) * 1000);
};
