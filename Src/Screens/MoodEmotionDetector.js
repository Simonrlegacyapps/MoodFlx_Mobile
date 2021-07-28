import React, {useEffect, useState} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  PanResponder,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import AnonymousHeader from '../Components/AnonymousHeader/AnonymousHeader';
import {getUniqueId} from 'react-native-device-info';
import ToolTip from '../../assets/tooltip/ToolTip';
import Svg, {Path, SvgUri, G} from 'react-native-svg';
import HappyIcon from '../../assets/emotionsicons/HappyIcon';
import CloseIcon from '../../assets/commonicons/CloseIcon';
import QuestionMarkIcon from '../../assets/commonicons/QuestionMarkIcon';
import {dynamicSize} from '../Constants/sizeChoose';
import moment from 'moment';
import GetLocation from 'react-native-get-location';
import PostRequestApi from '../apirequest/PostRequestApi';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import VideoModal from '../Components/VideoModal/VideoModal';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  HealthPerm,
  Lat,
  Long,
  Moods,
  UserDetail,
  UserDivision,
  UserEmail,
  WeatherPerm,
} from '../redux/actions/actions';
import {useRoute} from '@react-navigation/native';
import SaveConfirmModal from '../Components/Modals/SaveConfirmModal/SaveConfirmModal';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Geocoder from 'react-native-geocoding';
import BubbleIcon from '../../assets/emotionsicons/Bubble';
import GoogleFit, {Scopes} from 'react-native-google-fit';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const {StatusBarManager, statusBarHeight} = NativeModules;

const moods = [
  'Happy',
  'excited',
  'party',
  'Sad',
  'Funny',
  'Stocked',
  'Pumped',
];
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const {width, height} = Dimensions.get('screen');

