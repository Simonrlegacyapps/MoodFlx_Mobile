import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
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
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  const fetchSplash = async () => {
    const userData = getStore?.()?.getState?.()?.First;
    const finalUrl = await AsyncStorage.getItem('nextSplashURL');
    const params = {user_id: userData?.UserId};
    if (userData?.UserId) {
      await axios
        .post(BASE_URL_PRODUCTION_API + 'getSplashScreen', params)
        .then(async resp => {
          if (!resp?.data?.splash_screen.includes(finalUrl)) {
            if (!resp?.data?.splash_screen.includes('splash_screen.svg')) {
              try {
                await AsyncStorage.setItem(
                  'nextSplashURL',
                  resp?.data?.splash_screen,
                );
                setUpdatedImageURL(resp?.data?.splash_screen);
              } catch (error) {
                logger('Async Storage setItem error: ', error);
              }
            } else {
              await AsyncStorage.removeItem('nextSplashURL')
                .then(() => {})
                .catch(e => {});
            }
          }
        })
        .catch(error => {
          logger(error, 'error fetching splash');
        });
    } else {
      logger('not a vatility user');
    }
  };
  return (
    <View style={styles.container}>
      <Image ource={{uri: upDatedImageURL}} />
      <Image
        source={
          imageURL
            ? {uri: imageURL}
            : require('../../../assets/default_splash.png')
        }
        style={styles.splashImage}
      />
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
    resizeMode: 'cover', // Optional: Adjust the image scaling
  },
});

export default SplashScreen;
