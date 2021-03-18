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
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import Constants from '../../Constants';
import ProgressBar from 'react-native-animated-progress';
import Swiper from 'react-native-swiper';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  monotoneCubicInterpolation,
} from '@rainbow-me/animated-charts';
import GraphicChart from '../../Components/GraphicChart/GraphicChat';

export const {width: SIZE} = Dimensions.get('window');

export const data = [
  {x: 1453075200, y: 1.47},
  {x: 1453161600, y: 1.37},
  {x: 1453248000, y: 1.53},
  {x: 1453334400, y: 1.54},
  {x: 1453420800, y: 1.52},
  {x: 1453507200, y: 2.03},
  {x: 1453593600, y: 2.1},
  {x: 1453680000, y: 2.5},
  {x: 1453766400, y: 2.3},
  {x: 1453852800, y: 2.42},
  {x: 1453939200, y: 2.55},
  {x: 1454025600, y: 2.41},
  {x: 1454112000, y: 2.43},
  {x: 1454198400, y: 2.2},
];

const points = monotoneCubicInterpolation({data, range: 40});

const PERMS = AppleHealthKit.Constants.Permissions;

const App = () => {
  const [Weight, setWeight] = useState(false);
  const [Weather, setWeather] = useState(false);
  const [lng, setlng] = useState(false);
  const [lat, setlat] = useState(false);
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

  const OnAutoSync = () => {
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
          ],
        },
      };

      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then((location) => {
          //   console.log('Success', location);
          setlat(location.latitude);
          setlng(location.longitude);
        })
        .catch((error) => {
          const {code, message} = error;
          console.log('error', code, message);
        });

      AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
        if (err) {
          console.log('error initializing Healthkit: ', err);
          return;
        }

        // Date of Birth Example
        AppleHealthKit.getDateOfBirth(null, async (err, results) => {
          await setDateOfBirth(results), console.log('age', results);
        });

        // Get Latest Weight
        AppleHealthKit.getLatestWeight(
          null,
          async (err: string, results: Object) => {
            await setLatestWeight(results), console.log('weight', results);
          },
        );

        AppleHealthKit.getHeightSamples(
          stepsCount,
          async (err: string, results: Object) => {
            await setallHeights(results), console.log('All height', results);
          },
        );

        AppleHealthKit.getLatestHeight(
          null,
          async (err: string, results: Object) => {
            console.log('height', results);

            await setHeight(results);
          },
        );

        AppleHealthKit.getLatestBmi(
          null,
          async (err: string, results: Object) => {
            console.log('BMI', results);

            await setBMI(results);
          },
        );
        AppleHealthKit.getBodyTemperatureSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await settemp(results);

            console.log('All body temp', results);
          },
        );

        AppleHealthKit.getDailyStepCountSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await setsteps(results);

            console.log('All steps', results);
          },
        );

        AppleHealthKit.getBodyFatPercentageSamples(
          stepsCount,
          async (err: string, results: Object) => {
            await setBodyFatPerc(results);

            console.log(' All Body Fat % ', results);
          },
        );

        AppleHealthKit.getWeightSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await setWeight(results);

            console.log(' All Body Weight ', results);
          },
        );

        AppleHealthKit.getBloodPressureSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await setBP(results);

            console.log('All BP', results);
          },
        );
        // Need to check from here for data ================================================================>>>>>>>>>>>>>>>>>>>>
        AppleHealthKit.getActiveEnergyBurned(
          stepsCount,
          async (err: Object, results: Object) => {
            await setCalories(results);
            console.log('Active energy count', results);
          },
        );

        AppleHealthKit.getDailyDistanceWalkingRunningSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await setDistance(results);
            console.log('Distance in KMS', results);
          },
        );

        AppleHealthKit.getHeartRateSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await setHeartRate(results);
            console.log('Heart Samples', results);
          },
        );

        AppleHealthKit.getSleepSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            await setSleep(results);
            console.log('Sleep Analysis', results);
          },
        );

        AppleHealthKit.getDateOfBirth(
          null,
          async (err: Object, results: Object) => {
            await setDOB(results);
            console.log('DOB', results);
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
            //   '<<<<<<<<============== Time ==============>>>>>>>>>',
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
        console.log(
          `bhal bhal bhal bhal blah blaj>>>>>>>>>>28684628643464646436546543265423654235643`,
          Workouts,
        );
      });
    }

    CheckForWeather();
    setTimeout(() => {
      // findTime();
      while (Fsteps.length == 0 && WalkTime.length == 0) {
        filterDates();
        filterSteps();
        AddDataToFilter();
      }
    }, 1000);
  };

  const dates = [];

  const filterDates = () => {
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
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
      )
      .then((response) => {
        setWeather(response.data);
      })
      .catch(function (error) {});
  };

  const happiest = (
    <Text style={{fontSize: 22, color: '#5947D0'}}>{'happiest'}</Text>
  );

  const AddDataToFilter = () => {
    const deviceId = DeviceInfo.getUniqueId();
    Fsteps.push(
      {age: DateOfBirth.age},
      {height: Height != null ? Height.value : 0},
      {weight: LatestWeight != null ? LatestWeight.value : 0},
      {DOB: DateOfBirth.value},
      {device_id: deviceId},
    );

    console.log(`Fsteps at last`, Fsteps);
  };
  return (
    <View>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.HeaderView}>
            <TouchableOpacity
              onPress={() => {
                OnAutoSync();
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
              <Text style={styles.SmallThinText}>2/3</Text>
            </View>
          </View>

          <Swiper
            style={styles.wrapper}
            showsButtons={true}
            dotStyle={{height: 0, width: 0}}
            activeDotStyle={{height: 0, width: 0}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.SmallThinText}>Hello Swiper</Text>
              <Text style={styles.swiperText}>
                You are the <Text style={{color: '#5947D0'}}>happiest</Text>{' '}
                when you walk over <Text style={{color: '#5947D0'}}>5000</Text>{' '}
                steps before <Text style={{color: '#5947D0'}}>2PM</Text>
              </Text>
            </View>
          </Swiper>
          <View style={styles.forCircle}>
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
                size={80}
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
                  style={{height: 30, width: 30, marginTop: -25}}
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
                size={80}
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
                  style={{height: 30, width: 30, marginTop: -25}}
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
                size={80}
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
                  style={{height: 30, width: 30, marginTop: -25}}
                />
              </View>
              <View style={{marginTop: 10}}>
                <Text style={[styles.SmallThinBlackText]}>23 min</Text>
              </View>
            </View>
          </View>
          {/* <View style={{backgroundColor: 'green', marginBottom: 100}}>
            <ChartPathProvider data={{points, smoothingStrategy: 'bezier'}}>
              <ChartPath height={SIZE / 2} stroke="yellow" width={SIZE} />
              <ChartDot style={{backgroundColor: 'blue'}} />
            </ChartPathProvider>
          </View> */}
          <GraphicChart />
        </ScrollView>
      </SafeAreaView>
    </View>
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
    height: 100,
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
    height: 210,
    // backgroundColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperText: {
    fontSize: 30,
    fontWeight: '500',
    width: '75%',
    textAlign: 'center',
    fontFamily: RubikMedium,
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
});

