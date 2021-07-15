import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  StatusBar,
  Platform,
} from 'react-native';
import Scroller from './moodScroller';
import {
  getEmotionsTextData,
  regularWheelSize,
  getScrollerOffset,
  setEmotionsTextData,
  initialEmotionTextData,
  getHapticStats,
  playHapticJawsTheme,
  playHapticCircusTheme,
  getScrollerWheelSize,
  longPressPopupDuration,
  mediumPressDuration,
  longPressDuration,
  setScrollerWheelSize,
  mediumWheelSize,
  largeWheelSize,
  setIsHapticsEnabledFlag,
  getIsHapticsEnabled,
} from './moodService';
import { hsv2Hex, pSBC } from './moodUtlis';
import {
  dynamicSize,
  getFontSize,
  getLineHeight,
  horizontalScale,
  iPhoneXPadding,
  isIphoneX,
} from '../../Constants/sizeChoose';
import AnonymousHeader from '../../Components/AnonymousHeader/AnonymousHeader';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '../../../assets/commonicons/CloseIcon';
import QuestionMarkIcon from '../../../assets/commonicons/QuestionMarkIcon';
import moment from 'moment';
import GetLocation from 'react-native-get-location';
import PostRequestApi from '../../apirequest/PostRequestApi';
import DeviceInfo from 'react-native-device-info';
import VideoModal from '../../Components/VideoModal/VideoModal';
import AsyncStorage from '@react-native-community/async-storage';
import {
  HealthPerm,
  Lat,
  Long,
  Moods,
  SetNotification,
  UserDetail,
  UserDivision,
  UserEmail,
  WeatherPerm,
} from '../../redux/actions/actions';
import { useRoute } from '@react-navigation/native';
import SaveMoodConfirmModal from '../../Components/Modals/SaveMoodConfirm/SaveMoodConfirmModal';
import SaveConfirmModal from '../../Components/Modals/SaveConfirmModal/SaveConfirmModal';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Geocoder from 'react-native-geocoding';
import NotificationQuestion from '../../Components/Modals/NotificationQuestion/NotificationQuestion';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import NotifService from '../../services/notifService';
import { RubikMedium } from '../../Constants/fonts/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import messaging, { firebase } from '@react-native-firebase/messaging';
import {
  defaultLocation,
  hapticsTopFlags,
  isCountryIndia,
  moodTypes,
} from '../../Constants/constants';
import { getCurrentRoute, navigate } from '../../navigator/RootNavigation';
import SkipMoodInputModal from '../../Components/Modals/SkipMoodInputModal/SkipMoodInputModal';
import Insights from '../../../assets/svg/insights';

let prevXY = { dx: 0, dy: 0 };
let moveCount = 0;
let lpX = 0;
let lpY = 0;

let isUnmounted = true;
let isMoodDetectorScreenFocused = false;
// let currentNotif = null;

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const window = Dimensions.get('window');
const scrollerWheelRadius = getScrollerWheelSize() / 2;
const screenWidth = Math.floor(window.width);

// import imagePath from '../assets/images';

