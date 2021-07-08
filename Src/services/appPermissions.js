import {
  PERMISSIONS,
  check,
  request,
  RESULTS,
  requestNotifications,
  checkNotifications,
} from 'react-native-permissions';
import { Platform, Linking, Alert } from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import AsyncStorage from '@react-native-community/async-storage';
import GetLocation from 'react-native-get-location';

const PERMS = AppleHealthKit.Constants.Permissions;
import { HealthPerm, NotificationPerm, SetLocation, SleepPerm, WeatherPerm } from '../redux/actions/actions';

const CAMERA_PERMISSION = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
};

const LOCATION_PERMISSION = {
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

const REQUEST_PERMISSION_TYPE = {
  camera: CAMERA_PERMISSION,
  location: LOCATION_PERMISSION,
};

const PERMISSION_TYPE = {
  camera: 'camera',
  location: 'location',
};

const googleFitScopes = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_ACTIVITY_WRITE,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_BODY_WRITE,
    Scopes.FITNESS_SLEEP_READ,
    Scopes.FITNESS_HEART_RATE_READ,
    Scopes.FITNESS_BLOOD_PRESSURE_READ,
  ],
};

const activityHealthKitOptions = {
  permissions: {
    read: [
      PERMS.DateOfBirth,
      PERMS.Weight,
      PERMS.Height,
      // PERMS.BodyMassIndex,
      // PERMS.LeanBodyMass,
      // PERMS.BodyFatPercentage,
      PERMS.StepCount,
      PERMS.Steps,
      // PERMS.BodyTemperature,
      PERMS.BloodPressureDiastolic,
      PERMS.BloodPressureSystolic,
      PERMS.ActiveEnergyBurned, //
      // PERMS.BasalEnergyBurned, //
      PERMS.DistanceWalkingRunning, //
      PERMS.HeartRate,

      // PERMS.FlightsClimbed,
      PERMS.DistanceCycling,
      PERMS.Workout,
      // PERMS.StandHours,
    ],
  },
};

class MoodFloPermission {
  checkPermission = async (type): Promise<boolean> => {
    const permission = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    if (!permission) {
      return true;
    }
    try {
      const result = await check(permission);
      if (result === RESULTS.GRANTED) {
        return true;
      }
      // return this.requestPermission(permission);
    } catch (error) {
      console.log('error in permission', error);

      return false;
    }
  };

  requestPermission = async (permission): Promise<boolean> => {
    console.log('permisson', permission);

    try {
      const result = await request(permission);
      console.log('result', result);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.log('error ', error);

      return false;
    }
  };

  gotoSettingsPageiOS = async () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'MOODFLO',
        'You denied the permission. Please accept the permission from settings to give permission.',
        [
          {
            text: 'OK',
            onPress: () => Linking.openURL('app-settings:'),
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert(
        'MOODFLO',
        'You denied the permission. Please accept the permission from settings to give permission.',
        [
          {
            text: 'OK',
            onPress: () => Linking.openSettings(),
          },
        ],
        { cancelable: false },
      );
    }
  };

  requestMultiple = async (types): Promise<boolean> => {
    console.log('permission type', types);
    const results = [];
    for (const type of types) {
      const permission = REQUEST_PERMISSION_TYPE[type][Platform.OS];
      if (permission) {
        const result = await this.requestPermission(permission);
        results.push(result);
      }
    }
    for (const result of results) {
      if (!result) {
        return false;
      }
    }
    return true;
  };

  checkPermissionForOnboardingFlow = async (type): Promise<boolean> => {
    const permission = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    if (!permission) {
      return true;
    }
    try {
      const result = await check(permission);
      if (result === RESULTS.GRANTED) {
        return true;
      }
      return false;
    } catch (error) {
      console.log('error in permission', error);

      return false;
    }
  };

