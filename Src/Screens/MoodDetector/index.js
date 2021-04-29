import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import Scroller from './moodScroller';
import {
  getEmotionsTextData,
  regularWheelSize,
  getScrollerOffset,
  setEmotionsTextData,
  initialEmotionTextData,
  getHapticStats,
  getScrollerWheelSize,
  mediumPressDuration,
  longPressDuration,
  setScrollerWheelSize,
  mediumWheelSize,
  largeWheelSize,
} from './moodService';
import { pSBC } from './moodUtlis';
import { dynamicSize, iPhoneXPadding, isIphoneX } from '../../Constants/sizeChoose';
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
  UserDetail,
  UserDivision,
  UserEmail,
  WeatherPerm,
} from '../../redux/actions/actions';
import { useRoute } from '@react-navigation/native';
import SaveConfirmModal from '../../Components/Modals/SaveConfirmModal/SaveConfirmModal';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Geocoder from 'react-native-geocoding';

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
  // const [locationX, setLocationX] = useState(width / 2); //pan
  // const [locationY, setLocationY] = useState(height / 2 + height / 80); //pan
  // const [ShowDraggable, setShowDraggable] = useState(true); //not using
  // const [Location, setLocation] = useState([]); //not using
  // const [Moving, setMoving] = useState(false); //not using
  // const [Anonymous, setAnonymous] = useState(false); //not using
  // const [Label, setLabel] = useState('Slide finger'); //emotionText
  // const [startTime, setstartTime] = useState(0); //long press time caluclation to enlarge bubble not using currently
  // const [EndTime, setEndTime] = useState(0); //long press time caluclation to enlarge bubble not using currently
  // const [StatusVertical, setStatusVertical] = useState(0); //for status bar height
  // const [GetMoods, setGetMoods] = useState(null); //not using
  // const [Svgs, setSvgs] = useState(''); //icon
  const [lng, setlng] = useState(false); //using in api calls
  const [lat, setlat] = useState(false); //using in api calls
  const [Email, setEmail] = useState(null); //using in api calls
  const [Loading, setLoading] = useState(false); //using in api calls
  const [MoodFail, setMoodFail] = useState(false); //not using
  const [SaveConfirm, setSaveConfirm] = useState(false); //for modal flag
  const [SaveName, setSaveName] = useState(null); //for modal flag
  const [X0, setX0] = useState(0); //not using
  const [Y0, setY0] = useState(0); //not using
  const [blocksContainerSize, setBlocksContainerSize] = useState(null) //i am using
  let [toolTipData, setToolTipData] = useState(initialEmotionTextData); //i am usin
  const [emotionText, setEmotionText] = useState(toolTipData.text); //i am using
  const [color, setColor] = useState(toolTipData.color); //i am using
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const route = useRoute();
  const forceUpdate = useForceUpdate();

  const closeModal = () => {
    setModalVisible(false);
  };
  const UserData = useSelector((state) => state.First);

  const pan = useRef(new Animated.ValueXY());
  const prevEmotionData = useRef({});
  const scrollerRef = useRef(null);
  const toolTipRef = useRef(null);
  const count = useRef(1);
  const addValue = useRef(1);
  const toolTipSize = useRef(null);
  const blocksSize = useRef(null);
  const scrollerContainerSize = useRef(null);
  const scrollerContainerRef = useRef(null);
  const blocksContainerRef = useRef(null);
  const isInitialPanResponderUpdated = useRef(null);
  const constrainedX = useRef(null);
  const constrainedY = useRef(null);
  const offsetSize = useRef(null);
  const hapticTimeoutId = useRef(null);
  const mediumPressTimeoutId = useRef(null);
  const longPressTimeoutId = useRef(null);
  const previousWheelCenter = useRef(null);
  const newScrollerContainerPosition = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => {
        return true;
      },
      onStartShouldSetPanResponderCapture: (event, gestureState) => {
        const x = parseFloat(event.nativeEvent.locationX.toFixed(2));
        const y = parseFloat(event.nativeEvent.locationY.toFixed(2));
        if (offsetSize.current) {
          const panX = offsetSize.current.xMin + x;
          const panY = offsetSize.current.yMin + y;
          pan.current.setValue({ x: panX, y: panY });
          const left = blocksSize.current.left + x;
          const top = blocksSize.current.top + y;
          updateColorData(left, top);
        }
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => { return Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1 },//true,
      // onMoveShouldSetPanResponder: (evt, gestureState) => true,//true,
      onPanResponderGrant: (event, gestureState) => {
        pan.current.setOffset({
          x: pan.current.x._value,
          y: pan.current.y._value
        });
        pan.current.setValue({ x: 0, y: 0 });
        // clearLongPressTimeouts({mediumPressTimeoutId, longPressTimeoutId});
        // mediumPressTimeoutId.current = setTimeout(() => {
        //   updateOffsetOnChangeWheelSize(mediumWheelSize, () => {
        //     setScrollerWheelSize(mediumWheelSize);
        //     forceUpdate();
        //   });

        //   // clearLongPressTimeouts({mediumPressTimeoutId});
        // }, mediumPressDuration * 1000);
        // longPressTimeoutId.current = setTimeout(() => {
        //   updateOffsetOnChangeWheelSize(largeWheelSize, () => {
        //     setScrollerWheelSize(largeWheelSize);
        //     forceUpdate();
        //   });
        //   // clearLongPressTimeouts({longPressTimeoutId});
        // }, longPressDuration * 1000);
      },
      onPanResponderMove: (event, gestureState) => {
        pan.current.setValue({ x: gestureState.dx, y: gestureState.dy });
        // console.log('pan.current.getLayout => ', pan.current.getLayout());
        onPanResponderMove(event, gestureState);
        // if(Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1){
        //   clearLongPressTimeouts({mediumPressTimeoutId, longPressTimeoutId, resetWheelSize: true});
        // }
      },
      onPanResponderRelease: (event, gestureState) => {
        pan.current.flattenOffset();
        // clearLongPressTimeouts({mediumPressTimeoutId, longPressTimeoutId, resetWheelSize: true});
        // console.log('onPanResponderRelease screenWidth : ', screenWidth)
      },
    })
  ).current;

  const onPanResponderMove = (event, gestureState) => {
    scrollerRef.current.measureInWindow((x, y, width, height) => {
      const left = x + scrollerWheelRadius;
      const top = y + scrollerWheelRadius;
      const { hapticType, timeInterval } = getHapticStats(top, blocksSize.current, offsetSize.current);
      // if(!hapticTimeoutId.current && hapticType && timeInterval) {
      //   hapticTimeoutId.current = setTimeout(() => {
      //     ReactNativeHapticFeedback.trigger(hapticType, hapticOptions);
      //     if(hapticTimeoutId.current){
      //       clearTimeout(hapticTimeoutId.current)
      //       hapticTimeoutId.current = null;
      //     }
      //   }, (timeInterval * 1000));
      // } else if(timeInterval === -1){
      //   if(hapticTimeoutId.current){
      //     clearTimeout(hapticTimeoutId.current)
      //     hapticTimeoutId.current = null;
      //   }
      // }
      updateColorData(left, top, gestureState);
      // console.log("++++++ measureInWindow " + width + " " + height + " " + x + " " + y);
    }
    );
  }
  const updateColorData = (x, y, gestureState) => {
    const left = x;
    const top = y;
    previousWheelCenter.current = { left, top };
    const emotionData = getEmotionsTextData(top, left, prevEmotionData.current, UserData, gestureState);
    // console.log('emotionData => ', emotionData);
    if (prevEmotionData?.current?.text === emotionData.text) {
      const color = pSBC(count.current / 100, toolTipData.color);
      setToolTipData(Object.assign(toolTipData, { ...emotionData }));
      setEmotionText(emotionData?.text ?? '');
      setColor(color);
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
      setColor(color);
      // count.current = 1;
    }
    prevEmotionData.current = emotionData;
  }

  const updateOffsetOnChangeWheelSize = (newWheelSize, onUpdate) => {
    if (!scrollerContainerRef.current && scrollerContainerSize.current) {
      return;
    }
    scrollerContainerRef?.current?.measureInWindow((x, y, width, height) => {
      const toolTipHeight = scrollerContainerSize.current.height - getScrollerWheelSize();
      const xOffset = scrollerContainerSize.current.width > newWheelSize ? 0 : ((getScrollerWheelSize() - newWheelSize) / 2);
      const yOffset = scrollerContainerSize.current.height > (newWheelSize + toolTipHeight) ? 0 : (scrollerContainerSize.current.height - (toolTipHeight + newWheelSize));

      newScrollerContainerPosition.current = { left: x + xOffset, top: y + yOffset };
      // console.log('newScrollerContainerPosition xOffset', xOffset);
      // console.log('newScrollerContainerPosition yOffset', yOffset);
      // console.log('newScrollerContainerPosition', scrollerContainerSize.current);
      onUpdate?.();
    })
  }

  const clearLongPressTimeouts = ({ mediumPressTimeoutId, longPressTimeoutId, resetWheelSize }) => {
    if (mediumPressTimeoutId?.current) {
      clearTimeout(mediumPressTimeoutId.current);
      mediumPressTimeoutId.current = null;
    }
    if (longPressTimeoutId?.current) {
      clearTimeout(longPressTimeoutId.current);
      longPressTimeoutId.current = null;
    }
    console.log('clearLongPressTimeouts =>', resetWheelSize);
    if (resetWheelSize) {
      const timeoutId = setTimeout(() => {
        updateOffsetOnChangeWheelSize(regularWheelSize, () => {
          setScrollerWheelSize(regularWheelSize);
          forceUpdate();
        });
        clearTimeout(timeoutId);
      }, 1 * 1000);
    }
  }

  const updateOffset = () => {
    isInitialPanResponderUpdated.current = false;
    scrollerContainerSize.current = null;
    toolTipSize.current = null;
    onToolTipLayout();
    onLayoutScrollerContainer();
  }

  const updatePanResponder = (forceUpdate, isOrientationChange) => {
    if (!blocksSize.current || !scrollerContainerSize.current || !toolTipSize.current) {
      return
    }
    const isInitialUpdate = (isInitialPanResponderUpdated.current === null);
    isInitialPanResponderUpdated.current = true;
    const offSetSize = getScrollerOffset(window, getScrollerWheelSize(), scrollerContainerSize.current, toolTipSize.current, blocksSize.current);
    let {
      xMin,
      xMax,
      yMin,
      yMax,
      initialX,
      initialY,
    } = offSetSize;
    console.log('updatePanResponder ', offSetSize)
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
    forceUpdate && forceUpdate();
    if (pan.current.x._value === initialX && pan.current.y._value === initialY) {
      return
    }
    (isOrientationChange || !forceUpdate) && emotionText === initialEmotionTextData.text && isInitialUpdate && pan.current.setValue({
      x: initialX,
      y: initialY
    });
  }

  const onBlocksContainerLayout = () => {
    if (blocksSize.current) {
      return;
    }
    blocksContainerRef.current.measureInWindow((x, y, width, height) => {
      setEmotionsTextData(y, x, height, width);
      const size = { left: x, top: y, width, height };
      blocksSize.current = size;
      setBlocksContainerSize(size)
      // console.log('useEffect blocksSize ', blocksSize.current)
      !isInitialPanResponderUpdated.current && updatePanResponder();
    })
  }

  const onToolTipLayout = () => {
    if (toolTipSize.current) {
      return;
    }
    toolTipRef?.current?.measureInWindow((x, y, width, height) => {
      toolTipSize.current = { left: x, top: y, width, height };
      !isInitialPanResponderUpdated.current && updatePanResponder();
    })
  }

  const onLayoutScrollerContainer = () => {
    if (scrollerContainerSize.current) {
      return;
    }
    scrollerContainerRef?.current?.measureInWindow((x, y, width, height) => {
      scrollerContainerSize.current = { left: x, top: y, width, height };
      // console.log('scrollerContainerSize x,y,width,height', x, y, width, height)
      // console.log('scrollerContainerSize scrollerContainerSize.current', scrollerContainerSize.current)
      !isInitialPanResponderUpdated.current && updatePanResponder();
    })
  }

  const checkStorage = async () => {
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
    await setEmail(e);
    dispatch(UserEmail(e));
    dispatch(UserDivision(division));
    dispatch(HealthPerm(HealthP));
    dispatch(WeatherPerm(WeatherP));
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

  useEffect(() => {
    setTimeout(() => {
      checkStorage();
      getProfileUserData();

      {
        UserData.WeatherPermission &&
          (UserData.lat == null || UserData.lon == null) &&
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
            .then((location) => {
              //   console.log('Success', location);
              setlat(location.latitude);
              dispatch(Lat(location.latitude));
              setlng(location.longitude);
              dispatch(Long(location.longitude));
            })
            .catch((error) => {
              const { code, message } = error;
              console.log('error', code, message);
            });
      }

    }, 150);
  }, []);

  const findId = async () => {
    let p = await AsyncStorage.getItem('MoodCount');
    // console.log(`check check check`, JSON.parse(AsyncStorage.getItem('Email')));
    let e = await JSON.parse(p);
    console.log(`mood count`, e);

    let geocode = null;
    Geocoder.init('AIzaSyD8BafHP8VtNFGyMg4uozFJcgsBaKDxS9s');
    var state_info = '';
    var city_info = '';
    var country_info = '';
    await Geocoder.from({
      lat: UserData.lat,
      lng: UserData.lon,
    })
      .then((data) => {
        geocode = data.plus_code.compound_code;
        const address_list = data.results[0].address_components;
        for (i = 0; i < address_list.length; i++) {
          if (address_list[i].types.includes('country')) {
            country_info = address_list[i].long_name;
          }
          if (address_list[i].types.includes('administrative_area_level_1')) {
            state_info = address_list[i].long_name;
          }
          if (address_list[i].types.includes('administrative_area_level_2')) {
            city_info = address_list[i].long_name;
          }
        }
      })
      .catch((err) => console.log(`weather api location err`, err));

    const Id = UserData.AllMoods.find(({ name }) => {
      // console.log(`name`, name);
      return name === emotionText;
    });
    console.log(`Id`, Id);

    console.log(`lat, lng`, UserData.lat, UserData.lon);
    const deviceId = DeviceInfo.getUniqueId();
    if (Id === undefined) {
      console.log(`fail`);
      setMoodFail(true);
    } else {
      setLoading(true);
      console.log(`not fail`);
      console.log(`Id`, Id.id);
      const params = {
        mood_id: Id.id,
        device_id: deviceId,
        lat: UserData.lat,
        long: UserData.lon,
        email: Email,
        city: city_info,
        state: state_info,
        country: country_info,
      };

      if (route?.params?.question != undefined) {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        var raw = JSON.stringify({
          device_id: deviceId,
          email: UserData.UserEmail,
          pulse_question_id: route?.params?.question,
          mood_id: Id.id,
          is_anonymous: !UserData.Anonymous ? 0 : 1,
          user_id: UserData.UserId,
        });

        console.log(`params for updating answer`, raw);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };

        fetch('https://admin.moodflo.com/api/updateAnswer', requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log('quesstion updated', result), setLoading(false);
            navigation.navigate('HomeScreen', { screen: 'MicScreen' });
          })
          .catch((error) => {
            console.log('error', error), setLoading(false);
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
              {
                route?.params?.question != undefined
                  ? navigation.navigate('HomeScreen', { screen: 'MicScreen' })
                  : navigation.replace('HomeScreen', {
                    lat: lat,
                    long: lng,
                    screen: 'Home',
                  });
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
    console.log(`value-->`, value);

    if (value === 'Yes') {
      setSaveConfirm(false);
      findId();
    } else {
      setSaveConfirm(false);
    }
  };

  const cancelled = () => {
    setSaveConfirm(false);
  };

  const renderBlocks = () => {
    return (
      < View
        ref={blocksContainerRef}
        onLayout={onBlocksContainerLayout}
        {...panResponder.panHandlers}
        style={
          [
            styles.childViewStyle,
            {
              backgroundColor: 'green',
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 1,
            },
          ]} >
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
            backgroundColor: pSBC(0.50, color),
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
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            position: 'absolute',
            bottom: 8,
            zIndex: 1,
          }}
        >
          <Text
            // ref={(ref) => this.passiveCalm = ref}
            style={{
              color: '#fff',
              //  left: width / 2.4,
            }}>
            Passive/Calm
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            hieght: blocksContainerSize?.height,
            top: blocksContainerSize ? (blocksContainerSize.height / 2) - 6 : undefined,
            alignItems: 'center',
            position: 'absolute',
            left: 6,
            zIndex: 2,
          }}
        >
          <Text
            // ref={(ref) => this.negative = ref}
            style={{
              color: '#fff',
              lineHeight: 12,
              // flex: 1,
              // justifyContent: 'center',
              //  top: height / 3.05,
            }}>
            Negative
         </Text>
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            position: 'absolute',
            top: 8,
            zIndex: 4,
          }}
        >
          <Text
            // ref={(ref) => this.activeAroused = ref}
            style={{
              color: '#fff',
              //  left: width / 2.56,
            }}>
            Active/Aroused
          </Text>
        </View>
        <View
          style={{
            hieght: '100%',
            justifyContent: 'center',
            position: 'absolute',
            top: blocksContainerSize ? (blocksContainerSize.height / 2) - 6 : undefined,
            right: 6,
          }}
        >
          <Text
            // ref={(ref) => this.positive = ref}
            style={{
              color: '#fff',
              //  top: height / 3.05,
              lineHeight: 12,
            }}>
            Positive
          </Text>
        </View>
      </View >
    )
  }

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
            () => navigation.navigate('HomeScreen', { lat: lat, long: lng })
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
            <CloseIcon width={dynamicSize(52)} height={dynamicSize(52)} />
          </View>
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
          <QuestionMarkIcon
            width={dynamicSize(52)}
            height={dynamicSize(52)}
          />
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
        {/* {MoodFail && (
          <Text style={styles.ErrorText}>Please select a mood</Text>
        )} */}
      </View>
    </View>
  )


  const topBottomColor = pSBC(0.60, color);

  return (
    <View style={[styles.container,
      //  { backgroundColor: color }
    ]}
    >
      <TouchableOpacity
        disabled={true}
        style={{
          zIndex: -99999,
          backgroundColor: topBottomColor,
          // position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          paddingVertical: 15,
        }}>
        <AnonymousHeader />
      </TouchableOpacity>
      {renderBlocks()}
      {renderBottomBar(topBottomColor)}

      <Scroller
        scrollerStyle={{
          ...pan.current.getLayout(),
          ...newScrollerContainerPosition.current !== null ? newScrollerContainerPosition.current : {},
          ...(constrainedX.current !== null && constrainedY.current !== null) ? { left: constrainedX.current, top: constrainedY.current } : {}
        }}
        scrollerPanResponder={panResponder}
        toolTipData={toolTipData}
        emotionText={emotionText}
        toolTipRef={toolTipRef}
        onToolTipLayout={onToolTipLayout}
        isAllMoodsDataAvailable={UserData.AllMoods !== null}
        scrollerRef={(ref) => scrollerRef.current = ref}
        scrollerContainerRef={scrollerContainerRef}
        onLayoutScrollerContainer={onLayoutScrollerContainer}
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
  )
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
})

