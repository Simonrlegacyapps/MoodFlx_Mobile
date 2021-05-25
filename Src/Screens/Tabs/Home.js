import React, {useState, useEffect} from 'react';
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

import AppleHealthKit from 'rn-apple-healthkit';
import GetLocation from 'react-native-get-location';
import DeviceInfo from 'react-native-device-info';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
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
import {useRoute} from '@react-navigation/native';
import FitnessData from '../Home/FitnessData';
import WeatherData from '../Home/WeatherData/WeatherData';
import ScreenData from '../Home/screenData/screenData';
import SleepData from '../Home/SleepData/SleepData';
import {useDispatch, useSelector} from 'react-redux';
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
  SleepPerm,
  UserCalories,
  UserDistance,
  UserMoodCount,
  UserMoveTime,
  UserSteps,
  WeatherPerm,
} from '../../redux/actions/actions';
import messaging, {firebase} from '@react-native-firebase/messaging';
import LightData from '../Home/LightData/LightData';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import {
  AppInstalledChecker,
  CheckPackageInstallation,
} from 'react-native-check-app-install';
import RNAndroidInstalledApps from 'react-native-android-installed-apps';

export const {width: SIZE, height: HEIGHT} = Dimensions.get('window');

const data = [
  {x: 1, y: 1.2},
  {x: 2, y: 2.3},
  {x: 3, y: 2.42},
  {x: 4, y: 1.1},
  {x: 5, y: 2.41},
  {x: 6, y: 2.43},
  {x: 7, y: 2.2},
];

const dataLow = [
  {x: 1, y: 10},
  {x: 2, y: 20},
  {x: 3, y: 29},
  {x: 4, y: 18},
  {x: 5, y: 22},
  {x: 6, y: 20},
  {x: 7, y: 23},
];

// const points = monotoneCubicInterpolation({data, range: 30});
// const pointsLow = monotoneCubicInterpolation({dataLow, range: 30});

const PERMS = AppleHealthKit.Constants.Permissions;

