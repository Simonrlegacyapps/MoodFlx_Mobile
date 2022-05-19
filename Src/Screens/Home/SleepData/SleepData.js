import React, { useCallback, useEffect, useRef, useState, useReducer } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
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
import axios from 'axios';
import GraphicChart from '../../../Components/GraphicChart/GraphicChart';
import StarProgress from '../../../Components/StarProgress/StarProgress';
import PopUp from '../../../Components/PopUp/PopUp';
import DateExpiredModal from '../../../Components/Modals/DateExpiredModal/DateExpiredModal';
import { useDispatch, useSelector } from 'react-redux';
// import AppleHealthKit from 'rn-apple-healthkit';
import moment from 'moment';
import { dynamicSize, horizontalScale } from '../../../Constants/sizeChoose';
import {
  getMonthlySleepData,
  getSleepGraphData,
  getWeeklySleepData,
  setSleepDataLastThirtyDays,
  sleepDataPermissionsIOS,
  fetchSleepDataForLastThirtyDays,
  getSleepDataForUpdateApi,
} from './sleepDataService';
import { dataTypes, getApiBaseUrl, getMonthlyInsightsAvailable, getWeeklyInsightsAvailable } from '../../../Constants/constants';
import PostRequestApi, { GetStaffUserData } from '../../../apirequest/PostRequestApi';
import DataInsights from '../../../Components/DataInsights/DataInsights';
import AnonymousPopUp from '../../../Components/Modals/AnonymousPopUp/AnonymousPopUp';
import HomeSyncHeader from '../../../Components/HomeSyncHeader/HomeSyncHeader';
import Skeleton from '../../../Components/Skeleton/Skeleton';
import getStore from '../../../redux';
import { getMyDeviceId } from '../../../services/commonService';
import Colors from '../../../Constants/Colors/Colors';

const sleepInsightsInitialState = {
  dailyInsights: '',
  weeklyInsights: '',
  dailySuggestion: '',
  dailySuggestionType: '',
  weeklySuggestion: '',
  weeklySuggestionType: '',
  monthlyInsights: '',
  monthlySuggestion: '',
  monthlySuggestionType: '',
};

const sleepInsightsTypes = {
  SET_INSIGHTS: 'SET_INSIGHTS',
};

function sleepInsightsReducer(state, action) {
  switch (action.type) {
    case sleepInsightsTypes.SET_INSIGHTS:
      return action?.payload && typeof action?.payload === 'object'
        ? { ...state, ...action.payload }
        : state;
    default:
      return state;
  }
}


const { width: SIZE, height: HEIGHT } = Dimensions.get('window');

const IndicatorHelper = ({ color, text }) => {
  return (
    <View style={styles.indicatorHelperView}>
      <View style={[styles.indicatorHelper, { backgroundColor: color }]} />
      <Text style={styles.indicatorText}>{text}</Text>
    </View>
  );
};