export default App;

// {Platform.OS === 'ios' && (
//   <View style={styles.body}>
//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionTitle}>Weather Info</Text>
//       {Weather && (
//         <View>
//           <Text style={styles.sectionDescription}>
//             Current Temp: {Weather.main.temp} ºC{' '}
//           </Text>
//           <Text>
//             Sunrise Time:{' '}
//             {moment(Weather.sys.sunrise).format('HH:MM')}
//           </Text>
//           <Text>
//             Sunset Time: {moment(Weather.sys.sunset).format('HH:MM')}
//           </Text>

//           <Text
//             style={[styles.sectionDescription, {textAlign: 'left'}]}>
//             Min Temp: {Weather.main.temp_min} ºC{' '}
//           </Text>
//           <Text
//             style={[styles.sectionDescription, {textAlign: 'left'}]}>
//             Max Temp: {Weather.main.temp_max} ºC{' '}
//           </Text>
//         </View>
//       )}
//       <Text style={[styles.sectionTitle, {marginTop: 22}]}>
//         Weight
//       </Text>

//       {Weight &&
//         Weight.length > 0 &&
//         Weight?.map((i, k) => {
//           return (
//             <Text style={styles.sectionDescription} key={k}>
//               {moment(i.startDate).format('DD MMM YYYY')} {'->'}{' '}
//               {Math.round(i.value)} {'Pound'}
//             </Text>
//           );
//         })}
//       {!Weight && (
//         <Text style={styles.sectionDescriptionError}>
//           Add your Weight to Health App!
//         </Text>
//       )}
//     </View>
//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionTitle}>Age</Text>
//       {DateOfBirth && (
//         <Text style={styles.sectionDescription}>
//           {DateOfBirth.age}
//         </Text>
//       )}
//       {!DateOfBirth && (
//         <Text style={styles.sectionDescriptionError}>
//           Add your Birthday to Health App!
//         </Text>
//       )}
//     </View>

