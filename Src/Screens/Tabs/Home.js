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
import GraphicChart from '../../Components/GraphicChart/GraphicChart';
import PostRequestApi from '../../apirequest/PostRequestApi';
import ProgressBarCustom from '../../Components/ProgressBar/ProgressBarCustom';
import BarGraph from '../../Components/BarChart/BarGraph';
import {LineChart} from 'react-native-chart-kit';
import {dynamicSize} from '../../Constants/sizeChoose';
import BezierGraphAuto from '../../Components/BezierGraphAuto/BezierGraphAuto';
import HomeHeader from '../../Components/HomeHeader/HomeHeader';
import {useRoute} from '@react-navigation/native';
import FitnessData from '../Home/FitnessData';
import WeatherData from '../Home/WeatherData/WeatherData';
import ScreenData from '../Home/screenData/screenData';
import SleepData from '../Home/SleepData/SleepData';
import {useSelector} from 'react-redux';

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
  const [PermScreenTime, setPermScreenTime] = useState(false);

  const route = useRoute();
  const UserData = useSelector((state) => state.First);
  const {lat, long} = route.params.cord;
  // console.log(`UserData.UserEmail`, UserData.UserEmail);

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

  const CheckForScreenData = () => {
    console.log(`Implement screen data`);
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
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&exclude=hourly,minutely&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
    );
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&exclude=hourly,minutely&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
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

    // console.log(`Fsteps at last`, Fsteps);
    // console.log(`walkTime at last`, WalkTime);
    // console.log(`Workouts at last`, Workouts);
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
        email: UserData.UserEmail,
      });
      console.log(`data`, data);

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
          <FitnessData Perm={Perm} checkStorage={checkStorage} />
        </View>
        <View>
          <WeatherData
            data={data}
            dataLow={dataLow}
            Weather={Weather}
            PermWeather={PermWeather}
            CheckForWeather={CheckForWeather}
          />
        </View>

        <View style={styles.slide3}>
          <ScreenData
            data={data}
            dataLow={dataLow}
            Weather={Weather}
            PermScreenTime={PermScreenTime}
            CheckForScreenData={CheckForScreenData}
          />
        </View>
        <View style={styles.slide3}>
          <SleepData
            data={data}
            dataLow={dataLow}
            Weather={Weather}
            PermScreenTime={PermScreenTime}
            CheckForWeather={CheckForScreenData}
          />
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
