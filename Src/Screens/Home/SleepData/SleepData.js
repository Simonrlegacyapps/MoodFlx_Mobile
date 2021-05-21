import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Constants from '../../../Constants';
import {
  RubikExtraBold,
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
// import ProgressBar from 'react-native-animated-progress';
import ProgressBar from '../../../Components/ProgressBar/ProgressBarCustom';
import HomeHeader from '../../../Components/HomeHeader/HomeHeader';
import BarGraph from '../../../Components/BarChart/BarGraph';
import BezierGraphAuto from '../../../Components/BezierGraphAuto/BezierGraphAuto';
import GraphicChart from '../../../Components/GraphicChart/GraphicChart';
import StarProgress from '../../../Components/StarProgress/StarProgress';
import PopUp from '../../../Components/PopUp/PopUp';
import DateExpiredModal from '../../../Components/Modals/DateExpiredModal/DateExpiredModal';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {SleepPerm} from '../../../redux/actions/actions';

export const {width: SIZE, height: HEIGHT} = Dimensions.get('window');

const IndicatorHelper = ({color, text}) => {
  return (
    <View style={styles.indicatorHelperView}>
      <View style={[styles.indicatorHelper, {backgroundColor: color}]} />
      <Text style={styles.indicatorText}>{text}</Text>
    </View>
  );
};

const SleepData = ({
  CheckForSleepData,
  PermScreenTime,
  Weather,
  data,
  dataLow,
  MoodCount,
  swiperIndex,
}) => {
  const [openActionSheet, setopenActionSheet] = useState(false);
  const [SleepPopUp, setSleepPopUp] = useState(false);

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  // console.log(`UserData.SleepPermission`, UserData.SleepPermission);

  const VerifyDone = async () => {
    // await AsyncStorage.setItem('GiveSleepPerm', 'true');

    setopenActionSheet(false);
    let Sp = await AsyncStorage.getItem('GiveSleepPerm');
    let SleepP = await JSON.parse(Sp);
    console.log(`SleepPerm`, SleepP);
    dispatch(SleepPerm(SleepP));
    if (SleepP != null) {
      OnSleepDataPerm();
    }
  };

  useEffect(() => {
    if (UserData.SleepPermission === true) {
      OnSleepDataPerm();
    }
  }, []);

  const OnSleepDataPerm = () => {
    if (Platform.OS === 'ios') {
      const healthKitOptions = {
        permissions: {
          read: [PERMS.SleepAnalysis],
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

        AppleHealthKit.getSleepSamples(
          stepsCount,
          async (err: Object, results: Array<Object>) => {
            setSleep(results);
            console.log('Sleep Analysis +++++++++======>>>>', results);
          },
        );
      });
      // setLoading(false);
    }
  };

  return (
    <View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.HeaderView}>
          <TouchableOpacity
            onPress={async () => {
              setopenActionSheet(true);
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
              <Text style={styles.normalText}>Sleep data</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.ColoredView}>
            <Text style={styles.ColoredText}>Anonymous</Text>
          </View>
        </View>
        <View style={styles.ProgressBarView}>
          <ProgressBar
            progress={
              // swiperIndex == 1
              ((JSON.parse(MoodCount) < 3 ? JSON.parse(MoodCount) : 3) / 3) *
              100
              // : 0
            }
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
              {JSON.parse(MoodCount) === null ? 0 : JSON.parse(MoodCount)}/3
            </Text>
          </View>
        </View>
        <View>
          {
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setSleepPopUp(true);
                }}
                activeOpacity={1}
                style={{
                  // fontSize: SIZE / 14,
                  // fontWeight: '500',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <Text style={[styles.SmallThinText, {paddingVertical: 9}]}>
                  SLEEP
                </Text>
                <Text style={styles.swiperText}>
                  You're more likely to be{' '}
                  <Text style={{color: '#5947D0'}}>excited</Text> and{' '}
                  <Text style={{color: '#5947D0'}}>happy</Text> when you sleep
                  more than <Text style={{color: '#5947D0'}}>7.5hrs</Text>
                </Text>
                <Text style={[styles.SmallThinText, {paddingVertical: 9}]}>
                  Almost there! Try sleep a bit longer
                </Text>
              </TouchableOpacity>
              {UserData.SleepPermission && (
                <View
                  style={{
                    position: 'absolute',
                    zIndex: -234234,
                    justifyContent: 'center',
                    top: 420,
                  }}>
                  <Text
                    style={{
                      marginTop: -160,
                      fontWeight: '700',
                      fontFamily: RubikExtraBold,
                      fontSize: SIZE / 3.5,
                      color: '#E0DDED',
                      transform: [{rotate: '-15deg'}],
                    }}>
                    Demo
                  </Text>
                </View>
              )}
            </View>
          }

          {/* <ProgressBarCustom /> */}
          {/* <HomeHeader /> */}
          <View style={{marginBottom: 50}}>
            {/* <BarGraph /> */}
            <StarProgress />
            <View
              style={{
                position: 'absolute',
                alignSelf: 'center',
                marginTop: 30,
              }}>
              {/* <View>
              <View>
                <BezierGraphAuto data={data} color={'#F4227E'} />
              </View>
              <View style={{marginTop: 20}}>
                <BezierGraphAuto data={dataLow} color={'#70DEEC'} />
              </View>
            </View> */}
            </View>
            {/* <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <IndicatorHelper color={'#7FE3F0'} text={'Min ºC'} />
            <IndicatorHelper color={'#FC4190'} text={'Max ºC'} />
            <IndicatorHelper color={'#7265E3'} text={'Rainfall'} />
            <IndicatorHelper color={'#0DDE7A'} text={'Pollen'} />
          </View> */}
          </View>
          <GraphicChart />
          {!UserData.SleepPermission && (
            <TouchableOpacity
              activeOpacity={0}
              onPress={async () => {
                // await AsyncStorage.setItem('GiveHealthPerm', 'true');
                setopenActionSheet(true);
              }}
              style={{
                position: 'absolute',
                flex: 1,
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                opacity: 0,
              }}></TouchableOpacity>
          )}
        </View>
        {!UserData.SleepPermission && (
          <View
            style={{
              position: 'absolute',
              top: 420,
              alignItems: 'center',
              height: '100%',
              width: '100%',
              zIndex: -234234,
            }}>
            <Text
              style={{
                marginTop: -160,
                fontWeight: '700',
                fontFamily: RubikExtraBold,
                fontSize: SIZE / 3.5,
                color: '#E0DDED',
                transform: [{rotate: '-15deg'}],
              }}>
              Demo
            </Text>
          </View>
        )}
      </ScrollView>

      <PopUp
        ComingUp
        permission={false}
        image={Constants.Images.Sleepimage}
        dataType={'sleep'}
        modalVisible={openActionSheet}
        dismissModalHandler={() => setopenActionSheet(false)}
        verifyDone={() => VerifyDone()}
      />

      <DateExpiredModal
        SleepPopUp
        modalVisible={SleepPopUp}
        dismissModalHandler={() => setSleepPopUp(false)}
        verifyDone={() => setSleepPopUp(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
    paddingBottom: 400,
  },
  WeatherCardMain: {
    flexDirection: 'row',
    width: 320,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: '#F1F4F9',
    borderRadius: 18,
    paddingVertical: 20,
  },
  WeatherCard: {
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingBottom: 8,
  },
  city: {
    paddingVertical: 0,
    color: '#3B456D',
    fontSize: 18,
    fontFamily: RubikRegular,
  },
  CardsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  card2View: {
    width: 120,
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 15,
  },
  SmallCardImage: {
    margin: 5,
    height: 20,
    width: 20,
  },
  smallCardText: {
    fontFamily: RubikLight,
    fontWeight: '300',
    color: '#8A8BAB',
    fontSize: 16,
    marginBottom: 5,
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
  Card1Text: {
    fontFamily: RubikLight,
    fontWeight: '300',
    color: '#8A8BAB',
    fontSize: 16,
    marginTop: 10,
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
    // lineHeight: 12,
    // marginVertical: 5,
  },
  normalText: {
    fontSize: 16,
    marginTop: 4,
    // lineHeight: 16,
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
  SmallThinText: {
    paddingVertical: 12,
    fontFamily: RubikLight,
    color: '#747690',
  },
  swiperText: {
    fontSize: SIZE / 14,
    fontWeight: '500',
    width: '70%',
    textAlign: 'center',
    fontFamily: RubikMedium,
    color: '#222432',
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

export default SleepData;
