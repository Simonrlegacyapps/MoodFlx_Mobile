import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {logger} from '../../..';
import getStore from '../../redux';
import axios from 'axios';
import {BASE_URL_PRODUCTION_API} from '../../Constants/constants';

const SplashScreen = ({onLoaded}) => {
  const [imageURL, setImageURL] = useState();
  const [upDatedImageURL, setUpdatedImageURL] = useState();

  useEffect(() => {
    getURLFromLocal();
    fetchSplash();
  }, []);

  const getURLFromLocal = async () => {
    try {
      const finalUrl = await AsyncStorage.getItem('splashURL');
      if (finalUrl) {
        setImageURL(finalUrl);
      }
    } catch (error) {
      logger(error, 'error getting splash from Async storage');
    } finally {
      // Change the duration as needed
      const timer = setTimeout(() => {
        onLoaded();
      }, 4000);
      return () => clearTimeout(timer);
    }
  };

  const fetchSplash = async () => {
    const userData = getStore?.()?.getState?.()?.First;
    const finalUrl = await AsyncStorage.getItem('nextSplashURL');
    const userID = await AsyncStorage.getItem('UID');
    const params = {user_id: userData?.UserId || userID};
    if (userData?.UserId || userID) {
      await axios
        .post(BASE_URL_PRODUCTION_API + 'getSplashScreen', params)
        .then(async resp => {
          if (resp?.data?.splash_screen === '') {
            try {
              await AsyncStorage.removeItem('splashURL');
              await AsyncStorage.removeItem('nextSplashURL');
            } catch (error) {
              console.log('remove splashURL error --- ', error);
            }
            return;
          }
          if (!resp?.data?.splash_screen.includes(finalUrl)) {
            try {
              await AsyncStorage.setItem('nextSplashURL',resp?.data?.splash_screen);
              setUpdatedImageURL(resp?.data?.splash_screen);
            } catch (error) {
              logger('Async Storage setItem error: ', error);
            }
          }
        })
        .catch(error => {
          logger(error, 'error fetching splash');
        });
    } else {
      try {
        await AsyncStorage.removeItem('splashURL');
        await AsyncStorage.removeItem('UID');
      } catch (error) {
        console.log('removed UID --- ', error);
      }
      logger('not a vatility user');
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <>
          <FastImage
            style={{height: 0, width: 0}}
            source={{uri: upDatedImageURL, cache: FastImage.cacheControl.web}}
            resizeMode={FastImage.resizeMode.cover}
          />

          <FastImage
            style={styles.splashImage}
            source={
              imageURL
                ? {uri: imageURL, cache: FastImage.cacheControl.web}
                : require('../../../assets/default_splash.png')
            }
            resizeMode={FastImage.resizeMode.stretch}
            onLoad={res => {
              logger(res, 'onload');
            }}
            onLoaded={res => {
              logger(res, 'onloaded');
            }}
          />
        </>
      ) : (
        <>
      <Image source={{uri: upDatedImageURL}} />
      <Image
        source={
          imageURL
            ? {uri: imageURL}
            : require('../../../assets/default_splash.png')
        }
        style={styles.splashImage}
      />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Change the background color if needed
  },
  splashImage: {
    width: '100%',
    height: '100%', // Adjust the size of the image as needed
  },
  androidSplashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Adjust the size of the image as needed
  },
});

export default SplashScreen;
