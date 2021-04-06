import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  Text,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
import {ScaledSheet} from 'react-native-size-matters';
import StackNavigation from './Src/navigator/StackNavigation';
import thunk from 'redux-thunk';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import allReducers from './Src/redux/reducers';
import ImageOne from './assets/OnBoarding/ImageOne';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import One from './assets/OnBoarding/ImageOne.svg';
import {SvgCssUri, SvgUri, SvgXml} from 'react-native-svg';
import {GetUserId, Moods} from './Src/redux/actions/actions';

// const store = createStore(allReducers, applyMiddleware(thunk));
const {width: screenWidth} = Dimensions.get('window');

const slides = [
  {
    key: 1,
    title: `A multi species tournamet platform that fairly and accurately scores
    scores North America's most popular gamefish for local, regional, and
    International competition.`,
  },
  {
    key: 2,
    title: `A multi species tournamet platform that fairly and accurately scores
    scores North America's most popular gamefish for local, regional, and
    International competition.`,
  },
  {
    key: 3,
    title: `A multi species tournamet platform that fairly and accurately scores
    scores North America's most popular gamefish for local, regional, and
    International competition.`,
  },
];

const Images = [
  {
    key: 1,
    img: require('./assets/OnBoarding/Onboarding1.png'),
  },
  {
    key: 2,
    img: require('./assets/OnBoarding/Onboarding2.png'),
  },
  {
    key: 3,
    img: require('./assets/OnBoarding/Onboarding3.png'),
  },
  {
    key: 4,
    img: require('./assets/OnBoarding/Onboarding4.png'),
  },
];

const App: () => React$Node = () => {
  const [screenName, setScreenName] = useState(false);
  const [ShowWelcome, setShowWelcome] = useState('');

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();

  const CheckScreen = async () => {
    let p = await AsyncStorage.getItem('ShowWelcomeScreen');
    let welcome = await JSON.parse(p);
    await setShowWelcome(welcome);
    console.log('welcome', welcome);
  };

  useEffect(() => {
    CheckScreen();
    if (ShowWelcome == null) {
      AsyncStorage.setItem('ShowWelcomeScreen', 'true');
      CheckScreen();
    } else {
      setShowWelcome(false);
    }
    // CheckScreen();

    // try {
    //   let data = AsyncStorage.getItem('WelcomeScreen');
    //   if (data !== null) {
    //     setScreenName(true);
    //   } else {
    //     setScreenName(false);
    //   }
    // } catch (e) {
    //   console.warn(e);
    // }
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  const checkStorage = async () => {
    let UserId = await AsyncStorage.getItem('UserId');
    // console.log(`check check check`, JSON.parse(AsyncStorage.getItem('Email')));
    let e = await JSON.parse(UserId);
    console.log(`userId`, e);
    dispatch(GetUserId(e));
  };
  useEffect(() => {
    {
      UserData.AllMoods == null &&
        fetch('https://admin.moodflo.com/api/getMood')
          .then((data) => data.json())
          .then(async (res) => {
            // await setGetMoods(res.data);
            await dispatch(Moods(res.data));
          });
    }
    checkStorage();
  }, []);

  const renderItems = ({item, index}, parallaxProps) => {
    // console.log('item', item.img);
    // console.log('ShowWelcome--', ShowWelcome);
    return (
      <>
        <View activeOpacity={0.8} style={styles.item}>
          <Image
            source={item.img}
            height={'100%'}
            width={'100%'}
            style={{height: '100%', width: '100%'}}
          />
        </View>
      </>
    );
  };

  const _onDone = async () => {
    await AsyncStorage.setItem('ShowWelcomeScreen', 'false');
    CheckScreen();
    try {
      await AsyncStorage.setItem('WelcomeScreen', 'false');
      setScreenName(true);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <>
      {/* {console.log('ShowWelcome--', ShowWelcome)} */}
      {/* <Provider store={store}> */}
      {ShowWelcome === false ? (
        <NavigationContainer>
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
              <StackNavigation />
            </View>
          </SafeAreaView>
        </NavigationContainer>
      ) : (
        <AppIntroSlider
          renderItem={renderItems}
          data={Images}
          onDone={_onDone}
          showSkipButton={true}
        />
      )}
      {/* </Provider> */}
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  messageStyle: {
    color: 'white',
    fontSize: 16,
  },
  containerStyle: {
    backgroundColor: 'black',
    paddingBottom: 8,
  },
  errorStyle: {
    backgroundColor: 'red',
    paddingBottom: 8,
  },
  welcomeLogoStyle: {
    position: 'absolute',
    bottom: '15%',
    left: '50%',
    right: '50%',
    alignItems: 'center',
  },
  welcomeDotStyle: {
    backgroundColor: 'gray',
    height: '14@ms',
    width: '14@ms',
    borderRadius: '7@ms',
    borderColor: 'red',
    borderWidth: 1,
  },
  activeWelcomeDotStyle: {
    backgroundColor: 'red',
    height: '14@ms',
    width: '14@ms',
    borderRadius: '7@ms',
  },
  welcometextStyle: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
  },
  welcomeTextWrapper: {position: 'absolute', top: '15%', alignSelf: 'center'},
  welRenderWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: '25@ms',
  },
  welTitletext: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
    fontWeight: '600',
  },
  sliderImage: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: '10@ms',
    marginLeft: 40,
  },
  sliderContentContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    // paddingHorizontal:15,
    // paddingVertical: '10@ms', // for custom animation
  },
});

export default App;
