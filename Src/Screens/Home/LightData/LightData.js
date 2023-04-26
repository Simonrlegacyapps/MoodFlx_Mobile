import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useReducer,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import Constants from '../../../Constants';
import {
  RubikBlack,
  RubikExtraBold,
  RubikBold,
  RubikLight,
  RubikMedium,
  RubikRegular,
  RubikSemiBold,
} from '../../../Constants/fonts/Fonts';
// import ProgressBar from 'react-native-animated-progress';
import ProgressBar from '../../../Components/ProgressBar/ProgressBarCustom';
import PopUp from '../../../Components/PopUp/PopUp';
import { dynamicSize, getFontSize, getLineHeight, horizontalScale, verticalScale } from '../../../Constants/sizeChoose';
const { SensorManager } = NativeModules;
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import LightGraph from '../../../Components/LightGraph/LightGraph';
import { getLightDataIOS } from '../../../services/moodDataModuleService';
import PostRequestApi from '../../../apirequest/PostRequestApi';
import DataInsights from '../../../Components/DataInsights/DataInsights';
import BulbIcon from '../../../../assets/commonicons/BulbIcon';
import { getBulbColorFromLux, getLightGraphData, getMyDeviceId } from '../../../services/commonService';
import { getApiBaseUrl, getMonthlyInsightsAvailable, getWeeklyInsightsAvailable } from '../../../Constants/constants';
import AnonymousPopUp from '../../../Components/Modals/AnonymousPopUp/AnonymousPopUp';
import HomeSyncHeader from '../../../Components/HomeSyncHeader/HomeSyncHeader';
import Skeleton from '../../../Components/Skeleton/Skeleton';
import Colors from '../../../Constants/Colors/Colors';
let lightData = null;
let getLightTimeoutIdIOS = null;
let isStopLightTimeout = true;
let currentLightData = -1;

const { width: SIZE, height: HEIGHT } = Dimensions.get('window');

const lightInsightsInitialState = {
  dailyInsights: '',
  weeklyInsights: '',
  dailySuggestion: '',
  dailySuggestionType: '',
  weeklySuggestion: '',
  weeklySuggestionType: '',
  monthlyInsights: '',
  monthlySuggestion: '',
  monthlySuggestionType: '',
  demoDailyInsights: 'Today your Saddest mood input was when there was 180 lux in the room',
  demoWeeklyInsights: 'This week your Saddest mood input was when there was 180 lux in the room',
  demoMonthlyInsights: 'This month your Saddest mood input was when there was 180 lux in the room',
  demoSuggestion: 'Try turning up the lights and aim for around 300 lux',
};

const lightInsightsTypes = {
  SET_INSIGHTS: 'SET_INSIGHTS',
};

function lightInsightsReducer(state, action) {
  switch (action.type) {
    case lightInsightsTypes.SET_INSIGHTS:
      return action?.payload && typeof action?.payload === 'object'
        ? { ...state, ...action.payload }
        : state;
    default:
      return state;
  }
}