export default function MoodDetector({ navigation }) {
  const [lng, setlng] = useState(false); //using in api calls
  const [lat, setlat] = useState(false); //using in api calls
  const [Loading, setLoading] = useState(false); //using in api calls
  const [MoodFail, setMoodFail] = useState(false); //not using
  const [SaveConfirm, setSaveConfirm] = useState(false); //for modal flag
  const [SaveName, setSaveName] = useState(null); //for modal flag
  const [isScreenFocused, setIsScreenFocused] = useState(false); //for modal flag
  const [
    isSaveMoodConfirmModalVisible,
    setIsSaveMoodConfirmModalVisible,
  ] = useState(false); //for modal flag
  const [
    isNotificationQuestionModalVisible,
    setIsNotificationQuestionModalVisible,
  ] = useState(false); //for remote question flag
  const [
    isSkipMoodInputModalVisible,
    setIsSkipMoodInputModalVisible,
  ] = useState(false);
  const [QuestionID, setQuestionID] = useState(null);
  const [blocksContainerSize, setBlocksContainerSize] = useState(null);
  let [toolTipData, setToolTipData] = useState({ ...initialEmotionTextData });
  const [emotionText, setEmotionText] = useState(initialEmotionTextData.text);
  const [color, setColor] = useState(toolTipData.color);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isHapticsEnabled, setisHapticsEnabled] = useState(false);
  const [hapticPosition, setHapticPosition] = useState(0);
  const [wheelSize, setWheelSize] = useState(getScrollerWheelSize());
  const [NotifData, setNotifData] = useState(null);
  const [showLongPressText, setShowLongPressText] = useState(false);
  const dispatch = useDispatch();
  const route = useRoute();
  const forceUpdate = useForceUpdate();

  const closeModal = () => {
    setModalVisible(false);
  };
  const UserData = useSelector((state) => state.First);

  const pan = useRef(
    new Animated.ValueXY({ x: screenWidth / 2, y: window.height / 2 }),
  );
  const prevEmotionData = useRef({});
  const scrollerRef = useRef(null);
  const toolTipRef = useRef(null);
  const count = useRef(1);
  const addValue = useRef(1);
  const toolTipSize = useRef(null);
  const blocksSize = useRef(null);
  const scrollerContainerSize = useRef(null);
  const screenContainerSize = useRef(null);
  const scrollerContainerRef = useRef(null);
  const screenContainerRef = useRef(null);
  const blocksContainerRef = useRef(null);
  const isInitialPanResponderUpdated = useRef(null);
  const constrainedX = useRef(null);
  const constrainedY = useRef(null);
  const offsetSize = useRef(null);
  const hapticTimeoutId = useRef(null);
  const hapticsData = useRef(null);
  const longPressPopUpTimeoutId = useRef(null);
  const mediumPressTimeoutId = useRef(null);
  const longPressTimeoutId = useRef(null);
  const previousWheelCenter = useRef(null);
  const userData = useRef(UserData);
  const wheelSizeChangeDisabled = useRef(true);
  const hsvColor = useRef({ h: 0, s: 0, v: 100 });
  const shouldPlayHaptics = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => {
        // console.log('onStartShouldSetPanResponder: ', Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1);
        return true;
      },
      onMoveShouldSetPanResponder: () => {
        // console.log('onMoveShouldSetPanResponder: ', (Math.abs(gestureState.dx) != 0 && Math.abs(gestureState.dy) != 0));
        return Math.abs(gestureState.dx) != 0 && Math.abs(gestureState.dy) != 0;
      },
      onStartShouldSetPanResponderCapture: (event, gestureState) => {
        // console.log('onStartShouldSetPanResponderCapture: ', Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1);
        setisHapticsEnabled(true);
        shouldPlayHaptics.current = true;
        const x = parseFloat(event.nativeEvent.locationX.toFixed(2));
        const y = parseFloat(event.nativeEvent.locationY.toFixed(2));
        if (getScrollerWheelSize() !== regularWheelSize) {
          clearLongPressTimeouts({
            resetWheelSize: true,
            resetLongPressText: true,
          });
        }
        if (offsetSize.current) {
          const panX = offsetSize.current.xMin + x;
          const panY = offsetSize.current.yMin + y;
          pan.current.setValue({ x: panX, y: panY });
          const left = blocksSize.current.left + x;
          const top = blocksSize.current.top + y;
          updateColorData(left, top);
        }
        if (Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1) {
          return true;
        }
        startLongPressGesture(event, gestureState);
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // console.log(
        //   'onMoveShouldSetPanResponder: ',
        //   Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1,
        // );
        // return Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1;
        return true;
      }, //true,
      // onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      //   console.log('onMoveShouldSetPanResponderCapture: ', Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1);
      //   return Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1;
      // },
      // onMoveShouldSetPanResponder: (evt, gestureState) => true,//true,
      onPanResponderGrant: (event, gestureState) => {
        // console.log(
        //   'onPanResponderGrant: ',
        //   Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1,
        // );
        pan.current.setOffset({
          x: 0,
          y: 0,
        });
        // console.log('onPanResponderGrant gesture started');
        setisHapticsEnabled(true);
        shouldPlayHaptics.current = true;

        // enlarge buubble on long press
        if (Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1) {
          return true;
        }
      },
      onPanResponderMove: (event, gestureState) => {
        const x = parseFloat(event.nativeEvent.locationX.toFixed(2));
        const y = parseFloat(event.nativeEvent.locationY.toFixed(2));
        if (!offsetSize.current) {
          return true;
        }
        const panX = offsetSize.current.xMin + x;
        const panY = offsetSize.current.yMin + y;
        const isMoved =
          Math.abs(Math.abs(prevXY.dx) - Math.abs(gestureState.dx)) >= 1 ||
          Math.abs(Math.abs(prevXY.dy) - Math.abs(gestureState.dy)) >= 1;
        if (isMoved) {
          // console.log(
          //   'isMoved: ',
          //   isMoved,
          //   'dx: ',
          //   Math.abs(Math.abs(prevXY.dx) - Math.abs(gestureState.dx)),
          //   'dy: ',
          //   Math.abs(Math.abs(prevXY.dy) - Math.abs(gestureState.dy)),
          // );
          moveCount = 0;
          if (getScrollerWheelSize() !== regularWheelSize) {
            clearLongPressTimeouts({
              mediumPressTimeoutId,
              longPressTimeoutId,
              longPressPopUpTimeoutId,
              resetLongPressText: true,
            });
            setScrollerWheelSize(regularWheelSize);
            setWheelSize(regularWheelSize);
          }
          wheelSizeChangeDisabled.current = true;
          onPanResponderMove(event, gestureState);
          pan.current.setValue({ x: panX, y: panY });
          startLongPressGesture(event, gestureState);
        } else {
          if (longPressPopUpTimeoutId.current === null && moveCount === 0) {
            startLongPressGesture(event, gestureState);
          }
          moveCount += 1;
        }
        prevXY = { dx: gestureState.dx, dy: gestureState.dy };
        return true;
      },
      onPanResponderRelease: (event, gestureState) => {
        console.log('onPanResponderRelease');
        // pan.current.flattenOffset();
        setisHapticsEnabled(false);
        shouldPlayHaptics.current = false;
        const x = parseFloat(event.nativeEvent.locationX.toFixed(2));
        const y = parseFloat(event.nativeEvent.locationY.toFixed(2));
        let panXY = { x, y };
        if (offsetSize.current) {
          let panX = offsetSize.current.xMin + x;
          let panY = offsetSize.current.yMin + y;
          panXY = { ...panXY, x: panX, y: panY };
        }
        wheelSizeChangeDisabled.current = true;
        clearLongPressTimeouts({
          mediumPressTimeoutId,
          longPressTimeoutId,
          longPressPopUpTimeoutId,
          resetLongPressText: true,
          //  resetWheelSize: true, panXY
        });
        // console.log('onPanResponderRelease screenWidth : ', screenWidth)
      },
    }),
  ).current;

  const onPanResponderMove = (event, gestureState) => {
    scrollerRef.current.measureInWindow((x, y, width, height) => {
      const left = x + scrollerWheelRadius;
      const top = y + scrollerWheelRadius;
      updateColorData(left, top, gestureState);
      // console.log("++++++ measureInWindow " + width + " " + height + " " + x + " " + y);
    });
  };

  //color wheel caluclations

  const polar = ({ locationX, locationY }) => {
    const lx = locationX,
      ly = locationY;
    if (!lx || !ly) {
      return null;
    }
    const wheelHeight = blocksSize.current?.height ?? screenWidth;
    const wheelWidth = blocksSize.current?.width ?? screenWidth;
    const [x, y] = [lx - wheelWidth / 2, ly - wheelHeight / 2];
    let deg = Math.atan2(y, x) * (-180 / Math.PI);
    // console.log('polar nativeEvent: ', nativeEvent);
    deg = 180 - (45 + deg);
    // console.log('polar deg: ', deg, x, y, lx, ly);
    return {
      // deg: (Math.atan2(y, x) * (-180 / Math.PI)),
      deg,
      // deg: 180,
      radius: Math.sqrt(y * y + x * x) / (wheelHeight / 2),
    };
  };

  const updateHueSaturation = (location) => {
    const polarData = polar(location);
    if (!polarData) {
      return;
    }
    let { deg, radius } = polarData;
    if (radius > 1) {
      radius = 1;
    }
    const h = deg,
      s = 100 * radius,
      v = hsvColor.current.v;
    const hsv = { h, s, v };
    const currentColor = hsv2Hex(hsv);
    hsvColor.current = hsv;
    setColor(hsv2Hex(hsv));
  };

  const updateColorData = (x, y, gestureState) => {
    const left = x;
    const top = y;
    updateHueSaturation({ locationX: left, locationY: y });
    previousWheelCenter.current = { left, top };
    const emotionData = getEmotionsTextData(
      top,
      left,
      prevEmotionData.current,
      userData.current,
    );
    const hapticsDataObj = getHapticStats(
      top,
      left,
      blocksSize.current,
      offsetSize.current,
    );
    hapticsData.current = hapticsDataObj;

    // console.log('emotionData => ', emotionData);
    if (prevEmotionData?.current?.text === emotionData.text) {
      const color = pSBC(count.current / 100, toolTipData.color);
      setToolTipData(Object.assign(toolTipData, { ...emotionData }));
      setEmotionText(emotionData?.text ?? '');
      // setColor(color);
      if (count.current === 40) {
        addValue.current = -1;
      }
      if (count.current === 0) {
        addValue.current = 1;
      }
      count.current = count.current + addValue.current;
    } else {
      updateOffset();
      setToolTipData(Object.assign(toolTipData, { ...emotionData }));
      setEmotionText(emotionData?.text ?? '');
      const color = pSBC(count.current / 100, emotionData.color);
      // setColor(color);
      // count.current = 1;
    }
    prevEmotionData.current = emotionData;
  };

  const startLongPressGesture = (event, gestureState) => {
    wheelSizeChangeDisabled.current = false;
    const x = parseFloat(event.nativeEvent.locationX.toFixed(2));
    const y = parseFloat(event.nativeEvent.locationY.toFixed(2));
    let newScrollerWidth =
      offsetSize.current.scrollerWidth > mediumWheelSize
        ? offsetSize.current.scrollerWidth
        : mediumWheelSize;
    let panX =
      offsetSize.current.xMin +
      offsetSize.current.scrollerWidth / 2 -
      newScrollerWidth / 2 +
      x;
    let panY =
      offsetSize.current.yMin +
      offsetSize.current.bubbleCenterOffsetTop -
      (offsetSize.current.toolTipHeight + mediumWheelSize / 2) +
      y;
    clearLongPressTimeouts({
      longPressPopUpTimeoutId,
      mediumPressTimeoutId,
      longPressTimeoutId,
    });
    longPressPopUpTimeoutId.current = setTimeout(() => {
      //longPressPopUpTimeout code
      if (wheelSize === regularWheelSize) {
        setShowLongPressText(true);
      }

      //mediumPressTimeout code
      mediumPressTimeoutId.current = setTimeout(() => {
        // console.log(
        //   'mediumPressTimeoutId: ',
        //   Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1,
        // );
        if (!wheelSizeChangeDisabled.current) {
          setScrollerWheelSize(mediumWheelSize);
          setWheelSize(mediumWheelSize);
          // pan.current.setOffset({x: 0, y: 0});
          pan.current.setValue({
            x: offsetSize.current.xMin + x,
            y: offsetSize.current.yMin + y,
          });
          forceUpdate();
          // pan.current.setValue({ x: panX, y: panY });
        }
        longPressTimeoutId.current = setTimeout(() => {
          newScrollerWidth =
            offsetSize.current.scrollerWidth > largeWheelSize
              ? offsetSize.current.scrollerWidth
              : largeWheelSize;
          if (!wheelSizeChangeDisabled.current) {
            if (offsetSize.current) {
              panX =
                offsetSize.current.xMin +
                offsetSize.current.scrollerWidth / 2 -
                newScrollerWidth / 2 +
                x;
              panY =
                offsetSize.current.yMin +
                offsetSize.current.bubbleCenterOffsetTop -
                (offsetSize.current.toolTipHeight + largeWheelSize / 2) +
                y;
            }
            setScrollerWheelSize(largeWheelSize);
            setWheelSize(largeWheelSize);
            // pan.current.setValue({ x: panX, y: panY });
            // pan.current.setOffset({ x: 0, y: 0 });
            pan.current.setValue({
              x: offsetSize.current.xMin + x,
              y: offsetSize.current.yMin + y,
            });
            setShowLongPressText(false);
          }
          clearLongPressTimeouts({ longPressTimeoutId });
        }, longPressDuration * 1000);
        clearLongPressTimeouts({ mediumPressTimeoutId });
      }, mediumPressDuration * 1000);
      clearLongPressTimeouts({ longPressPopUpTimeoutId });
    }, longPressPopupDuration * 1000);
  };

  const clearLongPressTimeouts = ({
    longPressPopUpTimeoutId,
    mediumPressTimeoutId,
    longPressTimeoutId,
    resetWheelSize,
    resetLongPressText,
    panXY,
  }) => {
    if (resetLongPressText && getScrollerWheelSize() === regularWheelSize) {
      // console.log('showLongPressText reseted');
      setShowLongPressText(false);
    }
    if (longPressPopUpTimeoutId?.current) {
      clearTimeout(longPressPopUpTimeoutId.current);
      longPressPopUpTimeoutId.current = null;
    }
    if (mediumPressTimeoutId?.current) {
      clearTimeout(mediumPressTimeoutId.current);
      mediumPressTimeoutId.current = null;
    }
    if (longPressTimeoutId?.current) {
      clearTimeout(longPressTimeoutId.current);
      longPressTimeoutId.current = null;
    }
    // console.log(
    //   'clearLongPressTimeouts =>',
    //   resetWheelSize,
    //   getScrollerWheelSize(),
    // );
    if (resetWheelSize && getScrollerWheelSize() !== regularWheelSize) {
      if (panXY) {
        // pan.current.setOffset({
        //   x: pan.current.x._value,
        //   y: pan.current.y._value
        // });
        pan.current.setValue({ x: 0, y: 0 });
        pan.current.setValue(panXY);
      }
      // console.log('setting wheelSize to Regular =>', regularWheelSize);

      setScrollerWheelSize(regularWheelSize);
      setWheelSize(regularWheelSize);
      // const timeoutId = setTimeout(() => {
      //   clearTimeout(timeoutId);
      // }, 1 * 1000);
    }
  };

  const updateOffset = () => {
    isInitialPanResponderUpdated.current = false;
    scrollerContainerSize.current = null;
    toolTipSize.current = null;
    onToolTipLayout();
    onLayoutScrollerContainer();
  };

  const SaveMood = () => {
    const id = setTimeout(() => {
      setIsSaveMoodConfirmModalVisible(false);
      const closeId = setTimeout(() => {
        navigation.replace('HomeScreen', {
          lat: lat,
          long: lng,
          screen: 'Home',
          isMoodUpdate: true,
        });
        // onClose?.();
        clearTimeout(closeId);
      }, 300);
      clearTimeout(id);
    }, 200);
  }

  const updatePanResponder = () => {
    if (
      !blocksSize.current ||
      !scrollerContainerSize.current ||
      !toolTipSize.current ||
      !screenContainerSize.current
    ) {
      return;
    }
    const isInitialUpdate = isInitialPanResponderUpdated.current === null;
    isInitialPanResponderUpdated.current = true;
    const offSetSize = getScrollerOffset(
      window,
      getScrollerWheelSize(),
      scrollerContainerSize.current,
      toolTipSize.current,
      blocksSize.current,
      screenContainerSize.current,
    );
    let { xMin, xMax, yMin, yMax, initialX, initialY } = offSetSize;
    // console.log('updatePanResponder ', offSetSize);
    offsetSize.current = offSetSize;
    constrainedX.current = pan.current.x.interpolate({
      inputRange: [xMin, 150, xMax],
      outputRange: [xMin, 150, xMax],
      extrapolate: 'clamp',
    });
    constrainedY.current = pan.current.y.interpolate({
      inputRange: [yMin, (yMax + yMin) / 2, yMax],
      outputRange: [yMin, (yMax + yMin) / 2, yMax],
      extrapolate: 'clamp',
    });
    // if (
    //   pan.current.x._value === initialX &&
    //   pan.current.y._value === initialY
    // ) {
    //   return;
    // }

    if (emotionText === initialEmotionTextData.text && isInitialUpdate) {
      pan.current.setOffset({ x: 0, y: 0 });
      pan.current.setValue({
        x: initialX,
        y: initialY,
      });
      forceUpdate();
    }
  };

  const onBlocksContainerLayout = () => {
    if (blocksSize.current) {
      return;
    }
    blocksContainerRef.current.measureInWindow((x, y, width, height) => {
      setEmotionsTextData(y, x, height, width);
      const size = { left: x, top: y, width, height };
      if (screenContainerSize.current) {
        size.top = y - screenContainerSize.current.top;
      }
      blocksSize.current = size;
      setBlocksContainerSize(size);
      // console.log('useEffect blocksSize ', blocksSize.current)
      !isInitialPanResponderUpdated.current && updatePanResponder();
    });
  };

  const onToolTipLayout = () => {
    if (toolTipSize.current) {
      return;
    }
    toolTipRef?.current?.measureInWindow((x, y, width, height) => {
      toolTipSize.current = { left: x, top: y, width, height };
      !isInitialPanResponderUpdated.current && updatePanResponder();
    });
  };

  const onLayoutScrollerContainer = () => {
    if (scrollerContainerSize.current) {
      return;
    }
    scrollerContainerRef?.current?.measureInWindow((x, y, width, height) => {
      scrollerContainerSize.current = { left: x, top: y, width, height };
      // console.log('scrollerContainerSize x,y,width,height', x, y, width, height)
      // console.log('scrollerContainerSize scrollerContainerSize.current', scrollerContainerSize.current)
      !isInitialPanResponderUpdated.current && updatePanResponder();
    });
  };

  const onLayoutScreenContainer = () => {
    if (screenContainerSize.current) {
      return;
    }
    screenContainerRef?.current?.measureInWindow((x, y, width, height) => {
      const size = { left: x, top: y, width, height };
      screenContainerSize.current = size;
      if (blocksSize.current) {
        blocksSize.current = {
          ...blocksSize.current,
          top: blocksSize.current.top - size.top,
        };
      }
      // console.log('scrollerContainerSize x,y,width,height', x, y, width, height)
      // console.log('scrollerContainerSize scrollerContainerSize.current', scrollerContainerSize.current)
      !isInitialPanResponderUpdated.current && updatePanResponder();
    });
  };

  const checkStorage = async () => {
    try {
      await AsyncStorage.setItem('Anonymous', 'true');
      // console.log(`UserData.AllMoods`, await UserData?.AllMoods[0]);
      let p = await AsyncStorage.getItem('Email');
      let d = await AsyncStorage.getItem('Division');
      let Hp = await AsyncStorage.getItem('GiveHealthPerm');
      let Wp = await AsyncStorage.getItem('GiveWeatherPerm');
      // console.log(`check check check`, JSON.parse(AsyncStorage.getItem('Email')));
      let e = await JSON.parse(p);
      let division = await JSON.parse(d);
      let HealthP = await JSON.parse(Hp);
      let WeatherP = await JSON.parse(Wp);
      console.log(`e`, e);
      console.log(`division`, division);
      console.log(`HealthPerm`, HealthP);
      console.log(`WeatherPerm`, WeatherP);
      dispatch(UserEmail(e));
      dispatch(UserDivision(division));
      dispatch(HealthPerm(HealthP));
      dispatch(WeatherPerm(WeatherP));
    } catch (error) {
      console.log('error getting AsyncStorage values', error);
    }
  };

  const getProfileUserData = () => {
    const deviceId = DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      device_id: deviceId,
      email: UserData?.UserEmail,
      user_id: UserData?.UserId,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://admin.moodflo.com/api/getStaffUserData', requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        // console.log('UserDetailsssssssssssssssss here', await result);
        await dispatch(UserDetail(result.userData));
      })
      .catch((error) => console.log('error', error));
  };

  // useEffect(() => {
  //   isUnmounted = false;

  //   PushNotification.configure({
  //     onNotification: function (notification) {
  //       if (notification?.data?.question && notification?.data?.id) {
  //         console.log(
  //           'Is it getting in here ======+++++++++=====+++++++++======+++++++++++====+++++++++++',
  //         );
  //         if (isUnmounted === false && isMoodDetectorScreenFocused === true) {
  //           setNotifData(notification);
  //           setIsNotificationQuestionModalVisible(true);
  //         }
  //         currentNotif = notification;
  //       }
  //       const currentRoute = getCurrentRoute();
  //       if (currentRoute?.name !== 'MoodEmotionDetector') {
  //         console.log('----navigate to MoodEmotionDetector----');
  //         navigate('MoodEmotionDetector');
  //       }
  //       NotifService.cancelDeliveredNotifications([String(notification.id)]);
  //       console.log('NOTIFICATION: MoodDetector', notification);
  //     },
  //   });
  //   // const data = NotifService.getLatestNotificationData();
  //   // data.finish((e) => {
  //   //   console.log(`e of test notif`, e);
  //   // });
  //   // console.log(`data fro notification`, data);
  //   // }, 1000);
  //   return () => {
  //     isUnmounted = true;
  //     currentNotif = null;
  //   };
  // }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkStorage();
      getProfileUserData();
      UserData.WeatherPermission &&
        (UserData.lat == null || UserData.lon == null) &&
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
          .then((location) => {
            const isIndia = isCountryIndia();
            if (isIndia) {
              location = {
                latitude: defaultLocation.latitude,
                longitude: defaultLocation.longitude,
              };
            }
            console.log('Success', location);
            setlat(location.latitude);
            dispatch(Lat(location.latitude));
            setlng(location.longitude);
            dispatch(Long(location.longitude));
          })
          .catch((error) => {
            const { code, message } = error;
            console.log('error', code, message);
          });
    }, 150);
    return () => {
      timeoutId && clearTimeout(timeoutId);
      isUnmounted = true;
      dispatch(SetNotification(null));
    };
  }, []);

  useEffect(() => {
    if (Array.isArray(UserData?.AllMoods) && UserData.AllMoods.length > 0) {
      userData.current = UserData;
    }
  }, [UserData]);

  const playHaptics = useCallback(() => {
    console.log('playHaptics shouldPlayHaptics.current', shouldPlayHaptics.current);
    if (shouldPlayHaptics.current) {
      const data = hapticsData.current ?? {};
      let { hapticType, timeInterval, percentage, isLeft } = data;
      if (percentage < 0) {
        setIsHapticsEnabledFlag({
          isEnabled: false,
          directionFlag: hapticsTopFlags.both,
        });
        let interval = 0.1;
        if (percentage) {
          interval = (100 - Math.abs(percentage)) / 1000;
        }
        // console.log('playHaptics isEnabled: ', isEnabled, hapticsData.current);
        // console.log('playHaptics interval: ', interval)
        // console.log('playHaptics timeInterval: ', timeInterval);
        if (hapticTimeoutId.current) {
          clearTimeout(hapticTimeoutId.current);
          hapticTimeoutId.current = null;
        }
        hapticTimeoutId.current = setTimeout(() => {
          if (hapticType && timeInterval !== -1 && percentage !== 0) {
            ReactNativeHapticFeedback.trigger(hapticType, hapticOptions);
          }
          playHaptics();
        }, timeInterval * 1000);
      } else if (percentage > 0) {
        if (isLeft === true) {
          setIsHapticsEnabledFlag({
            isEnabled: true,
            directionFlag: hapticsTopFlags.left,
          });
          playHapticJawsTheme(() => {
            getIsHapticsEnabled(true) === true && playHaptics();
          });
        } else if (isLeft === false) {
          setIsHapticsEnabledFlag({
            isEnabled: true,
            directionFlag: hapticsTopFlags.right,
          });
          playHapticCircusTheme(() => {
            getIsHapticsEnabled(false) === true && playHaptics();
          });
        }
      }
    } else {
      setIsHapticsEnabledFlag({
        isEnabled: false,
        directionFlag: hapticsTopFlags.both,
      });
      if (hapticTimeoutId.current) {
        clearInterval(hapticTimeoutId.current);
        hapticTimeoutId.current = null;
      }
    }
  }, []);

  useEffect(() => {
    // console.log('isHapticsEnabled =>', isHapticsEnabled, hapticsData.current);
    if (isHapticsEnabled) {
      playHaptics();
    } else {
      setIsHapticsEnabledFlag({
        isEnabled: false,
        directionFlag: hapticsTopFlags.both,
      });
    }

    // if (isHapticsEnabled && !hapticTimeoutId.current) {
    //   hapticTimeoutId.current = setInterval(() => {
    //     const { hapticType, timeInterval } = hapticsData.current;
    //     if (hapticType && timeInterval !== -1) {
    //       ReactNativeHapticFeedback.trigger(hapticType, hapticOptions);
    //     }
    //   }, (timeInterval * 1000));
    // } else {
    //   if (hapticTimeoutId.current) {
    //     clearInterval(hapticTimeoutId.current)
    //     hapticTimeoutId.current = null;
    //   }
    // }

    // return () => hapticTimeoutId.current && clearInterval(hapticTimeoutId.current);
  }, [isHapticsEnabled, playHaptics]);

  const showMoodSaveConfirmModal = (onClose) => {
    setIsSaveMoodConfirmModalVisible(true);
    // const id = setTimeout(() => {
    //   setIsSaveMoodConfirmModalVisible(false);
    //   const closeId = setTimeout(() => {
    //     onClose?.();
    //     clearTimeout(closeId);
    //   }, 300);
    //   clearTimeout(id);
    // }, 1000);
  };

  // console.log(`route?.params?.question`, route?.params?.question);
  // console.log(`QuestionId`, QuestionID);

  const findId = async () => {
    let mood_type = moodTypes.regular;
    if (wheelSize === mediumWheelSize) {
      mood_type = moodTypes.pretty;
    } else if (wheelSize === largeWheelSize) {
      mood_type = moodTypes.very;
    }

    let p = await AsyncStorage.getItem('MoodCount');
    // console.log(`check check check`, JSON.parse(AsyncStorage.getItem('Email')));
    let e = await JSON.parse(p);
    const fcm = await messaging().getToken();
    // console.log(`mood count`, e);

    let geocode = null;
    Geocoder.init('AIzaSyD8BafHP8VtNFGyMg4uozFJcgsBaKDxS9s');
    var state_info = '';
    var city_info = '';
    var country_info = '';
    setLoading(true);
    if (UserData.lat && UserData.lon) {
      await Geocoder.from({
        lat: UserData.lat,
        lng: UserData.lon,
      })
        .then((data) => {
          geocode = data.plus_code.compound_code;
          const address_list = data.results[0].address_components;
          for (i = 0; i < address_list.length; i++) {
            if (address_list?.[i]?.types?.includes?.('country')) {
              country_info = address_list?.[i]?.long_name ?? '';
            }
            if (
              address_list?.[i]?.types?.includes?.(
                'administrative_area_level_1',
              )
            ) {
              state_info = address_list?.[i]?.long_name ?? '';
            }
            if (
              address_list?.[i]?.types?.includes?.(
                'administrative_area_level_2',
              )
            ) {
              city_info = address_list?.[i]?.long_name ?? '';
            }
          }
        })
        .catch((err) => console.log(`weather api location err`, err));
    }
    const Id = UserData.AllMoods.find(({ name }) => {
      // console.log(`name`, name);
      return name === emotionText;
    });
    console.log(`Id`, Id);

    // console.log(`lat, lng`, UserData.lat, UserData.lon);
    const deviceId = DeviceInfo.getUniqueId();
    if (Id === undefined) {
      // console.log(`fail`);
      setLoading(false);
      setMoodFail(true);
    } else {
      setLoading(true);
      // console.log(`not fail`);
      // console.log(`Id`, Id.id);
      const isIndia = isCountryIndia();
      const params = {
        mood_id: Id.id,
        device_id: deviceId,
        mood_type,
        city: isIndia && city_info ? defaultLocation.city : city_info,
        state: isIndia && state_info ? defaultLocation.state : state_info,
        country:
          isIndia && country_info ? defaultLocation.country : country_info,
        lat: isIndia && UserData.lat ? defaultLocation.latitude : UserData.lat,
        long:
          isIndia && UserData.lon ? defaultLocation.longitude : UserData.lon,

        email: UserData.UserEmail,
        user_id: UserData.UserId,
        device_token: fcm,
        device_type: Platform.OS,
        anonymous: !UserData.Anonymous ? 0 : 1,
      };

      if (route?.params?.question != undefined || QuestionID !== null) {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        var raw = JSON.stringify({
          device_id: deviceId,
          email: UserData.UserEmail,
          pulse_question_id: route?.params?.question
            ? route?.params?.question
            : QuestionID,
          mood_id: Id.id,
          mood_type,
          is_anonymous: !UserData.Anonymous ? 0 : 1,
          user_id: UserData.UserId,
        });

        console.log(`params for updating answer --------------->`, raw);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };

        fetch('https://admin.moodflo.com/api/updateAnswer', requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log('quesstion updated', result);
            setLoading(false);
            navigation.navigate('HomeScreen', { screen: 'MicScreen' });
          })
          .catch((error) => {
            console.log('error', error);
            setLoading(false);
          });
      } else {
        console.log(`params for mood update`, params);
        PostRequestApi('moodUpdate', params)
          .then((resp) => {
            if (resp.status == 200) {
              AsyncStorage.setItem('MoodCount', JSON.stringify(e + 1));
              console.log(
                'Success Message of respose mood ✅ ✅ ✅ ✅',
                resp.data,
              );
              setLoading(false);
              // navigation.navigate('VerifyEmail', {
              //   code: resp.data.otp,
              //   mail: value,
              //   deviceID: deviceId,
              // });
              if (route?.params?.question != undefined) {
                navigation.navigate('HomeScreen', { screen: 'MicScreen' });
              } else {
                showMoodSaveConfirmModal(() => {
                  navigation.replace('HomeScreen', {
                    lat: lat,
                    long: lng,
                    screen: 'Home',
                    isMoodUpdate: true,
                  });
                });
                const notifService = new NotifService();
                notifService.checkTimeAndUpdateNotif();
              }

              // navigation.replace('HomeScreen', {
              //   lat: UserData.lat,
              //   long: UserData.lon,
              // });

              console.log(`params`, params);
            }
          })
          .catch((err) => {
            console.log(`params for err of mood`, params);
            console.log('err of response mood❌ ❌ ❌ ❌', err);
            setLoading(false);
          });
      }
    }
  };

  const savingDataWithName = () => {
    // navigation.replace('HomeScreen');

    if (!UserData.Anonymous) {
      setSaveConfirm(true);
    } else {
      findId();
    }
  };

  const verifyDone = (value) => {
    // console.log(`value-->`, value);

    if (value === 'Yes') {
      setSaveConfirm(false);
      findId();
    } else {
      setSaveConfirm(false);
    }
  };

  const verifyNotificationQuestion = (value) => {
    if (value === 'Yes') {
      setIsNotificationQuestionModalVisible(false);
      setQuestionID(NotifData?.data?.id);
    } else {
      setIsNotificationQuestionModalVisible(false);
    }
    // navigation.navigate('MoodEmotionDetector');
  };

  const cancelled = () => {
    setSaveConfirm(false);
  };

  const dismissSaveMoodConfirmModal = useCallback(() => {
    setIsSaveMoodConfirmModalVisible(false);
  }, []);

  const dismissNotificationQuestionModal = useCallback(() => {
    setIsNotificationQuestionModalVisible(false);
    navigation.navigate('HomeScreen', { screen: 'MicScreen' });
  }, []);

  const dismissSkipMoodInputModal = useCallback(() => {
    setIsSkipMoodInputModalVisible(false);
  }, []);

  const onAcceptSkipMoodInput = useCallback(() => {
    dismissSkipMoodInputModal();
    const timeoutId = setTimeout(() => {
      navigation.navigate('HomeScreen', { lat: lat, long: lng });
      clearTimeout(timeoutId);
    }, 500);
  }, [dismissSkipMoodInputModal, lat, lng, navigation]);

  const onDenySkipMoodInput = useCallback(() => {
    dismissSkipMoodInputModal();
  }, [dismissSkipMoodInputModal]);

  useFocusEffect(
    React.useCallback(() => {
      isMoodDetectorScreenFocused = true;
      setIsScreenFocused(true);
      // if(currentNotif) {
      //   setNotifData(currentNotif);
      //   setIsNotificationQuestionModalVisible(true);
      // }
      // screen isFocused
      // console.log('screen isFocused: ', isActive);

      return () => {
        // screen is out of focus
        isMoodDetectorScreenFocused = false;
        setIsScreenFocused(false);
        dispatch(SetNotification(null));
        setNotifData(null);
        // currentNotif = null;
        setWheelSize(regularWheelSize);
        setScrollerWheelSize(regularWheelSize);
        // console.log('screen is out of focus: ', isActive);
      };
    }, []),
  );

  useEffect(() => {
    isUnmounted = false;
    if (UserData.notification) {
      if (
        isScreenFocused &&
        !NotifData &&
        UserData.notification?.data?.question &&
        UserData.notification?.data?.id
      ) {
        console.log(
          'Is it getting in here ======+++++++++=====+++++++++======+++++++++++====+++++++++++',
        );
        console.log(
          'isUnmounted: ',
          isUnmounted,
          ' isMoodDetectorScreenFocused: ',
          isMoodDetectorScreenFocused,
        );
        if (isUnmounted === false) {
          setNotifData(UserData.notification);
          setIsNotificationQuestionModalVisible(true);
        }
      }
      // NotifService.cancelDeliveredNotifications([String(notification.id)]);
      console.log('NOTIFICATION: MoodDetector', UserData.notification);
    }
  }, [isScreenFocused, NotifData, UserData.notification, dispatch]);

  const setLPXY = () => {
    // pan.current.setValue({
    //   x:
    //     pan.current.x._value -
    //     (wheelSize === regularWheelSize ? 0 : getFontSize(16)),
    //   y:
    //     pan.current.y._value -
    //     (wheelSize === regularWheelSize ? 0 : getFontSize(6)),
    // });
    // forceUpdate();
  };

  const renderBlocks = () => {
    const fontSize = getFontSize(12);
    const lineHeight = getLineHeight(fontSize);
    return (
      <View
        ref={blocksContainerRef}
        onLayout={onBlocksContainerLayout}
        {...(UserData.AllMoods !== null ? panResponder.panHandlers : {})}
        style={[
          styles.childViewStyle,
          {
            backgroundColor: 'green',
            flexDirection: 'row',
            flexWrap: 'wrap',
            flex: 1,
          },
        ]}>
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="dark-content" backgroundColor={'white'} />
        )}
        <View
          pointerEvents="none"
          style={{
            height: '50%',
            width: '50%',
            backgroundColor: pSBC(0.75, color),
          }}
        />
        <View
          pointerEvents="none"
          style={{
            height: '50%',
            width: '50%',
            backgroundColor: pSBC(0.5, color),
          }}
        />
        <View
          pointerEvents="none"
          style={{
            height: '50%',
            width: '50%',
            backgroundColor: color,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            height: '50%',
            width: '50%',
            backgroundColor: pSBC(0.25, color),
          }}
        />
        {/* <View
          pointerEvents="none"
          style={{
            width: '100%',
            alignItems: 'center',
            position: 'absolute',
            bottom: 8,
            zIndex: 1,
          }}>
          <Text
            // ref={(ref) => this.passiveCalm = ref}
            style={{
              color: '#000000',
              //  left: width / 2.4,
              lineHeight: lineHeight,
              fontSize: fontSize,
            }}>
            Passive/Calm
          </Text>
        </View> */}
        {/* <View
          pointerEvents="none"
          style={{
            flexDirection: 'row',
            hieght: blocksContainerSize?.height,
            top: blocksContainerSize
              ? (blocksContainerSize.height / 2) - (lineHeight/2)
              : undefined,
            alignItems: 'center',
            position: 'absolute',
            left: 6,
            zIndex: 2,
          }}>
          <Text
            // ref={(ref) => this.negative = ref}
            style={{
              color: '#000000',
              lineHeight: lineHeight,
              fontSize: fontSize,
              // flex: 1,
              // justifyContent: 'center',
              //  top: height / 3.05,
            }}>
            Negative
          </Text>
        </View> */}
        {/* <View
          pointerEvents="none"
          style={{
            width: '100%',
            alignItems: 'center',
            position: 'absolute',
            top: 8,
            zIndex: 4,
          }}>
          <Text
            // ref={(ref) => this.activeAroused = ref}
            style={{
              color: '#000000',
              lineHeight: lineHeight,
              fontSize: fontSize,
            }}>
            Active/Aroused
          </Text>
        </View> */}
        {/* <View
          pointerEvents="none"
          style={{
            hieght: '100%',
            justifyContent: 'center',
            position: 'absolute',
            top: blocksContainerSize
              ? (blocksContainerSize.height / 2) - (lineHeight/2)
              : undefined,
            right: 6,
            zIndex: 2,
          }}>
          <Text
            // ref={(ref) => this.positive = ref}
            style={{
              color: '#000000',
              //  top: height / 3.05,
              lineHeight: lineHeight,
              fontSize: fontSize,
            }}>
            Positive
          </Text>
        </View> */}
      </View>
    );
  };

  const renderBottomBar = (color) => (
    <View
      style={{
        backgroundColor: color,
        // alignItems: 'center',
        // justifyContent: 'center',
        width: '100%',
        paddingVertical: 15,
      }}>
      <View
        style={{
          height: 80,
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{ marginLeft: 12 }}
          onPress={
            () => setIsSkipMoodInputModalVisible(true)
            // navigation.replace('HomeScreen', {
            //   lat: UserData.lat,
            //   long: UserData.lon,
            // })
          }>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Insights w={dynamicSize(52)} h={dynamicSize(52)} />

            {/* <CloseIcon width={dynamicSize(52)} height={dynamicSize(52)} /> */}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={
            UserData.AllMoods && emotionText !== 'Slide finger' ? false : true
          }
          onPress={savingDataWithName}
          style={{
            height: dynamicSize(52),
            width: dynamicSize(197),
            backgroundColor: emotionText === 'Slide finger' ? 'grey' : 'white',
            borderRadius: 17,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View />
          <Text style={{ textAlign: 'center', fontSize: 18 }}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <QuestionMarkIcon w={dynamicSize(52)} h={dynamicSize(52)} />
        </TouchableOpacity>
        {/* {MoodFail && (
          <Text style={styles.ErrorText}>Please select a mood</Text>
        )} */}
      </View>
    </View>
  );

  const topBottomColor = pSBC(0.6, color);
  // {top: blockSize.current.top - horizontalScale(25)}
  return (
    <View
      onLayout={onLayoutScreenContainer}
      ref={screenContainerRef}
      style={[styles.container, { backgroundColor: topBottomColor }]}>
      <TouchableOpacity disabled={true} style={styles.anonymousHeaderView}>
        <AnonymousHeader />
      </TouchableOpacity>
      {emotionText !== 'Slide finger' &&
        showLongPressText &&
        blocksSize?.current?.top && (
          <View
            style={{
              ...styles.holdTextView,
              top: blocksSize.current.top - horizontalScale(25),
            }}
            pointerEvents="none">
            <Text style={styles.holdText}>
              Hold longer to increase intensity
            </Text>
          </View>
        )}
      {renderBlocks()}
      {renderBottomBar(topBottomColor)}
      <Scroller
        scrollerStyle={{
          ...pan.current.getLayout(),
          ...(constrainedX.current !== null &&
            constrainedY.current !== null &&
            wheelSize === regularWheelSize
            ? { left: constrainedX.current, top: constrainedY.current }
            : {}),
        }}
        scrollerPanResponder={panResponder}
        toolTipData={toolTipData}
        emotionText={
          wheelSize === regularWheelSize || emotionText === 'Slide finger'
            ? emotionText
            : wheelSize === mediumWheelSize
              ? `Pretty ${emotionText}`
              : `Very ${emotionText}`
        }
        toolTipRef={toolTipRef}
        // forceUpdate={forceUpdate}
        forceUpdate={setLPXY}
        wheelSize={wheelSize}
        onToolTipLayout={onToolTipLayout}
        isAllMoodsDataAvailable={UserData.AllMoods !== null}
        scrollerRef={(ref) => (scrollerRef.current = ref)}
        scrollerContainerRef={scrollerContainerRef}
        onLayoutScrollerContainer={onLayoutScrollerContainer}
      // toolTipSize={toolTipSize.current}
      />

      <VideoModal
        ModalVisible={isModalVisible}
        dismissModalHandler={closeModal}
      />

      <SaveConfirmModal
        value={SaveName}
        onChangeText={setSaveName}
        modalVisible={SaveConfirm}
        dismissModalHandler={cancelled}
        verifyDone={(value) => verifyDone(value)}

      />

      <SaveMoodConfirmModal
        modalVisible={isSaveMoodConfirmModalVisible}
        dismissModalHandler={SaveMood}
        emotionText={emotionText}
        onClickButtonOne={() => SaveMood()}
      />

      <NotificationQuestion
        navigation={navigation}
        question={NotifData}
        // modalVisible={isNotificationQuestionModalVisible}
        modalVisible={isNotificationQuestionModalVisible}
        dismissModalHandler={dismissNotificationQuestionModal}
        verifyDone={(value) => verifyNotificationQuestion(value)}
      />

      <SkipMoodInputModal
        modalVisible={isSkipMoodInputModalVisible}
        dismissModalHandler={dismissSkipMoodInputModal}
        onClickButtonOne={onAcceptSkipMoodInput}
        onClickButtonTwo={onDenySkipMoodInput}
      />

      {Loading && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childViewStyle: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#F5FCFF',
    borderStyle: 'solid',
  },
  ErrorText: {
    fontWeight: '300',
    letterSpacing: 0.2,
    fontSize: 12,
    marginTop: 0,
    marginLeft: screenWidth / 3,
    // marginRight: 62,
    textAlign: 'center',
    color: 'red',
    position: 'absolute',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  anonymousHeaderView: {
    zIndex: -99999,
    // position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: horizontalScale(25),
    marginBottom: horizontalScale(37),
  },
  holdTextView: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: horizontalScale(12),
    // marginBottom: -horizontalScale(25),
    zIndex: 8,
  },
  holdText: {
    color: '#FFFFFF',
    fontSize: getFontSize(15),
    margin: horizontalScale(17),
    fontFamily: RubikMedium,
  },
});
