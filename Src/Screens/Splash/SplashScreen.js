import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {logger} from '../../..';

const SplashScreen = ({onLoaded}) => {
  const [imageURL, setImageURL] = useState();

  useEffect(() => {
    // Start retrieving the URL immediately
    getURLFromLocal();
    const timer = setTimeout(() => {
      onLoaded();
    }, 5000); // Change the duration as needed
    return () => clearTimeout(timer);
  }, []);

  const getURLFromLocal = async () => {
    try {
      const finalUrl = await AsyncStorage.getItem('splashURL');
      finalUrl &&  setImageURL(finalUrl);
    } catch (error) {
      logger(error, 'error getting splash from Async storage');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={
          imageURL
            ? { uri: imageURL }
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
