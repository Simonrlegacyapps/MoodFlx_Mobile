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
} from 'react-native';
import AnonymousHeader from '../Components/AnonymousHeader/AnonymousHeader';
import {getUniqueId} from 'react-native-device-info';
import ToolTip from '../../assets/tooltip/ToolTip';
import Svg, {Path, SvgUri} from 'react-native-svg';
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
import {UserDivision, UserEmail} from '../redux/actions/actions';

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
  const [locationX, setLocationX] = useState(240);
  const [locationY, setLocationY] = useState(330);
  const [ShowDraggable, setShowDraggable] = useState(true);
  const [Location, setLocation] = useState([]);
  const [Moving, setMoving] = useState(false);
  const [Anonymous, setAnonymous] = useState(false);
  const [Label, setLabel] = useState('Excited');
  const [startTime, setstartTime] = useState(0);
  const [EndTime, setEndTime] = useState(0);
  const [StatusVertical, setStatusVertical] = useState(0);
  const [GetMoods, setGetMoods] = useState(null);
  const [Svgs, setSvgs] = useState('');
  const [lng, setlng] = useState(false);
  const [lat, setlat] = useState(false);
  const [Email, setEmail] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false);

  // const toggleModal = () => {
  //   setModalVisible(!isModalVisible);
  // };

  const dispatch = useDispatch();

  const closeModal = () => {
    setModalVisible(false);
  };

  const UserData = useSelector((state) => state.First);

  const checkStorage = async () => {
    let p = await AsyncStorage.getItem('Email');
    let d = await AsyncStorage.getItem('Division');
    // console.log(`check check check`, JSON.parse(AsyncStorage.getItem('Email')));
    let e = await JSON.parse(p);
    let division = await JSON.parse(d);
    console.log(`e`, e);
    console.log(`division`, division);
    await setEmail(e);
    dispatch(UserEmail(e));
    dispatch(UserDivision(division));

    return e;
    // console.log('Email', e);
  };

  console.log(`user division`, UserData.UserDivision);
  useEffect(() => {
    checkStorage();

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        //   console.log('Success', location);
        setlat(location.latitude);
        setlng(location.longitude);
      })
      .catch((error) => {
        const {code, message} = error;
        console.log('error', code, message);
      });

    StatusBarManager.getHeight((statusBarHeight) => {
      setStatusVertical(statusBarHeight.height);
    });
  }, []);

  useEffect(() => {
    fetch('https://admin.moodflo.com/api/getMood')
      .then((data) => data.json())
      .then(async (res) => {
        await setGetMoods(res.data);
        // console.log('response of division', res.data);

        // setSelectedDivisionId(res.data[0].id);
      });
  }, []);
  // console.log(`GetMoods`, GetMoods);

  const FindId = () => {
    const Id = GetMoods.find(({name}) => {
      console.log(`name`, name);
      return name === Label;
    });
    console.log(`Id`, Id.id);
    console.log(`lat, lng`, lat, lng);
    const deviceId = DeviceInfo.getUniqueId();

    const params = {
      mood_id: Id.id,
      device_id: deviceId,
      lat: lat,
      long: lng,
      email: Email,
    };
    PostRequestApi('moodUpdate', params)
      .then((resp) => {
        if (resp.status == 200) {
          // setLoading(false);
          console.log('Success Message of respose mood ✅ ✅ ✅ ✅', resp.data);
          // navigation.navigate('VerifyEmail', {
          //   code: resp.data.otp,
          //   mail: value,
          //   deviceID: deviceId,
          // });
          console.log(`params`, params);
        }
      })
      .catch((err) => {
        console.log(`params for err of mood`, params);
        console.log('err of response mood❌ ❌ ❌ ❌', err);
      });
    navigation.replace('HomeScreen', {lat: lat, long: lng});
  };

  const FindSvg = ({moveY, moveX, dx, dy, y0, x0}) => {
    let Svg = '';

    const locationX = moveX;
    const locationY = moveY;
    0 < locationX &&
    locationX < fourthWidth &&
    statusHeight < locationY &&
    locationY < fourthHeight + statusHeight
      ? (Svg = 'mood_icons/16161615941398599996054ab3aa7d5a.svg')
      : 0 < locationX &&
        locationX < fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (Svg = 'mood_icons/16161615941398599996054ab3aa7d5a.svg')
      : 0 < locationX &&
        locationX < fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (Svg = 'mood_icons/161616020811568889776054a5d0a647b.svg')
      : 0 < locationX &&
        locationX < fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (Svg = 'mood_icons/161616165713773338836054ab79f1da3.svg')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (Svg = 'mood_icons/16161615819211632466054ab2df10cd.svg')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (Svg = 'mood_icons/161616160519398103336054ab4547f6f.svg')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (Svg = 'mood_icons/16161598431282637146054a4639766f.svg')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (Svg = 'mood_icons/16161616415022878446054ab69f2c06.svg')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (Svg = 'mood_icons/16161618594253055676054ac43027d1.svg')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (Svg = 'mood_icons/1616161630114389416054ab5eabe61.svg')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (Svg = 'mood_icons/16161617966057941926054ac048c7bf.svg')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (Svg = 'mood_icons/161616167810216837516054ab8e7cb4e.svg')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (Svg = 'mood_icons/161616176321272238406054abe3bb450.svg')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (Svg = 'mood_icons/16161617438626044096054abcf2e5c9.svg')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (Svg = 'mood_icons/161616181011965041556054ac126be19.svg')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (Svg = 'mood_icons/16161616189187972696054ab524887b.svg')
      : (Svg = 'mood_icons/16161618594253055676054ac43027d1.svg');
    return Svg;
    // console.log(`Svg`, Svg);
  };

  // console.log('SB', StatusVertical);
  let statusHeight = StatusVertical + 110;
  const halfHeight = height / 2;
  let fourthHeight = (halfHeight - statusHeight) / 2;
  let fourthWidth = width / 4;

  const getDirectionAndColor = ({moveY, moveX, dx, dy, y0, x0}) => {
    console.log('moveX, moveY, dx, dy, move', moveY, moveX, dx, dy, y0, x0);
    // console.log('dx', dx)
    // console.log('dy', dy)
    let word = '';

    const locationX = moveX;
    const locationY = moveY;

    setLocationX(moveX.toFixed(2));
    setLocationY(moveY.toFixed(2));

    0 < locationX &&
    locationX < fourthWidth &&
    statusHeight < locationY &&
    locationY < fourthHeight + statusHeight
      ? (word = 'Angry')
      : 0 < locationX &&
        locationX < fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (word = 'Furious')
      : 0 < locationX &&
        locationX < fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (word = 'Wierd')
      : 0 < locationX &&
        locationX < fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (word = 'Tired')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (word = 'Flat')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (word = 'Sad')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (word = 'Spent')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (word = 'Anxious')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (word = 'Happy')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (word = 'Excited')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (word = 'Chilled')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (word = 'Alert')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (word = 'Pumped')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (word = 'Stoked')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (word = 'Sharp')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (word = 'Content')
      : (word = 'Okay');

    // console.log('label', Label)

    return word;
  };
  const getDirectionAndColorOnClick = ({moveY, moveX, dx, dy, y0, x0}) => {
    console.log('moveX, moveY, dx, dy, click', moveY, moveX, dx, dy, y0, x0);
    console.log(`fourthHeight`, fourthHeight);
    // console.log('dx', dx)
    // console.log('dy', dy)
    let word = '';
    const locationX = x0;
    const locationY = y0;

    setLocationX(x0.toFixed(2));
    setLocationY(y0.toFixed(2));

    0 < locationX &&
    locationX < fourthWidth &&
    statusHeight < locationY &&
    locationY < fourthHeight + statusHeight
      ? (word = 'Angry')
      : 0 < locationX &&
        locationX < fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (word = 'Furious')
      : 0 < locationX &&
        locationX < fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (word = 'Wierd')
      : 0 < locationX &&
        locationX < fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (word = 'Tired')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (word = 'Flat')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (word = 'Sad')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (word = 'Spent')
      : fourthWidth < locationX &&
        locationX < 2 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (word = 'Anxious')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (word = 'Happy')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (word = 'Excited')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (word = 'Chilled')
      : 2 * fourthWidth < locationX &&
        locationX < 3 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (word = 'Alert')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        statusHeight < locationY &&
        locationY < fourthHeight + statusHeight
      ? (word = 'Pumped')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        fourthHeight < locationY &&
        locationY < 2 * fourthHeight + statusHeight
      ? (word = 'Stoked')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        2 * fourthHeight + statusHeight < locationY &&
        locationY < 3 * fourthHeight + statusHeight
      ? (word = 'Sharp')
      : 3 * fourthWidth < locationX &&
        locationX < 4 * fourthWidth &&
        3 * fourthHeight + statusHeight < locationY &&
        locationY < 4 * fourthHeight + statusHeight
      ? (word = 'Content')
      : (word = 'Okay');

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
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event, gestureState) => {
      !!getDirectionAndColorOnClick(gestureState);
      setstartTime(Date.now());
      console.log(`check check check`);
    },
    onStartShouldSetPanResponderCapture: (event, gestureState) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => {
      !!getDirectionAndColor(gestureState);
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

  const ColorFunctionB1 = () => {
    var colorCode = '';
    0 < locationX &&
    locationX < fourthWidth &&
    statusHeight < locationY &&
    locationY < fourthHeight + statusHeight
      ? (colorCode = '#BEBFD5')
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

    return colorCode;
  };
  const ColorFunctionB2 = () => {
    var colorCode = '';
    0 < locationX &&
    locationX < fourthWidth &&
    statusHeight < locationY &&
    locationY < fourthHeight + statusHeight
      ? (colorCode = '#ADADC9')
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
    0 < locationX &&
    locationX < fourthWidth &&
    statusHeight < locationY &&
    locationY < fourthHeight + statusHeight
      ? (colorCode = '#8688AF')
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
    0 < locationX &&
    locationX < fourthWidth &&
    statusHeight < locationY &&
    locationY < fourthHeight + statusHeight
      ? (colorCode = '#9C9DBE')
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
    0 < locationX &&
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

  const onPressButton = () => {
    // navigation.replace('HomeScreen');
    FindId();
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

  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* <Text style={styles.titleStyle}>
          React Native Get Clicked Location of Touchscreen Using PanResponder
        </Text> */}
        {/* {console.log('Moving', Moving)} */}
        {/* Header Bar */}
        <View
          style={{
            backgroundColor: BottomAndTopBar(),
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
          }}>
          <AnonymousHeader />
        </View>
        {/* Header Bar till here*/}

        <View
          style={[
            styles.childViewStyle,
            {
              backgroundColor: 'green',
              flexDirection: 'row',
              flexWrap: 'wrap',
              zIndex: -99999,
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
          <View
            style={[
              {
                alignItems: 'center',
                position: 'absolute',
                top: parseFloat(locationY - 220),
                left:
                  Label?.length >= 5 && Label?.length < 7
                    ? parseFloat(locationX - 35)
                    : Label?.length >= 7 && Label?.length <= 8
                    ? parseFloat(locationX - 40)
                    : Label?.length >= 8 && Label?.length < 11
                    ? parseFloat(locationX - 51)
                    : parseFloat(locationX - 25),
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 5,
                backgroundColor: 'white',
                borderRadius: 8,
                overflow: 'hidden',
              }}>
              {/* {console.log(`Label`, Label.length)} */}
              <Text style={{paddingHorizontal: 7}}>
                {locationX !== 0 && locationY !== 0 && <Text>{Label}</Text>}
                {/* X: {locationX}, Y: {locationY} */}
              </Text>
              <SvgUri
                width={20}
                height={20}
                // viewBox="0 0 24 24"
                fill="none"
                uri={
                  'https://super.moodflo.com/mood_icons/161616176321272238406054abe3bb450.svg'
                }
                // uri="http://super.moodflo.com/mood_icons/161616176321272238406054abe3bb450.svg"
              />
            </View>

            <Svg
              style={{}}
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <Path
                d="M13 8L25.1244 0.5H0.875645L13 8Z"
                fill="white"
                stroke="white"
                strokeWidth={0.5}
              />
            </Svg>
          </View>
          <View
            style={{
              alignContent: 'center',
              position: 'absolute',
              top: parseFloat(locationY - 170),
              left: parseFloat(locationX),
              height: 20,
              width: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
            }}
            {...panResponder.panHandlers}
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
            onPress={() =>
              navigation.replace('HomeScreen', {lat: lat, long: lng})
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
            disabled={GetMoods ? false : true}
            onPress={() => FindId()}
            style={{
              height: dynamicSize(52),
              width: dynamicSize(197),
              backgroundColor: 'white',
              borderRadius: 17,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View />
            <Text style={{textAlign: 'center', fontSize: 18}}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <VideoModal
        ModalVisible={isModalVisible}
        dismissModalHandler={closeModal}
      />
    </View>
  );
};
export default MoodEmotionDetector;

const styles = StyleSheet.create({
  container: {
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
});
