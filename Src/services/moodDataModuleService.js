import {NativeModules} from 'react-native';
const {MoodDataModule = null} = NativeModules;

export const getLightDataIOS = (callback) => {
  MoodDataModule?.getLightDataIOS?.(callback);
};