  checkAppPermissions = async (dispatch) => {
    if (!dispatch) {
      return false;
    }

    // Notification permission
    if (Platform.OS === 'android') {
      dispatch(NotificationPerm(true));
    } else {
      try {
        const isNotificationPermissionGiven = await this.checkNotificationPermission();
        dispatch(NotificationPerm(isNotificationPermissionGiven));
      } catch (error) {
        console.log('error in notification permission', error);
      }
    }

    // Location permission
    let isLocationPermissionGiven = null;
    let location = null;
    try {
      isLocationPermissionGiven = await this.checkPermission(
        PERMISSION_TYPE.location,
      );
    } catch (error) {
      console.log('error in location permission', error);
    }
    try {
      if (isLocationPermissionGiven) {
        location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });
      }
    } catch (error) {
      console.log('error in getCurrentPosition', error);
    }
    if (location?.latitude !== undefined && location?.longitude !== undefined) {
      dispatch(
        SetLocation({
          lat: location.latitude,
          lon: location.longitude,
        }),
      );
    }
    dispatch(WeatherPerm(isLocationPermissionGiven));
    if (isLocationPermissionGiven) {
      await AsyncStorage.setItem('GiveWeatherPerm', 'true');
    } else {
      await AsyncStorage.removeItem('GiveWeatherPerm');
    }
  };

  checkNotificationPermission = async (): Promise<Boolean> => {
    if (Platform.OS === 'android') {
      return true;
    }
    const { status, settings } = await checkNotifications();
    return status === RESULTS.GRANTED;
  };

  requestNotificationPermission = async (): Promise<Boolean> => {
    if (Platform.OS === 'android') {
      return true;
    }
    const { status, settings } = await requestNotifications([
      'alert',
      'sound',
      'badge',
    ]);
    console.log('got permssions for: ', settings);
    return status === RESULTS.GRANTED;
  };

  requestLocationPermission = async (dispatch) => {
    if (!dispatch) {
      return false;
    }
    try {
      let isGiven = false;
      if (Platform.OS === 'android') {
        isGiven = await this.requestPermission(LOCATION_PERMISSION.android);
      } else {
        isGiven = await this.requestPermission(LOCATION_PERMISSION.ios);
      }
      console.log('Location permission isGiven: ', isGiven);
      if (isGiven) {
        AsyncStorage.setItem('GiveWeatherPerm', 'true')
          .then(() => {
            dispatch(WeatherPerm(true));
          })
          .catch((error) => {
            console.log('Async storage set GiveWeatherPerm Error', error);
          });
      } else {
        await AsyncStorage.removeItem('GiveWeatherPerm');
        this.gotoSettingsPageiOS();
      }
    } catch (error) {
      console.log('error in request location permission ', error);
      return false;
    }
  };

  requestActivityPermission = async (dispatch) => {
    if (!dispatch) {
      return false;
    }

    if (Platform.OS === 'ios') {
      AppleHealthKit.initHealthKit(activityHealthKitOptions, (err, results) => {
        // {"permissions": {"read": [0], "write": []}}
        if (err) {
          console.log(
            'Activity HealtKit Permissions getAuthStatus error: ',
            err,
          );
        }
        // console.log('Sleep Analysis getAuthStatus +++++++++======>>>>', result);
        console.log(
          'requestActivityIOSPermission',
          ' activityHealthKitOptions.permissions.read: ',
          activityHealthKitOptions.permissions.read,
          ' results: ',
          results,
          ' Object.keys(activityHealthKitOptions.permissions.read).length: ',
          Object.keys(activityHealthKitOptions.permissions.read).length,
        );
        if (results === 1) {
          console.log('Activity Permission given');
          AsyncStorage.setItem('GiveHealthPerm', 'true')
            .then(() => {
              dispatch(HealthPerm(true));
            })
            .catch((error) => {
              console.log('Async storage set GiveHealthPerm Error', error);
            });
        } else {
          console.log('Activity Permission not given');
        }
      });
    } else if (Platform.OS === 'android') {
      try {
        await GoogleFit.checkIsAuthorized();
        console.log('Google Fit isAuthorized: ', GoogleFit.isAuthorized);
        if (!GoogleFit.isAuthorized) {
          await GoogleFit.authorize(googleFitScopes)
            .then((authResult) => {
              if (authResult.success) {
                console.log('AUTH_SUCCESS');
                AsyncStorage.setItem('GiveHealthPerm', 'true')
                  .then(() => {
                    dispatch(HealthPerm(true));
                  })
                  .catch((error) => {
                    console.log(
                      'Async storage set GiveHealthPerm Error',
                      error,
                    );
                  });
                AsyncStorage.setItem('GiveSleepPerm', 'true')
                  .then(() => {
                    dispatch(SleepPerm(true));
                  })
                  .catch((error) => {
                    console.log('Async storage set GiveSleepPerm Error', error);
                  });
              } else {
                console.log(
                  'GoogleFit permission AUTH_DENIED',
                  authResult.message,
                );
              }
            })
            .catch(() => {
              console.log('GoogleFit permission AUTH_ERROR');
            });
        }
      } catch (error) {
        console.log('Google Fit checkAuthorization error: ', error);
      }
    }
  };
}

const AppPermissions = new MoodFloPermission();
export {
  AppPermissions,
  PERMISSION_TYPE,
  googleFitScopes,
  activityHealthKitOptions,
};
