import React, { useEffect, useState } from 'react';
import { View, StatusBar, Text, ImageBackground, LogBox, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
import { ScaledSheet } from 'react-native-size-matters';
import StackNavigation from './Src/navigator/StackNavigation';

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

  const _renderItem = ({ item }) => {
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


  return (
    <>
      {screenName === true ? (
        <NavigationContainer>
          <StatusBar backgroundColor={'lightgreen'} barStyle="light-content" />
          <SafeAreaView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <View style={styles.container}>
                <StackNavigation />
              </View>
            </SafeAreaProvider>
          </SafeAreaView>
        </NavigationContainer>
      ) : (
        <ImageBackground
          source={require('./assets/welcomeBackground/WelcomeImage.jpg')}
          style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: 'black', opacity: 0.8 }}>
            <View style={styles.welcomeTextWrapper}>
              <Text style={styles.welcometextStyle}>Welcome</Text>
            </View>
            <AppIntroSlider
              renderItem={_renderItem}
              dotStyle={styles.welcomeDotStyle}
              activeDotStyle={styles.activeWelcomeDotStyle}
              data={slides}
              onDone={_onDone} />
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
  welcomeTextWrapper: { position: 'absolute', top: '15%', alignSelf: 'center' },
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
