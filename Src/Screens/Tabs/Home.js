import React from 'react';
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

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Weight: false,
            Height: false,
            DateOfBirth: false,
            BMI: false,
            BodyFatPerc: false,
            StepCount: false,
            temp: false,
            steps: false,
            allHeights: false,
            BP: false,
            lat: 0,
            lng: 0,
            Weather: null,
        };
    }

    wow = {
        startDate: new Date(2020, 1, 1).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
    };

    Temp = {
        unit: 'celsius', // optional; default 'celsius'
        startDate: new Date(2021, 1, 1).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        // ascending: false, // optional; default false
        // limit: 10, // optional; default no limit
    };

    stepsCount = {
        startDate: new Date(2021, 0, 1).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
    };

    componentDidMount() {
        console.log(
            `api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lng}&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
        );

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
                    console.log('Success', location);
                    this.setState({ lat: location.latitude });
                    this.setState({ lng: location.longitude });
                })
                .catch((error) => {
                    const { code, message } = error;
                    console.log('error', code, message);
                });

            AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
                if (err) {
                    console.log('error initializing Healthkit: ', err);
                    return;
                }

                // Date of Birth Example
                AppleHealthKit.getDateOfBirth(null, (err, results) => {
                    this.setState({
                        DateOfBirth: results,
                    });
                    // console.log('age', results);
                });

                // Get Latest Weight
                AppleHealthKit.getLatestWeight(null, (err: string, results: Object) => {
                    this.setState({
                        Weight: results,
                    });
                    // console.log('weight', results);
                });

                AppleHealthKit.getHeightSamples(
                    this.stepsCount,
                    (err: string, results: Object) => {
                        this.setState({
                            allHeights: results,
                        });
                        // console.log('All height', results);
                    },
                );

                AppleHealthKit.getLatestHeight(null, (err: string, results: Object) => {
                    // console.log('height', results);
                    this.setState({
                        Height: results,
                    });
                });

                AppleHealthKit.getLatestBmi(null, (err: string, results: Object) => {
                    // console.log('BMI', results);
                    this.setState({
                        BMI: results,
                    });
                });

                // AppleHealthKit.getStepCount(
                //   {options: this.stepsCount},
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
                    this.stepsCount,
                    (err: Object, results: Array<Object>) => {
                        this.setState({
                            temp: results,
                        });
                        // console.log('All body temp', results);
                    },
                );

                AppleHealthKit.getDailyStepCountSamples(
                    this.stepsCount,
                    (err: Object, results: Array<Object>) => {
                        this.setState({
                            steps: results,
                        });
                        console.log('All steps', results);
                    },
                );

                AppleHealthKit.getBodyFatPercentageSamples(
                    this.stepsCount,
                    (err: string, results: Object) => {
                        this.setState({
                            BodyFatPerc: results,
                        });
                        // console.log(' All Body Fat % ', results);
                    },
                );

                AppleHealthKit.getWeightSamples(
                    this.stepsCount,
                    (err: Object, results: Array<Object>) => {
                        this.setState({
                            Weight: results,
                        });
                        // console.log(' All Body Weight ', results);
                    },
                );

                AppleHealthKit.getBloodPressureSamples(
                    this.stepsCount,
                    (err: Object, results: Array<Object>) => {
                        this.setState({
                            BP: results,
                        });
                        // console.log("All BP",results)
                    },
                );
                // Need to check from here for data ================================================================>>>>>>>>>>>>>>>>>>>>
                AppleHealthKit.getBasalEnergyBurned(
                    this.stepsCount,
                    (err: Object, results: Object) => {
                        if (err) {
                            return;
                        }
                        console.log('Basal Energy Burned', results);
                    },
                );

                AppleHealthKit.getDailyDistanceWalkingRunningSamples(
                    this.stepsCount,
                    (err: Object, results: Array<Object>) => {
                        if (err) {
                            return;
                        }
                        console.log('Distance in KMS', results);
                    },
                );

                AppleHealthKit.getHeartRateSamples(
                    this.stepsCount,
                    (err: Object, results: Array<Object>) => {
                        if (err) {
                            return;
                        }
                        console.log('Heart Samples', results);
                    },
                );

                AppleHealthKit.getSleepSamples(
                    this.stepsCount,
                    (err: Object, results: Array<Object>) => {
                        if (err) {
                            return;
                        }
                        console.log('Sleep Analysis', results);
                    },
                );

                AppleHealthKit.getDateOfBirth(null, (err: Object, results: Object) => {
                    if (err) {
                        return;
                    }
                    console.log('DOB', results);
                });
            });
        }
    }

    CheckForWeather() {
        console.log(
            `api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lng}&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
        );
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lng}&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
            )
            .then((response) => {
                // handle success
                console.log('Success', response.data);
                this.setState({ Weather: response.data });
            })
            .catch(function (error) {
                // handle error
                console.log('error', error);
            })
            .then(function () {
                // always executed
            });
    }

    render() {
        const {
            DateOfBirth,
            Weight,
            Height,
            BMI,
            BodyFatPerc,
            StepCount,
            temp,
            steps,
            allHeights,
            BP,
            Weather,
        } = this.state;
        // {moment(dateTime).format("DD MMM YYYY")}
        return (
            <View>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    {this.CheckForWeather()}
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
                                                Sunset Time:{' '}
                                                {moment(Weather.sys.sunset).format('HH:MM')}
                                            </Text>

                                            <Text
                                                style={[
                                                    styles.sectionDescription,
                                                    { textAlign: 'left' },
                                                ]}>
                                                Min Temp: {Weather.main.temp_min} ºC{' '}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.sectionDescription,
                                                    { textAlign: 'left' },
                                                ]}>
                                                Max Temp: {Weather.main.temp_max} ºC{' '}
                                            </Text>
                                        </View>
                                    )}
                                    <Text style={[styles.sectionTitle, { marginTop: 22 }]}>
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
    }
}

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