//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionTitle}>Height</Text>
//       {allHeights &&
//         allHeights.length > 0 &&
//         allHeights?.map((i, k) => {
//           return (
//             <Text style={styles.sectionDescription} key={k}>
//               {moment(i.startDate).format('DD MMM YYYY')} {'->'}{' '}
//               {Math.round(i.value)} {'Inches'}
//             </Text>
//           );
//         })}
//       {!allHeights && (
//         <Text style={styles.sectionDescriptionError}>
//           Add your Height to Health App!
//         </Text>
//       )}
//     </View>

//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionTitle}>BMI</Text>
//       {BMI && (
//         <Text style={styles.sectionDescription}>{BMI.value}</Text>
//       )}
//       {!BMI && (
//         <Text style={styles.sectionDescriptionError}>
//           Add your Birthday to Health App!
//         </Text>
//       )}
//     </View>

//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionTitle}>BodyFatPerc</Text>
//       {BodyFatPerc &&
//         BodyFatPerc.length > 0 &&
//         BodyFatPerc?.map((i, k) => {
//           return (
//             <Text style={styles.sectionDescription} key={k}>
//               {moment(i.startDate).format('DD MMM YYYY')} {'->'}{' '}
//               {i.value}
//               {'%'}
//             </Text>
//           );
//         })}
//       {!BodyFatPerc && (
//         <Text style={styles.sectionDescriptionError}>
//           Add your Birthday to Health App!
//         </Text>
//       )}
//     </View>

//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionTitle}>BP</Text>
//       {BP &&
//         BP.length > 0 &&
//         BP?.map((i, k) => {
//           return (
//             <Text style={styles.sectionDescription} key={k}>
//               {moment(i.startDate).format('DD MMM YYYY')} {'->'}{' '}
//               {i.bloodPressureSystolicValue}
//               {'/'}
//               {i.bloodPressureDiastolicValue}
//             </Text>
//           );
//         })}
//       {!BP && (
//         <Text style={styles.sectionDescriptionError}>
//           Add your BP to Health App!
//         </Text>
//       )}
//     </View>

//     {/* <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>StepCount</Text>
//         {StepCount && (
//           <Text style={styles.sectionDescription}>
//             {StepCount.value}
//           </Text>
//         )}
//         {!StepCount && (
//           <Text style={styles.sectionDescriptionError}>
//             Add your StepCount to Health App!
//           </Text>
//         )}
//       </View> */}

//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionTitle}>Body Temp</Text>
//       {temp &&
//         temp.length > 0 &&
//         temp?.map((i, k) => {
//           return (
//             <Text style={styles.sectionDescription} key={k}>
//               {moment(i.startDate).format('DD MMM YYYY')} {'->'}{' '}
//               {Math.round(i.value)} {'ºc'}
//             </Text>
//           );
//         })}
//       {!temp && (
//         <Text style={styles.sectionDescriptionError}>
//           Add your Temp to Health App!
//         </Text>
//       )}
//     </View>
//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionTitle}>
//         Steps which is different
//       </Text>
//       {/* {filterFunction()} */}
//       {steps &&
//         steps.length > 0 &&
//         steps?.map((i, k) => {
//           return (
//             <Text style={styles.sectionDescription} key={k}>
//               {moment(i.startDate).format('DD MMM YYYY')} {'->'}{' '}
//               {i.value} {'Steps'}
//             </Text>
//           );
//         })}
//       {!steps && (
//         <Text style={styles.sectionDescriptionError}>
//           Add your steps to Health App!
//         </Text>
//       )}
//     </View>
//   </View>
// )}
// {Platform.OS === 'android' && <GoogleFit />}
