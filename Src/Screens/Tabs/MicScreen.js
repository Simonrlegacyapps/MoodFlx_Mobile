import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView,
  FlatList,
} from 'react-native';
import HappyIcon from '../../../assets/emotionsicons/HappyIcon';
import Constants from '../../Constants';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import Svg, {Path, SvgUri} from 'react-native-svg';
import {dynamicSize, getFontSize, horizontalScale, isTablet} from '../../Constants/sizeChoose';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import DateExpiredModal from '../../Components/Modals/DateExpiredModal/DateExpiredModal';
import AsyncStorage from '@react-native-community/async-storage';
import {GetUserId, UserEmail} from '../../redux/actions/actions';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {getDivisionName, GetStaffUserData} from '../../apirequest/PostRequestApi';
import {getApiBaseUrl, moodTypes} from '../../Constants/constants';
import ProgressBar from '../../Components/ProgressBar/ProgressBarCustom';
import Clock from '../../../assets/svg/clock';
import FloCoin from '../../../assets/svg/floCoins';
import {getUpdateAnswerRewardPoints} from '../../services/commonService';
import getStore from '../../redux';
import {
  PulseConnect,
  PulseSelectDivision,
} from '../../Components/PulseComponents/PulseConnect';

const {height, width} = Dimensions.get('window');
const MicScreen = ({navigation}) => {
  const UserData = useSelector((state) => state.First);
  const [questions, setquestions] = useState(null);
  const [Loading, setLoading] = useState(false);
  // const [DateExpired, setDateExpired] = useState(false);

  const [refreshing, setRefreshing] = React.useState(false);
  const dispatch = useDispatch();
  const route = useRoute();

  const wait = (timeout) => {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve();
        clearTimeout(timeoutId);
      }, timeout);
    });
  };

  const onRefresh = React.useCallback(() => {
    setquestions(null);
    console.log(`refreshed here`);
    getQuestions();
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
  }, []);

  const getQuestions = async () => {
    let UserId = await AsyncStorage.getItem('UserId');
    let Id = await JSON.parse(UserId);
    dispatch(GetUserId(Id));
    let p = await AsyncStorage.getItem('Email');
    let e = await JSON.parse(p);
    console.log(`e`, e);
    dispatch(UserEmail(e));
    if (!(e && Id)) {
      setquestions(null);
      return false;
    }
    const deviceId = DeviceInfo.getUniqueId();
    var data = JSON.stringify({
      device_id: deviceId,
      email: e,
      user_id: Id,
    });
    console.log(`data of questions`, data);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow',
    };
    setLoading(true);

    GetStaffUserData(
      {
        device_id: deviceId,
        email: e,
        user_id: Id,
      },
      dispatch,
    )
      .then(async (result) => {
        // console.log(
        //   '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
        //   result?.userData
        // );
        if (result?.userData?.status !== 2) {
          return fetch(`${getApiBaseUrl()}getQuestions`, requestOptions);
        } else {
          requestOptions.body = JSON.stringify({
            device_id: deviceId,
            email: '',
            user_id: '',
          });
          return fetch(`${getApiBaseUrl()}getQuestions`, requestOptions);
        }
      })
      .then(async (result) => result.json())
      .then(async (result) => {
        if (result) {
          console.log(' ✅ ✅ ✅ ✅ Success Get Questions✅ ✅ ✅ ✅ ', result);
          if (result?.questions) {
            await setquestions(result?.questions);
          }
          setLoading(false);
        }
      })
      .catch(function (error) {
        console.log('❌❌❌❌Fail Get Questions❌❌❌❌', error, data);
      });
  };

  useFocusEffect(
    useCallback(() => {
      const userEmail = getStore?.()?.getState?.()?.First?.UserEmail;
      const userDivision = getStore?.()?.getState?.()?.First?.UserDivision;
      if (userEmail && typeof userEmail === 'string' && !userDivision) {
        getDivisionName();
      }
      getQuestions();
      return () => {
        // screen is out of focus
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor('#FFFFFF');
          StatusBar.setBarStyle('dark-content');
        }
        // console.log('screen is out of focus: ', isActive);
      };
    }, []),
  );

  const getMoodType = (type) => {
    if (typeof type !== 'string') {
      return '';
    }
    if (type.toLowerCase() === moodTypes.pretty.toLowerCase()) {
      return 'Pretty ';
    } else if (type.toLowerCase() === moodTypes.very.toLowerCase()) {
      return 'Very ';
    }
    return '';
  };

  useEffect(() => {
    getQuestions();
  }, [navigation]);
  // const Questions = [
  //   {
  //     question: 'What do you think of the CEO’s dress sense?',
  //     showAns: true,
  //   },
  //   {
  //     question: 'How did you feel about the new wage deal announcement today?',
  //   },
  //   {
  //     question:
  //       'How is the new work from home policy announced yesterday making you feel?',
  //   },
  //   {
  //     question:
  //       'How are the construction works next to the office making you feel?',
  //   },
  //   {
  //     question:
  //       'How would you feel if we moved the weekly workshop to the afternoon?',
  //   },
  // ];

  // console.log(`questions`, questions);

  // const cancelled = () => {
  //   setDateExpired(false);
  // };

  // const VerifyDone = (value) => {
  //   setDateExpired(false);
  // };

  const ProgressDay = ({label, color, progress}) => {
    return (
      <View style={styles.progressView}>
        <ProgressBar
          dots={true} // it is referring opposite
          dot1={true} // it is referring opposite
          dot2={true}
          dot3={true}
          dot4={true} // it is referring opposite
          progress={progress}
          MoodCount={2}
          height={8}
          backgroundColor={color}
        />
      </View>
    );
  };

  const getAnsweredQuestions = () => {
    let total = 0;
    for (let i in questions) {
      if (questions[i].answerdate != null) {
        total++;
      }
    }
    return total;
  };

  function dayDiff(prevDate, laterDate) {
    if (!(prevDate && laterDate)) {
      return null;
    }
    let prevDt = moment(prevDate, 'YYYY-MM-DD HH-mm-ss');
    let laterDt = moment(laterDate, 'YYYY-MM-DD HH-mm-ss');
    if (!(prevDt.isValid() && laterDt.isValid() && prevDt.isBefore(laterDt))) {
      return null;
    }
    // console.log('dayDiff laterDt---', laterDt?.format?.());
    // console.log('dayDiff prevDate---', prevDt?.format?.());
    let diff = laterDt?.diff?.(prevDt, 'days');
    if (!isNaN(diff)) {
      return Number(diff);
    }
    return null;
  }

  function hrDiff(prevDate, laterDate) {
    if (!(prevDate && laterDate)) {
      return null;
    }
    let prevDt = moment(prevDate, 'YYYY-MM-DD HH-mm-ss');
    let laterDt = moment(laterDate, 'YYYY-MM-DD HH-mm-ss');
    if (!(prevDt.isValid() && laterDt.isValid() && prevDt.isBefore(laterDt))) {
      return null;
    }
    // console.log('hrDiff laterDt---', laterDt?.format?.());
    // console.log('hrDiff prevDate---', prevDt?.format?.());
    let diff = laterDt?.diff?.(prevDt, 'hour');
    if (!isNaN(diff)) {
      return Number(diff);
    }
    return null;
  }

  function dayHourDiffFormat(prevDate, laterDate) {
    if (!(prevDate && laterDate)) {
      return null;
    }
    let prevDt = moment(prevDate, 'YYYY-MM-DD HH-mm-ss');
    let laterDt = moment(laterDate, 'YYYY-MM-DD HH-mm-ss');
    if (!(prevDt.isValid() && laterDt.isValid() && prevDt.isBefore(laterDt))) {
      return null;
    }
    // console.log('dayHourDiffFormat laterDt---', laterDt?.format?.());
    // console.log('dayHourDiffFormat prevDate---', prevDt?.format?.());
    let totalHours = laterDt?.diff?.(prevDt, 'hour');
    if (isNaN(totalHours)) {
      return null;
    }
    let hours = totalHours % 24;
    let days = Math.floor(totalHours / 24);
    if (days <= 0) {
      return `${hours}hrs left`;
    }
    if (hours <= 0) {
      return `${days} days left`;
    }
    return `${days}d ${hours}hrs left`;
  }

  function postedTimeFormat(prevDate, laterDate) {
    if (!(prevDate && laterDate)) {
      return null;
    }
    let prevDt = moment(prevDate, 'YYYY-MM-DD HH-mm-ss');
    let laterDt = moment(laterDate, 'YYYY-MM-DD HH-mm-ss');
    if (!(prevDt.isValid() && laterDt.isValid() && prevDt.isBefore(laterDt))) {
      return null;
    }
    // console.log('postedTimeFormat laterDt---', laterDt?.format?.());
    // console.log('postedTimeFormat prevDate---', prevDt?.format?.());
    let totalHours = laterDt.diff(prevDt, 'hour');
    if (isNaN(totalHours)) {
      return null;
    }
    let hours = totalHours % 24;
    let days = Math.floor(totalHours / 24);
    if (days > 7 && days < 14) {
      return 'Posted: Last week';
    }
    if (days <= 0) {
      return `Posted: ${hours}hrs ago`;
    }
    return `Posted: ${days} days ago`;
  }

  function answeredTimeFormat(prevDate, laterDate) {
    if (!(prevDate && laterDate)) {
      return null;
    }
    let prevDt = moment(prevDate, 'YYYY-MM-DD HH-mm-ss');
    let laterDt = moment(laterDate, 'YYYY-MM-DD HH-mm-ss');
    if (!(prevDt.isValid() && laterDt.isValid() && prevDt.isBefore(laterDt))) {
      return null;
    }
    // console.log('postedTimeFormat laterDt---', laterDt?.format?.());
    // console.log('postedTimeFormat prevDate---', prevDt?.format?.());
    let totalHours = laterDt.diff(prevDt, 'hour');
    if (isNaN(totalHours)) {
      return null;
    }
    let hours = totalHours % 24;
    let days = Math.floor(totalHours / 24);
    if (days > 0) {
      return `Answered in ${days} ${days === 1 ? 'day' : 'days'}`;
    }
    if (days <= 0) {
      return `Answered in ${hours} hours`;
    }
  }

  function getRewardsCoins(day, hour) {
    if (day != 0) {
      return 'Missed out on flo coins';
    } else {
      if (hour <= 2) {
        return 8;
      } else if (hour > 2 && hour <= 3) {
        return 6;
      } else if (hour > 3 && hour <= 4) {
        return 4;
      } else if (hour > 4 && hour <= 5) {
        return 2;
      } else if (hour > 5 && hour <= 6) {
        return 0;
      } else {
        return 0;
      }
    }
  }

  const onConnect = useCallback(() => {
    navigation.navigate('LinkCompanyStackNavigation');
  }, []);

  const Questions = ({item, index}) => {
    const [showMore, setshowMore] = useState(false);
    const [DateExpired, setDateExpired] = useState(false);

    const cancelled = () => {
      setDateExpired(false);
    };
  
    const VerifyDone = (value) => {
      setDateExpired(false);
    };

    let i = item?.item;
    const startDate = i.start_date ? (
      moment(i.start_date)?.subtract?.(600, 'minute')?.add?.(moment().utcOffset(), 'minute')?.format?.('YYYY-MM-DD HH-mm-ss')
      ) : i.start_date;
    const endDate = i.end_date ? (
      moment(i.end_date)?.subtract?.(600, 'minute')?.add?.(moment().utcOffset(), 'minute')?.format?.('YYYY-MM-DD HH-mm-ss')
      ) : i.end_date;
    let answerDate = i?.answerdate ? (
      moment(i.answerdate)?.subtract?.(600, 'minute')?.add?.(moment().utcOffset(), 'minute')?.format?.('YYYY-MM-DD HH-mm-ss')
      ) : null;
    const currentDate = moment().format('YYYY-MM-DD HH-mm-ss');
    console.log('endDate -', endDate);
    const isExpired = moment().isAfter(moment(endDate, 'YYYY-MM-DD HH-mm-ss'));
    let EndDiff = dayHourDiffFormat(currentDate, endDate);
    // let totalTime = DayDifference(new Date(moment(endDate, 'YYYY-MM-DD HH-mm-ss')),new Date(moment(startDate, 'YYYY-MM-DD HH-mm-ss')));
    let totalTime = hrDiff(startDate, endDate);
    let timeTaken = hrDiff(startDate, currentDate);
    let rewardPts = getUpdateAnswerRewardPoints(i.start_date);

    console.log(`DateExpired`, DateExpired, showMore)

    return (
      <>
      <TouchableOpacity
        disabled={true}
        key={i?.id ?? index}
        onPress={() => setshowMore((e) => !e)}>
        <TouchableOpacity
          onPress={() => setshowMore((e) => !e)}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.questionText, {marginHorizontal: 6}]}>
              {index + 1}.{' '}
            </Text>
            <Text style={[styles.questionText, {width: '82%'}]}>
              {i.question}
            </Text>
            <Image
              source={require('../../../assets/newImage/arrow/arrow.png')}
              style={[
                styles.imageArrow,
                {
                  tintColor: '#8496AC',
                  transform: [{rotate: showMore ? '270deg' : '90deg'}],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
        {!i.name && showMore && (
          <View
            style={styles.unansweredContainer}>
            <View
              style={styles.unansweredSubView}>
              <Text
                style={[
                  styles.Text,
                  {textAlign: 'left', flex: 1, marginLeft: '4%', fontSize: getFontSize(13)},
                ]}>
                {postedTimeFormat(startDate, currentDate)}
              </Text>
              <View style={{alignSelf: 'center'}}>
              <Clock w={getFontSize(13.5)} h={getFontSize(13.5)} />
              </View>
              <Text
                style={[
                  styles.Text,
                  {textAlign: 'right', fontSize: getFontSize(13), color: 'red'},
                ]}>
                {' '}
                {isExpired
                  ? 'Closed'
                  : EndDiff}
              </Text>
            </View>
            <View style={{width: '90%'}}>
              <ProgressBar
                dots={true}
                dot1={true}
                dot2={true}
                dot3={true}
                dot4={true}
                progress={isExpired === true ? 100: ((timeTaken/totalTime)*100)}
                MoodCount={2}
                height={6}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: '4%',
                }}>
                <View style={styles.answerFloCoinsView}>
                  <View style={styles.unansweredFloCoinIcon}>
                    <FloCoin color={'#6D6E86'} w={getFontSize(13.5)} h={getFontSize(13.5)} />
                  </View>
                  <Text
                    style={[styles.Text, {fontSize: getFontSize(13), marginVertical: 0}]}>
                    {' '}
                    {rewardPts === 0
                      ? 'Missed out on flo coins'
                      : `Earn ${rewardPts} flo coins`
                    }
                  </Text>
                </View>
              </View>
                {!isExpired && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.replace('MoodEmotionDetector', {
                        question: i.id,
                        points: rewardPts,
                      });
                    }}>
                    <Text
                      style={{
                        fontSize: getFontSize(14),
                        fontFamily: RubikMedium,
                        color: '#7265E3',
                        textAlign: 'right',
                        // backgroundColor:'blue'
                      }}>
                      Answer ->
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        )}
        {i.name && answerDate && showMore && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{width: '100%', flexDirection: 'row', marginBottom: 5}}>
              <Text
                style={[
                  styles.Text,
                  {textAlign: 'left', flex: 1, marginLeft: '4%', fontSize: getFontSize(13)},
                ]}>
                {postedTimeFormat(startDate, currentDate)}
              </Text>
                <View style={styles.postedFloCoinIcon}>
                  <FloCoin w={getFontSize(13.5)} h={getFontSize(13.5)} />
                </View>
              <Text
                style={[
                  styles.Text,
                  {textAlign: 'right', fontSize: getFontSize(13), color: '#FB8D09'},
                ]}>
                Earned {i.reward_point} flo coins
              </Text>
            </View>
            <View style={{width: '90%'}}>
              <ProgressBar
                dots={true}
                dot1={true}
                dot2={true}
                dot3={true}
                dot4={true}
                progress={isExpired === true ? 100: ((timeTaken/totalTime)*100)}
                MoodCount={2}
                height={6}
                // backgroundColor={"blue"}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  // padding: 8,
                  // borderRadius: 10,
                  marginLeft: '4%',
                  marginVertical: horizontalScale(10),
                }}>
                <SvgUri
                  width={horizontalScale(30)}
                  height={horizontalScale(30)}
                  // viewBox="0 0 24 24"
                  fill="none"
                  uri={`https://super.moodflo.com/${i.icon}`}
                  // uri="http://super.moodflo.com/mood_icons/161616176321272238406054abe3bb450.svg"
                />
                <View>
                  <Text
                    style={{
                      flexDirection: 'row',
                      marginHorizontal: horizontalScale(10),
                      fontFamily: RubikMedium,
                    }}>
                    {i.mood_type ? getMoodType(i.mood_type) : ''}
                    {i.name}
                  </Text>
                  <Text
                    style={[
                      styles.Text,
                      {
                        flexDirection: 'row',
                        marginHorizontal: horizontalScale(10),
                        fontSize: getFontSize(13),
                      },
                    ]}>
                      {answeredTimeFormat(startDate, answerDate)}
                  </Text>
                </View>
                {/* <HappyIcon /> */}
              </View>
              <TouchableOpacity disabled={true}>
                <Text
                  style={{
                    fontSize: getFontSize(13.5),
                    fontFamily: RubikRegular,
                    color: '#6D6E86',
                    textAlign: 'right',
                  }}>
                  {i.is_anonymous === 0 ? 'Answered by you' : 'Anonymous'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {questions.length - 1 != index && <View style={styles.line} />}
      </TouchableOpacity>
      {/* <DateExpiredModal
        modalVisible={DateExpired}
        dismissModalHandler={() => cancelled()}
        verifyDone={(value) => VerifyDone(value)}
      /> */}
      </>
    );
  };

  if (
    !UserData.UserEmail ||
    !UserData.UserId ||
    (!UserData.UserDivision && !(
      Array.isArray(UserData.getDivision) &&
      UserData.getDivision.length > 0))
  ) {
    return <PulseConnect onConnect={onConnect} />;
  } else if (
    !UserData.UserDivision &&
    Array.isArray(UserData.getDivision) &&
    UserData.getDivision.length > 0
  ) {
    return (
      <PulseSelectDivision
        divisions={UserData.getDivision}
        userEmail={UserData.UserEmail}
      />
    );
  }

  return (
    <View
      // check={() => onRefresh()}
      style={{
        // alignItems: 'center',
        // justifyContent: 'center',
        flex: 1,
        backgroundColor: 'white',
      }}>
      {Platform.OS === 'android' && (
        <StatusBar barStyle="light-content" backgroundColor={'#89A1F7'} />
      )}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            tintColor="#000000"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        // style={{
        //   // alignItems: 'center',
        //   // justifyContent: 'center',
        //   flex: 1,
        //   backgroundColor: 'white',
        //   // paddingBottom: 60,
        // }}
      >
        <View
          style={{
            height: dynamicSize(300),
            width: '100%',
            backgroundColor: '#89A1F7',
            alignItems: 'center',
            justifyContent: 'center',
            // flex: 1,
          }}>
          <Image
            source={Constants.Images.TeamPulse}
            style={{
              height: dynamicSize(300),
              width: width,
              resizeMode: 'cover',
            }}
          />
        </View>
        <Image
          style={{
            marginTop: -10,
            ...(isTablet
              ? {
                  resizeMode: 'stretch',
                  width: width,
                }
              : {}),
          }}
          source={Constants.Images.Circles}
        />
        <View style={{marginHorizontal: 15, paddingBottom: 90}}>
          <Text style={styles.normalText}>Team Pulse</Text>
          {UserData.UserEmail ? (
            questions && questions.length > 0 ? (
              <>
                <Text style={styles.BigText}>
                  Have your say as a collective
                </Text>
                <ProgressDay
                  progress={(getAnsweredQuestions() / questions.length) * 100}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.Text, {flex: 1, marginVertical: 10}]}>
                    Answer on time to earn more coins{' '}
                  </Text>
                  <Text style={[styles.Text, {fontSize: 14}]}>
                    <Text style={{fontFamily: RubikMedium, fontWeight: '500'}}>
                      {getAnsweredQuestions()}
                    </Text>
                    /{questions.length}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={{textAlign: 'center', alignSelf: 'center', flex: 1}}>
                <Text
                  numberOfLines={4}
                  style={{
                    alignSelf: 'center',
                    lineHeight: 28,
                    fontWeight: '500',
                    fontSize: dynamicSize(18),
                    marginTop: dynamicSize(12),
                    // marginLeft: 62,
                    // marginRight: 62,
                    textAlign: 'center',
                    // width: dynamicSize(290),
                  }}>
                  Anonymously answer Team Pulses with how you feel.
                </Text>
                {'\n'}
                <Text
                  numberOfLines={4}
                  style={{
                    lineHeight: 28,
                    fontWeight: '500',
                    fontSize: dynamicSize(18),
                    marginTop: dynamicSize(12),
                    // marginLeft: 62,
                    // marginRight: 62,
                    textAlign: 'center',
                    alignSelf: 'center',
                    // width: dynamicSize(270),
                  }}>
                  You'll get a notification when a Team Pulse is available, stay
                  tuned!
                </Text>
              </Text>
            )
          ) : (
            <Text
              numberOfLines={4}
              style={{
                lineHeight: 28,
                fontWeight: '500',
                fontSize: dynamicSize(18),
                marginTop: dynamicSize(12),
                // backgroundColor: 'blue',
                // marginLeft: 62,
                // marginRight: 62,
                textAlign: 'center',
                // width: dynamicSize(250),
              }}>
              Connect with your company to answer Team Pulses anonymously
            </Text>
          )}

          <FlatList
            // key={(i)=>{i.id}}
            data={questions}
            renderItem={(item, index) => {
              return <Questions item={item} index={item.index} />;
            }}
          />
          {!UserData.UserEmail && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('LinkCompanyStackNavigation');
              }}
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <View
                style={{
                  marginTop: dynamicSize(48),
                  height: dynamicSize(53),
                  width: dynamicSize(230),
                  backgroundColor: '#E4DFFF',
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
                }}>
                <Text
                  style={{fontWeight: '500', fontSize: 16, color: '#7265E3'}}>
                  Connect
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* <DateExpiredModal
        modalVisible={DateExpired}
        dismissModalHandler={() => cancelled()}
        verifyDone={(value) => VerifyDone(value)}
      /> */}

      {Loading && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.2)',
            // opacity: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color="#9889F9" size="large" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  normalText: {
    fontSize: 16,
    lineHeight: 16,
    fontFamily: RubikRegular,
    color: '#7265E3',
  },
  BigText: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: RubikRegular,
    marginVertical: 10,
  },
  questionText: {
    fontFamily: RubikLight,
    fontSize: 17,
    fontWeight: '300',
    marginVertical: 6,
  },
  Text: {
    fontFamily: RubikLight,
    fontSize: 16,
    color: '#9C9EB9',
    fontWeight: '300',
    marginVertical: 6,
  },
  line: {
    width: '95%',
    alignSelf: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F2F2',
    marginVertical: 10,
    // marginHorizontal: 7,
  },
  imageArrow: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  unansweredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unansweredSubView: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: horizontalScale(5),
  },
  postedFloCoinIcon: {
    alignSelf: 'center',
    marginRight: horizontalScale(6),
  },
  unansweredFloCoinIcon: {
    alignSelf: 'center',
    marginRight: horizontalScale(2),
  },
  answerFloCoinsView: {
    marginVertical: horizontalScale(10),
    flexDirection: 'row',
  }
});

export default MicScreen;
