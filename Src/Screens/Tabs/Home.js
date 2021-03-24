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
import Constants from '../../Constants';
import ProgressBar from 'react-native-animated-progress';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-community/async-storage';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  monotoneCubicInterpolation,
} from '@rainbow-me/animated-charts';
import GraphicChart from '../../Components/GraphicChart/GraphicChat';
import PostRequestApi from '../../apirequest/PostRequestApi';
import ProgressBarCustom from '../../Components/ProgressBar/ProgressBarCustom';
import BarGraph from '../../Components/BarChart/BarGraph';
import {LineChart} from 'react-native-chart-kit';
import {dynamicSize} from '../../Constants/sizeChoose';
import BezierGraphAuto from '../../Components/BezierGraphAuto/BezierGraphAuto';
import HomeHeader from '../../Components/HomeHeader/HomeHeader';
import {useRoute} from '@react-navigation/native';

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

  const route = useRoute();
  const {lat, long} = route.params.cord;
  console.log(`paramsss`, props.route);

  const a = moment().subtract(1, 'months').format('DD MMM YYYY');

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

  useEffect(() => {
    CheckForWeather();
    console.log(`Weather`, Weather);
  }, []);

  const checkStorage = async () => {
    let p = await AsyncStorage.getItem('GiveHealthPerm');
    let welcome = await JSON.parse(p);
    await setPerm(welcome);
    console.log('welcome', welcome);
    if (welcome != null) {
      console.log('good to go for API in async');
      await OnAutoSync();
      console.log(`auto sync function called`);
      filterDates();
      filterSteps();
      AddDataToFilter();
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

  const OnAutoSync = async () => {
    const a = moment().subtract(1, 'months').format('DD MMM YYYY');

    console.log('moment() month', new Date(a).toISOString());
    // console.log(
    //   `api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lng}&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
    // );

    if (Platform.OS === 'ios') {
      const healthKitOptions = {
        permissions: {
          read: [
            PERMS.DateOfBirth,
            PERMS.Weight,
            PERMS.Height,
            PERMS.BodyMassIndex,
            PERMS.LeanBodyMass,
            PERMS.BodyFatPercentage,
            PERMS.StepCount,
            PERMS.Steps,
            PERMS.BodyTemperature,
            PERMS.BloodPressureDiastolic,
            PERMS.BloodPressureSystolic,
            PERMS.ActiveEnergyBurned, //
            PERMS.BasalEnergyBurned, //
            PERMS.DistanceWalkingRunning, //
            PERMS.HeartRate,
            PERMS.SleepAnalysis,
            PERMS.DateOfBirth,
            PERMS.FlightsClimbed,
            PERMS.DistanceCycling,
            PERMS.Workout,
            PERMS.StandHours,
          ],
        },
      };

      AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
        if (err) {
          console.log('error initializing Healthkit: ', err);
          return;
        }

        // Date of Birth Example
        AppleHealthKit.getDateOfBirth(null, async (err, results) => {
          await setDateOfBirth(results);
          //  console.log('age', results);
        });

        // Get Latest Weight
        AppleHealthKit.getLatestWeight(
          null,
          async (err: string, results: Object) => {
            await setLatestWeight(results);
            //  console.log('weight', results);
          },
        );

        AppleHealthKit.getHeightSamples(
          stepsCount,
          async (err: string, results: Object) => {
            await setallHeights(results);
            // console.log('All height', results);
          },
        );

        AppleHealthKit.getLatestHeight(
          null,
          async (err: string, results: Object) => {
            // console.log('height', results);

            await setHeight(results);
          },
        );

        AppleHealthKit.getLatestBmi(
          null,
          async (err: string, results: Object) => {
            // console.log('BMI', results);

            await setBMI(results);
          },
        );
        AppleHealthKit.getBodyTemperatureSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await settemp(results);

            // console.log('All body temp', results);
          },
        );

        AppleHealthKit.getDailyStepCountSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await setsteps(results);

            // console.log('All steps', results);
          },
        );

        AppleHealthKit.getBodyFatPercentageSamples(
          stepsCount,
          async (err: string, results: Object) => {
            await setBodyFatPerc(results);

            // console.log(' All Body Fat % ', results);
          },
        );

        AppleHealthKit.getWeightSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await setWeight(results);

            // console.log(' All Body Weight ', results);
          },
        );

        AppleHealthKit.getBloodPressureSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await setBP(results);

            // console.log('All BP', results);
          },
        );
        // Need to check from here for data ================================================================>>>>>>>>>>>>>>>>>>>>
        AppleHealthKit.getActiveEnergyBurned(
          stepsCount,
          async (err: Object, results: Object) => {
            await setCalories(results);
            // console.log('Active energy count', results);
          },
        );

        AppleHealthKit.getDailyDistanceWalkingRunningSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await setDistance(results);
            // console.log('Distance in KMS', results);
          },
        );

        AppleHealthKit.getHeartRateSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await setHeartRate(results);
            // console.log('Heart Samples', results);
          },
        );

        AppleHealthKit.getSleepSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await setSleep(results);
            // console.log('Sleep Analysis', results);
          },
        );

        AppleHealthKit.getDateOfBirth(
          null,
          async (err: Object, results: Object) => {
            await setDOB(results);
            // console.log('DOB', results);
          },
        );

        AppleHealthKit.getSamples(
          TimeCount,
          async (err: Object, results: Array<Object>) => {
            if (err) {
              return;
            }
            await setMovingTime(results);
            // console.log(
            //   '<<<<<<<<============== Time walking ==============>>>>>>>>>',
            //   results,
            // );
          },
        );

        AppleHealthKit.getSamples(
          WorkoutTimeCount,
          async (err: Object, results: Array<Object>) => {
            if (err) {
              return console.log(`errola`, err);
            }
            await setWorkouts(results);
            // console.log(
            //   '<<<<<<<<============== Workout Time ==============>>>>>>>>>',
            //   results,
            // );
          },
        );
        // console.log(
        //   `bhal bhal bhal bhal blah blaj>>>>>>>>>>28684628643464646436546543265423654235643`,
        //   Workouts,
        // );
      });
    }

    CheckForWeather();
  };

  const dates = [];

  const filterDates = () => {
    console.log(`------------steps in filterdates----------`, steps);

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

  const filterSteps = () => {
    for (let i in dates) {
      for (let j in steps) {
        let iteratedate = moment(steps[j].startDate).format('DD-MMM-YYYY');
        if (dates[i] === iteratedate) {
          totalSteps = totalSteps + steps[j].value;
        }
      }
      for (let k in Distance) {
        let iteratedate = moment(Distance[k].startDate).format('DD-MMM-YYYY');
        if (dates[i] === iteratedate) {
          totalDistance = totalDistance + Distance[k].value;
        }
      }
      for (let l in Calories) {
        let iteratedate = moment(Calories[l].startDate).format('DD-MMM-YYYY');
        if (dates[i] === iteratedate) {
          totalCalories = totalCalories + Calories[l].value;
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
      for (let r in MovingTime) {
        let iteratedate = moment(MovingTime[r].start).format('DD-MMM-YYYY');
        // console.log(`startTime`, startTime, EndTime);
        // console.log(`end ========== >>>> ${diffDuration} `);
        if (dates[i] === iteratedate) {
          const startTime = moment(MovingTime[r].start);
          const EndTime = moment(MovingTime[r].end);
          const diff = EndTime.diff(startTime);
          const diffDuration = moment.duration(diff).asMinutes();
          totalWalkTime = totalWalkTime + diffDuration;
        }
      }
      Fsteps.push({
        date: dates[i],
        steps: totalSteps,
        distance: totalDistance,
        calories: totalCalories,
        heartRate: totalHeartRate,
        highBP: highBp,
        lowBP: lowBp,
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
    console.log(`walkTime |||||||||||| ppppppp =========`, WalkTime);
    console.log(`Workouts |||||||||||| ppppppp =========`, Workouts);
  };

  const CheckForWeather = () => {
    console.log(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
    );
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
      )
      .then(async (response) => {
        await setWeather(response.data);
        await console.log(`response.data for weather`, response.data);
      })
      .catch(function (error) {
        console.log(`error for weather`, error);
      });
  };

  const AddDataToFilter = async () => {
    const deviceId = DeviceInfo.getUniqueId();
    Fsteps.push();

    console.log(`Fsteps at last`, Fsteps);
    console.log(`walkTime at last`, WalkTime);
    console.log(`Workouts at last`, Workouts);
    if (Fsteps.length > 5 && WalkTime.length > 5) {
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
        exercise_time: Workouts,
        moving_time: WalkTime,
        steps: Fsteps,
        height: Height != null ? Height.value : 0,
        DOB: DateOfBirth.value,
        weight: LatestWeight != null ? LatestWeight.value : 0,
        age: DateOfBirth.age,
      });
      console.log(`data`, data);

      var config = {
        method: 'post',
        url: 'http://admin.moodflo.com/api/updateStaffHealth',
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
  };

  return (
    <View style={{flex: 1}}>
      <Swiper
        buttonWrapperStyle={{marginTop: -(HEIGHT / 4.8)}}
        dotStyle={{height: 0, width: 0}}
        activeDotStyle={{height: 0, width: 0}}
        style={{backgroundColor: 'white'}}
        showsButtons={false}
        loop={false}>
        <View>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.HeaderView}>
              <TouchableOpacity
                onPress={async () => {
                  await AsyncStorage.setItem('GiveHealthPerm', 'true');
                  checkStorage();
                  // OnAutoSync();
                  // filterDates();
                  // filterSteps();
                  // AddDataToFilter();
                }}
                style={{
                  flexDirection: 'row',
                }}>
                <View style={styles.syncButtonView}>
                  <Image
                    style={{height: 20, width: 20}}
                    source={Constants.Images.Sync}
                  />
                </View>
                <View style={{alignContent: 'center', paddingHorizontal: 15}}>
                  <Text style={styles.lightText}>Sync your</Text>
                  <Text style={styles.normalText}>Fitness data</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.ColoredView}>
                <Text style={styles.ColoredText}>Anonymous</Text>
              </View>
            </View>
            <View style={styles.ProgressBarView}>
              <ProgressBar
                progress={66.66}
                height={10}
                backgroundColor="#CB9866"
              />
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.SmallThinText, {flex: 1}]}>
                  Try add 3 moods per day
                </Text>
                <Text
                  style={
                    (styles.SmallThinText, {paddingTop: 10, paddingVertical: 0})
                  }>
                  2/3
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[styles.SmallThinText, {paddingVertical: 9}]}>
                Activity
              </Text>
              <Text style={styles.swiperText}>
                You are the <Text style={{color: '#5947D0'}}>happiest</Text>{' '}
                when you walk over <Text style={{color: '#5947D0'}}>5000</Text>{' '}
                steps before <Text style={{color: '#5947D0'}}>2PM</Text>
              </Text>
            </View>
            <View style={[styles.forCircle, {marginTop: 30}]}>
              <AnimatedCircularProgress
                style={styles.CircularProgressStyle}
                arcSweepAngle={270}
                size={180}
                width={13}
                fill={70}
                rotation={-135}
                tintColor="#9889F9"
                lineCap={'round'}
                onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#E2E4EA"></AnimatedCircularProgress>
              <View style={styles.absolute}>
                <ImageBackground
                  resizeMode={'contain'}
                  style={styles.BigCircleBackgroundImage}
                  source={Constants.Images.RunningBackground}>
                  <Image
                    source={Constants.Images.RunningMan}
                    style={{height: 30, width: 30, marginTop: 25}}
                  />
                  <Text
                    style={[styles.swiperText, {fontSize: 24, marginTop: 10}]}>
                    7,300
                  </Text>
                  <Text
                    style={[
                      styles.SmallThinText,
                      {paddingVertical: 0, color: '#3B456D'},
                    ]}>
                    steps
                  </Text>
                </ImageBackground>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '80%',
                alignSelf: 'center',
                marginTop: 10,
                marginBottom: 40,
              }}>
              <View style={styles.forCircle}>
                <AnimatedCircularProgress
                  style={styles.CircularProgressStyle}
                  arcSweepAngle={360}
                  size={70}
                  width={10}
                  fill={80}
                  rotation={0}
                  tintColor="#30C3D6"
                  lineCap={'round'}
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#E0F8FB"
                />
                <View style={styles.absolute}>
                  <Image
                    source={Constants.Images.Calories}
                    style={{height: 25, width: 25, marginTop: -25}}
                  />
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={[styles.SmallThinBlackText]}>2345 kcal</Text>
                </View>
              </View>
              <View style={styles.forCircle}>
                <AnimatedCircularProgress
                  style={styles.CircularProgressStyle}
                  arcSweepAngle={360}
                  size={70}
                  width={10}
                  fill={80}
                  rotation={0}
                  tintColor="#F43085"
                  lineCap={'round'}
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#FDE2EF"
                />
                <View style={styles.absolute}>
                  <Image
                    source={Constants.Images.Distance}
                    style={{height: 25, width: 25, marginTop: -25}}
                  />
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={[styles.SmallThinBlackText]}>2 km</Text>
                </View>
              </View>
              <View style={styles.forCircle}>
                <AnimatedCircularProgress
                  style={styles.CircularProgressStyle}
                  arcSweepAngle={360}
                  size={70}
                  width={10}
                  fill={80}
                  rotation={0}
                  tintColor="#37DD67"
                  lineCap={'round'}
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#C6F9E8"
                />
                <View style={styles.absolute}>
                  <Image
                    source={Constants.Images.Time}
                    style={{height: 25, width: 25, marginTop: -25}}
                  />
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={[styles.SmallThinBlackText]}>23 min</Text>
                </View>
              </View>
            </View>
            <GraphicChart />
          </ScrollView>
          {!Perm && (
            <View
              style={{
                // backgroundColor: 'blue',
                position: 'absolute',
                // flex: 1,

                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                zIndex: -234234,
              }}>
              <Text
                style={{
                  marginTop: -160,
                  fontWeight: '700',
                  fontFamily: RubikExtraBold,
                  fontSize: 120,
                  color: '#E0DDED',
                  transform: [{rotate: '-15deg'}],
                }}>
                Demo
              </Text>
            </View>
          )}
        </View>
        <View>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.HeaderView}>
              <TouchableOpacity
                onPress={async () => {
                  CheckForWeather();
                }}
                style={{
                  flexDirection: 'row',
                }}>
                <View style={styles.syncButtonView}>
                  <Image
                    style={{height: 20, width: 20}}
                    source={Constants.Images.Sync}
                  />
                </View>
                <View style={{alignContent: 'center', paddingHorizontal: 15}}>
                  <Text style={styles.lightText}>Sync your</Text>
                  <Text style={styles.normalText}>Weather data</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.ColoredView}>
                <Text style={styles.ColoredText}>Anonymous</Text>
              </View>
            </View>
            <View style={styles.ProgressBarView}>
              <ProgressBar
                progress={66.66}
                height={10}
                backgroundColor="#CB9866"
              />
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.SmallThinText, {flex: 1}]}>
                  Try add 3 moods per day
                </Text>
                <Text
                  style={
                    (styles.SmallThinText, {paddingTop: 10, paddingVertical: 0})
                  }>
                  2/3
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[styles.SmallThinText, {paddingVertical: 9}]}>
                Activity
              </Text>
              <Text style={styles.swiperText}>
                You are more <Text style={{color: '#5947D0'}}>energetic</Text>{' '}
                when the temperature is below{' '}
                <Text style={{color: '#5947D0'}}>20ª</Text> and it{' '}
                <Text style={{color: '#5947D0'}}>rains</Text> around{' '}
                <Text style={{color: '#5947D0'}}>2hrs</Text>
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                // justifyContent: 'space-around',
                // flex: 1,
                width: 320,
                alignSelf: 'center',
                marginTop: 40,
                marginBottom: 40,
                backgroundColor: '#F1F4F9',
                borderRadius: 18,
                paddingVertical: 20,
              }}>
              <View
                style={{
                  // flex: 1,
                  width: 320,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  paddingBottom: 8,
                }}>
                <Text
                  style={[
                    styles.SmallThinText,
                    {paddingVertical: 0, paddingBottom: 4},
                  ]}>
                  Today's Weather
                </Text>
                <Text
                  style={[
                    styles.SmallThinText,
                    {
                      paddingVertical: 0,
                      color: '#3B456D',
                      fontSize: 18,
                      fontFamily: RubikRegular,
                    },
                  ]}>
                  {Weather ? Weather?.name : 'Loading ...'}
                </Text>
                <View>
                  <View
                    style={{
                      width: 260,
                      backgroundColor: 'white',
                      margin: 10,
                      borderRadius: 15,
                      marginHorizontal: 20,
                    }}>
                    <View style={{flexDirection: 'row', padding: 15}}>
                      <Image
                        resizeMode={'contain'}
                        source={Constants.Images.Rain}
                        style={{margin: 10, marginHorizontal: 20}}
                      />
                      <View>
                        <Text
                          style={[
                            ,
                            {
                              fontFamily: RubikLight,
                              fontWeight: '300',
                              color: '#8A8BAB',
                              fontSize: 16,
                              marginTop: 10,
                            },
                          ]}>
                          {Weather ? Weather.weather[0].description : 'Low'}
                        </Text>
                        <Text
                          style={[, {fontFamily: RubikMedium, fontSize: 36}]}>
                          {Math.round(Weather ? Weather.main.temp : '0')}ºC
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 120,
                        backgroundColor: 'white',
                        // margin: 5,
                        borderRadius: 15,
                        marginRight: 15,
                        // marginHorizontal: 10,
                      }}>
                      <View style={{flexDirection: 'row', padding: 15}}>
                        <Image
                          resizeMode={'contain'}
                          source={Constants.Images.Rain}
                          style={{
                            margin: 5,
                            // marginHorizontal: 10,
                            height: 20,
                            width: 20,
                          }}
                        />
                        <View>
                          <Text
                            style={[
                              {
                                fontFamily: RubikLight,
                                fontWeight: '300',
                                color: '#8A8BAB',
                                fontSize: 16,
                                marginBottom: 5,
                              },
                            ]}>
                            Rainfall
                          </Text>
                          <Text
                            style={[, {fontFamily: RubikMedium, fontSize: 18}]}>
                            1hr
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        width: 120,
                        backgroundColor: 'white',
                        // margin: 5,
                        borderRadius: 15,
                        // marginHorizontal: 10,
                      }}>
                      <View style={{flexDirection: 'row', padding: 15}}>
                        <Image
                          resizeMode={'contain'}
                          source={Constants.Images.Rain}
                          style={{
                            margin: 5,
                            // marginHorizontal: 10,
                            height: 20,
                            width: 20,
                          }}
                        />
                        <View>
                          <Text
                            style={[
                              ,
                              {
                                fontFamily: RubikLight,
                                fontWeight: '300',
                                color: '#8A8BAB',
                                fontSize: 16,
                                marginBottom: 5,
                              },
                            ]}>
                            Pollen
                          </Text>
                          <Text
                            style={[, {fontFamily: RubikMedium, fontSize: 18}]}>
                            Low
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* <ProgressBarCustom /> */}
            <HomeHeader />
            <View style={{marginBottom: 50}}>
              <BarGraph />
              <View
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  marginTop: 30,
                }}>
                <View>
                  <View>
                    <BezierGraphAuto data={data} color={'#F4227E'} />
                  </View>
                  <View style={{marginTop: 20}}>
                    <BezierGraphAuto data={dataLow} color={'#70DEEC'} />
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <View style={styles.indicatorHelperView}>
                  <View
                    style={[
                      styles.indicatorHelper,
                      {backgroundColor: '#7FE3F0'},
                    ]}
                  />
                  <Text style={styles.indicatorText}>Min ºC</Text>
                </View>
                <View style={styles.indicatorHelperView}>
                  <View
                    style={[
                      styles.indicatorHelper,
                      {backgroundColor: '#FC4190'},
                    ]}
                  />
                  <Text style={styles.indicatorText}>Max ºC</Text>
                </View>
                <View style={styles.indicatorHelperView}>
                  <View
                    style={[
                      styles.indicatorHelper,
                      {backgroundColor: '#7265E3'},
                    ]}
                  />
                  <Text style={styles.indicatorText}>Rainfall</Text>
                </View>
                <View style={styles.indicatorHelperView}>
                  <View
                    style={[
                      styles.indicatorHelper,
                      {backgroundColor: '#0DDE7A'},
                    ]}
                  />
                  <Text style={styles.indicatorText}>Pollen</Text>
                </View>
              </View>
            </View>
            <GraphicChart />
            {!PermWeather && (
              <View
                style={{
                  // backgroundColor: 'blue',
                  position: 'absolute',
                  // flex: 1,
                  top: 420,
                  alignItems: 'center',
                  // justifyContent: 'center',
                  height: '100%',
                  width: '100%',
                  zIndex: -234234,
                }}>
                <Text
                  style={{
                    marginTop: -160,
                    fontWeight: '700',
                    fontFamily: RubikExtraBold,
                    fontSize: 120,
                    color: '#E0DDED',
                    transform: [{rotate: '-15deg'}],
                  }}>
                  Demo
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.slide3}>
          <Text style={styles.text}>And simple</Text>
        </View>
      </Swiper>
    </View>
    // <View>
    //   <StatusBar barStyle="dark-content" />
    //   <SafeAreaView style={{backgroundColor: 'white'}}>
    // <ScrollView
    //   contentInsetAdjustmentBehavior="automatic"
    //   style={styles.scrollView}>
    //

    //     </ScrollView>

    //   </SafeAreaView>
    // </View>
  );
  // }
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
