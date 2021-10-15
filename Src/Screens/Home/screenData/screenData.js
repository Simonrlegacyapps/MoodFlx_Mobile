import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  AppState,
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
import WeatherGraphDurationModal from '../../../Components/Modals/WeatherGraphDurationModal/WeatherGraphDurationModal';
import GraphBezierCustom from '../../../Components/GraphBezierCustom/GraphBezierCustom';
import ScreenCircleBar from '../../../Components/ScreenCircleBar/ScreenCircleBar';
import PopUp from '../../../Components/PopUp/PopUp';
import Toast from 'react-native-toast-message';
import UsageStats from 'react-native-usage-stats';
import moment from 'moment';
import CrownBox from '../../../Components/crownBox/crownBox';
import {useSelector, useDispatch} from 'react-redux';
import AnonymousPopUp from '../../../Components/Modals/AnonymousPopUp/AnonymousPopUp';
import HomeSyncHeader from '../../../Components/HomeSyncHeader/HomeSyncHeader';
import DataInsights from '../../../Components/DataInsights/DataInsights';
import ScreenTimeBarGraph from '../../../Components/ScreenTimeGraph/ScreenTimeBarGraph';
import ScreenTimeLineGraph from '../../../Components/ScreenTimeGraph/ScreenTimeLineGraph';
import { horizontalScale } from '../../../Constants/sizeChoose';
import isEmpty from 'lodash.isempty';
import getStore from '../../../redux';
import {ScreenTimePerm} from '../../../redux/actions/actions';
import PostRequestApi from '../../../apirequest/PostRequestApi';
import {getMyDeviceId} from '../../../services/commonService';

const { width: SIZE, height: HEIGHT } = Dimensions.get('window');

const IndicatorHelper = ({ color, text }) => {
  return (
    <View style={styles.indicatorHelperView}>
      <View style={[styles.indicatorHelper, { backgroundColor: color }]} />
      <Text style={styles.indicatorText}>{text}</Text>
    </View>
  );
};