const SleepData = ({
  CheckForSleepData,
  MoodCount,
  swiperIndex,
  index,
  isMoodUpdate,
}) => {
  const [openActionSheet, setopenActionSheet] = useState(false);
  const [SleepPopUp, setSleepPopUp] = useState(false);
  const [sleepMinutesToday, setSleepMinutesToday] = useState(0);
  const [lastThirtyDaySleepData, setLastThirtyDaySleepData] = useState(null);
  const [weeklySleepData, setWeeklySleepData] = useState(null);
  const [weeklyInBedData, setWeeklyInBedData] = useState(null);
  const [weeklyAsleepData, setWeeklyAsleepData] = useState(null);
  const [monthlySleepData, setMonthlySleepData] = useState(null);
  const [sleepGraphData, setSleepGraphData] = useState(null);
  const [AnonymousClick, setAnonymousClick] = useState(false);
  const [skeleton, setskeleton] = useState(false);
  const [insights, setInsights] = useReducer(
    sleepInsightsReducer,
    sleepInsightsInitialState,
  );

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  // console.log(`UserData.SleepPermission`, UserData.SleepPermission);

  const VerifyDone = async () => {
    // return;
    // await AsyncStorage.setItem('GiveSleepPerm', 'true');

    setopenActionSheet(false);
    const timeoutId = setTimeout(() => {
      // remove commented code after testing for fetchSleepDataFroLastThiryDays
      // onSleepDataPerm();
      fetchSleepDataForLastThirtyDays({
        askPermission: true,
        onUpdate: function ({ sleepData, isPermissionAsked }) {
          setLastThirtyDaySleepData(sleepData);
          if (sleepData) {
            callSleepDataUpdateApi(sleepData);
          } else {
            callInsightsApi();
            callGetSleepDataApi();
          }
        },
        dispatch
      });
      clearTimeout(timeoutId);
    }, 500);
    // let Sp = await AsyncStorage.getItem('GiveSleepPerm');
    // let SleepP = await JSON.parse(Sp);
    // console.log(`SleepPerm`, SleepP);
    // dispatch(SleepPerm(SleepP));
    // if (SleepP == null) {
    //   onSleepDataPerm();
    // }
  };

  const onSync = () => {
    const sleepPermission = getStore?.()?.getState?.()?.First?.SleepPermission;
    if (sleepPermission) {
      VerifyDone();
    }
  };

  useEffect(() => {
    console.log('Sleep Data useEffect called');
    fetchSleepDataForLastThirtyDays({
      askPermission: false,
      onUpdate: function ({ sleepData, isPermissionAsked }) {
        console.log('setLastThirtyDaySleepData: ', sleepData);
        setLastThirtyDaySleepData(sleepData);
        if (sleepData) {
          callSleepDataUpdateApi(sleepData);
        } else {
          callInsightsApi();
          callGetSleepDataApi();
        }
      },
      dispatch,
    });
  }, [UserData.SleepPermission]);

  useEffect(() => {
    //sleep data for current day
    if (
      Array.isArray(lastThirtyDaySleepData) &&
      lastThirtyDaySleepData.length > 0
    ) {
      let totalMinutes = 0;
      lastThirtyDaySleepData.forEach((e, idx) => {
        const startDate = e?.start_date ? moment(new Date(e.start_date).getTime()) : null;
        const endDate = e?.end_date ? moment(new Date(e.end_date).getTime()) : null;
        let diff = 0;
        if (e.type === 'ASLEEP' && startDate && endDate && (startDate.clone().format('DD MMM YYYY') === moment().format('DD MMM YYYY') || endDate.clone().format('DD MMM YYYY') === moment().format('DD MMM YYYY'))) {
          diff = endDate.diff(startDate, 'minutes');
          totalMinutes += diff;
          console.log('======sleep today diff=======', diff, 'total min===', totalMinutes, '---e---', e);
        }
      });
      totalMinutes === 0 &&
        lastThirtyDaySleepData.forEach((e, idx) => {
          const startDate = e?.start_date
            ? moment(new Date(e.start_date).getTime())
            : null;
          const endDate = e?.end_date
            ? moment(new Date(e.end_date).getTime())
            : null;
          let diff = 0;
          if (
            e.type === 'INBED' &&
            startDate &&
            endDate && (
              startDate.clone().format('DD MMM YYYY') === moment().format('DD MMM YYYY') ||
              endDate.clone().format('DD MMM YYYY') === moment().format('DD MMM YYYY')
            )
          ) {
          diff = endDate.diff(startDate, 'minutes');
          totalMinutes += diff;
          console.log('======sleep today diff=======', diff, 'total min===', totalMinutes, '---e---', e);
        }
      });
      setSleepMinutesToday(totalMinutes);
    }
  }, [lastThirtyDaySleepData]);

  useEffect(() => {
    //sleep data for last 7 days
    if (Array.isArray(lastThirtyDaySleepData) && lastThirtyDaySleepData.length > 0) {
      setSleepDataLastThirtyDays(lastThirtyDaySleepData);
      const weeklyData = getWeeklySleepData();
      // console.log('weeklyData: ', JSON.stringify(weeklyData));
      // console.log('weeklyData: ', weeklyData);
      setWeeklySleepData(weeklyData);
    }
  }, [lastThirtyDaySleepData]);

  useEffect(() => {
    //sleep data for this month
    if (Array.isArray(lastThirtyDaySleepData) && lastThirtyDaySleepData.length > 0) {
      setSleepDataLastThirtyDays(lastThirtyDaySleepData);
      const montlhlySleep = getMonthlySleepData();
      // console.log('monthlySleep: ', JSON.stringify(montlhlySleep));
      // console.log('monthlySleep: ', montlhlySleep);
      setMonthlySleepData(montlhlySleep);
    }
  }, [lastThirtyDaySleepData]);

  const callInsightsApi = () => {
    setskeleton(true);
    const deviceId = getMyDeviceId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var params = {
      device_id: deviceId,
      email: UserData?.UserEmail ?? '',
      user_id: UserData?.UserId ?? '',
    };

    console.log(`Sleep Insights Api Params`, params);
    PostRequestApi('getSleepInsights', {...params, status: 'daily'})
      .then((res) => {
        console.log('✅ ✅ ✅ ✅ getSleepInsights daily: ✅ ✅ ✅ ✅ ', res?.data);
        // console.log('getSleepInsights daily res: ', res);
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
          type: sleepInsightsTypes.SET_INSIGHTS,
          payload: dailyInsightsPayload,
        });
        /*
        Weekly api should be called between
        Friday @ 12pm until Saturday 6pm
        */
        if (getWeeklyInsightsAvailable() === true) {
          return PostRequestApi('getSleepInsights', {
            ...params,
            status: 'weekly',
            flag: 'current',
          });
        } else {
          return new Promise((resolve, reject) => resolve(null));
        }
      })
      .then((res) => {
        // console.log('getSleepInsights weekly res: ', res);
        let weeklyInsightsPayload = {};
        console.log('✅ ✅ ✅ ✅ getSleepInsights weekly: ✅ ✅ ✅ ✅ ', res?.data);
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
          type: sleepInsightsTypes.SET_INSIGHTS,
          payload: weeklyInsightsPayload,
        });
        if (getMonthlyInsightsAvailable() === true) {
          return PostRequestApi('getSleepInsights', {
            ...params,
            status: 'monthly',
          });
        } else {
          return new Promise((resolve, reject) => resolve(null));
        }
      })
      .then((res) => {
        setskeleton(false);
        // console.log('getSleepInsights weekly res: ', res);
        let monthlyInsightsPayload = {};
        console.log('✅ ✅ ✅ ✅  getSleepInsights monthly: ✅ ✅ ✅ ✅ ', res?.data);
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
          type: sleepInsightsTypes.SET_INSIGHTS,
          payload: monthlyInsightsPayload,
        });
      })
      .catch(function (error) {
        setskeleton(false);
        console.log('❌❌❌❌Fail Get Sleep Data❌❌❌❌', error, params);
      });
  };

  const callGetSleepDataApi = () => {
    const deviceId = getMyDeviceId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var params = {
      device_id: deviceId,
      email: UserData?.UserEmail ?? '',
      user_id: UserData?.UserId ?? '',
    };
    // var raw = JSON.stringify({
    //   device_id: deviceId,
    //   email: UserData?.UserEmail ?? '',
    //   user_id: UserData?.UserId ?? '',
    // });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(params),
      // redirect: 'follow',
    };

    console.log(`Get Sleep Data Params`, params);
    fetch(`${getApiBaseUrl()}getSleepQualityReport`, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log(' ✅ ✅ ✅ ✅ Get Sleep Data Success ✅ ✅ ✅ ✅ ', JSON.stringify(result));
        const inBedArray = result?.sleepData?.INBED ? Object.values(result.sleepData.INBED) : [];
        const asleepArray = result?.sleepData?.ASLEEP ? Object.values(result.sleepData.ASLEEP) : [];
        if (Array.isArray(inBedArray) && inBedArray.length > 0) {
          console.log(' ✅ ✅ ✅ ✅ Get Sleep Data Success ✅ ✅ ✅ ✅  inBed', inBedArray);
          setWeeklyInBedData(inBedArray);
        }
        if (Array.isArray(asleepArray) && asleepArray.length > 0) {
          console.log(' ✅ ✅ ✅ ✅ Get Sleep Data Success ✅ ✅ ✅ ✅  asleep', asleepArray);
          setWeeklyAsleepData(asleepArray);
        }
        const graphData = getSleepGraphData({ weeklyData: { ASLEEP: asleepArray, INBED: inBedArray } });
        console.log('graphData: ', graphData);
        setSleepGraphData(graphData);
      })
      .catch(function (error) {
        console.log('❌❌❌❌Fail Get Sleep Data❌❌❌❌', error, params);
      });
  };

  const callSleepDataUpdateApi = (sData) => {
    if (!(Array.isArray(sData) && sData.length > 0)) {
      return;
    }
    setSleepDataLastThirtyDays(sData);
    const sleepData = getSleepDataForUpdateApi();

    if (!(Array.isArray(sleepData) && sleepData.length > 0)) {
      callInsightsApi();
      callGetSleepDataApi();
      return;
    }
    console.log('api sleep data: ', sleepData);
    // return;
    const userData = getStore?.()?.getState?.()?.First;
    const deviceId = getMyDeviceId();
    let data = {
      device_id: deviceId,
      email: userData.UserEmail ?? '',
      user_id: userData.UserId ?? '',
      sleep_data: sleepData,
    };
    var config = {
      method: 'post',
      url: `${getApiBaseUrl()}updateSleepQuality`,
      headers: {
        'Content-Type': 'application/json',
        Cookie: '__cfduid=de42be196e76a7e54fe0b710d009e4dd11615455418',
      },
      data: JSON.stringify(data),
    };

    GetStaffUserData(
      {
        device_id: deviceId,
        email: userData.UserEmail ?? '',
        user_id: userData.UserId ?? '',
      },
      dispatch,
    )
      .then(async (result) => {
        // console.log(
        //   '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
        //   result?.userData
        // );
        if (result?.userData?.status !== 2) {
          return axios(config);
        } else {
          data.user_id = '';
          data.email = '';
          config.data = JSON.stringify(data);
          return axios(config);
        }
      })
      .then(async (result) => {
        if (result) {
          console.log(
            ' ✅ ✅ ✅ ✅ Success Update Sleep Data✅ ✅ ✅ ✅ ',
            data,
          );
          const timeoutId = setTimeout(() => {
            callInsightsApi();
            callGetSleepDataApi();
            clearTimeout(timeoutId);
          }, 500);
        }
      })
      .catch(function (error) {
        console.log('❌❌❌❌Fail Update Sleep Data❌❌❌❌', error, data);
      });
  };

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
        <HomeSyncHeader
          label={'Sleep'}
          isPermissionGiven={
            UserData.SleepPermission && UserData.sleepDataSyncStatus
          }
          setOpenActionSheet={setopenActionSheet}
          setAnonymousClick={setAnonymousClick}
        />
        <View style={styles.ProgressBarView}>
          <ProgressBar
            progress={
              // swiperIndex == 1
              ((JSON.parse(MoodCount) < 3 ? JSON.parse(MoodCount) : 3) / 3) *
              100
              // : 0
            }
            MoodCount={JSON.parse(MoodCount)}
            height={10}
            // backgroundColor="#CB9866"
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
        {skeleton && <Skeleton/>}
        <View style={styles.subViewTwo}>
          {skeleton === false && (
            <DataInsights
              dailyInsights={!UserData.SleepPermission ? "Today you were more likely to be excited and happy when you got more than 7hrs sleep" : insights?.dailyInsights}
              weeklyInsights={!UserData.SleepPermission ? "This week your Saddest mood input was when you got less than 6 hrs of sleep" : insights?.weeklyInsights}
              dailySuggestion={!UserData.SleepPermission ? "Nice! Just the right amount of sleep" : insights?.dailySuggestion}
              dailySuggestionType={!UserData.SleepPermission ? "" : insights?.dailySuggestionType}
              weeklySuggestion={!UserData.SleepPermission ? "7-9 hrs of sleep per night is best for your mood. Try a warm bath or reading a book before bed" : insights?.weeklySuggestion}
              weeklySuggestionType={!UserData.SleepPermission ? "warning" : insights?.weeklySuggestionType}
              monthlyInsights={!UserData.SleepPermission ? "This month your Saddest mood input was when you got less than 6 hrs of sleep" : insights?.monthlyInsights}
              monthlySuggestion={!UserData.SleepPermission ? "7-9 hrs of sleep per night is best for your mood. Try a warm bath or reading a book before bed" : insights?.monthlySuggestion}
              monthlySuggestionType={!UserData.SleepPermission ? "warning" : insights?.monthlySuggestionType}
              timeLeft={UserData?.weeklyInsightsTimeLeft}
              isPermissionGiven={UserData.SleepPermission}
              dispatch={dispatch}
              onSync={onSync}
            />
          )}
          <View style={styles.wrapperTwo}>
            <StarProgress
              sleepMinutes={UserData.SleepPermission ? sleepMinutesToday : 0}
            />
            <View style={styles.viewOne} />
          </View>
          <GraphicChart
            isDailyDisabled={true}
            sleepGraphData={sleepGraphData}
            graphType={dataTypes.sleep}
          />
          {!UserData.SleepPermission && (
            <TouchableOpacity
              activeOpacity={0}
              onPress={() => {
                setopenActionSheet(true);
              }}
              style={styles.buttonOne}
            />
          )}
        </View>
      </ScrollView>

      <PopUp
        ComingUp={false}
        permission={UserData.SleepPermission}
        image={Constants.Images.Sleepimage}
        dataType={'sleep'}
        modalVisible={openActionSheet}
        dismissModalHandler={() => setopenActionSheet(false)}
        verifyDone={VerifyDone}
      />

      <DateExpiredModal
        SleepPopUp
        modalVisible={SleepPopUp}
        dismissModalHandler={() => setSleepPopUp(false)}
        verifyDone={() => setSleepPopUp(false)}
      />

      <AnonymousPopUp
        modalVisible={AnonymousClick}
        dismissModalHandler={AnonymousPopUpcancelled}
        verifyDone={AnonymousPopUpcancelled}
      />
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
  indicatorHelper: {
    height: 18,
    width: 18,
    borderRadius: 5,
  },
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
  wrapperTwo: {
    marginBottom: 50,
  },
  viewOne: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 30,
  },
  buttonOne: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0,
  },
});

export default SleepData;
