import React, {  useEffect, useState, useReducer } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Constants from '../../../Constants';
import {
  RubikLight,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import ProgressBar from '../../../Components/ProgressBar/ProgressBarCustom';
import axios from 'axios';
import GraphicChart from '../../../Components/GraphicChart/GraphicChart';
import StarProgress from '../../../Components/StarProgress/StarProgress';
import PopUp from '../../../Components/PopUp/PopUp';
import DateExpiredModal from '../../../Components/Modals/DateExpiredModal/DateExpiredModal';
import { useDispatch, useSelector } from 'react-redux';
import {  horizontalScale } from '../../../Constants/sizeChoose';
import {
  getMonthlySleepData,
  getSleepGraphData,
  getWeeklySleepData,
  setSleepDataLastThirtyDays,
  fetchSleepDataForLastThirtyDays,
  getSleepDataForUpdateApi,
} from './sleepDataService';
import { dataTypes, getApiBaseUrl, getMonthlyInsightsAvailable, getWeeklyInsightsAvailable, insightsDurationFlags } from '../../../Constants/constants';
import PostRequestApi, { GetStaffUserData } from '../../../apirequest/PostRequestApi';
import DataInsights from '../../../Components/DataInsights/DataInsights';
import AnonymousPopUp from '../../../Components/Modals/AnonymousPopUp/AnonymousPopUp';
import HomeSyncHeader from '../../../Components/HomeSyncHeader/HomeSyncHeader';
import Skeleton from '../../../Components/Skeleton/Skeleton';
import getStore from '../../../redux';
import { getMyDeviceId } from '../../../services/commonService';
import Colors from '../../../Constants/Colors/Colors';
import { logger } from '../../../..';

const defaultSleepDuration = {
  [insightsDurationFlags.daily]: 0,
  [insightsDurationFlags.weekly]: 0,
  [insightsDurationFlags.monthly]: 0,
};

const sleepInsightsInitialState = {
  dailyInsights: '',
  dailySuggestion: '',
  dailySuggestionType: '',
  weeklyInsights: '',
  weeklySuggestion: '',
  weeklySuggestionType: '',
  monthlyInsights: '',
  monthlySuggestion: '',
  monthlySuggestionType: '',
  duration: {...defaultSleepDuration},
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


const SleepData = ({
  CheckForSleepData,
  MoodCount,
  swiperIndex,
  index,
  isMoodUpdate,
}) => {
  const [openActionSheet, setopenActionSheet] = useState(false);
  const [SleepPopUp, setSleepPopUp] = useState(false);
  const [dataDuration, setDataDuration] = useState(insightsDurationFlags.daily);
  const [lastThirtyDaySleepData, setLastThirtyDaySleepData] = useState(null);
  const [sleepGraphData, setSleepGraphData] = useState(null);
  const [AnonymousClick, setAnonymousClick] = useState(false);
  const [skeleton, setskeleton] = useState(false);
  const [insights, setInsights] = useReducer(
    sleepInsightsReducer,
    sleepInsightsInitialState,
  );

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();

  const VerifyDone = async () => {
    setopenActionSheet(false);
    const timeoutId = setTimeout(() => {
      fetchSleepDataForLastThirtyDays({
        askPermission: true,
        onUpdate: function ({ sleepData, isPermissionAsked }) {
          logger('SleepData ',sleepData)
          setLastThirtyDaySleepData(sleepData);
          if (sleepData) {
            // logger("Test ===>",sleepData)
            callSleepDataUpdateApi("From : VerifyDone",sleepData);
          } else {
            callInsightsApi();
            callGetSleepDataApi();
          }
        },
        dispatch
      });
      clearTimeout(timeoutId);
    }, 500);
  };

  const onSync = () => {
    const sleepPermission = getStore?.()?.getState?.()?.First?.SleepPermission;
    if (sleepPermission) {
      VerifyDone();
    }
  };

  useEffect(() => {
    logger('Sleep Data useEffect called');
    fetchSleepDataForLastThirtyDays({
      askPermission: false,
      onUpdate: function ({ sleepData, isPermissionAsked }) {
        console.log('setLastThirtyDaySleepData: ', sleepData);
        setLastThirtyDaySleepData(sleepData);
        if (sleepData) {
          callSleepDataUpdateApi('From : useEffect',sleepData);
        } else {
          callInsightsApi();
          callGetSleepDataApi();
        }
      },
      dispatch,
    });
  }, [UserData.SleepPermission]);

  useEffect(() => {
    //sleep data for last 7 days
    if (Array.isArray(lastThirtyDaySleepData) && lastThirtyDaySleepData.length > 0) {
      setSleepDataLastThirtyDays(lastThirtyDaySleepData);
      const weeklyData = getWeeklySleepData();
    }
  }, [lastThirtyDaySleepData]);

  useEffect(() => {
    if (Array.isArray(lastThirtyDaySleepData) && lastThirtyDaySleepData.length > 0) {
      setSleepDataLastThirtyDays(lastThirtyDaySleepData);
       getMonthlySleepData();
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
    logger('sleep params', params)
    let _sleepDuration = {...insights.duration};
    PostRequestApi('getSleepInsights', {...params, status: 'daily'})
      .then((res) => {
        console.log('✅ ✅ ✅ ✅ getSleepInsights daily: ✅ ✅ ✅ ✅ ', res?.data);
        logger("getSleepInsights daily", res?.data)
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
        dailyInsightsPayload.duration = _sleepDuration =
          res?.data?.sleepData?.duration && !isNaN(res.data.sleepData.duration)
            ? {
                ..._sleepDuration,
                [insightsDurationFlags.daily]: Number(
                  res.data.sleepData.duration,
                ),
              }
            : {..._sleepDuration};
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
        weeklyInsightsPayload.duration = _sleepDuration =
          res?.data?.sleepData?.duration && !isNaN(res.data.sleepData.duration)
            ? {
                ..._sleepDuration,
                [insightsDurationFlags.weekly]: Number(
                  res.data.sleepData.duration,
                ),
              }
            : {..._sleepDuration};
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
        monthlyInsightsPayload.duration = _sleepDuration =
          res?.data?.sleepData?.duration && !isNaN(res.data.sleepData.duration)
            ? {
                ..._sleepDuration,
                [insightsDurationFlags.monthly]: Number(
                  res.data.sleepData.duration,
                ),
              }
            : {..._sleepDuration};
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

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(params),
    };

    console.log(`Get Sleep Data Params`, params);
    fetch(`${getApiBaseUrl()}getSleepQualityReport`, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log(' ✅ ✅ ✅ ✅ Get Sleep Data Success ✅ ✅ ✅ ✅ ', JSON.stringify(result));
        const inBedArray = result?.sleepData?.INBED ? Object.values(result.sleepData.INBED) : [];
        const asleepArray = result?.sleepData?.ASLEEP ? Object.values(result.sleepData.ASLEEP) : [];
        // if (Array.isArray(inBedArray) && inBedArray.length > 0) {
        //   console.log(' ✅ ✅ ✅ ✅ Get Sleep Data Success ✅ ✅ ✅ ✅  inBed', inBedArray);
        // }
        // if (Array.isArray(asleepArray) && asleepArray.length > 0) {
        //   console.log(' ✅ ✅ ✅ ✅ Get Sleep Data Success ✅ ✅ ✅ ✅  asleep', asleepArray);
        // }
        const graphData = getSleepGraphData({ weeklyData: { ASLEEP: asleepArray, INBED: inBedArray } });
        setSleepGraphData(graphData);
      })
      .catch(function (error) {
        console.log('❌❌❌❌Fail Get Sleep Data❌❌❌❌', error, params);
      });
  };

  const callSleepDataUpdateApi = (msg, sData) => {
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
    logger('sleep req', data)
    var config = {
      method: 'post',
      url: `${getApiBaseUrl()}updateSleepQuality`,
      headers: {
        'Content-Type': 'application/json',
        Cookie: '__cfduid=de42be196e76a7e54fe0b710d009e4dd11615455418',
      },
      data: JSON.stringify(data),
    };

    logger("updateSleepQuality",getApiBaseUrl(),data.sleep_data, JSON.stringify(data), config)
    const message = msg + " SleepData, inside callSleepDataUpdateApi() method ==>" + JSON.stringify(sData);
    GetStaffUserData(message,
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
          // axios(config).then((res)=>{
          //   logger('axios',res)
          // })
        } else {
          data.user_id = '';
          data.email = '';
          config.data = JSON.stringify(data);
          // axios(config).then((res)=>{
          //   logger('axios',res)
          // })
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
    <SafeAreaView style={styles.container}>
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
              setDataDuration={setDataDuration}
              dispatch={dispatch}
              onSync={onSync}
            />
          )}
          <View style={styles.wrapperTwo}>
            <StarProgress
              sleepMinutes={
                UserData.SleepPermission
                  ? (insights?.duration?.[dataDuration] ?? 0)
                  : 0
              }
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Math.ceil(SIZE),
    paddingTop:  20
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