const ScreenData = ({
  CheckForScreenData,
  PermScreenTime,
  Weather,
  // data,
  // dataLow,
  MoodCount,
  swiperIndex,
  index,
}) => {
  const [ScreenTimeDuration, setScreenTimeDuration] = useState(false);
  const [screenDuration, setScreenDuration] = useState('Weekly');
  const [graphData, setGraphData] = useState(null);
  const [openActionSheet, setopenActionSheet] = useState(false);
  const [AnonymousClick, setAnonymousClick] = useState(false);
  const [currentDayScreenTime, setCurrentDayScreenTime] = useState(0);
  const [yesterdayScreenTime, setYesterdayScreenTime] = useState(0);
  const [morningTime, setMorningTime] = useState(0);
  const [noonTime, setNoonTime] = useState(0);
  const [afternoonTime, setAfternoonTime] = useState(0);
  const [eveningTime, setEveningTime] = useState(0);
  const [nightTime, setNightTime] = useState(0);
  const requestingPermission = useRef(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();

  const fetchScreenTimeData = () => {
    if (Platform.OS === 'android') {
      getDailyStats();
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("Screen Data App has come to the foreground!");
        if (requestingPermission.current === true) {
          fetchScreenTimeData();
          requestingPermission.current = false;
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      // console.log("AppState", appState.current);
    });

    return () => {
      subscription?.remove?.();
    };
  }, []);

  useEffect(() => {
    if (UserData.ScreenTimePermission === true) {
      fetchScreenTimeData();
    }
  }, []);

  const getScreenGraphData = (dataArray) => {
    let screenTimeGraphData = [];
    let weekDates = [];
    let dates = [6, 5, 4, 3, 2, 1, 0];
    dates.forEach((e, idx) => {
      const d = moment().startOf('day').subtract(e, 'days').toDate().getTime();
      weekDates.push(d);
    });
    weekDates.forEach((e, idx) => {
      const eData = moment(e);
      let data = null;
      let day = '';
      day = eData.format('dd');
      // INBED
      dataArray.forEach((d) => {
        const startDateMillis = d?.start_date ? new Date(d.start_date).getTime() : null;
        let value = 0;
        if (!isNaN(d?.duration)) {
          value = Number.parseInt(Number(d.duration), 10);
          value = value > 0 ? Math.floor(value / 60) : 0;
          let x = Number(d.duration) % 60;
          x = Math.floor((100 * x) / 60);
          value = value + (x / 100);
        }
        if (
          startDateMillis !== null &&
          moment(startDateMillis).startOf('days').isSame(eData)
        ) {
          data = {
            x: idx + 1,
            y: value,
            day,
          };
        }
      });
      if (data === null) {
        data = {
          x: idx + 1,
          y: 0,
          day,
        };
      }
      screenTimeGraphData.push(data);
    });
    // console.log('screenTimeGraphData ------>', screenTimeGraphData);
    return screenTimeGraphData;
  };

  const VerifyDone = async () => {
    // await AsyncStorage.setItem('GiveSleepPerm', 'true');

    setopenActionSheet(false);
    if (Platform.OS === 'android') {
      const timeoutId = setTimeout(() => {
        requestUsageStatsPermission();
        clearTimeout(timeoutId);
      }, 400);
    }
    //   let Sp = await AsyncStorage.getItem('GiveSleepPerm');
    //   let SleepP = await JSON.parse(Sp);
    //   console.log(`SleepPerm`, SleepP);
    //   dispatch(SleepPerm(SleepP));
  };

  const requestUsageStatsPermission = () => {
    // if (UsageStats.checkForPermission()) {
    //   console.log('UsageStats.checkForPermission() ->', UsageStats?.checkForPermission?.());
    //   return;
    // }
    if (Platform.OS !== 'android') {
      return;
    }
    const s = moment().startOf('day').toDate();
    if (!UsageStats) {
      Toast.show({
        type: 'error',
        text2: 'Usage Stats not available',
        visibilityTime: 4000,
        autoHide: true,
      });
      return;
    }
    if (!UsageStats?.queryUsageStats) {
      Toast.show({
        type: 'error',
        text2: 'Usage Stats queryUsageStats not available',
        visibilityTime: 4000,
        autoHide: true,
      });
      return;
    }
    UsageStats.queryUsageStats(
      UsageStats.INTERVAL_BEST,
      s.getTime(),
      new Date().getTime(),
    )
      .then((data) => {
        console.log('requestUsageStatsPermission SCREEN TIME DATA: ', data);
        if (isEmpty(data)) {
          if (!UsageStats?.showUsageAccessSettings) {
            Toast.show({
              type: 'error',
              text2: 'Usage Stats showUsageAccessSettings not available',
              visibilityTime: 4000,
              autoHide: true,
            });
          } else {
            UsageStats.showUsageAccessSettings('com.moodflo');
            requestingPermission.current = true;
          }
        } else {
          fetchScreenTimeData();
        }
      })
      .catch((error) => {
        console.log('Error in getting SCREEN TIME DATA: ', error);
      });
  };

  const getUsageStats = () => {
    if (!UsageStats) {
      Toast.show({
        type: 'error',
        text2: 'Usage Stats not available',
        visibilityTime: 4000,
        autoHide: true,
      });
      return;
    }
    if (!UsageStats.queryUsageStats) {
      Toast.show({
        type: 'error',
        text2: 'Usage Stats queryUsageStats not available',
        visibilityTime: 4000,
        autoHide: true,
      });
      return;
    }
    const s = moment().startOf('day').toDate();
    UsageStats.queryUsageStats(
      UsageStats.INTERVAL_BEST,
      s.getTime(),
      new Date().getTime(),
    )
      .then((data) => {
        // console.log('SCREEN TIME DATA: ', data);
      })
      .catch((error) => {
        console.log('Error in getting SCREEN TIME DATA: ', error);
      });
  };

  const getTotalTimeInForeground = (screenTimeData) => {
    let totalScreenTime = 0;
    if (!screenTimeData) {
      return totalScreenTime;
    }
    const keys = Object.keys(screenTimeData);
    if (Array.isArray(keys) && keys.length > 0) {
      totalScreenTime = screenTimeData?.[keys[0]]?.totalTime ?? 0;
      // keys.forEach((e) => {
      //   let screenTime = screenTimeData?.[e]?.totalTimeInForeground ?? 0;
      //   if (!isNaN(screenTime)) {
      //     totalScreenTime += Number(screenTime);
      //   }
      // });
    }
    // console.log('screen time in milli --->', totalScreenTime);
    totalScreenTime = totalScreenTime > 0 ? Math.ceil((totalScreenTime / 1000) / 60) : 0;
    // console.log('screen time in minutes --->', totalScreenTime);
    // if (totalScreenTime === 0) {
    //   console.log('screen time in hours --->', 0);
    // } else {
    //   console.log('screen time in hours --->', `${Math.floor(totalScreenTime / 60)} hours - ${totalScreenTime % 60} minutes`);
    // }
    return totalScreenTime;
  };

  const getDailyStats = () => {
    let currentDayTime = 0;
    let morning = 0;
    let noon = 0;
    let afternoon = 0;
    let evening = 0;
    let night = 0;
    let morningSTime = moment().startOf('day').add(7, 'hours').valueOf();
    let noonSTime = moment().startOf('day').add(11, 'hours').valueOf();
    let afternoonSTime = moment().startOf('day').add(13, 'hours').valueOf();
    let eveningSTime = moment().startOf('day').add(16, 'hours').valueOf();
    let nightSTime = moment().startOf('day').add(19, 'hours').valueOf();
    let nightETime = moment().startOf('day').add(1, 'day').add(7, 'hours').valueOf();
    if (!UsageStats) {
      Toast.show({
        type: 'error',
        text2: 'Usage Stats not available',
        visibilityTime: 4000,
        autoHide: true,
      });
      return;
    }
    if (!UsageStats?.getDailyStats) {
      Toast.show({
        type: 'error',
        text2: 'Usage Stats queryUsageStats not available',
        visibilityTime: 4000,
        autoHide: true,
      });
      return;
    }
    UsageStats?.getUsageStats?.(morningSTime, noonSTime)
      .then((data) => {
        console.log('MORNING SCREEN TIME DATA: ', data);
        morning = getTotalTimeInForeground(data);
        setMorningTime(morning);
        const screenTimePermission = getStore?.()?.getState?.()?.First?.ScreenTimePermission;
        if (screenTimePermission === false && !isEmpty(data)) {
          dispatch(ScreenTimePerm(true));
        }
        return UsageStats.getUsageStats(noonSTime, afternoonSTime);
      })
      .then((data) => {
        console.log('NOON SCREEN TIME DATA: ', data);
        noon = getTotalTimeInForeground(data);
        setNoonTime(noon);
        const screenTimePermission = getStore?.()?.getState?.()?.First?.ScreenTimePermission;
        if (screenTimePermission === false && !isEmpty(data)) {
          dispatch(ScreenTimePerm(true));
        }
        return UsageStats.getUsageStats(afternoonSTime, eveningSTime);
      })
      .then((data) => {
        console.log('AFTERNOON SCREEN TIME DATA: ', data);
        afternoon = getTotalTimeInForeground(data);
        setAfternoonTime(afternoon);
        const screenTimePermission = getStore?.()?.getState?.()?.First?.ScreenTimePermission;
        if (screenTimePermission === false && !isEmpty(data)) {
          dispatch(ScreenTimePerm(true));
        }
        return UsageStats.getUsageStats(eveningSTime, nightSTime);
      })
      .then((data) => {
        console.log('EVENING SCREEN TIME DATA: ', data);
        evening = getTotalTimeInForeground(data);
        setEveningTime(evening);
        const screenTimePermission = getStore?.()?.getState?.()?.First?.ScreenTimePermission;
        if (screenTimePermission === false && !isEmpty(data)) {
          dispatch(ScreenTimePerm(true));
        }
        return UsageStats.getUsageStats(nightSTime, nightETime);
      })
      .then((data) => {
        console.log('NIGHT SCREEN TIME DATA: ', data);
        night = getTotalTimeInForeground(data);
        setNightTime(night);
        const screenTimePermission = getStore?.()?.getState?.()?.First?.ScreenTimePermission;
        if (screenTimePermission === false && !isEmpty(data)) {
          dispatch(ScreenTimePerm(true));
        }
        return UsageStats.getUsageStats(
          moment().startOf('day').valueOf(),
          moment().valueOf(),
        );
      })
      .then((data) => {
        console.log('CURRENT DAY SCREEN TIME DATA: ', data);
        currentDayTime = getTotalTimeInForeground(data);
        setCurrentDayScreenTime(currentDayTime);
        const screenTimePermission = getStore?.()?.getState?.()?.First?.ScreenTimePermission;
        if (screenTimePermission === false && !isEmpty(data)) {
          dispatch(ScreenTimePerm(true));
        }
        return UsageStats.getYesterdayStats();
      })
      .then((data) => {
        console.log('YESTERDAY SCREEN TIME DATA: ', data);
        let prevDayTime = getTotalTimeInForeground(data);
        setYesterdayScreenTime(prevDayTime);
        const screenTimePermission = getStore?.()?.getState?.()?.First?.ScreenTimePermission;
        if (screenTimePermission === false && !isEmpty(data)) {
          dispatch(ScreenTimePerm(true));
        }
        let prevDay = moment().subtract(1, 'days');
        const params = {
          device_id: getMyDeviceId(),
          email: getStore?.()?.getState?.()?.First?.UserEmail ?? '',
          screen_data: [
            {
              time_interval: 'yesterday',
              start_date: prevDay.clone().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
              end_date: prevDay.clone().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
              value: prevDayTime,
            },
            {
              time_interval: 'morning',
              start_date: moment(morningSTime).format('YYYY-MM-DD HH:mm:ss'),
              end_date: moment(noonSTime).format('YYYY-MM-DD HH:mm:ss'),
              value: morning,
            },
            {
              time_interval: 'noon',
              start_date: moment(noonSTime).format('YYYY-MM-DD HH:mm:ss'),
              end_date: moment(afternoonSTime).format('YYYY-MM-DD HH:mm:ss'),
              value: noon,
            },
            {
              time_interval: 'afternoon',
              start_date: moment(afternoonSTime).format('YYYY-MM-DD HH:mm:ss'),
              end_date: moment(eveningSTime).format('YYYY-MM-DD HH:mm:ss'),
              value: afternoon,
            },
            {
              time_interval: 'evening',
              start_date: moment(eveningSTime).format('YYYY-MM-DD HH:mm:ss'),
              end_date: moment(nightSTime).format('YYYY-MM-DD HH:mm:ss'),
              value: evening,
            },
            {
              time_interval: 'night',
              start_date: moment(nightSTime).format('YYYY-MM-DD HH:mm:ss'),
              end_date: moment(nightETime).format('YYYY-MM-DD HH:mm:ss'),
              value: night,
            },
            {
              time_interval: 'today',
              start_date: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
              end_date: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
              value: currentDayTime,
            },
          ],
          user_id: getStore?.()?.getState?.()?.First?.UserId ?? '',
        };
        console.log('updateScreenTime params --->', params);
        return PostRequestApi('updateScreenTime', params);
      })
      .then((data) => {
        console.log('✅ ✅ ✅ ✅ updateScreenTime api success✅ ✅ ✅ ✅ -data---->', data?.data);
        const params = {
          device_id: getMyDeviceId(),
          email: getStore?.()?.getState?.()?.First?.UserEmail ?? '',
          user_id: getStore?.()?.getState?.()?.First?.UserId ?? '',
        };
        console.log('getScreenTimeReport params --->', params);
        return PostRequestApi('getScreenTimeReport', params);
      })
      .then((data) => {
        console.log('✅ ✅ ✅ ✅ getScreenTimeReport api success✅ ✅ ✅ ✅ -data---->', data?.data);
        let screenDataArray = Object.values(data?.data?.screenData);
        if (Array.isArray(screenDataArray) && screenDataArray.length > 0) {
          setGraphData(getScreenGraphData(screenDataArray));
        }
      })
      .catch((error) => {
        console.log('❌ ❌ ❌ ❌ Error in getting SCREEN TIME DATA❌ ❌ ❌ ❌ : ', error);
      });
  };

  // const getPreviousDayStats = () => {
  //   if (!UsageStats) {
  //     Toast.show({
  //       type: 'error',
  //       text2: 'Usage Stats not available',
  //       visibilityTime: 4000,
  //       autoHide: true,
  //     });
  //     return;
  //   }
  //   if (!UsageStats?.getPreviousDayStats) {
  //     Toast.show({
  //       type: 'error',
  //       text2: 'Usage Stats queryUsageStats not available',
  //       visibilityTime: 4000,
  //       autoHide: true,
  //     });
  //     return;
  //   }
  //   UsageStats.getPreviousDayStats()
  //     .then((data) => {
  //       // console.log('PREVIOUS DAY SCREEN TIME DATA: ', data);
  //       setYesterdayScreenTime(getTotalTimeInForeground(data));
  //       const screenTimePermission = getStore?.()?.getState?.()?.First?.ScreenTimePermission;
  //       if (screenTimePermission === false && !isEmpty(data)) {
  //         dispatch(ScreenTimePerm(true));
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('Error in getting SCREEN TIME DATA: ', error);
  //     });
  // };

  const ScreenDurations = [{ label: 'Day' }, { label: 'Week' }, { label: 'Month' }];

  const AnonymousPopUpcancelled = () => {
    setAnonymousClick(false);
  };

  const getProgress = (e, totalTime = 360) => {
    if (!isNaN(e)) {
      return Math.ceil((Number(e) * 120) / totalTime);
    }
    return 0;
  };

  const getTimeInHoursMin = (e) => {
    if (!isNaN(e)) {
      let i = Number(e);
      let hr = Math.floor(i / 60);
      let min = i % 60;
      return i > 0 ? `${hr > 0 ? `${hr}hr ` : ''}${min > 0 ? `${min}min` : ''}` : '0min';
    }
    return '0min';
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
              CheckForScreenData();
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
              <Text style={styles.lightText}>Sync your</Text>
              <Text style={styles.normalText}>Screen data</Text>
            </View>
          </TouchableOpacity>
          <CrownBox floCoins={UserData.floCoins}/>
          <View style={styles.ColoredView}>
            <Text style={styles.ColoredText}>Anon</Text>
          </View>
        </View> */}
        <HomeSyncHeader
          label={'Screen'}
          isPermissionGiven={false}
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
        {/* <TouchableOpacity
          style={{
            marginTop: 30,
            alignSelf: 'center',
            borderWidth: 1.5,
            borderColor: '#000000',
          }}
          onPress={requestUsageStatsPermission}>
              <Text>Check Usage Permission</Text>
          </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: 30,
            alignSelf: 'center',
            borderWidth: 1.5,
            borderColor: '#000000',
          }}
          onPress={getDailyStats}>
              <Text>Get Current Day Statistics</Text>
          </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: 30,
            alignSelf: 'center',
            borderWidth: 1.5,
            borderColor: '#000000',
          }}
          onPress={getPreviousDayStats}>
              <Text>Get Yesterday Statistics</Text>
          </TouchableOpacity> */}
        <View>
          <DataInsights
            dailyInsights={'You became more tired and anxious as your screen time went over 5hrs per day'}
            weeklyInsights={'This week you were more Anxious when you got more than 7 hrs of screen time'}
            dailySuggestion={'Try getting less than 4hrs for a few days'}
            dailySuggestionType={'warning'}
            weeklySuggestion={'Try to get less than 5 hrs per day'}
            weeklySuggestionType={'warning'}
            timeLeft={UserData?.weeklyInsightsTimeLeft}
            // isPermissionGiven={UserData.ScreenTimePermission}
            isPermissionGiven={false}
            dispatch={dispatch}
          />
          {/* <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={[styles.SmallThinText, { paddingVertical: 9 }]}>
              SCREEN TIME
            </Text>
            <Text style={styles.swiperText}>
              You became more <Text style={{ color: '#5947D0' }}>tired</Text> and{' '}
              <Text style={{ color: '#5947D0' }}>anxious</Text> as your screen
              time <Text style={{ color: '#5947D0' }}>increased</Text> above{' '}
              <Text style={{ color: '#5947D0' }}>3hrs</Text> per day
            </Text>
            <Text style={[styles.SmallThinText, { paddingVertical: 9 }]}>
              Try get less than 3hrs a day
            </Text>
          </View> */}

          {/* <ProgressBarCustom /> */}
          <HomeHeader
            // click={() => setScreenTimeDuration(false)}
            value={screenDuration}
          />
          <View style={{ marginBottom: 50, alignItems: 'center' }}>
            {/* {swiperIndex == index && ( */}
            {true && (
              // <BarGraph color={'#16B7C7'} ShowPollen={false} RightBar={false} />
              <ScreenTimeBarGraph graphWidth={SIZE} data={graphData} />
            )}
          </View>

          <View style={styles.bottomView}>
            {/* <ScreenCircleBar
              DarkColor="#0DDE79"
              lightColor="#CFF9ED"
              Label="Today"
              // Time="1hr 34min"
              Time={getTimeInHoursMin(currentDayScreenTime)}
              value={getProgress(currentDayScreenTime)}
              border={true}
            />
            <ScreenCircleBar
              DarkColor="#F992BE"
              lightColor="#FEE9F2"
              Label="Yesterday"
              Time={getTimeInHoursMin(yesterdayScreenTime)}
              // Time="1hr 34min"
              value={getProgress(yesterdayScreenTime)}
              border={true}
            /> */}
            <ScreenCircleBar
              DarkColor="#0DDE79"
              lightColor="#CFF9ED"
              Label="Morning"
              Time={getTimeInHoursMin(UserData.ScreenTimePermission ? morningTime : 94)}
              value={getProgress((UserData.ScreenTimePermission ? morningTime : 94), 240)}
              border={true}
            />
            <ScreenCircleBar
              DarkColor="#E74C3C"
              lightColor="#FEE9F2"
              Label="Noon"
              Time={getTimeInHoursMin(UserData.ScreenTimePermission ? noonTime : 94)}
              value={getProgress((UserData.ScreenTimePermission ? noonTime : 94), 120)}
              border={true}
            />
            <ScreenCircleBar
              DarkColor="#F992BE"
              lightColor="#FEE9F2"
              Label="Afternoon"
              Time={getTimeInHoursMin(UserData.ScreenTimePermission ? afternoonTime : 94)}
              value={getProgress((UserData.ScreenTimePermission ? afternoonTime : 94), 180)}
              border={true}
            />
            <ScreenCircleBar
              DarkColor="#21CDDE"
              lightColor="#E5F9FC"
              Label="Evening"
              Time={getTimeInHoursMin(UserData.ScreenTimePermission ? eveningTime : 94)}
              value={getProgress((UserData.ScreenTimePermission ? eveningTime : 94), 180)}
            />
            <ScreenCircleBar
              DarkColor="#3498DB"
              lightColor="#E5F9FC"
              Label="Night"
              Time={getTimeInHoursMin(UserData.ScreenTimePermission ? nightTime : 94)}
              value={getProgress((UserData.ScreenTimePermission ? nightTime : 94), 720)}
            />
          </View>
          {/* <GraphicChart /> */}
          {/* <ScreenTimeLineGraph /> */}
          {/* {!PermScreenTime && (
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
                allowFontScaling={false}
                style={{
                  marginTop: -260,
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
          {!UserData.ScreenTimePermission && (
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
      </ScrollView>

      <PopUp
        ComingUp={false}
        permission={UserData.ScreenTimePermission}
        image={Constants.Images.ScreenPopUpImg}
        dataType={'screen'}
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
  SmallThinText: {
    paddingVertical: 12,
    fontFamily: RubikLight,
    color: '#747690',
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
    color: '#4C5980',
    fontFamily: RubikRegular,
  },
  bottomView: {
    marginBottom: horizontalScale(100),
  },
});

export default ScreenData;