const LightData = ({
  MoodCount,
  swiperIndex,
  index,
}) => {
  const [light, setLight] = useState(-1);
  const [Graph, setGraph] = useState(null);
  const [skeleton, setskeleton] = useState(false);
  const [insights, setInsights] = useReducer(
    lightInsightsReducer,
    lightInsightsInitialState,
  );
  const [openActionSheet, setopenActionSheet] = useState(false);
  const [lightGraphData, setLightGraphData] = useState(null);
  const isUpdateLightApiCalled = useRef(false);
  const [AnonymousClick, setAnonymousClick] = useState(false);

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();

  const VerifyDone = async () => {
    callUpdateLightApi(light);
    setopenActionSheet(false);
  };

  const callUpdateLightApi = (_light) => {
    isUpdateLightApiCalled.current = true;
    const deviceId = getMyDeviceId();
    if (_light !== -1) {
      // _light = isNaN(_light) ? Number.parseInt(_light, 10) : _light;
      const params = {
        "device_id": deviceId,
        "email": UserData.UserEmail ?? "",
        "user_id": UserData.UserId ?? "",
        "date": moment().format("YYYY-MM-DD HH:mm:ss"),
        "value": _light
      };
      console.log('callUpdateLightApi params ==> ', params);
      // return;
      axios.post(`${getApiBaseUrl()}updateLightData`, params)
        .then(function (response) {
          console.log('✅ ✅ ✅ ✅ Success Update Light Data ✅ ✅ ✅ ✅', params);
          callGetLightApi();
        })
        .catch(function (error) {
          console.log('❌ ❌ ❌ ❌ Error Update Light Data ❌ ❌ ❌ ❌', error);
        });
    }
  }

  const callGetLightApi = () => {
    setskeleton(true);
    const deviceId = getMyDeviceId();
    const params = {
      "device_id": deviceId,
      "email": UserData.UserEmail ?? "",
      "user_id": UserData.UserId ?? ""
    };
    console.log('callGetLightApi params ==> ', params);
    axios.post(`${getApiBaseUrl()}getLightReport`, params)
      .then(function (response) {
        console.log('✅ ✅ ✅ ✅ Success Get Light Data ✅ ✅ ✅ ✅');
        console.log('Get Light Data response: ', response?.data?.lightData);
        console.log('Get Light Data response: ', Object.values(response?.data?.lightData));
        if (response?.data?.lightData) {
          const lightArray = Object.values(response?.data?.lightData);
          if (Array.isArray(lightArray) && lightArray.length > 0) {
            const lightGraphData = getLightGraphData(lightArray);
            console.log('lightGraphData: ', lightGraphData);
            setLightGraphData(lightGraphData);
          }
        }
        return PostRequestApi('getLightInsights', { ...params, "status": "daily" });
      })
      .then((res) => {
        console.log('✅ ✅ ✅ ✅  getLightInsights daily res ✅ ✅ ✅ ✅ : ', res?.data);
        let dailyInsightsPayload = {};
        dailyInsightsPayload.dailyInsights =
          res?.data?.insights?.message1 &&
            typeof res.data.insights.message1 === 'string'
            ? res.data.insights.message1
            : '';
        dailyInsightsPayload.dailySuggestion =
          res?.data?.insights?.message2 &&
            typeof res.data.insights.message2 === 'string'
            ? res.data.insights.message2
            : '';
        dailyInsightsPayload.dailySuggestionType =
          res?.data?.insights?.message2Type &&
            res?.data?.insights?.message2Type?.toLowerCase?.() === 'warning'
            ? res.data.insights.message2Type
            : '';
        setInsights({
          type: lightInsightsTypes.SET_INSIGHTS,
          payload: dailyInsightsPayload,
        });
        /*
        Weekly api should be called between
        Friday @ 12pm until Saturday 6pm
        */
        if (getWeeklyInsightsAvailable() === true) {
          return PostRequestApi('getLightInsights', {
            ...params,
            status: 'weekly',
            flag: 'current',
          });
        } else {
          return new Promise((resolve, reject) => resolve(null));
        }
      })
      .then((res) => {
        console.log('✅ ✅ ✅ ✅  getLightInsights weekly res ✅ ✅ ✅ ✅ : ', res?.data);
        let weeklyInsightsPayload = {};
        console.log('weeklyInsights: ', res?.data?.insights);
        weeklyInsightsPayload.weeklyInsights =
          res?.data?.insights?.message1 &&
            typeof res.data.insights.message1 === 'string'
            ? res.data.insights.message1
            : '';
        weeklyInsightsPayload.weeklySuggestion =
          res?.data?.insights?.message2 &&
            typeof res.data.insights.message2 === 'string'
            ? res.data.insights.message2
            : '';
        weeklyInsightsPayload.weeklySuggestionType =
          res?.data?.insights?.message2Type &&
            res?.data?.insights?.message2Type?.toLowerCase?.() === 'warning'
            ? res.data.insights.message2Type
            : '';
        setInsights({
          type: lightInsightsTypes.SET_INSIGHTS,
          payload: weeklyInsightsPayload,
        });
        if (getMonthlyInsightsAvailable() === true) {
          return PostRequestApi('getLightInsights', {
            ...params,
            status: 'monthly',
          });
        } else {
          return new Promise((resolve, reject) => resolve(null));
        }
      })
      .then((res) => {
        setskeleton(false);
        console.log('✅ ✅ ✅ ✅  getLightInsights monthly res ✅ ✅ ✅ ✅ : ', res?.data);
        let monthlyInsightsPayload = {};
        console.log('monthlyInsights: ', res?.data?.insights);
        monthlyInsightsPayload.monthlyInsights =
          res?.data?.insights?.message1 &&
            typeof res.data.insights.message1 === 'string'
            ? res.data.insights.message1
            : '';
        monthlyInsightsPayload.monthlySuggestion =
          res?.data?.insights?.message2 &&
            typeof res.data.insights.message2 === 'string'
            ? res.data.insights.message2
            : '';
        monthlyInsightsPayload.monthlySuggestionType =
          res?.data?.insights?.message2Type &&
            res?.data?.insights?.message2Type?.toLowerCase?.() === 'warning'
            ? res.data.insights.message2Type
            : '';
        setInsights({
          type: lightInsightsTypes.SET_INSIGHTS,
          payload: monthlyInsightsPayload,
        });
      })
      .catch(function (error) {
        setskeleton(false);
        console.log('❌ ❌ ❌ ❌ Error Get Light Data Insights ❌ ❌ ❌ ❌', error, 'params', params);
      });
  };

  const getCalculatedLightIOS = (v) => {
    const m = v * 100;
    const m1 = 41 - m;
    const multiplier = 5.7948 + (m1 < 0 ? (m / 10) : 0);
    // console.log('multiplier light data: ', multiplier);
    const l = multiplier * v * 100;
    return l;
  };

  const getLightIOS = useCallback(() => {
    if (isStopLightTimeout) {
      getLightTimeoutIdIOS && clearTimeout(getLightTimeoutIdIOS);
      getLightTimeoutIdIOS = null;
    } else {
      getLightTimeoutIdIOS && clearTimeout(getLightTimeoutIdIOS);
      getLightTimeoutIdIOS = null;
      getLightTimeoutIdIOS = setTimeout(() => {
        getLightDataIOS((lightValue) => {
          // console.log('LightData getLightDataIOS: ', lightValue);
          let l = lightValue;
          if (!isStopLightTimeout) {
            if (lightValue && !isNaN(lightValue)) {
              const l = getCalculatedLightIOS(lightValue);
              l?.toFixed && setLight(l.toFixed(0));
            }
            getLightIOS();
          }
        });
      }, 100);
    }
  }, []);

  // Light data using react-native-sensor-manager
  useEffect(() => {
    if (light === -1 || swiperIndex === index) {
      isStopLightTimeout = false;
      if (Platform.OS === 'android') {
        SensorManager.startLightSensor(100);
        function lightSensorCallback(d) {
          if (light === -1 || swiperIndex === index) {
            if (d?.light && typeof d?.light === 'number') {
              // currentLightData = !isNaN(data.light) ? Number.parseInt(data.light, 10) : data.light
              currentLightData = Number.parseInt(d.light, 10);
              // console.log('LigntSensorData: ', currentLightData);
              setLight(currentLightData);
            }
          } else {
            SensorManager.stopLightSensor();
          }
        }
        const lightSensorListener = DeviceEventEmitter.addListener('LightSensor', lightSensorCallback);
        return () => {
          isStopLightTimeout = true;
          SensorManager.stopLightSensor();
          lightSensorListener?.remove();
        };
      } else if (Platform.OS === 'ios') {
        isStopLightTimeout = false;
        getLightDataIOS((lightValue) => {
          // console.log('LightData getLightDataIOS: ', lightValue);
          if (lightValue && !isNaN(lightValue)) {
            const l = getCalculatedLightIOS(lightValue);
            l?.toFixed && setLight(l.toFixed(0));
          }
        });
        getLightIOS();
        return () => {
          isStopLightTimeout = true;
        };
      }
    } else if (light !== -1 && swiperIndex !== index) {
      isStopLightTimeout = true;
    }
  }, [getLightIOS, light, swiperIndex]);

  useEffect(() => {
    if (!isUpdateLightApiCalled.current && light !== -1) {
      callUpdateLightApi(light);
    }
    return () => {
      lightData = null;
      currentLightData = -1;
    };
  }, [light]);

  const lux = light === -1 ? 0 : light;

  const AnonymousPopUpcancelled = () => {
    setAnonymousClick(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        {/* <View style={styles.HeaderView}>
          <TouchableOpacity
            onPress={async () => {
              setopenActionSheet(true);
            }}
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.syncButtonView}>
              <Image
                style={{ height: 20, width: 20 }}
                source={Constants.Images.Sync}
              />
            </View>
            <View style={{ alignContent: 'center', paddingHorizontal: 15 }}>
              <Text style={styles.lightText}>Syncing your</Text>
              <Text style={styles.normalText}>Light data</Text>
            </View>
          </TouchableOpacity>
          <View>
            <CrownBox floCoins={UserData.floCoins}/>
            </View>
          <View style={styles.ColoredView}>
            <Text style={styles.ColoredText}>Anon</Text>
          </View>
        </View> */}
        <HomeSyncHeader
          label={'Light'}
          isPermissionGiven={true}
          setOpenActionSheet={setopenActionSheet}
          setAnonymousClick={setAnonymousClick}
        />
        <View style={[styles.ProgressBarView, {width: JSON.parse(MoodCount) > 3 ? "90%" : '88%'}]}>
          <ProgressBar
            progress={
              // swiperIndex == 1
              ((JSON.parse(MoodCount) < 3 ? JSON.parse(MoodCount) : 3) / 3) *
              100
              // : 0
            }
            MoodCount={JSON.parse(MoodCount)}
            height={10}
          />
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.SmallThinText, { flex: 1 }]}>
              Try add 3 moods per day
            </Text>
            <Text
              style={
                (styles.SmallThinText, { paddingTop: 10, paddingVertical: 0 })
              }>
              {JSON.parse(MoodCount) === null ? 0 : JSON.parse(MoodCount)}/3
            </Text>
          </View>
        </View>
        {skeleton && <Skeleton />}
        <View style={styles.subViewTwo}>
          {skeleton === false && (
            <DataInsights
              dailyInsights={insights?.dailyInsights}
              weeklyInsights={insights?.weeklyInsights}
              dailySuggestion={insights?.dailySuggestion}
              dailySuggestionType={insights?.dailySuggestionType}
              weeklySuggestion={insights?.weeklySuggestion}
              weeklySuggestionType={insights?.weeklySuggestionType}
              monthlyInsights={insights?.monthlyInsights}
              monthlySuggestion={insights?.monthlySuggestion}
              monthlySuggestionType={insights?.monthlySuggestionType}
              timeLeft={UserData?.weeklyInsightsTimeLeft}
              isPermissionGiven={true}
              dispatch={dispatch}
            />
          )}
          {/* <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
          <View
            style={{
              alignItems: 'center',
              width: '100%',
            }}>
            <Text style={[styles.SmallThinText, {paddingVertical: 9}]}>
              LIGHT
            </Text>
            <Text style={styles.swiperText}>
              You seem to be a bit more{' '}
              <Text style={{color: '#5947D0'}}>anxious</Text> when light lux is
              under <Text style={{color: '#5947D0'}}>250</Text> for over{' '}
              <Text style={{color: '#5947D0'}}>4 hours</Text>
            </Text>
            </View>
            {UserData.LightPermission && (
              <View
                style={{
                  position: 'absolute',
                  zIndex: -234234,
                  justifyContent: 'center',
                  top: SIZE / 2.3,
                }}>
                <Text
                  style={{
                    marginTop: -160,
                    fontWeight: '700',
                    fontFamily: RubikExtraBold,
                    fontSize: SIZE / 5.5,
                    color: '#E0DDED',
                    transform: [{ rotate: '-15deg' }],
                  }}>
                  Demo
              </Text>
              </View>
            )}
          </View> */}

          <View
            style={{
              alignItems: 'center',
              // justifyContent: 'center',
              marginVertical: 30,
            }}>
            <BulbIcon
              width={220}
              height={220}
              stroke={getBulbColorFromLux(lux)}
            />
            <View style={styles.bulbImage}>
              <Text style={styles.bulbText}>{lux}</Text>
              <Text style={styles.bulbText}>Lux</Text>
            </View>
          </View>
          <View style={{ marginBottom: 100, alignItems: 'center' }}>
            {/* {swiperIndex == index && ( */}
            {true && (
              <LightGraph data={lightGraphData} graphWidth={SIZE} />
            )}
          </View>

          {/* {!UserData.LightPermission && (
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
                  marginTop: dynamicSize(-320),
                  fontWeight: '700',
                  fontFamily: RubikExtraBold,
                  fontSize: SIZE / 3.5,
                  color: '#E0DDED',
                  transform: [{rotate: '-15deg'}],
                }}>
                Demo
              </Text>
            </View>
          )} */}

          {/* {!UserData.LightPermission  && (
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
          )} */}
        </View>
      </ScrollView>

      <PopUp
        permission
        ComingUp={false}
        image={Constants.Images.Sleepimage}
        dataType={'light'}
        modalVisible={openActionSheet}
        dismissModalHandler={() => setopenActionSheet(false)}
        verifyDone={() => VerifyDone()}
      />

      <AnonymousPopUp
        modalVisible={AnonymousClick}
        dismissModalHandler={() => AnonymousPopUpcancelled()}
        verifyDone={() => AnonymousPopUpcancelled()}
      />

      {/* <WeatherGraphDurationModal
        data={ScreenDurations}
        modalVisible={ScreenDuration}
        onChangeText={setScreenDuration}
        value={ScreenDuration}
        dismissModalHandler={() => setScreenDuration(false)}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Math.ceil(SIZE),
  },
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
    marginLeft:-10,
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
    color: Colors.greyColorCode,
  },
  subViewTwo: {
    marginTop: horizontalScale(20),
  },
  swiperText: {
    fontSize: SIZE / 14,
    fontWeight: '500',
    width: '75%',
    textAlign: 'center',
    fontFamily: RubikMedium,
    color: '#222432',
  },
  indicatorHelper: { height: 18, width: 18, borderRadius: 5 },
  indicatorHelperView: {
    flexDirection: 'row',
    marginHorizontal: 3,
    marginTop: 10,
  },
  indicatorText: {
    marginHorizontal: 10,
    color: Colors.greyTwo,
    fontFamily: RubikRegular,
  },
  bulbImage: {
    position: 'absolute',
    alignItems: 'center',
    top: 70
  },
  bulbText: {
    fontFamily: RubikBold,
    fontSize: 19,
    lineHeight: 23,
    letterSpacing: 1,
    color: '#000000'
  },
});

export default LightData;
