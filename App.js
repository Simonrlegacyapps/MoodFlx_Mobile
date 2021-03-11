import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  Text,
  Image,
  ImageBackground,
  LogBox,
  SafeAreaView,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {createStore, applyMiddleware} from 'redux';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
import {ScaledSheet} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import MoodEmotionDetector from './Src/Screens/MoodEmotionDetector';
import MoodEmotionDetectorTouch from './Src/Screens/MoodEmotionDetectorTouch';

LogBox.ignoreAllLogs();
// const sagaMiddleware = createSagaMiddleware();
// const store = createStore(reducer, applyMiddleware(sagaMiddleware));
// const persistor = persistStore(store);

// sagaMiddleware.run(sagas);
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

const App: () => React$Node = () => {
  const [screenName, setScreenName] = useState(false);
  useEffect(() => {
    try {
      let data = AsyncStorage.getItem('WelcomeScreen');
      if (data !== null) {
        setScreenName(true);
      } else {
        setScreenName(false);
      }
    } catch (e) {
      console.warn(e);
    }
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  const _renderItem = ({item}) => {
    return (
      <View style={styles.welRenderWrapper}>
        <Text style={styles.welTitletext}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const _onDone = async () => {
    try {
      await AsyncStorage.setItem('WelcomeScreen', 'true');
      setScreenName(true);
    } catch (e) {
      console.warn(e);
    }
  };

  /********************************Request Permission Token**********************/
  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   } else {
  //     await messaging.requestPermission();
  //   }
  // }

  return (
    <>
      {screenName === true ? (
        <NavigationContainer>
          <StatusBar backgroundColor={'lightgreen'} barStyle="light-content" />
          <SafeAreaView style={{flex: 1}}>
            <SafeAreaProvider>
              <View style={styles.container}>
                <MoodEmotionDetector />
                {/* <MoodEmotionDetectorTouch /> */}
                <Text>Hello Mood Flo</Text>
                {/* <Provider store={store}> */}
                {/* <PersistGate
                  loading={<Spinner visible={true} />}
                  persistor={persistor}
                >
                  <Routes />
                  <Loader />
                  <Toast ref={(ref) => Toast.setRef(ref)} />
                </PersistGate> */}
                {/* </Provider> */}
              </View>
            </SafeAreaProvider>
          </SafeAreaView>
        </NavigationContainer>
      ) : (
        <ImageBackground
          source={require('./assets/welcomeBackground/WelcomeImage.jpg')}
          style={{flex: 1}}>
          <View style={{flex: 1, backgroundColor: 'black', opacity: 0.8}}>
            <View style={styles.welcomeTextWrapper}>
              <Text style={styles.welcometextStyle}>Welcome</Text>
            </View>
            <AppIntroSlider
              renderItem={_renderItem}
              dotStyle={styles.welcomeDotStyle}
              activeDotStyle={styles.activeWelcomeDotStyle}
              data={slides}
              onDone={_onDone}
            />
            {/* <View style={styles.welcomeLogoStyle}>
              <Image source={Constants.Images.Icon} />
            </View> */}
          </View>
        </ImageBackground>
      )}
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
});

export default App;
