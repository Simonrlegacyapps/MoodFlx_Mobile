import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  InteractionManager,
  Linking,
} from 'react-native';
import moment from 'moment';
import axios from 'axios';
// import AppleHealthKit from 'rn-apple-healthkit';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';
import isEmpty from 'lodash.isempty';
import GetLocation from 'react-native-get-location';
import DeviceInfo from 'react-native-device-info';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {
  RubikBlack,
  RubikBold,
  RubikExtraBold,
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import Swiper from '../../Components/Swiper';
import AsyncStorage from '@react-native-community/async-storage';
import { useRoute } from '@react-navigation/native';
import FitnessData from '../Home/FitnessData';
import WeatherData from '../Home/WeatherData/WeatherData';
import ScreenData from '../Home/screenData/screenData';
import SleepData from '../Home/SleepData/SleepData';
import { useDispatch, useSelector } from 'react-redux';
import {
  DaySteps,
  DayTemp,
  GetCalories,
  GetDistance,
  GetDOB,
  GetMovingTime,
  GetSteps,
  GetWorkouts,
  HealthPerm,
  SetFitnessSyncText,
  SleepPerm,
  UserCalories,
  UserDistance,
  UserMoodCount,
  UserMoveTime,
  UserSteps,
  WeatherPerm,
} from '../../redux/actions/actions';
import messaging, { firebase } from '@react-native-firebase/messaging';
import LightData from '../Home/LightData/LightData';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import {
  AppInstalledChecker,
  CheckPackageInstallation,
} from 'react-native-check-app-install';
import RNAndroidInstalledApps from 'react-native-android-installed-apps';
import InstallGoogleFitModal from '../../Components/Modals/InstallGoogleFitModal/InstallGoogleFitModal';
import {
  googleFitScopes,
  activityHealthKitOptions,
} from '../../services/appPermissions';
import { dataTypes, getScreensPriority } from '../../Constants/constants';
import { setFitnessDataSync, setSwiperIndexHome } from '../../services/commonService';
import { setSleepDataSync } from '../Home/SleepData/sleepDataService';

const { width: SIZE, height: HEIGHT } = Dimensions.get('window');
let steps = false;
let HeartRate = false;
let workOuts = null;
let BP = null;
let dateOfBirth = null;
let mainCalories = null;
let mainDistance = null;
let mainMoving = null;
let mainWorkout = null;
let userSteps = 0;
let userCalories = 0;
let userDistance = 0;
let userMoveTime = 0;
let userWeight = 0;
// let userHeight = 0;

const data = [
  { x: 1, y: 1.2 },
  { x: 2, y: 2.3 },
  { x: 3, y: 2.42 },
  { x: 4, y: 1.1 },
  { x: 5, y: 2.41 },
  { x: 6, y: 2.43 },
  { x: 7, y: 2.2 },
];

const dataLow = [
  { x: 1, y: 10 },
  { x: 2, y: 20 },
  { x: 3, y: 29 },
  { x: 4, y: 18 },
  { x: 5, y: 22 },
  { x: 6, y: 20 },
  { x: 7, y: 23 },
];

// const points = monotoneCubicInterpolation({data, range: 30});
// const pointsLow = monotoneCubicInterpolation({dataLow, range: 30});

const PERMS = AppleHealthKit.Constants.Permissions;

const App = (props) => {
  const UserData = useSelector((state) => state.First);

  // const [Weight, setWeight] = useState(false);
  const [Weather, setWeather] = useState(false);
  // const [lng, setlng] = useState(false);
  // const [lat, setlat] = useState(false);
  // const [BP, setBP] = useState(false);
  const [allHeights, setallHeights] = useState(false);
  const [temp, settemp] = useState(false);
  const [StepCount, setStepCount] = useState(false);
  const [BodyFatPerc, setBodyFatPerc] = useState(false);
  const [BMI, setBMI] = useState(false);
  const [DateOfBirth, setDateOfBirth] = useState(false);
  // const [Height, setHeight] = useState(false);
  const [Calories, setCalories] = useState(false);
  const [Sleep, setSleep] = useState(false);
  // const [HeartRate, setHeartRate] = useState(false);
  const [Distance, setDistance] = useState(false);
  const [LatestWeight, setLatestWeight] = useState(false);
  const [MovingTime, setMovingTime] = useState(false);
  const [Workouts, setWorkouts] = useState(false);
  const [Perm, setPerm] = useState('');
  const [PermWeather, setPermWeather] = useState(false);
  const [PermScreenTime, setPermScreenTime] = useState(false);
  const [TodayStep, setTodayStep] = useState(0);
  const [TodayCalories, setTodayCalories] = useState(0);
  const [TodayDistance, setTodayDistance] = useState(0);
  const [MoveTime, setMoveTime] = useState(0);
  const [Ones, setOnes] = useState(0);
  const [Twos, setTwos] = useState(0);
  const [Threes, setThrees] = useState(0);
  const [Fours, setFours] = useState(0);
  const [Fives, setFives] = useState(0);
  const [Sixes, setSixes] = useState(0);
  const [MoodCount, setMoodCount] = useState(0);
  const [Loading, setLoading] = useState(
    UserData.HealthPermission ? true : false,
  );
  const prevHealthPermission = useRef(UserData.HealthPermission);
  // const [callOneTime, setcallOneTime] = useState('one');
  const [TryWeather, setTryWeather] = useState(null);
  const [ScreenDataPermModal, setScreenDataPermModal] = useState(false);
  const route = useRoute();
  const [loadAgain, setloadAgain] = useState(1);
  const [isInstallGoogleFitModalVisible, setIsInstallGoogleFitModalVisible] = useState(false);
  const [healthUpdateApiCount, setHealthUpdateApiCount] = useState(0);
  const { lat, long, isMoodUpdate } = route.params.cord;

  // const a = moment().subtract(1, 'months').format('DD MMM YYYY');
  // const a = moment().subtract(1, 'days').format('DD MMM YYYY'); // yesterday
  // const a = moment(); //today
  const a = moment().subtract(1, 'days').endOf('day').toString();
  const b = moment().subtract(0, 'days').startOf('day').toString();
  // console.log(`b`, Date.parse(b));
  const swiperIndex = UserData.swiperIndex;

  const stepsCount = {
    startDate: new Date(a).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
  };

  const healthKitWeight = {
    unit: 'kg',
  };

  const TimeCount = {
    startDate: new Date(a).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
    type: 'Walking', // one of: ['Walking', 'StairClimbing', 'Running', 'Cycling', 'Workout']
  };

  const WorkoutTimeCount = {
    startDate: new Date(a).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
    type: 'Workout', // one of: ['Walking', 'StairClimbing', 'Running', 'Cycling', 'Workout']
  };

  const dispatch = useDispatch();

  const mainToken = async () => {
    // firebase.initializeApp();
    const fcmToken = await messaging().getToken();
    try {
      await AsyncStorage.setItem('device_token', fcmToken);
    } catch (e) {
      console.log('error saving device token in async storage');
    }
    console.log(`mainToken`, fcmToken);
  };

  useEffect(() => {
    mainToken();

    // messaging()
    //   .requestPermission({
    //     provisional: true,
    //   })
    //   .then((authStatus) => {
    //     const enabled =
    //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    //     if (enabled) {
    //       console.log('Authorization status:', authStatus);
    //     } else {
    //       console.log('not Authorization status:', authStatus);
    //     }
    //   });

    // const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    //   console.log(`remoteMessage`, remoteMessage);
    //   return unsubscribe;
    // });

    // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //   console.log('Message handled in the background!', remoteMessage);
    // });

    // const data = {
    //   device_token: fcmToken,
    //   platform: Platform.OS,
    //   enable_notification: true,
    //   id: userData.id
    // }
  }, []);

  useEffect(() => {
    callAnApi();
    return () => {
      steps = null;
      HeartRate = null;
      workOuts = null;
      BP = null;
      dateOfBirth = null;
      mainCalories = null;
      mainDistance = null;
      mainMoving = null;
      mainWorkout = null;
      userSteps = 0;
      userCalories = 0;
      userDistance = 0;
      userMoveTime = 0;
    };
  }, [UserData.UserEmail]);

  useEffect(() => {
    // console.log(
    //   'HomeTab UserData.HealthPermission: ',
    //   UserData.HealthPermission,
    //   ' prevHealthPermission: ',
    //   prevHealthPermission.current,
    //   ' steps: ',
    //   steps,
    // );
    if (!prevHealthPermission.current && UserData.HealthPermission && !steps) {
      // console.log(
      //   'HomeTab useEffect UserData.HealthPermission: condition true',
      //   UserData.HealthPermission,
      // );
      prevHealthPermission.current = true;
      callAnApi();
    }
  }, [UserData.HealthPermission]);

  const callAnApi = async () => {
    let p = await AsyncStorage.getItem('GiveHealthPerm');
    let MCount = await AsyncStorage.getItem('MoodCount');
    let e = await JSON.parse(MCount);
    setMoodCount(e);
    dispatch(UserMoodCount(e));
    // console.log(`mood count again`, e);
    let HealthP = await JSON.parse(p);
    dispatch(HealthPerm(HealthP));
    // console.log(`HealthP`, HealthP);
    if (HealthP != null) {
      await OnAutoSync(function (flag, dataSyncArray) {
        setFitnessDataSync(dispatch, dataSyncArray);
        console.log('onFinish called', flag);
        setLoading(false);
        const timeoutId = setTimeout(async () => {
          // const steps_data = await UserData.MainSteps;
          console.log(`steps_data`, steps);
          if (steps) {
            console.log('good to go for API in async here at top');
            console.log(`steps`, steps);
            filterDates();
            filterSteps();
            AddDataToFilter();
          }
          clearTimeout(timeoutId);
        }, 500);
      });
    }
  };

  const checkStorage = async () => {
    // console.log(`checkStorage called`);
    // setLoading(UserData.HealthPermission ? true : false);
    let MCount = await AsyncStorage.getItem('MoodCount');
    let e = await JSON.parse(MCount);
    setMoodCount(e);
    dispatch(UserMoodCount(e));
    // console.log(`mood count again`, e);
    console.log('good to go for API in async here at top');
    const onAutoSyncTimeoutId = setTimeout(async () => {
      await OnAutoSync(async function (flag, dataSyncArray) {
        // console.log("onFinish called", flag);
        if (flag === true) {
          try {
            await AsyncStorage.setItem('GiveHealthPerm', 'true');
            dispatch(HealthPerm(true));
          } catch (error) {
            console.log('Async set item Health Permission error', error);
          }
          if (Platform.OS === 'android') {
            try {
              await AsyncStorage.setItem('GiveSleepPerm', 'true');
              dispatch(SleepPerm(true));
              setSleepDataSync(dispatch);
            } catch (error) {
              console.log('Async set item Health Permission error', error);
            }
          }
        }
        setFitnessDataSync(dispatch, dataSyncArray);
        setLoading(false);
        const timeoutId = setTimeout(async () => {
          console.log('steps', steps);
          if (steps) {
            filterDates();
            filterSteps();
            AddDataToFilter();
          }
          clearTimeout(timeoutId);
        }, 500);
      });
      clearTimeout(onAutoSyncTimeoutId);
    }, 500);
  };

  const OnAutoSync = async (onFinish) => {
    console.log(`auto sync function called`);
    let count = 0;
    //for ios if count === 11 - call onFinish function
    // const a = moment().subtract(1, 'months').format('DD MMM YYYY');

    // console.log('moment() month', new Date(a).toISOString());
    // console.log(
    //   `api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lng}&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
    // );
    if (Platform.OS === 'ios') {
      const healthKitOptions = activityHealthKitOptions;
      let dataSyncArray = [];
      !UserData.HealthPermission && dispatch?.(SetFitnessSyncText('Trying to Sync'));
      // console.log(`-------------qwertyuiopasdfghjklzxcvbnm-----------------,`);
      AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
        // setLoading(true);
        console.log(
          `healthKitOptions`,
          healthKitOptions.permissions.read,
          results,
          Object.keys(healthKitOptions.permissions.read).length,
        );
        if (
          Object.keys(healthKitOptions.permissions.read).length + 1 !=
          results
        ) {
          // Linking.openURL('App-Prefs:Privacy');
          // Linking.openSettings('Health');
        }
        if (err) {
          console.log('error initializing Healthkit: ', err);
          onFinish?.(false);
          return;
        }
        setLoading(true);
        // Date of Birth Example
        // AppleHealthKit.getDateOfBirth(null, async (err, results) => {
        //   if (err) {
        //     count++;
        //     console.log(`count==> `, count);
        //     count === 11 && onFinish?.(true);
        //     console.log('error getDateOfBirth: ', err);
        //     return;
        //   }
        //   dateOfBirth = results;
        //   dispatch(GetDOB(results));
        //   setDateOfBirth(results);
        //   count++;
        //   console.log(`count==> `, count);
        //   count === 11 && onFinish?.(true);
        //   //  console.log('age', results);
        // });

        AppleHealthKit.getLatestWeight(
          healthKitWeight,
          (err: string, results: HealthValue) => {
            if (err) {
              count++;
              console.log(`count==> `, count);
              count === 8 && onFinish?.(true, dataSyncArray);
              console.log('error getting latest weight: ', err);
              return;
            }
            // {
            //   "value": 200,
            //   "startDate": "2016-07-08T12:00:00.000-0400",
            //   "endDate": "2016-07-08T12:00:00.000-0400"
            // }
            count++;
            console.log(`count==> `, count);
            console.log('User weight: ', results);
            userWeight = results?.value ?? 0;
            results?.value !== undefined && dataSyncArray.push(PERMS.Weight);
            count === 8 && onFinish?.(true, dataSyncArray);
          },
        );

        // AppleHealthKit.getLatestHeight(
        //   null,
        //   (err: string, results: HealthValue) => {
        //     if (err) {
        //       console.log('error getLatestHeight: ', err);
        //       count++;
        //       console.log(`count==> `, count);
        //       count === 8 && onFinish?.(true);
        //       return;
        //     }
        //     count++;
        //     console.log(`count==> `, count);
        //     count === 8 && onFinish?.(true);
        //     console.log('User Height: ', results);
        //     userHeight = results?.value?.toFixed
        //       ? Number(results.value.toFixed(2))
        //       : 0;
        //   },
        // );

        AppleHealthKit.getDailyStepCountSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            if (err) {
              console.log('error getDailyStepCountSamples: ', err);
              count++;
              console.log(`count==> `, count);
              count === 8 && onFinish?.(true, dataSyncArray);
              return;
            }
            console.log(`results of all steps `, results);
            dispatch(GetSteps(results));
            !isEmpty(results) && dataSyncArray.push(PERMS.StepCount, PERMS.Steps);
            let total = 0;
            let zero = 0;
            let ones = 0;
            let twos = 0;
            let threes = 0;
            let fours = 0;
            let fives = 0;
            let all = [];
            steps = results;
            for (let j in results) {
              total = total + (results[j]?.value ?? 0);
              if (
                results?.[j]?.startDate &&
                moment(results[j].startDate).isValid() &&
                results?.[j]?.value
              ) {
                if (
                  moment(results[j].startDate).startOf('day') <
                  moment(results[j].startDate) &&
                  moment(results[j].startDate) <
                  moment(results[j].startDate).startOf('day').hours(4)
                ) {
                  console.log(`0`);
                  zero = zero + results[j].value;
                  setOnes(zero);
                } else if (
                  moment(results[j].startDate).startOf('day').hours(4) <
                  moment(results[j].startDate) &&
                  moment(results[j].startDate) <
                  moment(results[j].startDate).startOf('day').hours(8)
                ) {
                  console.log(`2`, results[j].value);
                  ones = ones + results[j].value;
                  setTwos(ones);
                } else if (
                  moment(results[j].startDate).startOf('day').hours(8) <=
                  moment(results[j].startDate) &&
                  moment(results[j].startDate) <=
                  moment(results[j].startDate).startOf('day').hours(12)
                ) {
                  twos = twos + results[j].value;
                  console.log(`3`, twos);
                  setThrees(twos);
                  //add setzeros to this.
                } else if (
                  moment(results[j].startDate).startOf('day').hours(12) <=
                  moment(results[j].startDate) &&
                  moment(results[j].startDate) <=
                  moment(results[j].startDate).startOf('day').hours(16)
                ) {
                  threes = threes + results[j].value;
                  console.log(`4`, threes);
                  setFours(threes);
                } else if (
                  moment(results[j].startDate).startOf('day').hours(16) <
                  moment(results[j].startDate) &&
                  moment(results[j].startDate) <
                  moment(results[j].startDate).startOf('day').hours(20)
                ) {
                  fours = fours + results[j].value;
                  console.log(`5`, results[j].value);
                  setFives(fours);
                } else {
                  fives = fives + results[j].value;
                  console.log(`6`, results[j].value);
                  setSixes(fives);
                }
              }
            }
            all.push({
              two: zero,
              three: ones,
              four: twos,
              five: threes,
              six: fours,
              seven: fives,
            });

            console.log(`all ====++++>>>>>>`, all);
            dispatch(DaySteps(all));
            dispatch(UserSteps(total));
            count++;
            console.log(`count==> `, count);
            count === 8 && onFinish?.(true, dataSyncArray);
            // console.log('All steps ++++', results, total);
          },
        );
        AppleHealthKit.getBloodPressureSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            if (err) {
              console.log('error getBloodPressureSamples: ', err);
              count++;
              console.log(`count==> `, count);
              count === 8 && onFinish?.(true, dataSyncArray);
              return;
            }
            // setBP(results);
            BP = results;
            console.log('All BP', results);
            count++;
            console.log(`count==> `, count);
            !isEmpty(results) && dataSyncArray.push(PERMS.BloodPressureDiastolic, PERMS.BloodPressureSystolic);
            count === 8 && onFinish?.(true, dataSyncArray);
          },
        );
        // Need to check from here for data ================================================================>>>>>>>>>>>>>>>>>>>>
        AppleHealthKit.getActiveEnergyBurned(
          stepsCount,
          async (err: Object, results: Object) => {
            if (err) {
              console.log('error getActiveEnergyBurned: ', err);
              count++;
              console.log(`count==> `, count);
              count === 8 && onFinish?.(true, dataSyncArray);
              return;
            }
            mainCalories = results;
            dispatch(GetCalories(results));
            let total = 0;
            setCalories(results);
            for (let i in results) {
              total = total + results[i].value;
            }
            userCalories = total;
            dispatch(UserCalories(total));
            count++;
            console.log(`count==> `, count);
            !isEmpty(results) && dataSyncArray.push(PERMS.ActiveEnergyBurned);
            count === 8 && onFinish?.(true, dataSyncArray);
            // console.log('Active energy count', results);
          },
        );

        AppleHealthKit.getDailyDistanceWalkingRunningSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            if (err) {
              console.log('error getDailyDistanceWalkingRunningSamples: ', err);
              count++;
              console.log(`count==> `, count);
              count === 8 && onFinish?.(true, dataSyncArray);
              return;
            }
            mainDistance = results;
            dispatch(GetDistance(results));
            let total = 0;
            setDistance(results);
            for (let i in results) {
              total = total + results[i].value;
            }
            userDistance = total;
            dispatch(UserDistance(total));
            // console.log('Distance in KMS', results, total);
            count++;
            console.log(`count==> `, count);
            !isEmpty(results) && dataSyncArray.push(PERMS.DistanceWalkingRunning);
            count === 8 && onFinish?.(true, dataSyncArray);
          },
        );

        AppleHealthKit.getHeartRateSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            if (err) {
              console.log('error getHeartRateSamples: ', err);
              count++;
              console.log(`count==> `, count);
              count === 8 && onFinish?.(true, dataSyncArray);
              return;
            }
            HeartRate = results;
            // setHeartRate(results);
            console.log('Heart Samples', results);
            count++;
            console.log(`count==> `, count);
            !isEmpty(results) && dataSyncArray.push(PERMS.HeartRate);
            count === 8 && onFinish?.(true, dataSyncArray);
          },
        );

        // AppleHealthKit.getSleepSamples(
        //   stepsCount,
        //   async (err: Object, results: Array<Object>) => {
        //     if (err) {
        //       console.log('error getSleepSamples: ', err);
        //       count++;
        //       console.log(`count==> `, count);
        //       count === 11 && onFinish?.(true);
        //       return;
        //     }
        //     setSleep(results);
        //     // console.log('Sleep Analysis +++++++++======>>>>', results);
        //     count++;
        //     console.log(`count==> `, count);
        //     count === 11 && onFinish?.(true);
        //   },
        // );

        AppleHealthKit.getSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            if (err) {
              console.log('error movingTime: ', err);
              count++;
              console.log(`count==> `, count);
              count === 8 && onFinish?.(true, dataSyncArray);
              return;
            }
            mainMoving = results;
            dispatch(GetMovingTime(results));
            let totalWalkTime = 0;
            setMovingTime(results);
            for (let r in results) {
              const startTime = moment(results[r].start);
              const EndTime = moment(results[r].end);
              const diff = EndTime.diff(startTime);
              const diffDuration = moment.duration(diff).asMinutes();
              totalWalkTime = totalWalkTime + diffDuration;
              // }
            }
            dispatch(UserMoveTime(totalWalkTime));
            // console.log(
            //   '<<<<<<<<============== Time walking ==============>>>>>>>>>',
            //   results,
            //   totalWalkTime,
            // );
            count++;
            console.log(`count==> `, count);
            !isEmpty && dataSyncArray.push(PERMS.DistanceCycling);
            count === 8 && onFinish?.(true, dataSyncArray);
          },
        );

        AppleHealthKit.getSamples(
          WorkoutTimeCount,
          async (err: Object, results: Array<Object>) => {
            if (err) {
              console.log('error workout: ', err);
              count++;
              console.log(`count==> `, count);
              count === 8 && onFinish?.(true, dataSyncArray);
              return;
            }
            console.log(
              `workout =++++++++++====++++++++======++++++++++++++++==`,
              results,
            );
            workOuts = results;
            dispatch(GetWorkouts(results));
            // setWorkouts(results);
            count++;
            console.log(`count==> `, count);
            !isEmpty && dataSyncArray.push(PERMS.Workout);
            count === 8 && onFinish?.(true, dataSyncArray);
          },
        );
      });
      // setLoading(false);
    }

    if (Platform.OS === 'android') {
      let isGoogleFitInstalled = '-1';
      try {
        isGoogleFitInstalled = await AppInstalledChecker.checkPackageName(
          'com.google.android.apps.fitness',
        );
        console.log(
          'AppInstalledChecker com.google.android.apps.fitness isInstalled?: ',
          isGoogleFitInstalled,
        );
        if (isGoogleFitInstalled === false) {
          !isInstallGoogleFitModalVisible &&
            setIsInstallGoogleFitModalVisible(true);
          onFinish?.(false);
          return false;
        }
      } catch (error) {
        console.log('error while checking if google fit is installed:', error);
      }

      console.log(`herer?`);
      const s = moment().subtract(1, 'days').endOf('day').toISOString();
      const options = googleFitScopes;
      try {
        await GoogleFit.checkIsAuthorized();
        console.log('Google Fit isAuthorized: ', GoogleFit.isAuthorized);
        if (!GoogleFit.isAuthorized) {
          dispatch?.(SetFitnessSyncText('Trying to Sync'));
          await GoogleFit.authorize(options)
            .then((authResult) => {
              if (authResult.success) {
                console.log('AUTH_SUCCESS');
                setLoading(true);
              } else {
                console.log('AUTH_DENIED', authResult.message);
              }
            })
            .catch(() => {
              console.log('AUTH_ERROR');
            });
        } else {
          setLoading(true);
        }
      } catch (error) {
        console.log('Google Fit checkAuthorization error: ', error);
      }

      const opt = {
        startDate: s, // required ISO8601Timestamp
        endDate: new Date().toISOString(), // required ISO8601Timestamp
        bucketUnit: 'HOUR', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
      };

      let optActivities = {
        startDate: s, // required
        endDate: new Date().toISOString(), // required
        bucketUnit: 'MINUTE', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 15, // optional - default 1.
      };

      const optCalories = {
        startDate: s, // required ISO8601Timestamp
        endDate: new Date().toISOString(), // required ISO8601Timestamp
        bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
      };

      const optDistance = {
        startDate: new Date(2021, 1, 1).toISOString(), // required
        endDate: new Date().toISOString(), // required
        bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
      };

      const optSleep = {
        startDate: new Date(2021, 1, 1).toISOString(), // required, timestamp or ISO8601 string
        endDate: new Date().toISOString(), // required, timestamp or ISO8601 string
      };

      const weightOptions = {
        unit: 'kg', // required; default 'kg'
        startDate: s, // required
        endDate: new Date().toISOString(), // required
        bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
        ascending: false, // optional; default false
      };

      const heightOptions = {
        startDate: s, // required
        endDate: new Date().toISOString(), // required
      };

      const heartRateBPOptions = {
        startDate: s, // required
        endDate: new Date().toISOString(), // required
        bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
      };

      console.log(`entering?`);
      try {
        await GoogleFit.checkIsAuthorized();
        console.log('isGoogleFitAuthorized: ', GoogleFit.isAuthorized);
        if (!GoogleFit.isAuthorized) {
          onFinish?.(false);
          return false;
        }
      } catch (error) {
        onFinish?.(false);
        console.log('GoogleFit check authorization error: ', error);
        return false;
      }

      // get daily steps count
      try {
        const res = await GoogleFit.getDailyStepCountSamples(opt);
        console.log('steps', res);
        // console.log('total user steps', res[2].steps[0].value);
        userSteps = -1;
        let rawSteps = null;
        if (Array.isArray(res) && res.length > 0) {
          res.forEach((e, eIdx) => {
            if (
              e.source === 'com.google.android.gms:estimated_steps' &&
              Array.isArray(e?.steps) &&
              e.steps.length > 0
            ) {
              e.steps.forEach((s) => {
                if (
                  userSteps === -1 &&
                  s.date &&
                  moment(s.date, 'YYYY-MM-DD').isValid() &&
                  moment(s.date, 'YYYY-MM-DD')
                    .startOf('days')
                    .isSame(moment().startOf('days'))
                ) {
                  userSteps = s?.value ? s.value : userSteps;
                  rawSteps =
                    userSteps !== -1 && e?.rawSteps?.length > 0
                      ? e.rawSteps
                      : rawSteps;
                }
              });
            }
          });
          userSteps !== -1 && dispatch(UserSteps(res[2].steps[0].value));
          rawSteps && dispatch(GetSteps(res[2].rawSteps));
          steps = rawSteps;
        }
      } catch (e) {
        console.log('getDailyStepCountSamples error: ', e);
      }
      // count === 2 && onFinish?.(true);
      // GoogleFit.onAuthorize(async function fetchData() {
      // });

      // get activity data
      try {
        const Activities = await GoogleFit.getActivitySamples(optActivities);
        // setActivities(Activities);
        console.log('Activities', Activities);
        dispatch(GetWorkouts(Activities));
        // setWorkouts(Activities);
        workOuts = Activities;
      } catch (e) {
        console.log('getActivitySamples error: ', e);
      }

      // Calories data
      try {
        const _Calories = await GoogleFit.getDailyCalorieSamples(optCalories);
        // setCalories(Calories);
        if (_Calories.length > 0) {
          userCalories = Math.abs(_Calories[0].calorie);
          dispatch(UserCalories(Math.abs(_Calories[0].calorie)));
          mainCalories = _Calories[0];
          dispatch(GetCalories(_Calories[0]));
        }
        console.log(
          'Calories????????????????????????----------------',
          _Calories,
        );
      } catch (e) {
        console.log('getDailyCalorieSamples error: ', e);
      }

      // Distance data
      try {
        const _Distance = await GoogleFit.getDailyDistanceSamples(opt);
        if (_Distance.length > 0) {
          userDistance = Math.ceil(_Distance[0].distance);
          dispatch(UserDistance(Math.ceil(_Distance[0].distance)));
        }
        console.log('getDailyDistanceSamples', _Distance);
      } catch (e) {
        console.log('getDailyDistanceSamples error: ', e);
      }

      // Weight data
      try {
        const Weight = await GoogleFit.getWeightSamples(weightOptions);
        if (Array.isArray(Weight) && Weight.length > 0) {
          userWeight = Math.ceil(Weight?.[0]?.value);
        }
        console.log('getWeightSamples Weight', Weight);
        console.log('userWeight', userWeight);
      } catch (e) {
        console.log('getWeightSamples error: ', e);
      }

      // Height data
      // try {
      //   const Height = await GoogleFit.getHeightSamples(heightOptions);
      //   if (Array.isArray(Height) && Height.length > 0) {
      //     userHeight = Height?.[0]?.value;
      //   }
      //   console.log('getHeightSamples Height', Height);
      //   console.log('userHeight', userHeight);
      // } catch (e) {
      //   console.log('getHeightSamples error: ', e);
      // }

      // Heart Rate data
      try {
        const heartrate = await GoogleFit.getHeartRateSamples(
          heartRateBPOptions,
        );
        if (Array.isArray(heartrate) && heartrate.length > 0) {
          HeartRate = heartrate;
        }
        console.log('getHeartRateSamples', heartrate);
      } catch (e) {
        console.log('getHeartRateSamples error: ', e);
      }

      // Blood Pressure data
      try {
        const bloodpressure = await GoogleFit.getBloodPressureSamples(
          heartRateBPOptions,
        );
        if (Array.isArray(bloodpressure) && bloodpressure.length > 0) {
          BP = bloodpressure;
        }
        console.log('getBloodPressureSamples', bloodpressure);
        onFinish?.(true);
      } catch (e) {
        console.log('getBloodPressureSamples error: ', e);
        onFinish?.(true);
      }
    }

    const health = async () => {
      // RNSamsungHealth.authorize((err, res) => {
      //   if (res) {
      //     // let startDate = new Date().setDate(new Date().getDate() - 30); // 30 days back date
      //     // let endDate = new Date().getTime(); //today's date
      //     // let opt = {startDate, endDate};
      //     // RNSamsungHealth.getDailyStepCount(opt, (err, res) => {
      //     //   if (err) console.log(err);
      //     //   if (res) console.log(res);
      //     // });
      //   }
      //   if (err) {
      //     console.log(`err`, err);
      //   }
      // });
    };
  };

  const dates = [];

  const filterDates = () => {
    console.log(`------------steps in filterdates----------`, steps);

    // steps &&
    //   steps.map((i) => {
    //     var date = moment(i.startDate).format('DD-MMM-YYYY');
    //     if (!dates.includes(date)) {
    //       dates.push(date);
    //     }
    //   });
    // dates.push(moment().subtract(1, 'days').format('DD-MMM-YYYY'),);
    dates.push(moment().format('DD-MMM-YYYY'));
    // console.log('dates', dates);
  };

  const Fsteps = [];
  const WalkTime = [];
  let totalSteps = 0;
  let totalDistance = 0;
  let totalCalories = 0;
  let totalHeartRate = 0;
  let highBp = 0;
  let lowBp = 0;
  let totalWalkTime = 0;
  let zero = 0;
  let ones = 0;
  let twos = 0;
  let threes = 0;
  let fours = 0;
  let fives = 0;

  // const findTime = () => {
  //   for (let r in MovingTime) {
  //     const startTime = moment(MovingTime[r].start);
  //     const EndTime = moment(MovingTime[r].end);
  //     const diff = EndTime.diff(startTime);
  //     const diffDuration = moment.duration(diff).asMinutes();
  //     console.log(`startTime`, startTime, EndTime);
  //     console.log(`end ========== >>>> ${diffDuration} `);
  //   }
  // };
  // console.log(`UserData.UserCalories`, UserData.UserCalories);
  const filterSteps = () => {
    console.log(`check???????????`, dates);

    for (let i in dates) {
      for (let j in steps) {
        let iteratedate = moment(steps[j].startDate).format('DD-MMM-YYYY');
        if (dates[i] === iteratedate) {
          Platform.OS === 'ios'
            ? (totalSteps = totalSteps + steps[j].value)
            : (totalSteps = totalSteps + steps[j].steps);
        }
        if (
          moment(steps[j].startDate).startOf('day') <
          moment(steps[j].startDate) &&
          moment(steps[j].startDate) <
          moment(steps[j].startDate).startOf('day').hours(4)
        ) {
          console.log(`0`);
          zero = zero + steps[j].value;
          setOnes(zero);
        } else if (
          moment(steps[j].startDate).startOf('day').hours(4) <
          moment(steps[j].startDate) &&
          moment(steps[j].startDate) <
          moment(steps[j].startDate).startOf('day').hours(8)
        ) {
          console.log(`2`, steps[j].value);
          ones = ones + steps[j].value;
          setTwos(ones);
        } else if (
          moment(steps[j].startDate).startOf('day').hours(8) <=
          moment(steps[j].startDate) &&
          moment(steps[j].startDate) <=
          moment(steps[j].startDate).startOf('day').hours(12)
        ) {
          twos = twos + steps[j].value;
          console.log(`3`, twos);
          setThrees(twos);
          //add setzeros to this.
        } else if (
          moment(steps[j].startDate).startOf('day').hours(12) <=
          moment(steps[j].startDate) &&
          moment(steps[j].startDate) <=
          moment(steps[j].startDate).startOf('day').hours(16)
        ) {
          threes = threes + steps[j].value;
          console.log(`4`, threes);
          setFours(threes);
        } else if (
          moment(steps[j].startDate).startOf('day').hours(16) <
          moment(steps[j].startDate) &&
          moment(steps[j].startDate) <
          moment(steps[j].startDate).startOf('day').hours(20)
        ) {
          fours = fours + steps[j].value;
          console.log(`5`, steps[j].value);
          setFives(fours);
        } else {
          fives = fives + steps[j].value;
          console.log(`6`, steps[j].value);
          setSixes(fives);
        }
      }
      for (let k in mainDistance) {
        let iteratedate = moment(mainDistance[k].startDate).format(
          'DD-MMM-YYYY',
        );
        if (dates[i] === iteratedate) {
          totalDistance = totalDistance + mainDistance[k].value;
        }
      }
      for (let l in mainCalories) {
        let iteratedate = moment(mainCalories[l].startDate).format(
          'DD-MMM-YYYY',
        );

        if (dates[i] === iteratedate) {
          Platform.OS === 'ios'
            ? (totalCalories = totalCalories + mainCalories[l].value)
            : (totalCalories = totalCalories + mainCalories.calorie / l.length);

          console.log('totalCalories', mainCalories);
        }
      }
      for (let m in HeartRate) {
        let iteratedate = moment(HeartRate[m].startDate).format('DD-MMM-YYYY');
        if (dates[i] === iteratedate) {
          totalHeartRate = totalHeartRate + HeartRate[m].value;
        }
      }
      for (let n in BP) {
        let iteratedate = moment(BP[n].startDate).format('DD-MMM-YYYY');
        if (dates[i] === iteratedate) {
          if (Platform.OS === 'ios') {
            highBp = BP?.[n]?.bloodPressureSystolicValue ?? 0;
            lowBp = BP?.[n]?.bloodPressureDiastolicValue ?? 0;
          } else if (Platform.OS === 'android') {
            highBp = BP?.[n]?.systolic ?? 0;
            lowBp = BP?.[n]?.diastolic ?? 0;
          }
        }
      }
      for (let r in mainMoving) {
        let iteratedate = moment(mainMoving[r].start).format('DD-MMM-YYYY');
        // console.log(`startTime`, startTime, EndTime);
        // console.log(`end ========== >>>> ${diffDuration} `);
        if (dates[i] === iteratedate) {
          const startTime = moment(mainMoving[r].start);
          const EndTime = moment(mainMoving[r].end);
          const diff = EndTime.diff(startTime);
          const diffDuration = moment.duration(diff).asMinutes();
          totalWalkTime = totalWalkTime + diffDuration;
        }
      }
      console.log(`totalSteps`, totalSteps);
      if (
        totalSteps !== 0 ||
        totalDistance !== 0 ||
        userCalories !== 0 ||
        totalHeartRate !== 0 ||
        highBp !== 0 ||
        lowBp !== 0
      ) {
        Fsteps.push({
          date: dates[i],
          steps: totalSteps,
          distance: totalDistance,
          calories: userCalories,
          heart_rate: totalHeartRate,
          high_bp: highBp,
          low_bp: lowBp,
        });
      }
      if (totalWalkTime !== 0) {
        WalkTime.push({
          date: dates[i],
          walkTime: totalWalkTime,
        });
      }
      totalSteps = 0;
      totalDistance = 0;
      totalCalories = 0;
      totalHeartRate = 0;
      highBp = 0;
      lowBp = 0;
      totalWalkTime = 0;
    }
    console.log('Fsteps', Fsteps);
    // console.log(`walkTime |||||||||||| ppppppp =========`, WalkTime);
    // console.log(`Workouts |||||||||||| ppppppp =========`, Workouts);
  };

  const CheckForSleepData = async () => {
    console.log(`Implement screen data`);
    let Sp = await Sleep.getItem('GiveSleepPerm');
    let SleepP = await JSON.parse(Wp);
    dispatch(SleepPerm(SleepP));
  };

  const CheckForScreenData = async () => {
    console.log(`Implement screen data`);
    setScreenDataPermModal(true);
    // let Wp = await AsyncStorage.getItem('GiveSleepPerm');
    // let WeatherP = await JSON.parse(Wp);
    // dispatch(SleepPerm(WeatherP));
  };

  const AddDataToFilter = async () => {
    const deviceId = DeviceInfo.getUniqueId();
    Fsteps.push();

    console.log(`Fsteps at last`, Fsteps);
    console.log(`walkTime at last`, WalkTime > 0);
    console.log(`Fsteps at last`, Fsteps > 0);
    if (
      Fsteps.length > 0 ||
      WalkTime.length > 0 ||
      (workOuts?.length && workOuts.length > 0) ||
      // userHeight !== 0 ||
      dateOfBirth?.value ||
      dateOfBirth?.age ||
      userWeight !== 0
    ) {
      let exercise_time =
        Array.isArray(workOuts) && workOuts.length > 0 ? workOuts : null;
      let moving_time =
        Array.isArray(WalkTime) && WalkTime.length > 0 ? WalkTime : null;
      let steps_data =
        Array.isArray(Fsteps) && Fsteps.length > 0 ? Fsteps : null;
      // console.log('good to go for API');
      // const data = {
      //   device_id: deviceId,
      //   steps: Fsteps,
      //   moving_time: WalkTime,
      //   exercise_time: Workouts,
      // };
      var _axios = require('axios');
      var _data = JSON.stringify({
        device_id: deviceId,
        exercise_time,
        moving_time,
        steps: steps_data,
        // height: Height != null ? Height.value : 0,
        // height: userHeight,
        DOB: 0,
        weight: userWeight,
        age: dateOfBirth?.age ?? 0,
        email: UserData.UserEmail ?? '',
      });
      console.log(`data1111`, _data);

      var config = {
        method: 'post',
        url: 'https://admin.moodflo.com/api/updateStaffHealth',
        headers: {
          'Content-Type': 'application/json',
          Cookie: '__cfduid=de42be196e76a7e54fe0b710d009e4dd11615455418',
        },
        data: _data,
      };

      _axios(config)
        .then(function (response) {
          console.log(
            '✅ ✅ ✅ ✅ Success Update Staff Health ✅ ✅ ✅ ✅',
            response?.data,
          );
          setHealthUpdateApiCount((e) => e + 1);
        })
        .catch(function (error) {
          console.log(
            '❌ ❌ ❌ ❌ Error Update Staff Health ❌ ❌ ❌ ❌',
            error,
          );
        });
    }
    setTodayStep(Fsteps.length > 0 ? (Fsteps[0].steps / 10000) * 100 : 0);
    setTodayDistance(Fsteps.length > 0 ? (Fsteps[0].distance / 5000) * 100 : 0);
    setTodayCalories(Fsteps.length > 0 ? (Fsteps[0].calories / 1000) * 100 : 0);
    setMoveTime(WalkTime.length > 0 ? (WalkTime[0].walkTime / 120) * 100 : 0);
  };

  const dismissInstallGoogleFitModal = useCallback(() => {
    setIsInstallGoogleFitModalVisible(false);
  }, [setIsInstallGoogleFitModalVisible]);

  const onInstallGoogleFit = useCallback(async () => {
    const googleFitPlayStoreUrl =
      'https://play.google.com/store/apps/details?id=com.google.android.apps.fitness';
    const supported = await Linking.canOpenURL(googleFitPlayStoreUrl);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      dismissInstallGoogleFitModal();
      const timeoutId = setTimeout(async () => {
        await Linking.openURL(googleFitPlayStoreUrl);
        clearTimeout(timeoutId);
      }, 500);
    } else {
      console.log(`Don't know how to open this URL: ${googleFitPlayStoreUrl}`);
    }
  }, []);

  // const FitnessData = () => {
  //   return <FitnessData Perm={Perm} checkStorage={checkStorage} />;
  // };

  // console.log(
  //   `zero, ones, twos, threes, fours, fives`,
  //   Ones,
  //   Twos,
  //   Threes,
  //   Fours,
  //   Fives,
  //   Sixes,
  // );

  // console.log(`loading`, Loading);
  const WeatherD = () => {
    InteractionManager.setDeadline(() => {
      return (
        <WeatherData
          data={data}
          dataLow={dataLow}
          Weather={Weather}
          PermWeather={PermWeather}
          lat={lat}
          long={long}
          MoodCount={MoodCount}
        />
      );
    }, 500);
  };

  const getScreen = (type, idx) => {
    if (type === dataTypes.activity) {
      return (
        <FitnessData
          kay={type}
          index={idx}
          swiperIndex={swiperIndex}
          TodayStep={TodayStep}
          TodayCalories={TodayCalories}
          TodayDistance={TodayDistance}
          MoveTime={MoveTime}
          Perm={Perm}
          checkStorage={checkStorage}
          zero={Ones}
          ones={Twos}
          twos={Threes}
          threes={Fours}
          fours={Fives}
          fives={Sixes}
          MoodCount={MoodCount}
          Loading={Loading}
          healthUpdateApiCount={healthUpdateApiCount}
        />
      );
    } else if (type === dataTypes.screenTime) {
      return (
        <ScreenData
          kay={type}
          index={idx}
          swiperIndex={swiperIndex}
          Weather={Weather}
          PermScreenTime={PermScreenTime}
          CheckForScreenData={CheckForScreenData}
          MoodCount={MoodCount}
        />
      );
    } else if (type === dataTypes.weather) {
      return (
        <WeatherData
          kay={type}
          index={idx}
          swiperIndex={swiperIndex}
          MoodCount={MoodCount}
        />
      );
    } else if (type === dataTypes.light) {
      return (
        <LightData
          kay={type}
          index={idx}
          swiperIndex={swiperIndex}
          MoodCount={MoodCount}
        />
      );
    } else if (type === dataTypes.sleep) {
      return (
        <SleepData
          kay={type}
          index={idx}
          swiperIndex={swiperIndex}
          isMoodUpdate={isMoodUpdate}
          CheckForSleepData={CheckForSleepData}
          MoodCount={MoodCount}
        />
      );
    }
  };

  const dataScreens = (data) => {
    // 'activity, screentime, weather, light, sleep'
    let screens = getScreensPriority(data);
    screens.sort((a, b) => {
      let i = 1;
      if (a.permission) {
        i = -1;
      }
      return i;
    });
    screens.sort((a, b) => {
      let i = 0;
      if (a.permission && b.permission) {
        if (a.priority < b.priority) {
          i = -1;
        } else {
          i = 1;
        }
      } else if (!a.permission || !b.permission) {
        if (a.permission) {
          i = -1;
        } else {
          i = 1;
        }
      }
      return i;
    });
    return screens.map((e, idx) => {
      return getScreen(e?.name, idx);
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'ios' ? (
        <StatusBar barStyle="dark-content" />
      ) : (
        <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      )}
      <Swiper
        // focusable={true}
        // buttonWrapperStyle={{marginTop: -(HEIGHT / 4.8)}}
        dotStyle={{ height: 0, width: 0 }}
        activeDotStyle={{ height: 0, width: 0 }}
        style={{ backgroundColor: 'white' }}
        showsButtons={true}
        onIndexChanged={(index) => setSwiperIndexHome(index, dispatch)}
        index={swiperIndex}
        loop={false}>
          {dataScreens(UserData)}
        {/* <FitnessData
          swiperIndex={swiperIndex}
          TodayStep={TodayStep}
          TodayCalories={TodayCalories}
          TodayDistance={TodayDistance}
          MoveTime={MoveTime}
          Perm={Perm}
          checkStorage={checkStorage}
          zero={Ones}
          ones={Twos}
          twos={Threes}
          threes={Fours}
          fours={Fives}
          fives={Sixes}
          MoodCount={MoodCount}
          Loading={Loading}
          healthUpdateApiCount={healthUpdateApiCount}
        />

        <SleepData
          swiperIndex={swiperIndex}
          isMoodUpdate={isMoodUpdate}
          CheckForSleepData={CheckForSleepData}
          MoodCount={MoodCount}
        />

        <WeatherData swiperIndex={swiperIndex} MoodCount={MoodCount} />

        <LightData swiperIndex={swiperIndex} MoodCount={MoodCount} />

        <ScreenData
          swiperIndex={swiperIndex}
          Weather={Weather}
          PermScreenTime={PermScreenTime}
          CheckForScreenData={CheckForScreenData}
          MoodCount={MoodCount}
        /> */}
      </Swiper>
      {Loading && !isInstallGoogleFitModalVisible && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <InstallGoogleFitModal
        modalVisible={!Loading && isInstallGoogleFitModalVisible}
        dismissModalHandler={dismissInstallGoogleFitModal}
        onClickButtonOne={onInstallGoogleFit}
        buttonOneText="Install Google Fit"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    // backgroundColor: '#FFF',
    height: '100%',
    paddingBottom: 400,
  },
  body: {
    // backgroundColor: '#FFF',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#555',
  },
  sectionDescriptionError: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#A00000',
  },
  ColoredView: {
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    backgroundColor: '#DED6FE',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  HeaderView: {
    height: 80,
    paddingTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  syncButtonView: {
    height: 40,
    width: 40,
    backgroundColor: '#DED6FE',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightText: {
    fontSize: 13,
    color: '#8A8BAB',
    fontFamily: RubikLight,
    lineHeight: 12,
    marginVertical: 5,
  },
  normalText: {
    fontSize: 16,
    lineHeight: 16,
    fontFamily: RubikRegular,
  },
  ColoredText: {
    fontSize: 16,
    color: '#5947D0',
  },
  ProgressBarView: {
    width: '88%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  CircularProgressStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  SmallThinText: {
    paddingVertical: 12,
    fontFamily: RubikLight,
    color: '#747690',
  },
  SmallThinBlackText: {
    fontFamily: RubikLight,
    // color: '#3B456D',
    fontSize: 12.5,
  },
  wrapper: {
    height: 200,
    // backgroundColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },
  swiperText: {
    fontSize: SIZE / 14,
    fontWeight: '500',
    width: '75%',
    textAlign: 'center',
    fontFamily: RubikMedium,
    color: '#222432',
  },
  forCircle: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  BigCircleBackgroundImage: {
    height: 140,
    width: 130,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    flex: 1,
    position: 'absolute',
  },
  indicatorHelper: { height: 18, width: 18, borderRadius: 5 },
  indicatorHelperView: {
    flexDirection: 'row',
    marginHorizontal: 3,
    marginTop: 10,
  },
  indicatorText: {
    marginHorizontal: 10,
    color: '#4C5980',
    fontFamily: RubikRegular,
  },
});

export default App;
