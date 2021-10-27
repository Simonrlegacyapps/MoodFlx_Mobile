import React, { useEffect, useState, useRef, useReducer } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
// import ProgressBar from 'react-native-animated-progress';
import ProgressBar from '../../Components/ProgressBar/ProgressBarCustom';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Constants from '../../Constants';
import {
  RubikExtraBold,
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import GraphicChart from '../../Components/GraphicChart/GraphicChart';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import PopUp from '../../Components/PopUp/PopUp';
import AddNameModal from '../../Components/Modals/AddNameModal/AddNameModal';
import { IsAnonymous, UserDetail } from '../../redux/actions/actions';
import DateExpiredModal from '../../Components/Modals/DateExpiredModal/DateExpiredModal';
import { dynamicSize, horizontalScale } from '../../Constants/sizeChoose';
import AnonymousPopUp from '../../Components/Modals/AnonymousPopUp/AnonymousPopUp';
import PostRequestApi, {
  GetStaffUserData,
} from '../../apirequest/PostRequestApi';
import DataInsights from '../../Components/DataInsights/DataInsights';
import moment from 'moment';
import { dataTypes, getApiBaseUrl, getIsWeeklyPrevious, getWeeklyInsightsAvailable } from '../../Constants/constants';
import LinearGradient from 'react-native-linear-gradient';
import Crown from '../../../assets/svg/Crown';
import { getFloCoins, getMyDeviceId, openHealthApp } from '../../services/commonService';
import CrownBox from '../../Components/crownBox/crownBox';
import HomeSyncHeader from '../../Components/HomeSyncHeader/HomeSyncHeader';
import { activityHealthKitOptions } from '../../services/appPermissions';
import getStore from '../../redux';
import Skeleton from '../../Components/Skeleton/Skeleton';

const fitnessInsightsInitialState = {
  dailyInsights: '',
  weeklyInsights: '',
  dailySuggestion: '',
  dailySuggestionType: '',
  weeklySuggestion: '',
  weeklySuggestionType: '',
};

const fitnessInsightsTypes = {
  SET_DALIY_INSIGHTS: 'SET_DALIY_INSIGHTS',
  SET_WEEKLY_INSIGHTS: 'SET_WEEKLY_INSIGHTS',
  SET_DAILY_SUGGESTION: 'SET_DAILY_SUGGESTION',
  SET__DAILY_SUGGESTION_TYPE: 'SET__DAILY_SUGGESTION_TYPE',
  SET_WEEKLY_SUGGESTION: 'SET_WEEKLY_SUGGESTION',
  SET__WEEKLY_SUGGESTION_TYPE: 'SET__WEEKLY_SUGGESTION_TYPE',
  SET_INSIGHTS: 'SET_INSIGHTS',
};

function fitnessInsightsReducer(state, action) {
  switch (action.type) {
    case fitnessInsightsTypes.SET_DALIY_INSIGHTS:
      return { ...state, dailyInsights: action.payload };
    case fitnessInsightsTypes.SET_WEEKLY_INSIGHTS:
      return { ...state, weeklyInsights: action.payload };
    case fitnessInsightsTypes.SET_DAILY_SUGGESTION:
      return { ...state, dailySuggestion: action.payload };
    case fitnessInsightsTypes.SET__DAILY_SUGGESTION_TYPE:
      return { ...state, dailySuggestionType: action.payload };
    case fitnessInsightsTypes.SET_WEEKLY_SUGGESTION:
      return { ...state, weeklySuggestion: action.payload };
    case fitnessInsightsTypes.SET__WEEKLY_SUGGESTION_TYPE:
      return { ...state, weeklySuggestionType: action.payload };
    case fitnessInsightsTypes.SET_INSIGHTS:
      return action?.payload && typeof action?.payload === 'object'
        ? { ...state, ...action.payload }
        : state;
    default:
      return state;
  }
}

function getWeeklyHealthGraphData(dataArray) {
  let weekDates = [];
  let dates = [6, 5, 4, 3, 2, 1, 0];
  let todaySteps = getStore?.().getState?.()?.First?.UserSteps ?? '0';
  let apiDataArray = [];
  dates.forEach((e, idx) => {
    const d = moment().startOf('day').subtract(e, 'days');
    weekDates.push({ date: d.format('YYYY-MM-DD'), day: d.format('dd'), y: e === 0 ? todaySteps : "0" });
  });
  console.log('dates ->', weekDates);
  if (!(Array.isArray(dataArray) && dataArray.length > 0)) {
    return weekDates;
  }
  let flag = false;
  weekDates.forEach((e, idx) => {
    dataArray.forEach((x) => {
      if (!flag && x?.date === (e?.date ?? '-1')) {
        apiDataArray.push({ ...e, y: x?.steps ?? "0" });
        flag = true;
      }
    });
    if (!flag) {
      apiDataArray.push({...e});
    }
    flag = false;
  });
  apiDataArray = apiDataArray.map((e) => {
    return { ...e, y: typeof e?.y === 'number' ? String(e.y) : (e?.y ?? '0') };
  })
  return apiDataArray;
}

const { width: SIZE, height: HEIGHT } = Dimensions.get('window');

const FitnessData = ({
  Perm,
  checkStorage,
  TodayStep,
  TodayCalories,
  TodayDistance,
  MoveTime,
  zero,
  ones,
  twos,
  threes,
  fours,
  fives,
  MoodCount,
  Loading,
  swiperIndex,
  index,
  healthUpdateApiCount,
  navigation
}) => {
  // useEffect(() => {
  //   checkThis();
  // }, [TodayStep]);
  // const [anime, setanime] = useState(false)

  const UserData = useSelector((state) => state.First);
  const [openActionSheet, setOpenActionSheet] = useState(false);
  const [name, setname] = useState('');
  const [ShowAddName, setShowAddName] = useState(false);
  const [FitnessPopUp, setFitnessPopUp] = useState(false);
  const [AnonymousClick, setAnonymousClick] = useState(false);
  const [weeklyHealthGraphData, setWeeklyHealthGraphData] = useState(null);
  const [insights, setInsights] = useReducer(
    fitnessInsightsReducer,
    fitnessInsightsInitialState,
  );
  const [isCallSync, setIsCallSync] = useState(false);
  const prevHealthUpdateApiCount = useRef(healthUpdateApiCount);
  const [skeleton, setskeleton] = useState(false);

  // console.log(`UserData`, UserData);

  const {
    UserMoodCount,
    UserSteps,
    UserCalories,
    UserDistance,
    UserMoveTime,
  } = UserData;
  // const checkThis = () => {
  //   return (
  //     // </AnimatedCircularProgress>
  //   );
  // };

  // console.log(`UserSteps`, UserSteps);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      UserData?.fitnessSyncText &&
      typeof UserData.fitnessSyncText === 'string'
    ) {
      let count = UserData.fitnessSyncText
        ?.split?.('Syncing ')
        ?.pop?.()
        ?.split?.('/')?.[0];
      if (!isNaN(count)) {
        count = Number(count);
        if (count > 5) {
          setIsCallSync(true);
        }
      }
    }
  }, [UserData.fitnessSyncText]);

  const VerifyDone = () => {
    setOpenActionSheet(false);
    checkStorage();
  };
  const VerifyAddName = () => {
    ProfileApiCallHere();
  };

  const onSync = () => {
    const healthPermission = getStore?.()?.getState?.()?.First?.HealthPermission;
    if (healthPermission) {
      checkStorage();
    }
  };

  const callGetHealthDataApi = () => {
    const deviceId = getMyDeviceId();
    const store = getStore?.()?.getState?.();
    const params = {
      device_id: deviceId,
      email: store?.First?.UserEmail ?? '',
      user_id: store?.First?.UserId ?? '',
    };
    console.log('getHealthData params --->', params);
    PostRequestApi('getHealthData', params)
      .then((res) => {
        console.log('✅ ✅ ✅ ✅ Success getHealthData ✅ ✅ ✅ ✅', res?.data);
        setWeeklyHealthGraphData(getWeeklyHealthGraphData(res?.data?.healthData));
      })
      .catch(function (error) {
        setskeleton(false)
        console.log('❌ ❌ ❌ ❌ Error getHealthData ❌ ❌ ❌ ❌', error);
      });
  };

  const getInsights = () => {
    setskeleton(true)
    const deviceId = getMyDeviceId();
    const store = getStore?.()?.getState?.();
    const params = {
      device_id: deviceId,
      email: store?.First?.UserEmail ?? '',
      user_id: store?.First?.UserId ?? '',
    };
    // const params = {
    //   device_id: deviceId,
    //   email: UserData.UserEmail ?? '',
    //   user_id: UserData.UserId ?? '',
    // };
    PostRequestApi('getActivityInsights', { ...params, status: 'daily' })
      .then((res) => {
        console.log('getActivityInsights daily res: ', res?.data);
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
          type: fitnessInsightsTypes.SET_INSIGHTS,
          payload: dailyInsightsPayload,
        });
        /*
        Weekly api should be called between
        Friday @ 12pm until Saturday 6pm
        */
        if (getWeeklyInsightsAvailable() === true) {
          return PostRequestApi('getActivityInsights', {
            ...params,
            status: 'weekly',
            flag: getIsWeeklyPrevious() === true ? 'previous' : 'current',
          });
        } else {
          return new Promise((resolve, reject) => resolve(null));
        }
      })
      .then((res) => {
        setskeleton(false)
        console.log('getActivityInsights weekly res: ', res?.data);
        let weeklyInsightsPayload = {};
        // console.log('getActivityInsights weeklyInsights: ', res?.data?.insights);
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
          type: fitnessInsightsTypes.SET_INSIGHTS,
          payload: weeklyInsightsPayload,
        });
      })
      .catch(function (error) {
        setskeleton(false)
        console.log('❌ ❌ ❌ ❌ Error Get Activity Insights ❌ ❌ ❌ ❌', error);
      });
  };

  useEffect(() => {
    // console.log('FitnessData healthUpdateApiCount=======', healthUpdateApiCount);
    if (
      prevHealthUpdateApiCount.current !== healthUpdateApiCount &&
      healthUpdateApiCount > 0
    ) {
      getInsights();
      callGetHealthDataApi();
      prevHealthUpdateApiCount.current = healthUpdateApiCount;
    }
  }, [healthUpdateApiCount, UserData.UserEmail, UserData.UserId]);

  const ProfileApiCallHere = () => {
    const deviceId = getMyDeviceId();
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    var raw = {
      device_id: deviceId,
      email: UserData.UserEmail,
      user_id: UserData.UserId,
      full_name: UserData?.UserDetails?.full_name
        ? UserData?.UserDetails?.full_name
        : name,
      pronouns: null,
      date_of_birth: null,
      gender: null,
    };

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: 'follow',
    };

    console.log(`raw`, raw);

    GetStaffUserData(
      {
        device_id: deviceId,
        email: UserData.UserEmail,
        user_id: UserData.UserId,
      }, dispatch)
      .then(async (result) => {
        // console.log(
        //   '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
        //   result?.userData
        // );
        if (result?.userData?.status !== 2) {
          return fetch(`${getApiBaseUrl()}updateStaffProfile`, requestOptions);
        } else {
          raw.user_id = '';
          raw.email = ''
          requestOptions.body = JSON.stringify(raw)
          return fetch(`${getApiBaseUrl()}updateStaffProfile`, requestOptions);
        }
      })
      .then(async (result) => result.json())
      .then(async (result) => {
        setShowAddName(false);
        if (result) {
          console.log(
            '✅ ✅ ✅ ✅ Success Update Staff Profile ✅ ✅ ✅ ✅',
            result
          );
          getProfileUserData();
        }
      })
      .catch((error) => console.log('❌ ❌ ❌ ❌ Error Update Staff Profile ❌ ❌ ❌ ❌', error));

  };

  const getProfileUserData = () => {
    console.log(`called called called called called called getProfileUserData`);
    const deviceId = getMyDeviceId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      device_id: deviceId,
      email: UserData.UserEmail,
      user_id: UserData.UserId,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${getApiBaseUrl()}getStaffUserData`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('UserDetail', result.userData);
        dispatch(UserDetail(result.userData));
      })
      .catch((error) => console.log('error', error));
  };

  const cancelled = async () => {
    setShowAddName(false);
  };

  const FitnessPopUpcancelled = () => {
    setFitnessPopUp(false);
  };

  const AnonymousPopUpcancelled = () => {
    setAnonymousClick(false);
  };

  // console.log(`UserDistance`, UserDistance);

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        {/* <View style={styles.HeaderView}>
          <TouchableOpacity
            onPress={async () => {
              // await AsyncStorage.setItem('GiveHealthPerm', 'true');
              // UserData.HealthPermission
              //   ? checkStorage()
              //   :
              setOpenActionSheet(true);

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
                style={{ height: 20, width: 20 }}
                source={Constants.Images.Sync}
              />
            </View>
            <View style={{ alignContent: 'center', paddingHorizontal: 15 }}>
              <Text style={styles.lightText}>
                {UserData.HealthPermission ? 'Syncing your' : 'Sync your'}
              </Text>
              <Text style={styles.normalText}>Fitness data</Text>
            </View>
          </TouchableOpacity>
          <CrownBox floCoins={UserData.floCoins}/>
          <TouchableOpacity
            onPress={() => setAnonymousClick(true)}
            style={styles.ColoredView}>
            <Text style={styles.ColoredText}>Anon</Text>
          </TouchableOpacity>
        </View> */}
        <HomeSyncHeader
          navigation={navigation}
          label={"Activity"}
          isPermissionGiven={UserData.HealthPermission}
          syncText={UserData.fitnessSyncText}
          setOpenActionSheet={
            isCallSync || Platform.OS === 'android'
              ? setOpenActionSheet
              : openHealthApp
          }
          setAnonymousClick={setAnonymousClick}/>
        <View style={styles.ProgressBarView}>
          <ProgressBar
            progress={
              swiperIndex == index
                ? ((JSON.parse(MoodCount) < 3 ? JSON.parse(MoodCount) : 3) /
                  3) *
                100
                : 0
            }
            MoodCount={UserMoodCount}
            height={10}
            // backgroundColor="#CB9866"
          />
          <View style={{ flexDirection: 'row' }}>
            <Text numberOfLines={1} style={[styles.SmallThinText, { flex: 1 }]}>
              {UserMoodCount < 3
                ? 'Try add 3 moods per day'
                : `Boom! You've added ${UserMoodCount} moods today`}
            </Text>
            <Text
              style={
                (styles.SmallThinText, { paddingTop: 10, paddingVertical: 0 })
              }>
              {UserMoodCount === null ? 0 : UserMoodCount}/3
            </Text>
          </View>
        </View>

        <View style={styles.subViewTwo}>
          {(Loading || skeleton) && <View style={styles.activityIndicator}><ActivityIndicator color='#9889F9' size='large' /></View>}
          {(Loading || skeleton) && <Skeleton/>}
          <DataInsights
            dailyInsights={!UserData.HealthPermission ? "Today your happiest mood input was when you walked over 5,000 steps before 2pm" : insights?.dailyInsights}
            onPressInsights={insights?.dailyInsights.includes('permissions') ? openHealthApp : undefined}
            weeklyInsights={!UserData.HealthPermission ? "Your weekly Excited mood input was more frequent when you took over 8,000 steps / day" : insights?.weeklyInsights}
            dailySuggestion={!UserData.HealthPermission ? "Try take a 20 min walk during lunch - 1,800 steps" : insights?.dailySuggestion}
            dailySuggestionType={!UserData.HealthPermission ? "warning" : insights?.dailySuggestionType}
            weeklySuggestion={!UserData.HealthPermission ? "The more steps you take the more energy you have" : insights?.weeklySuggestion}
            weeklySuggestionType={!UserData.HealthPermission ? "warning" : insights?.weeklySuggestionType}
            timeLeft={UserData?.weeklyInsightsTimeLeft}
            isPermissionGiven={UserData.HealthPermission}
            dispatch={dispatch}
            onSync={onSync}
          />
          {/* {!UserData.HealthPermission ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[styles.SmallThinText, { paddingVertical: 9 }]}>
                ACTIVITY
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  alignItems: 'center',
                  width: '100%',
                }}
                onPress={() => setFitnessPopUp(true)}>
                <Text style={styles.swiperText}>
                  You are the <Text style={{ color: '#5947D0' }}>happiest</Text>{' '}
                  when you walk over <Text style={{ color: '#5947D0' }}>5000</Text>{' '}
                  steps before <Text style={{ color: '#5947D0' }}>2PM</Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <DataInsights
              dailyInsights={insights?.dailyInsights}
              weeklyInsights={insights?.weeklyInsights}
              dailySuggestion={insights?.dailySuggestion}
              dailySuggestionType={insights?.dailySuggestionType}
              weeklySuggestion={insights?.weeklySuggestion}
              weeklySuggestionType={insights?.weeklySuggestionType}
              timeLeft={UserData?.weeklyInsightsTimeLeft}
              dispatch={dispatch}
            />
          )} */}
          {/* {UserData.HealthPermission && (
              <View
                style={{
                  position: 'absolute',
                  zIndex: -234234,
                  justifyContent: 'center',
                  top: SIZE / 2.6,
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
            )} */}
          {/* {UserData.TodayAllSteps !== null &&
          !Loading &&
          UserData.UserMoodCount !== null &&
          UserData.UserSteps !== null &&
          UserData.UserCalories !== null &&
          UserData.UserDistance !== null &&
          UserData.UserMoveTime !== null && ( */}
          <View style={[styles.forCircle, { marginTop: 30 }]}>
            {/* {setTimeout(() => {
                
              }, timeout)} */}
            {/* {checkThis()} */}
            <AnimatedCircularProgress
              duration={1500}
              style={styles.CircularProgressStyle}
              arcSweepAngle={270}
              size={180}
              width={13}
              fill={!Loading ? (UserSteps / 10000) * 100 : 0}
              // fill={!Loading ? 50 : 0}
              prefill={1}
              rotation={-135}
              tintColor="#9889F9"
              lineCap={'round'}
              // onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="#E2E4EA"
            />

            <View style={styles.absolute}>
              <ImageBackground
                resizeMode={'contain'}
                style={styles.BigCircleBackgroundImage}
                source={Constants.Images.RunningBackground}>
                <Image
                  source={Constants.Images.RunningMan}
                  style={{ height: 30, width: 30, marginTop: 25 }}
                />
                <Text
                  style={[styles.swiperText, { fontSize: 24, marginTop: 10 }]}>
                  {/* {(TodayStep * 100).toFixed(0)} */}
                  {UserSteps.toFixed(0)}
                </Text>
                <Text
                  style={[
                    styles.SmallThinText,
                    { paddingVertical: 0, color: '#3B456D' },
                  ]}>
                  steps
                </Text>
              </ImageBackground>
            </View>
          </View>
          {/* )} */}
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
                duration={1500}
                style={styles.CircularProgressStyle}
                arcSweepAngle={360}
                size={70}
                width={10}
                fill={!Loading ? (UserCalories / 1000) * 100 : 0}
                // fill={0}
                rotation={0}
                tintColor="#30C3D6"
                lineCap={'round'}
                // // onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#E0F8FB"
              />
              <View style={styles.absolute}>
                <Image
                  source={Constants.Images.Calories}
                  style={{ height: 25, width: 25, marginTop: -25 }}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.SmallThinBlackText]}>
                  {UserCalories.toFixed(0)} kcal
                </Text>
              </View>
            </View>
            <View style={styles.forCircle}>
              <AnimatedCircularProgress
                duration={1500}
                style={styles.CircularProgressStyle}
                arcSweepAngle={360}
                size={70}
                width={10}
                fill={!Loading ? (UserDistance / 5000) * 100 : 0}
                // fill={50}
                rotation={0}
                tintColor="#F43085"
                lineCap={'round'}
                // // onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#FDE2EF"
              />
              <View style={styles.absolute}>
                <Image
                  source={Constants.Images.Distance}
                  style={{ height: 25, width: 25, marginTop: -25 }}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.SmallThinBlackText]}>
                  {((UserDistance / 5000) * 5).toFixed(1)} km
                </Text>
              </View>
            </View>
            <View style={styles.forCircle}>
              <AnimatedCircularProgress
                duration={900}
                style={styles.CircularProgressStyle}
                arcSweepAngle={360}
                size={70}
                width={10}
                fill={!Loading ? (UserMoveTime / 120) * 100 : 0}
                // fill={25}
                rotation={0}
                tintColor="#37DD67"
                lineCap={'round'}
                // // onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#C6F9E8"
              />
              <View style={styles.absolute}>
                <Image
                  source={Constants.Images.Time}
                  style={{ height: 25, width: 25, marginTop: -25 }}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.SmallThinBlackText]}>
                  {UserMoveTime.toFixed(0)} min
                </Text>
              </View>
            </View>
          </View>
          {/* <GraphBezierCustom /> */}
          <GraphicChart
            fitness={true}
            graphType={dataTypes.activity}
            day
            zero={zero}
            ones={ones}
            twos={twos}
            threes={threes}
            fours={fours}
            fives={fives}
            weeklyHealthGraphData={weeklyHealthGraphData}
          />
          {/* {!UserData.HealthPermission && (
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
                allowFontScaling={false}
                style={{
                  marginTop: dynamicSize(-320),
                  fontWeight: '700',
                  fontFamily: RubikExtraBold,
                  fontSize: SIZE / 3.5,
                  color: '#E0DDED',
                  transform: [{ rotate: '-15deg' }],
                }}>
                Demo
              </Text>
            </View>
          )} */}
          {!UserData.HealthPermission && (
            <TouchableOpacity
              activeOpacity={0}
              onPress={async () => {
                // await AsyncStorage.setItem('GiveHealthPerm', 'true');
                setOpenActionSheet(true);
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
      </ScrollView>

      <PopUp
        permission={UserData.HealthPermission}
        image={Constants.Images.FitnessPopUp}
        dataType={'fitness'}
        modalVisible={openActionSheet}
        dismissModalHandler={() => setOpenActionSheet(false)}
        verifyDone={() => VerifyDone()}
      />
      <AddNameModal
        dataType={'Fitness'}
        modalVisible={ShowAddName}
        dismissModalHandler={() => cancelled()}
        verifyDone={() => VerifyAddName()}
        value={name}
        onChangeText={setname}
      />
      <DateExpiredModal
        FitnessPopUp
        modalVisible={FitnessPopUp}
        dismissModalHandler={() => FitnessPopUpcancelled()}
        verifyDone={() => FitnessPopUpcancelled()}
      />
      {Loading && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            backgroundColor: 'rgba(0,0,0,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}/>
      )}
      <AnonymousPopUp
        modalVisible={AnonymousClick}
        dismissModalHandler={() => AnonymousPopUpcancelled()}
        verifyDone={() => AnonymousPopUpcancelled()}
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
  subViewTwo: {
    marginTop: horizontalScale(20),
  },
  activityIndicator: {
    position: 'absolute',
    top: horizontalScale(20),
    alignSelf: 'center',
    zIndex: 5,
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
  forCircle: { alignItems: 'center', justifyContent: 'center', flex: 1 },
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
  indicatorHelper: { height: 18, width: 18, borderRadius: 5 },
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

export default FitnessData;
