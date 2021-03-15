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
        AppleHealthKit.getDateOfBirth(null, (err, results) => {
          setDateOfBirth(results), console.log('age', results);
        });

        // Get Latest Weight
        AppleHealthKit.getLatestWeight(null, (err: string, results: Object) => {
          setWeight(results), console.log('weight', results);
        });

        AppleHealthKit.getHeightSamples(
          stepsCount,
          (err: string, results: Object) => {
            setallHeights(results), console.log('All height', results);
          },
        );

        AppleHealthKit.getLatestHeight(null, (err: string, results: Object) => {
          console.log('height', results);

          setHeight(results);
        });

        AppleHealthKit.getLatestBmi(null, (err: string, results: Object) => {
          console.log('BMI', results);

          setBMI(results);
        });

        // AppleHealthKit.getStepCount(
        //   {options: stepsCount},
        //   (err: Object, results: Object) => {
        //     this.setState({
        //       StepCount: results,
        //     });
        //     console.log("step count",results);
        //   },
        // );

        // AppleHealthKit.getLatestBodyFatPercentage(
        //   null,
        //   (err: Object, results: Object) => {
        //     this.setState({
        //       BodyFatPerc: results,
        //     });
        //     // console.log("Body fat",results);
        //   },
        // );
        AppleHealthKit.getBodyTemperatureSamples(
          stepsCount,
          (err: Object, results: Array<Object>) => {
            settemp(results);

            console.log('All body temp', results);
          },
        );

        AppleHealthKit.getDailyStepCountSamples(
          stepsCount,
          (err: Object, results: Array<Object>) => {
            setsteps(results);

            console.log('All steps', results);
          },
        );

        AppleHealthKit.getBodyFatPercentageSamples(
          stepsCount,
          (err: string, results: Object) => {
            setBodyFatPerc(results);

            console.log(' All Body Fat % ', results);
          },
        );

        AppleHealthKit.getWeightSamples(
          stepsCount,
          (err: Object, results: Array<Object>) => {
            setWeight(results);

            console.log(' All Body Weight ', results);
          },
        );

        AppleHealthKit.getBloodPressureSamples(
          stepsCount,
          (err: Object, results: Array<Object>) => {
            setBP(results);

            console.log('All BP', results);
          },
        );
        // Need to check from here for data ================================================================>>>>>>>>>>>>>>>>>>>>
        AppleHealthKit.getActiveEnergyBurned(
          stepsCount,
          (err: Object, results: Object) => {
            // if (err) {
            //   return;
            // }
            setCalories(results);
            console.log('Active energy count', results);
          },
        );

        AppleHealthKit.getDailyDistanceWalkingRunningSamples(
          stepsCount,
          (err: Object, results: Array<Object>) => {
            // if (err) {
            //   return;
            // }
            setDistance(results);
            console.log('Distance in KMS', results);
          },
        );

        AppleHealthKit.getHeartRateSamples(
          stepsCount,
          (err: Object, results: Array<Object>) => {
            // if (err) {
            //   return;
            // }
            setHeartRate(results);
            console.log('Heart Samples', results);
          },
        );

        AppleHealthKit.getSleepSamples(
          stepsCount,
          (err: Object, results: Array<Object>) => {
            // if (err) {
            //   return;
            // }
            setSleep(results);
            console.log('Sleep Analysis', results);
          },
        );

        AppleHealthKit.getDateOfBirth(null, (err: Object, results: Object) => {
          // if (err) {
          //   return;
          // }
          setDOB(results);
          console.log('DOB', results);
        });
      });
    }

    // while (steps.length > 0) {

    // }
  }, []);

  const CheckForWeather = () => {
    // console.log(
    //   `api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lng}&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
    // );
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
      )
      .then((response) => {
        // handle success
        // console.log('Success', response.data);
        // this.setState({Weather: response.data});
        setWeather(response.data);
      })
      .catch(function (error) {
        // handle error
        // console.log('error', error);
      });
  };

  // render() {
  //   const {
  //     DateOfBirth,
  //     Weight,
  //     Height,
  //     BMI,
  //     BodyFatPerc,
  //     StepCount,
  //     temp,
  //     steps,
  //     allHeights,
  //     BP,
  //     Weather,
  //   } = this.state;
  // {moment(dateTime).format("DD MMM YYYY")}

  // const filterFunction = () => {
  //   let value = 0;
  //   let FilteredSteps = [];
  //   if (steps) {
  //     console.log('steps check run', steps);
  //     for (let i in steps) {
  //       console.log("date", date);
  //       let date = moment(steps[0].startDate).format('DD MMM YYYY');
  //       let Nextdate = moment(steps[i].startDate).format('DD MMM YYYY');
        
  //       if (date == Nextdate) {
  //         value += steps[i].value;
  //       }else {
  //         // console.log('Next', Nextdate)
  //         FilteredSteps.push({date: date, value: value})
  //         date = Nextdate
  //         value = 0;
  //       }
  //       // if (date != Nextdate) {
  //       //   FilteredSteps.push({value: value, date: date});
  //       //   value = 0;
  //       // }
  //       // // return FilteredSteps;
  //     }
  //     console.log('FilteredSteps   ========================================>>>>>>>>>', FilteredSteps);
  //   }
  // };

  const filterFunction=()=>{
    
  }
  return (
    <View>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        {CheckForWeather()}
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
                {filterFunction()}
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
