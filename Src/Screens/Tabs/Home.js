// import React from 'react';
// import {Text, View} from 'react-native';

// const HomeSscreen = () => {
//   return (
//     <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
//       <Text>Home Tab</Text>
//     </View>
//   );
// };

// export default HomeSscreen;

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import moment from 'moment';
import axios from 'axios';

import AppleHealthKit from 'rn-apple-healthkit';
import GetLocation from 'react-native-get-location';
import DeviceInfo from 'react-native-device-info';

const PERMS = AppleHealthKit.Constants.Permissions;

const App = () => {
  //energy
  //sleep
  //heartrrate
  //dob
  //distance

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

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     Weight: false,
  //     Height: false,
  //     DateOfBirth: false,
  //     BMI: false,
  //     BodyFatPerc: false,
  //     StepCount: false,
  //     temp: false,
  //     steps: false,
  //     allHeights: false,
  //     BP: false,
  //     lat: 0,
  //     lng: 0,
  //     Weather: null,
  //   };
  // }

  const wow = {
    startDate: new Date(2020, 1, 1).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
  };

  const a = moment().subtract(1, 'months').format('DD MMM YYYY');

  const Temp = {
    unit: 'celsius', // optional; default 'celsius'
    startDate: new Date(2021, 1, 1).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
    // ascending: false, // optional; default false
    // limit: 10, // optional; default no limit
  };

  const stepsCount = {
    startDate: new Date(a).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
  };

  useEffect(() => {
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
            PERMS.ActiveEnergyBurned,
            PERMS.BasalEnergyBurned,
            PERMS.DistanceWalkingRunning,
            PERMS.HeartRate,
            PERMS.SleepAnalysis,
            PERMS.DateOfBirth,
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

        // AppleHealthKit.getStepCount(
        //   {options: stepsCount},
        //   async(err: Object, results: Object) => {
        //     this.await setState({
        //       StepCount: results,
        //     });
        //     console.log("step count",results);
        //   },
        // );

        // AppleHealthKit.getLatestBodyFatPercentage(
        //   null,
        //   async(err: Object, results: Object) => {
        //     this.await setState({
        //       BodyFatPerc: results,
        //     });
        //     // console.log("Body fat",results);
        //   },
        // );
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
            // if async(err) {
            //   return;
            // }
            await setCalories(results);
            console.log('Active energy count', results);
          },
        );

        AppleHealthKit.getDailyDistanceWalkingRunningSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            // if async(err) {
            //   return;
            // }
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
      });
    }

    CheckForWeather();

    filterDates();
    filterSteps();
    AddDataToFilter();
  }, []);

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
  let totalSteps = 0;
  let totalDistance = 0;
  let totalCalories = 0;
  let totalHeartRate = 0;
  let highBp = 0;
  let lowBp = 0;
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
      Fsteps.push({
        date: dates[i],
        steps: totalSteps,
        distance: totalDistance,
        calories: totalCalories,
        heartRate: totalHeartRate,
        highBP: highBp,
        lowBP: lowBp,
      });
      totalSteps = 0;
      totalDistance = 0;
      totalCalories = 0;
      totalHeartRate = 0;
      highBp = 0;
      lowBp = 0;
    }
    console.log('Fsteps', Fsteps);
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

  const AddDataToFilter = () => {
    const deviceId = DeviceInfo.getUniqueId();
    Fsteps.push(
      {age: DateOfBirth.age},
      {height: Height != null ? Height.value : 0},
      {weight: LatestWeight != null ? LatestWeight.value : 0},
      {DOB: DateOfBirth.value},
      {device_id: deviceId},
    );
  };
  return (
    <View>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {Platform.OS === 'ios' && (
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Weather Info</Text>
                {Weather && (
                  <View>
                    <Text style={styles.sectionDescription}>
                      Current Temp: {Weather.main.temp} ºC{' '}
                    </Text>
                    <Text>
                      Sunrise Time:{' '}
                      {moment(Weather.sys.sunrise).format('HH:MM')}
                    </Text>
                    <Text>
                      Sunset Time: {moment(Weather.sys.sunset).format('HH:MM')}
                    </Text>

                    <Text
                      style={[styles.sectionDescription, {textAlign: 'left'}]}>
                      Min Temp: {Weather.main.temp_min} ºC{' '}
                    </Text>
                    <Text
                      style={[styles.sectionDescription, {textAlign: 'left'}]}>
                      Max Temp: {Weather.main.temp_max} ºC{' '}
                    </Text>
                  </View>
                )}
                <Text style={[styles.sectionTitle, {marginTop: 22}]}>
                  Weight
                </Text>

                {Weight &&
                  Weight.length > 0 &&
                  Weight?.map((i, k) => {
                    return (
                      <Text style={styles.sectionDescription} key={k}>
                        {moment(i.startDate).format('DD MMM YYYY')} {'->'}{' '}
                        {Math.round(i.value)} {'Pound'}
                      </Text>
                    );
                  })}
                {!Weight && (
                  <Text style={styles.sectionDescriptionError}>
                    Add your Weight to Health App!
                  </Text>
                )}
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Age</Text>
                {DateOfBirth && (
                  <Text style={styles.sectionDescription}>
                    {DateOfBirth.age}
                  </Text>
                )}
                {!DateOfBirth && (
                  <Text style={styles.sectionDescriptionError}>
                    Add your Birthday to Health App!
                  </Text>
                )}
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Height</Text>
                {allHeights &&
                  allHeights.length > 0 &&
                  allHeights?.map((i, k) => {
                    return (
                      <Text style={styles.sectionDescription} key={k}>
                        {moment(i.startDate).format('DD MMM YYYY')} {'->'}{' '}
                        {Math.round(i.value)} {'Inches'}
                      </Text>
                    );
                  })}
                {!allHeights && (
                  <Text style={styles.sectionDescriptionError}>
                    Add your Height to Health App!
                  </Text>
                )}
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>BMI</Text>
                {BMI && (
                  <Text style={styles.sectionDescription}>{BMI.value}</Text>
                )}
                {!BMI && (
                  <Text style={styles.sectionDescriptionError}>
                    Add your Birthday to Health App!
                  </Text>
                )}
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>BodyFatPerc</Text>
                {BodyFatPerc &&
                  BodyFatPerc.length > 0 &&
                  BodyFatPerc?.map((i, k) => {
                    return (
                      <Text style={styles.sectionDescription} key={k}>
                        {moment(i.startDate).format('DD MMM YYYY')} {'->'}{' '}
                        {i.value}
                        {'%'}
                      </Text>
                    );
                  })}
                {!BodyFatPerc && (
                  <Text style={styles.sectionDescriptionError}>
                    Add your Birthday to Health App!
                  </Text>
                )}
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>BP</Text>
                {BP &&
                  BP.length > 0 &&
                  BP?.map((i, k) => {
                    return (
                      <Text style={styles.sectionDescription} key={k}>
                        {moment(i.startDate).format('DD MMM YYYY')} {'->'}{' '}
                        {i.bloodPressureSystolicValue}
                        {'/'}
                        {i.bloodPressureDiastolicValue}
                      </Text>
                    );
                  })}
                {!BP && (
                  <Text style={styles.sectionDescriptionError}>
                    Add your BP to Health App!
                  </Text>
                )}
              </View>

              {/* <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>StepCount</Text>
                  {StepCount && (
                    <Text style={styles.sectionDescription}>
                      {StepCount.value}
                    </Text>
                  )}
                  {!StepCount && (
                    <Text style={styles.sectionDescriptionError}>
                      Add your StepCount to Health App!
                    </Text>
                  )}
                </View> */}

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Body Temp</Text>
                {temp &&
                  temp.length > 0 &&
                  temp?.map((i, k) => {
                    return (
                      <Text style={styles.sectionDescription} key={k}>
                        {moment(i.startDate).format('DD MMM YYYY')} {'->'}{' '}
                        {Math.round(i.value)} {'ºc'}
                      </Text>
                    );
                  })}
                {!temp && (
                  <Text style={styles.sectionDescriptionError}>
                    Add your Temp to Health App!
                  </Text>
                )}
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Steps which is different
                </Text>
                {/* {filterFunction()} */}
                {steps &&
                  steps.length > 0 &&
                  steps?.map((i, k) => {
                    return (
                      <Text style={styles.sectionDescription} key={k}>
                        {moment(i.startDate).format('DD MMM YYYY')} {'->'}{' '}
                        {i.value} {'Steps'}
                      </Text>
                    );
                  })}
                {!steps && (
                  <Text style={styles.sectionDescriptionError}>
                    Add your steps to Health App!
                  </Text>
                )}
              </View>
            </View>
          )}
          {Platform.OS === 'android' && <GoogleFit />}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
  // }
};

const styles = StyleSheet.create({
  scrollView: {
    // backgroundColor: '#FFF',
    height: '95%',
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
});

export default App;
