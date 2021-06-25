import {
  GetUserId,
  HealthPerm,
  IsAnonymous,
  UserDetail,
  UserDivision,
  UserEmail,
} from '../redux/actions/actions';
import AsyncStorage from '@react-native-community/async-storage';

export async function onUnlinkUpdate(dispatch) {
  await AsyncStorage.removeItem('UserId');
  await AsyncStorage.removeItem('Anonymous');
  await AsyncStorage.removeItem('Email');
  await AsyncStorage.removeItem('Division');
  await AsyncStorage.removeItem('Email');
  dispatch?.(UserDivision(null));
  dispatch?.(UserEmail(null));
  dispatch?.(GetUserId(null));
  dispatch?.(IsAnonymous(true));
  dispatch?.(UserDetail(null));
}