const MoodEmotionDetector = ({navigation}) => {
  // console.log(`width and height`, width, height);
  // console.log(`statusBarHeight`, statusBarHeight);
  const [locationX, setLocationX] = useState(width / 2); //pan
  const [locationY, setLocationY] = useState(height / 2 + height / 80); //pan
  const [ShowDraggable, setShowDraggable] = useState(true); //not using
  const [Location, setLocation] = useState([]); //not using
  const [Moving, setMoving] = useState(false); //not using
  const [Anonymous, setAnonymous] = useState(false); //not using
  const [Label, setLabel] = useState('Slide finger'); //emotionText
  const [startTime, setstartTime] = useState(0); //long press time caluclation to enlarge bubble not using currently
  const [EndTime, setEndTime] = useState(0); //long press time caluclation to enlarge bubble not using currently
  const [StatusVertical, setStatusVertical] = useState(0); //for status bar height
  const [GetMoods, setGetMoods] = useState(null); //not using
  const [Svgs, setSvgs] = useState(''); //icon
  const [lng, setlng] = useState(false); //using in api calls
  const [lat, setlat] = useState(false); //using in api calls
  const [Email, setEmail] = useState(null); //using in api calls
  const [Loading, setLoading] = useState(false); //using in api calls
  const [MoodFail, setMoodFail] = useState(false); //not using
  const [SaveConfirm, setSaveConfirm] = useState(false); //for modal flag
  const [SaveName, setSaveName] = useState(null); //for modal flag
  const [X0, setX0] = useState(0); //not using
  const [Y0, setY0] = useState(0); //not using

  const [isModalVisible, setModalVisible] = useState(false);

  // const toggleModal = () => {
  //   setModalVisible(!isModalVisible);
  // };

  const dispatch = useDispatch();
  const route = useRoute();
  // const {question} = route.params;
  // console.log(`route`, route?.params);

  const closeModal = () => {
    setModalVisible(false);
  };

  const UserData = useSelector((state) => state.First);

  const checkGoogleFitStatus = () => {
    GoogleFit.checkIsAuthorized().then(() => {
      console.log('GoogleFit GoogleFit.isAuthorized: ', GoogleFit.isAuthorized); // Then you can simply refer to `GoogleFit.isAuthorized` boolean.
      if (!GoogleFit.isAuthorized) {
        const options = {
          scopes: [
            Scopes.FITNESS_ACTIVITY_READ,
            Scopes.FITNESS_ACTIVITY_WRITE,
            Scopes.FITNESS_BODY_READ,
            Scopes.FITNESS_BODY_WRITE,
          ],
        };
        GoogleFit.authorize(options)
          .then((authResult) => {
            if (authResult.success) {
              // dispatch("AUTH_SUCCESS");
              console.log('GoogleFit authorize AUTH_SUCCESS');
            } else {
              console.log('GoogleFit authorize AUTH_DENIED');
            }
            console.log('GoogleFit authorize authResult: ', authResult);
          })
          .catch((error) => {
            console.log('GoogleFit authorize AUTH_ERROR: ', error);
          });
      }
    });
  };
  useEffect(() => {
    checkGoogleFitStatus();
  }, []);

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

  // console.log(`user division`, UserData.lat, UserData.lon);
  // console.log(
  //   `UserData.AllMoods`,
  //   UserData.AllMoods !== null ? UserData.AllMoods[0].name : 'nahi hai',
  // );

  // console.log(`called a get user`, UserData?.UserDetails);
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
            enableHighAccuracy: false,
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
              const {code, message} = error;
              console.log('error', code, message);
            });
      }

      StatusBarManager?.getHeight?.((statusBarHeight) => {
        setStatusVertical(statusBarHeight.height);
      });
    }, 150);
  }, []);

  // useEffect(() => {
  //   {
  //     UserData.AllMoods == null &&
  //       fetch('https://admin.moodflo.com/api/getMood')
  //         .then((data) => data.json())
  //         .then(async (res) => {
  //           await setGetMoods(res.data);
  //           await dispatch(Moods(res.data));
  //         });
  //   }
  // }, []);
  // console.log(`GetMoods`, GetMoods);

  // console.log(`route?.params?.question`, route?.params?.question);
  const FindId = async () => {
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

    const Id = UserData.AllMoods.find(({name}) => {
      // console.log(`name`, name);
      return name === Label;
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
            navigation.navigate('HomeScreen', {screen: 'MicScreen'});
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
                  ? navigation.navigate('HomeScreen', {screen: 'MicScreen'})
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

  // console.log('SB', StatusVertical);
  let statusHeight = StatusVertical + 110;
  const halfHeight = height / 2;
  let fourthHeight = (halfHeight - statusHeight) / 2 + height / 185;
  let fourthWidth = width / 4;

  const FindSvg = ({moveY, moveX, dx, dy, y0, x0}) => {
    let word = '';

    const locationX = moveX;
    const locationY = moveY;

    if (
      moveY.toFixed(2) > statusHeight + height / 185 &&
      moveY.toFixed(2) < 4 * fourthHeight + statusHeight
    ) {
      // setLocationX(moveX.toFixed(2));
      // setLocationY(moveY.toFixed(2));
      ReactNativeHapticFeedback.trigger('selection', options);
    }
    // console.log('moveX, moveY, dx, dy, move', moveY, moveX, dx, dy, y0, x0);
    // console.log('dx', dx)
    // console.log('dy', dy)
    if (UserData.AllMoods !== null) {
      0 < locationX &&
      locationX < fourthWidth &&
      statusHeight < locationY &&
      locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[0].icon) // sad
        : 0 < locationX &&
          locationX < fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[1].icon) //flat
        : 0 < locationX &&
          locationX < fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[2].icon) //wired
        : 0 < locationX &&
          locationX < fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[3].icon) //anxious
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          statusHeight < locationY &&
          locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[4].icon) //angry
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[5].icon) //Rattled
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[6].icon) //Spent
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[7].icon) //Tired
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          statusHeight < locationY &&
          locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[8].icon) //Excited
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[9].icon) //stoked
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[10].icon) //Spent
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[11].icon) //alert
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          statusHeight < locationY &&
          locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[12].icon) //Excited
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[13].icon) //Happy
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[14].icon) //sharp
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[15].icon) //Content
        : (word = UserData.AllMoods[11].icon);
    }

    // console.log('label', word);
    return word;
  };
  const FindSvgOnClick = ({moveY, moveX, dx, dy, y0, x0}) => {
    let word = '';

    const locationX = x0;
    const locationY = y0;

    if (
      moveY.toFixed(2) > statusHeight + height / 185 &&
      moveY.toFixed(2) < 4 * fourthHeight + statusHeight
    ) {
      // setLocationX(moveX.toFixed(2));
      // setLocationY(moveY.toFixed(2));
      ReactNativeHapticFeedback.trigger('selection', options);
    }
    // console.log('moveX, moveY, dx, dy, move', moveY, moveX, dx, dy, y0, x0);
    // console.log('dx', dx)
    // console.log('dy', dy)
    if (UserData.AllMoods !== null) {
      0 < locationX &&
      locationX < fourthWidth &&
      statusHeight < locationY &&
      locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[0].icon) // sad
        : 0 < locationX &&
          locationX < fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[1].icon) //flat
        : 0 < locationX &&
          locationX < fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[2].icon) //wired
        : 0 < locationX &&
          locationX < fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[3].icon) //anxious
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          statusHeight < locationY &&
          locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[4].icon) //angry
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[5].icon) //Rattled
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[6].icon) //Spent
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[7].icon) //Tired
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          statusHeight < locationY &&
          locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[8].icon) //Excited
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[9].icon) //stoked
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[10].icon) //Spent
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[11].icon) //alert
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          statusHeight < locationY &&
          locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[12].icon) //Excited
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[13].icon) //Happy
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[14].icon) //sharp
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[15].icon) //Content
        : (word = UserData.AllMoods[11].icon);
    }

    console.log('label', word);
    return word;
  };

  const getDirectionAndColor = ({moveY, moveX, dx, dy, y0, x0}) => {
    setMoodFail(false);
    let word = '';

    const locationX = moveX;
    const locationY = moveY;

    if (
      moveY.toFixed(2) > statusHeight + height / 185 &&
      moveY.toFixed(2) < 4 * fourthHeight + statusHeight
    ) {
      setX0(dx);
      setY0(dy);
      setLocationX(moveX.toFixed(2));
      setLocationY(moveY.toFixed(2));
      ReactNativeHapticFeedback.trigger('selection', options);
    }
    console.log('moveX, moveY, dx, dy, move', moveY, moveX, dx, dy, y0, x0);
    console.log(
      `object`,
      locationX,
      fourthWidth,
      fourthHeight,
      locationY,
      statusHeight,
    );
    // console.log('dx', dx)
    // console.log('dy', dy)
    if (UserData.AllMoods !== null) {
      0 < locationX &&
      locationX < fourthWidth &&
      statusHeight < locationY &&
      locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[0].name) // sad
        : 0 < locationX &&
          locationX < fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[1].name) //flat
        : 0 < locationX &&
          locationX < fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[2].name) //wired
        : 0 < locationX &&
          locationX < fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[3].name) //anxious
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          statusHeight < locationY &&
          locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[4].name) //angry
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[5].name) //Rattled
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[6].name) //Spent
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[7].name) //Tired
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          statusHeight < locationY &&
          locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[8].name) //Excited
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[9].name) //stoked
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[10].name) //Spent
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[11].name) //alert
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          statusHeight < locationY &&
          locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[12].name) //Excited
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[13].name) //Happy
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[14].name) //sharp
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[15].name) //Content
        : (word = 'Slide Finger');
    }

    // console.log('label', Label)
    return word;
  };
  const getDirectionAndColorOnClick = ({moveY, moveX, dx, dy, y0, x0}) => {
    ReactNativeHapticFeedback.trigger('selection', options);
    // console.log('clickX, clickY, dx, dy, click', moveY, moveX, dx, dy, y0, x0);
    console.log(`fourthHeight`, fourthHeight, statusHeight);
    // console.log('dx', dx)
    // console.log('dy', dy)
    setMoodFail(false);
    let word = '';
    const locationX = x0;
    const locationY = y0;

    setLocationX(x0.toFixed(2));
    setLocationY(y0.toFixed(2));
    if (UserData.AllMoods !== null) {
      0 < locationX &&
      locationX < fourthWidth &&
      statusHeight < locationY &&
      locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[0].name) // sad
        : 0 < locationX &&
          locationX < fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[1].name) //flat
        : 0 < locationX &&
          locationX < fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[2].name) //wired
        : 0 < locationX &&
          locationX < fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[3].name) //anxious
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          statusHeight < locationY &&
          locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[4].name) //angry
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[5].name) //Rattled
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[6].name) //Spent
        : fourthWidth < locationX &&
          locationX < 2 * fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[7].name) //Tired
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          statusHeight < locationY &&
          locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[8].name) //Excited
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[9].name) //stoked
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[10].name) //Spent
        : 2 * fourthWidth < locationX &&
          locationX < 3 * fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[11].name) //alert
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          statusHeight < locationY &&
          locationY < fourthHeight + statusHeight
        ? (word = UserData.AllMoods[12].name) //Excited
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          fourthHeight + statusHeight < locationY &&
          locationY < 2 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[13].name) //Happy
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          2 * fourthHeight + statusHeight < locationY &&
          locationY < 3 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[14].name) //sharp
        : 3 * fourthWidth < locationX &&
          locationX < 4 * fourthWidth &&
          3 * fourthHeight + statusHeight < locationY &&
          locationY < 4 * fourthHeight + statusHeight
        ? (word = UserData.AllMoods[15].name) //Content
        : (word = 'Okay');
    }
    // 0 < locationX && locationX < 208 && -15 < locationY && locationY < 383
    //   ? (word = word + 'Sad')
    //   : 208 < locationX && locationX < 411 && -15 < locationY && locationY < 383
    //   ? (word = word + 'Very Sad')
    //   : 208 < locationX && locationX < 411 && 383 < locationY && locationY < 570
    //   ? (word = word + 'Excited')
    //   : 0 < locationX && locationX < 208 && 570 < locationY && locationY < 774
    //   ? (word = word + 'Happy')
    //   : 0 < locationX && locationX < 208 && 383 < locationY && locationY < 570
    //   ? (word = word + 'Very Happy')
    //   : 208 < locationX && locationX < 411 && 570 < locationY && locationY < 774
    //   ? (word = word + 'Anxious')
    //   : (word = word + 'Delight');

    // console.log('label', Label)

    return word;
  };

  useEffect(() => {
    // console.log('Unique id', getUniqueId())
    renderLine(locationX, locationY);
  });
  // console.log('Location', Location);
  //panResponder initialization
  const panResponder =
    UserData.AllMoods !== null &&
    PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => {
        UserData.AllMoods !== null &&
          !!getDirectionAndColorOnClick(gestureState);
        ReactNativeHapticFeedback.trigger('selection', options);
        setstartTime(Date.now());
        !!FindSvgOnClick(gestureState);
        console.log(`check check check`);
      },
      onStartShouldSetPanResponderCapture: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => {
        if (locationY < statusHeight) {
          !!getDirectionAndColor(gestureState);
        }

        !!FindSvg(gestureState);
      },
      onPanResponderStart: (evt, gestureState) => {
        // console.log(
        //   'check check check ================>>>>>>>>>>>>.',
        //   evt,
        //   gestureState.y0,
        //   gestureState.x0,
        // );
        // setLocationX(gestureState.x0)
        // setLocationY(gestureState.y0)
        const click = getDirectionAndColorOnClick(gestureState);
        // ReactNativeHapticFeedback.trigger("selection", options);
        const svg = FindSvgOnClick(gestureState);
        setSvgs(svg);
        setLabel(click);
      },
      onMoveShouldSetPanResponderCapture: (event, gestureState) => {
        true;
      },
      onPanResponderGrant: (event, gestureState) => true,
      onPanResponderMove: (event, gestureState) => {
        const drag = getDirectionAndColor(gestureState);
        const svg = FindSvg(gestureState);
        setLabel(drag);
        setSvgs(svg);
      },
      onPanResponderRelease: (event, gestureState) => {
        setEndTime(Date.now());
        let start = moment(startTime);
        let end = moment(EndTime);
        const diff = end.diff(start);
        const diffDuration = moment.duration(diff).asSeconds();
        // console.log(`diffDuration`, diffDuration);
        // console.log(`EndTime`, EndTime);
        // console.log(`startTime`, startTime);
        // console.log(`difference in time`, Math.abs(EndTime - startTime));
      },
    });

  const findColor = (max1, min1, max2, min2, max3, min3) => {
    return `rgb(${Math.ceil(
      ((locationY - 0) / (width - 0)) * (max1 - min1) + min1, //301-120
    )}, ${Math.ceil(
      ((locationY - 0) / (width - 0)) * (max2 - min2) + min2, //0-0
    )},${Math.ceil(
      ((locationY / 2 - 0) / (width * 2 - 0)) * (max3 - min3) + min3, //11-4
    )})`;
  };

  const ColorFunctionB1 = () => {
    // console.log(`locationX, locationY`, locationX, locationY);
    var colorCode = '';
    let a = 145;
    0 <= locationX &&
    locationX < fourthWidth &&
    statusHeight < locationY &&
    locationY < fourthHeight + statusHeight
      ? (colorCode = findColor(301, 120, 0, 0, 11, 4)) //251, 19,36
      : 0 < locationX &&
        locationX < fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#CA929A')
      : 0 < locationX &&
        locationX < fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#D9A790')
      : 0 < locationX &&
        locationX < fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#82D1C3')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#8DC3B3')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#B6C9D8')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#A0C595')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#AFD4DA')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#BE7B83')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#C47CCF')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#D593A9')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#BEC947')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#DBB790')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#C59CB9')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#B7D9CE')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#89D881')
      : (colorCode = '#BE7B83'); //purple
    // console.log(`colorCode`, colorCode);
    return colorCode;
  };
  const ColorFunctionB2 = () => {
    var colorCode = '';
    0 <= locationX &&
    locationX < fourthWidth &&
    statusHeight < locationY &&
    locationY < fourthHeight + statusHeight
      ? (colorCode = findColor(249, 106, 7, 17, 9, 24))
      : 0 < locationX &&
        locationX < fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#BF7B85')
      : 0 < locationX &&
        locationX < fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#D19377')
      : 0 < locationX &&
        locationX < fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#6FC9B8')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#70A998')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#A3B9CC')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#91BB83')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#9BCAD0')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#B56873')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#BA65C6')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#CC7E99')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#B8C235')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#D2A77C')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#BA8AAB')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#A5CDC0')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#77D06D')
      : (colorCode = '#B56873'); //purple

    return colorCode;
  };
  const ColorFunctionB3 = () => {
    var colorCode = '';
    0 <= locationX &&
    locationX < fourthWidth &&
    statusHeight < locationY &&
    locationY < fourthHeight + statusHeight
      ? (colorCode = findColor(120, 260, 10, 4, 18, 4))
      : 0 < locationX &&
        locationX < fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#B05D69')
      : 0 < locationX &&
        locationX < fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#C37555')
      : 0 < locationX &&
        locationX < fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#4DBAA5')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#5DA891')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#7F9DB8')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#72A661')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#77B4BD')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#A24551')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#A83FB6')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#BB5779')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#949E25')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#C58C55')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#A46891')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#81B9A6')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#54C347')
      : (colorCode = '#A24551'); //purple

    return colorCode;
  };
  const ColorFunctionB4 = () => {
    var colorCode = '';
    0 <= locationX &&
    locationX < fourthWidth &&
    statusHeight < locationY &&
    locationY < fourthHeight + statusHeight
      ? (colorCode = findColor(144, 351, 74, 0, 6, 17))
      : 0 < locationX &&
        locationX < fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#B76B76')
      : 0 < locationX &&
        locationX < fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#CB8466')
      : 0 < locationX &&
        locationX < fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#5BC0AE')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#69AF99')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#92ACC3')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#80B072')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#87BEC6')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#AC5762')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#B052BE')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#C46988')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#ABB629')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#CB9866')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#AE779C')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#91C2B3')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#65CA5A')
      : (colorCode = '#AC5762'); //purple

    return colorCode;
  };

  const BottomAndTopBar = () => {
    var colorCode = '';
    0 <= locationX &&
    locationX < fourthWidth &&
    statusHeight < locationY &&
    locationY < fourthHeight + statusHeight
      ? (colorCode = '#A7A8BF')
      : 0 < locationX &&
        locationX < fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#C18390')
      : 0 < locationX &&
        locationX < fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#DFBAA8')
      : 0 < locationX &&
        locationX < fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#89C7BB')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#82C6B1')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#ADBAC8')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#A3C499')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#A0C9CE')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#BA6D77')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#A964B4')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#C88BA1')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#AEB75A')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (colorCode = '#CFB190')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (colorCode = '#B994AD')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (colorCode = '#6AA290')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (colorCode = '#7CD272')
      : (colorCode = '#BA6D77'); //purple

    return colorCode;
  };

  const savingDataWithName = () => {
    // navigation.replace('HomeScreen');

    if (!UserData.Anonymous) {
      setSaveConfirm(true);
    } else {
      FindId();
    }
  };

  const renderLine = (x, y) => {
    return (
      <View
        style={[
          styles.pointStyle2,
          {
            backgroundColor: '#F6926C',
            top: Math.round(y),
            left: Math.round(x),
          },
        ]}
      />
    );
  };
  // TOP => x:0 , y:-15 ||  x: 208 y: -15 || x: 411 y: -15
  // Middle =>  x:2, y:383 ||  x: 208 y: 383 || x: 411 y: 383
  // Bottom =>  x:0, y:774 ||  x: 208 y: 778 || x: 411 y: 776

  const VerifyDone = (value) => {
    console.log(`value-->`, value);

    if (value === 'Yes') {
      setSaveConfirm(false);
      FindId();
    } else {
      setSaveConfirm(false);
    }
  };

  const cancelled = () => {
    setSaveConfirm(false);
  };

  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* <Text style={styles.titleStyle}>
          React Native Get Clicked Location of Touchscreen Using PanResponder
        </Text> */}
        {/* {console.log('Moving', Moving)} */}
        {/* Header Bar */}
        <TouchableOpacity
          disabled={true}
          style={{
            zIndex: -99999,
            backgroundColor: BottomAndTopBar(),
            // position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
          }}>
          <AnonymousHeader />
        </TouchableOpacity>
        {/* Header Bar till here*/}

        <View
          style={[
            styles.childViewStyle,
            {
              backgroundColor: 'green',
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 1,
            },
          ]}
          {...panResponder.panHandlers}>
          <View
            style={{
              height: '50%',
              width: '50%',
              backgroundColor: ColorFunctionB1(),
            }}
          />
          <View
            style={{
              height: '50%',
              width: '50%',
              backgroundColor: ColorFunctionB2(),
            }}
          />
          <View
            style={{
              height: '50%',
              width: '50%',
              backgroundColor: ColorFunctionB3(),
            }}
          />
          <View
            style={{
              height: '50%',
              width: '50%',
              backgroundColor: ColorFunctionB4(),
            }}
          />
          {/* anxious */}
          {/*Text to show the screen location we get*/}
          {/* <View>
            <BubbleIcon />
          </View> */}

          <Text
            style={{
              position: 'absolute',
              color: '#fff',
              bottom: 8,
              left: width / 2.4,
            }}>
            Passive/Calm
          </Text>
          <Text
            style={{
              position: 'absolute',
              color: '#fff',
              flex: 1,
              justifyContent: 'center',
              top: height / 3.05,
              left: 6,
            }}>
            Negative
          </Text>
          <Text
            style={{
              position: 'absolute',
              color: '#fff',
              left: width / 2.56,
              top: 8,
            }}>
            Active/Aroused
          </Text>
          <Text
            style={{
              position: 'absolute',
              color: '#fff',
              right: 6,
              top: height / 3.05,
            }}>
            Positive
          </Text>
          {/* <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
            }}
            {...panResponder.panHandlers}
          /> */}
        </View>
        <View style={{position: 'absolute'}} {...panResponder.panHandlers}>
          {UserData.AllMoods !== null && (
            <View
              style={[
                {
                  zIndex: 9999999,
                  alignItems: 'center',
                  position: 'absolute',
                  elevation: 3,
                  top: parseFloat(locationY - 133),
                  left:
                    Label?.length >= 8 &&
                    Label?.length <= 12 &&
                    Label === 'Slide finger'
                      ? parseFloat(locationX - 50)
                      : Label?.length >= 5 && Label?.length <= 6
                      ? parseFloat(locationX - 45)
                      : Label?.length > 6 && Label?.length <= 7
                      ? parseFloat(locationX - 49)
                      : Label?.length >= 7 && Label?.length <= 8
                      ? parseFloat(locationX - 47)
                      : Label?.length >= 8 && Label?.length <= 12
                      ? parseFloat(locationX - 63)
                      : parseFloat(locationX - 35),
                },
              ]}>
              <View
                style={{
                  zIndex: 9999999,
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 7,
                  paddingHorizontal: 10,
                  backgroundColor: 'white',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}>
                <Text style={{paddingHorizontal: 7, zIndex: 9999999}}>
                  {locationX !== 0 && locationY !== 0 && <Text>{Label}</Text>}
                </Text>
                {Label !== 'Slide finger' && (
                  <SvgUri
                    width={20}
                    height={20}
                    // viewBox="0 0 24 24"
                    fill="none"
                    uri={`https://super.moodflo.com/${
                      Svgs
                        ? Svgs
                        : 'mood_icons/161616176321272238406054abe3bb450.svg'
                    }`}
                    // uri="http://super.moodflo.com/mood_icons/161616176321272238406054abe3bb450.svg"
                  />
                )}
              </View>

              <Svg
                style={{marginTop: -4, marginLeft: -12}}
                width={38}
                height={25}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <Path
                  fill="#fff"
                  d="M8.5 2.4H28c-.384 0-.75.16-1.011.441l-7.066 7.624a2 2 0 01-2.892.044l-7.604-7.72a1.302 1.302 0 00-.927-.39z"></Path>
              </Svg>
            </View>
          )}
          <View
            style={{
              alignContent: 'center',
              position: 'absolute',
              top: parseFloat(locationY - 61),
              left: parseFloat(locationX - 10),
              height: 18,
              width: 18,
              backgroundColor: 'white',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          />
          <View
            style={{
              alignContent: 'center',
              position: 'absolute',
              top: parseFloat(locationY - 69.5),
              left: parseFloat(locationX - 18),
              height: 35,
              width: 35,
              backgroundColor: 'white',
              opacity: 0.6,
              borderRadius: 18,
              overflow: 'hidden',
            }}
          />
          <View
            style={{
              alignContent: 'center',
              position: 'absolute',
              top: parseFloat(locationY - 79),
              left: parseFloat(locationX - 27),
              height: 54,
              width: 54,
              backgroundColor: 'white',
              opacity: 0.4,
              borderRadius: 27,
              overflow: 'hidden',
            }}
          />
          <View
            style={{
              alignContent: 'center',
              position: 'absolute',
              top: parseFloat(locationY - 88.5),
              left: parseFloat(locationX - 37),
              height: 74,
              width: 74,
              backgroundColor: 'white',
              opacity: 0.2,
              borderRadius: 37,
              overflow: 'hidden',
            }}
          />
        </View>
      </View>

      {/* Bottom Bar */}
      <View
        style={{
          backgroundColor: BottomAndTopBar(),
          // alignItems: 'center',
          // justifyContent: 'center',
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
            style={{marginLeft: 12}}
            onPress={
              () => navigation.navigate('HomeScreen', {lat: lat, long: lng})
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
              UserData.AllMoods && Label !== 'Slide finger' ? false : true
            }
            onPress={() => savingDataWithName()}
            style={{
              height: dynamicSize(52),
              width: dynamicSize(197),
              backgroundColor: Label === 'Slide finger' ? 'grey' : 'white',
              borderRadius: 17,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View />
            <Text style={{textAlign: 'center', fontSize: 18}}>Save</Text>
          </TouchableOpacity>
          {/* {MoodFail && (
            <Text style={styles.ErrorText}>Please select a mood</Text>
          )} */}
        </View>
      </View>
      <VideoModal
        ModalVisible={isModalVisible}
        dismissModalHandler={closeModal}
      />

      <SaveConfirmModal
        value={SaveName}
        onChangeText={setSaveName}
        modalVisible={SaveConfirm}
        dismissModalHandler={() => cancelled()}
        verifyDone={(value) => VerifyDone(value)}
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
};
export default MoodEmotionDetector;

const styles = StyleSheet.create({
  container: {
    zIndex: -9999,
    flex: 1,
    // backgroundColor: 'white',
  },
  titleStyle: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  childViewStyle: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#F5FCFF',
    borderStyle: 'solid',
  },
  pointStyle: {
    height: 22,
    width: 22,
    marginTop: 5,
    position: 'absolute',
    borderRadius: 14,
    backgroundColor: '#00FF30',
  },
  pointStyle2: {
    height: 11,
    width: 11,
    marginTop: 5,
    position: 'absolute',
    borderRadius: 14,
    backgroundColor: '#F6926C',
  },
  ErrorText: {
    fontWeight: '300',
    letterSpacing: 0.2,
    fontSize: 12,
    marginTop: 0,
    marginLeft: width / 3,
    // marginRight: 62,
    textAlign: 'center',
    color: 'red',
    position: 'absolute',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
});

{
  /* <Svg
                width="115"
                height="64"
                viewBox="0 0 115 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <G filter="url(#filter0_d)">
                  <Path'
                    d="M8 9.99999C8 5.58172 11.5817 2 16 2H99C103.418 2 107 5.58172 107 10V32.4C107 36.8183 103.418 40.4 99 40.4H72.7375C70.9778 40.4 69.2672 40.9802 67.8706 42.0507L58.7167 49.0674C57.9989 49.6176 57.0011 49.6176 56.2833 49.0674L47.1294 42.0507C45.7328 40.9802 44.0222 40.4 42.2625 40.4H16C11.5817 40.4 8 36.8183 8 32.4V9.99999Z"
                    fill="white"
                  />
                </G>
                <Text
                  style={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    paddingTop: 12,
                  }}>
                  {locationX !== 0 && locationY !== 0 && <Text>{Label}</Text>}
                </Text>
              </Svg> */
}