const App = (props) => {
  const UserData = useSelector((state) => state.First);

  const [Weight, setWeight] = useState(false);
  const [Weather, setWeather] = useState(false);
  // const [lng, setlng] = useState(false);
  // const [lat, setlat] = useState(false);
  const [BP, setBP] = useState(false);
  const [allHeights, setallHeights] = useState(false);
  const [steps, setsteps] = useState(false);
  const [temp, settemp] = useState(false);
  const [StepCount, setStepCount] = useState(false);
  const [BodyFatPerc, setBodyFatPerc] = useState(false);
  const [BMI, setBMI] = useState(false);
  const [DateOfBirth, setDateOfBirth] = useState(false);
  const [Height, setHeight] = useState(false);
  const [Calories, setCalories] = useState(false);
  const [Sleep, setSleep] = useState(false);
  const [HeartRate, setHeartRate] = useState(false);
  const [DOB, setDOB] = useState(false);
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
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [callOneTime, setcallOneTime] = useState('one');
  const [TryWeather, setTryWeather] = useState(null);
  const [ScreenDataPermModal, setScreenDataPermModal] = useState(false);
  const [LightDataPermModal, setLightDataPermModal] = useState(false);
  const route = useRoute();
  const [loadAgain, setloadAgain] = useState(1);
  const {lat, long} = route.params.cord;

  // const a = moment().subtract(1, 'months').format('DD MMM YYYY');
  // const a = moment().subtract(1, 'days').format('DD MMM YYYY'); // yesterday
  // const a = moment(); //today
  const a = moment().subtract(1, 'days').endOf('day').toString();
  const b = moment().subtract(0, 'days').startOf('day').toString();
  // console.log(`b`, Date.parse(b));

  const stepsCount = {
    startDate: new Date(a).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
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
    if (callOneTime === 'one') {
      callAnApi();
    }
  }, [Height]);

  const callAnApi = async () => {
    let p = await AsyncStorage.getItem('GiveHealthPerm');
    let MCount = await AsyncStorage.getItem('MoodCount');
    let e = await JSON.parse(MCount);
    setMoodCount(e);
    dispatch(UserMoodCount(e));
    // console.log(`mood count again`, e);
    let HealthP = await JSON.parse(p);
    dispatch(HealthPerm(HealthP));
    console.log(`HealthP`, HealthP != null);
    if (HealthP != null) {
      await OnAutoSync();
      const steps_data = await UserData.MainSteps;
      console.log(`steps_data`, steps_data, UserData.MainSteps);
      if (steps_data !== null) {
        console.log('good to go for API in async here at top');
        setLoading(UserData.HealthPermission ? true : false);
        setcallOneTime('second');
        console.log(`UserData.MainSteps`, UserData.MainSteps);
        filterDates();
        filterSteps();
        AddDataToFilter();
      }
      setLoading(false);
    }
  };

  const checkStorage = async () => {
    console.log(`called`);
    setLoading(UserData.HealthPermission ? true : false);
    let p = await AsyncStorage.getItem('GiveHealthPerm');
    let MCount = await AsyncStorage.getItem('MoodCount');
    let e = await JSON.parse(MCount);
    setMoodCount(e);
    dispatch(UserMoodCount(e));
    // console.log(`mood count again`, e);
    let HealthP = await JSON.parse(p);
    dispatch(HealthPerm(HealthP));

    if (HealthP != null) {
      console.log('good to go for API in async here at top');
      await OnAutoSync();
      await UserData.MainSteps;
      console.log(`UserData.MainSteps`, UserData.MainSteps);
      if (UserData.MainSteps !== null) {
        filterDates();
        filterSteps();
        AddDataToFilter();
      }
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   OnAutoSync();
  //   setTimeout(() => {
  //     filterDates();
  //     filterSteps();
  //     AddDataToFilter();
  //   }, 1000);
  // }, [10]);

  // useEffect(() => {
  //   FitnessData()
  // }, [])

  const OnAutoSync = async () => {
    console.log(`auto sync function called`);
    // const a = moment().subtract(1, 'months').format('DD MMM YYYY');

    // console.log('moment() month', new Date(a).toISOString());
    // console.log(
    //   `api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lng}&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
    // );

    if (Platform.OS === 'ios') {
      const healthKitOptions = {
        permissions: {
          read: [
            // PERMS.DateOfBirth,
            // PERMS.Weight,
            // PERMS.Height,
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
          return;
        }

        // Date of Birth Example
        AppleHealthKit.getDateOfBirth(null, async (err, results) => {
          setDateOfBirth(results);
          //  console.log('age', results);
        });

        AppleHealthKit.getDailyStepCountSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            console.log(`results of all steps `, results);
            dispatch(GetSteps(results));
            let total = 0;
            let zero = 0;
            let ones = 0;
            let twos = 0;
            let threes = 0;
            let fours = 0;
            let fives = 0;
            let all = [];
            setsteps(results);
            for (let j in results) {
              total = total + results[j].value;
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
            // console.log('All steps ++++', results, total);
          },
        );
        AppleHealthKit.getBloodPressureSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            setBP(results);

            console.log('All BP', results);
          },
        );
        // Need to check from here for data ================================================================>>>>>>>>>>>>>>>>>>>>
        AppleHealthKit.getActiveEnergyBurned(
          stepsCount,
          async (err: Object, results: Object) => {
            dispatch(GetCalories(results));
            let total = 0;
            setCalories(results);
            for (let i in results) {
              total = total + results[i].value;
            }
            dispatch(UserCalories(total));
            // console.log('Active energy count', results);
          },
        );

        AppleHealthKit.getDailyDistanceWalkingRunningSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            dispatch(GetDistance(results));
            let total = 0;
            setDistance(results);
            for (let i in results) {
              total = total + results[i].value;
            }
            dispatch(UserDistance(total));
            // console.log('Distance in KMS', results, total);
          },
        );

        AppleHealthKit.getHeartRateSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            setHeartRate(results);
            // console.log('Heart Samples', results);
          },
        );

        AppleHealthKit.getSleepSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            setSleep(results);
            // console.log('Sleep Analysis +++++++++======>>>>', results);
          },
        );

        AppleHealthKit.getDateOfBirth(
          null,
          async (err: Object, results: Object) => {
            dispatch(GetDOB(results));
            setDOB(results);
            // console.log('DOB', results);
          },
        );

        AppleHealthKit.getSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            dispatch(GetMovingTime(results));
            let totalWalkTime = 0;
            if (err) {
              return;
            }
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
          },
        );

        AppleHealthKit.getSamples(
          WorkoutTimeCount,
          async (err: Object, results: Array<Object>) => {
            console.log(
              `workout =++++++++++====++++++++======++++++++++++++++==`,
              results,
            );
            dispatch(GetWorkouts(results));
            if (err) {
              return console.log(`errola`, err);
            }
            setWorkouts(results);
          },
        );
      });
      // setLoading(false);
    }

    if (Platform.OS === 'android') {
      console.log(`herer?`);
      const a = moment().subtract(1, 'days').endOf('day').toISOString();
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_ACTIVITY_WRITE,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_BODY_WRITE,
          Scopes.FITNESS_SLEEP_READ,
        ],
      };
      GoogleFit.authorize(options)
        .then((authResult) => {
          if (authResult.success) {
            console.log('AUTH_SUCCESS');
          } else {
            console.log('AUTH_DENIED', authResult.message);
          }
        })
        .catch(() => {
          console.log('AUTH_ERROR');
        });

      const opt = {
        startDate: a, // required ISO8601Timestamp
        endDate: new Date().toISOString(), // required ISO8601Timestamp
        bucketUnit: 'HOUR', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
      };

      let optActivities = {
        startDate: a, // required
        endDate: new Date().toISOString(), // required
        bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
      };

      const optCalories = {
        startDate: a, // required ISO8601Timestamp
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

      console.log(`entering?`);
      GoogleFit.onAuthorize(async function fetchData() {
        const res = await GoogleFit.getDailyStepCountSamples(opt);
        console.log('steps', res);
        console.log('total user steps', res[2].steps[0].value);
        if (res.length > 0) {
          dispatch(UserSteps(res[2].steps[0].value));
          dispatch(GetSteps(res[2].rawSteps));
          setsteps(res[2].rawSteps);
        }
      });

      GoogleFit.onAuthorize(async function fetchMoreData() {
        const Activities = await GoogleFit.getActivitySamples(optActivities);
        // setActivities(Activities);
        console.log('Activities', Activities);

        const Calories = await GoogleFit.getDailyCalorieSamples(optCalories);
        // setCalories(Calories);
        if (Calories.length > 0) {
          dispatch(UserCalories(Math.abs(Calories[0].calorie)));
          dispatch(GetCalories(Calories[0]));
        }
        console.log(
          'Calories????????????????????????----------------',
          Calories[0],
        );

        const Distance = await GoogleFit.getDailyDistanceSamples(opt);
        if (Distance.length > 0) {
          dispatch(UserDistance(Math.ceil(Distance[0].distance)));
        }
        console.log('Distance', Distance);
      });
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

    CheckForWeather(lat, long);
  };

  const dates = [];

  const filterDates = () => {
    // console.log(`------------steps in filterdates----------`, steps);

    steps &&
      steps.map((i) => {
        var date = moment(i.startDate).format('DD-MMM-YYYY');
        if (!dates.includes(date)) {
          dates.push(date);
        }
      });
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
      for (let j in UserData.MainSteps) {
        let iteratedate = moment(UserData.MainSteps[j].startDate).format(
          'DD-MMM-YYYY',
        );
        if (dates[i] === iteratedate) {
          Platform.OS === 'ios'
            ? (totalSteps = totalSteps + UserData.MainSteps[j].value)
            : (totalSteps = totalSteps + UserData.MainSteps[j].steps);
        }
        if (
          moment(UserData.MainSteps[j].startDate).startOf('day') <
            moment(UserData.MainSteps[j].startDate) &&
          moment(UserData.MainSteps[j].startDate) <
            moment(UserData.MainSteps[j].startDate).startOf('day').hours(4)
        ) {
          console.log(`0`);
          zero = zero + UserData.MainSteps[j].value;
          setOnes(zero);
        } else if (
          moment(UserData.MainSteps[j].startDate).startOf('day').hours(4) <
            moment(UserData.MainSteps[j].startDate) &&
          moment(UserData.MainSteps[j].startDate) <
            moment(UserData.MainSteps[j].startDate).startOf('day').hours(8)
        ) {
          console.log(`2`, UserData.MainSteps[j].value);
          ones = ones + UserData.MainSteps[j].value;
          setTwos(ones);
        } else if (
          moment(UserData.MainSteps[j].startDate).startOf('day').hours(8) <=
            moment(UserData.MainSteps[j].startDate) &&
          moment(UserData.MainSteps[j].startDate) <=
            moment(UserData.MainSteps[j].startDate).startOf('day').hours(12)
        ) {
          twos = twos + UserData.MainSteps[j].value;
          console.log(`3`, twos);
          setThrees(twos);
          //add setzeros to this.
        } else if (
          moment(UserData.MainSteps[j].startDate).startOf('day').hours(12) <=
            moment(UserData.MainSteps[j].startDate) &&
          moment(UserData.MainSteps[j].startDate) <=
            moment(UserData.MainSteps[j].startDate).startOf('day').hours(16)
        ) {
          threes = threes + UserData.MainSteps[j].value;
          console.log(`4`, threes);
          setFours(threes);
        } else if (
          moment(UserData.MainSteps[j].startDate).startOf('day').hours(16) <
            moment(UserData.MainSteps[j].startDate) &&
          moment(UserData.MainSteps[j].startDate) <
            moment(UserData.MainSteps[j].startDate).startOf('day').hours(20)
        ) {
          fours = fours + UserData.MainSteps[j].value;
          console.log(`5`, UserData.MainSteps[j].value);
          setFives(fours);
        } else {
          fives = fives + UserData.MainSteps[j].value;
          console.log(`6`, UserData.MainSteps[j].value);
          setSixes(fives);
        }
      }
      for (let k in UserData.MainDistance) {
        let iteratedate = moment(UserData.MainDistance[k].startDate).format(
          'DD-MMM-YYYY',
        );
        if (dates[i] === iteratedate) {
          totalDistance = totalDistance + UserData.MainDistance[k].value;
        }
      }
      for (let l in UserData.MainCalories) {
        let iteratedate = moment(UserData.MainCalories[l].startDate).format(
          'DD-MMM-YYYY',
        );

        if (dates[i] === iteratedate) {
          Platform.OS === 'ios'
            ? (totalCalories = totalCalories + UserData.MainCalories[l].value)
            : (totalCalories =
                totalCalories + UserData.MainCalories.calorie / l.length);

          console.log(`totalCalories`, UserData.MainCalories);
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
          highBp = highBp + BP[n].bloodPressureSystolicValue;
          lowBp = lowBp + BP[n].bloodPressureDiastolicValue;
        }
      }
      for (let r in UserData.MainMoving) {
        let iteratedate = moment(UserData.MainMoving[r].start).format(
          'DD-MMM-YYYY',
        );
        // console.log(`startTime`, startTime, EndTime);
        // console.log(`end ========== >>>> ${diffDuration} `);
        if (dates[i] === iteratedate) {
          const startTime = moment(UserData.MainMoving[r].start);
          const EndTime = moment(UserData.MainMoving[r].end);
          const diff = EndTime.diff(startTime);
          const diffDuration = moment.duration(diff).asMinutes();
          totalWalkTime = totalWalkTime + diffDuration;
        }
      }
      console.log(`totalSteps`, totalSteps);
      Fsteps.push({
        date: dates[i],
        steps: totalSteps,
        distance: totalDistance,
        calories: UserData.UserCalories,
        heart_rate: totalHeartRate,
        high_bp: highBp,
        low_bp: lowBp,
      });
      WalkTime.push({
        date: dates[i],
        walkTime: totalWalkTime,
      });
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

  const CheckForWeather = async (loc_lat, loc_long) => {
    let Wp = await AsyncStorage.getItem('GiveWeatherPerm');
    let WeatherP = await JSON.parse(Wp);
    dispatch(WeatherPerm(WeatherP));
    // if (UserData.WeatherPermission) {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${loc_lat}&lon=${loc_long}&exclude=hourly,minutely&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
      )
      .then(async (response) => {
        console.log(`response`, response.data);
        dispatch(DayTemp(response.data));
        await setTryWeather(response.data);
        // await console.log(`response.data for weather`, response.data);
      })
      .catch(function (error) {
        console.log(`error for weather`, error);
      });
    // }
  };

  const CheckForSleepData = async () => {
    console.log(`Implement screen data`);
    let Wp = await Sleep.getItem('GiveSleepPerm');
    let WeatherP = await JSON.parse(Wp);
    dispatch(SleepPerm(WeatherP));
  };

  const CheckForScreenData = async () => {
    console.log(`Implement screen data`);
    setScreenDataPermModal(true);
    // let Wp = await AsyncStorage.getItem('GiveSleepPerm');
    // let WeatherP = await JSON.parse(Wp);
    // dispatch(SleepPerm(WeatherP));
  };

  const CheckForLightData = async () => {
    console.log(`Implement Light data`);
    setLightDataPermModal(true);
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
    if (Fsteps.length > 0 && WalkTime.length > 0) {
      // console.log('good to go for API');
      // const data = {
      //   device_id: deviceId,
      //   steps: Fsteps,
      //   moving_time: WalkTime,
      //   exercise_time: Workouts,
      // };
      var axios = require('axios');
      var data = JSON.stringify({
        device_id: deviceId,
        exercise_time: UserData?.MainWorkout ? UserData?.MainWorkout : null,
        moving_time: WalkTime,
        steps: Fsteps,
        // height: Height != null ? Height.value : 0,
        height: 0,
        DOB: DateOfBirth && DateOfBirth.value ? DateOfBirth.value : 0,
        weight:
          Platform.OS === 'ios'
            ? LatestWeight != null
              ? LatestWeight.value
              : 0
            : 0,
        age: DateOfBirth && DateOfBirth.age ? DateOfBirth.age : 0,
        email: UserData.UserEmail,
      });
      console.log(`data1111`, data);

      var config = {
        method: 'post',
        url: 'https://admin.moodflo.com/api/updateStaffHealth',
        headers: {
          'Content-Type': 'application/json',
          Cookie: '__cfduid=de42be196e76a7e54fe0b710d009e4dd11615455418',
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(
            '✅ ✅ ✅ ✅ Success message for health data ✅ ✅ ✅ ✅',
            JSON.stringify(response.data),
          );
        })
        .catch(function (error) {
          console.log('❌ ❌ ❌ ❌ error for health data ❌ ❌ ❌ ❌', error);
        });
    }
    setTodayStep(Fsteps.length > 0 ? (Fsteps[0].steps / 10000) * 100 : 0);
    setTodayDistance(Fsteps.length > 0 ? (Fsteps[0].distance / 5000) * 100 : 0);
    setTodayCalories(Fsteps.length > 0 ? (Fsteps[0].calories / 1000) * 100 : 0);
    setMoveTime(WalkTime.length > 0 ? (WalkTime[0].walkTime / 120) * 100 : 0);
  };

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
          CheckForWeather={CheckForWeather}
          lat={lat}
          long={long}
          MoodCount={MoodCount}
        />
      );
    }, 500);
  };

  return (
    <View style={{flex: 1}}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
      <Swiper
        // focusable={true}
        // buttonWrapperStyle={{marginTop: -(HEIGHT / 4.8)}}
        dotStyle={{height: 0, width: 0}}
        activeDotStyle={{height: 0, width: 0}}
        style={{backgroundColor: 'white'}}
        showsButtons={true}
        onIndexChanged={(index) => setSwiperIndex(index)}
        loop={false}>
        <View>
          {/* {!Loading &&
          !UserData.UserMoodCount &&
          !UserData.UserSteps &&
          !UserData.UserCalories &&
          !UserData.UserDistance &&
          !UserData.UserMoveTime ? (
            <View>
              <Text>Hi</Text>
            </View>
          ) : (
            <View>
              <Text>Loading your data</Text>
            </View>
          )} */}
          <FitnessData
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
          />
        </View>

        <View style={styles.slide3}>
          <SleepData
            swiperIndex={swiperIndex}
            data={data}
            dataLow={dataLow}
            Weather={Weather}
            PermScreenTime={PermScreenTime}
            CheckForSleepData={CheckForSleepData}
            MoodCount={MoodCount}
          />
        </View>

        <View>
          {/* {swiperIndex == 1 ? ( */}
          {/* {console.log(`tryWeather`, TryWeather)} */}
          <WeatherData
            tryWeather={UserData.DayTemperature}
            swiperIndex={swiperIndex}
            Weather={Weather}
            PermWeather={PermWeather}
            CheckForWeather={CheckForWeather}
            // lat={lat}
            // long={long}
            MoodCount={MoodCount}
          />
          {/* ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}>
              <Text> Your Data is updating</Text>
            </View>
          )} */}
        </View>

        <View style={styles.slide3}>
          <LightData
            swiperIndex={swiperIndex}
            // data={data}
            // dataLow={dataLow}
            Weather={Weather}
            PermScreenTime={PermScreenTime}
            CheckForLightData={CheckForLightData}
            MoodCount={MoodCount}
          />
        </View>

        <View style={styles.slide3}>
          <ScreenData
            swiperIndex={swiperIndex}
            // data={data}
            // dataLow={dataLow}
            Weather={Weather}
            PermScreenTime={PermScreenTime}
            CheckForScreenData={CheckForScreenData}
            MoodCount={MoodCount}
          />
        </View>
      </Swiper>
      {Loading && (
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
  forCircle: {alignItems: 'center', justifyContent: 'center', flex: 1},
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
  indicatorHelper: {height: 18, width: 18, borderRadius: 5},
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
