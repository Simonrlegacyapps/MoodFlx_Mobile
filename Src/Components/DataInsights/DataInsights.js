import React, {useState, useCallback, useEffect, useRef, memo} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Pressable,
} from 'react-native';
import moment from 'moment';
import {getFontSize, horizontalScale} from '../../Constants/sizeChoose';
import {
  RubikBold,
  RubikExtraBold,
  RubikMedium,
} from '../../Constants/fonts/Fonts';
const {width: SIZE, height: HEIGHT} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {SetShowMonthlyInsightsModal, SetShowWeeklyInsightsModal} from '../../redux/actions/actions';
import {getMonthlyInsightsAvailable, getMonthlyInsightsDaysLeft, getMonthlyInsightsStartEndTime, getWeeklyInsightsAvailable} from '../../Constants/constants';
import {getMoodsArray, getMyDeviceId} from '../../services/commonService';
import NotEnoughMoodsModal from '../Modals/NotEnoughtMoodsModal/NotEnoughMoodsModal';
import Images from '../../Constants/Images/Images';
import Eye from '../../../assets/svg/Eye';
import EyeClose from '../../../assets/svg/EyeClose';
import ProgressBar from '../../Components/ProgressBar/ProgressBarCustom';
import { useSelector } from 'react-redux';
import PostRequestApi from '../../apirequest/PostRequestApi'
import isFunction from 'lodash.isfunction';
import ProgressDay from './ProgressDay';
import Colors from '../../Constants/Colors/Colors';

const insightsDurationFlags = {
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly',
};

const getInsightsArray = (text) => {
  let insights = [];
  let moods = getMoodsArray();
  // console.log('moods ----', moods);
  let l = typeof text === 'string' ? text.split(' ') : [];
  let index = 0;
  if (
    Array.isArray(l) &&
    l.length > 0 &&
    Array.isArray(moods) &&
    moods.length > 0
  ) {
    l.forEach((r, idx) => {
      moods.forEach((e) => {
        let mArray = r.match(new RegExp(e, 'i'));
        if (Array.isArray(mArray) && mArray.length > 0) {
          // console.log('mArray ----', mArray);
          if (index === 0) {
            let x = l?.slice?.(index, idx)?.join?.(' ');
            x !== undefined &&
              typeof x === 'string' &&
              insights.push({text: x.trim(), color: ''});
            typeof r === 'string' && insights.push({text: r, color: '#7265e3'});
          } else {
            let x = l?.slice?.(index + 1, idx)?.join?.(' ');
            x !== undefined &&
              typeof x === 'string' &&
              insights.push({text: x.trim(), color: ''});
            typeof r === 'string' && insights.push({text: r, color: '#7265e3'});
          }
          index = idx;
        }
      });
    });
    if (index !== 0) {
      let y = l?.slice?.(index + 1)?.join?.(' ');
      typeof y === 'string' && insights.push({text: y, color: ''});
    }
  }
  if (Array.isArray(insights) && insights.length > 0) {
    return insights;
  }
  insights.push({text: text, color: ''});
  // console.log('insights ----', insights);
  return insights;
};

function DataInsights({
  dailyInsights,
  weeklyInsights,
  dailySuggestion,
  dailySuggestionType,
  weeklySuggestion,
  weeklySuggestionType,
  monthlyInsights,
  monthlySuggestion,
  monthlySuggestionType,
  timeLeft,
  isPermissionGiven,
  dispatch,
  onPressInsights,
  onSync,
}) {
  const getInsightsDuration = (weekInsights, monthInsights, isPermGiven) => {
    if (!!isPermGiven === false) {
      return insightsDurationFlags.daily;
    }
    if (
      getMonthlyInsightsAvailable() === true &&
      !!monthlyInsights &&
      typeof monthInsights === 'string'
    ) {
      return insightsDurationFlags.monthly;
    } else if (
      getWeeklyInsightsAvailable() === true &&
      !!weekInsights &&
      typeof weekInsights === 'string'
    ) {
      return insightsDurationFlags.weekly;
    } else {
      return insightsDurationFlags.daily;
    }
  };
  const [insightsDuration, setInsightsDuration] = useState(
    getInsightsDuration(weeklyInsights, monthlyInsights, isPermissionGiven),
  );
  const [showNotEnoughMoodsModal, setShowNotEnoughMoodsModal] = useState(false);
  const [showNotEnoughData, setShowNotEnoughData] = useState(false);
  const [ShowTarget, setShowTarget] = useState(false);
  const [MoodCountData, setMoodCountData] = useState(null);
  const [modalDuration, setModalDuration] = useState(insightsDurationFlags.weekly);
  const prevWeeklyInsights = useRef(
    getInsightsDuration(weeklyInsights, monthlyInsights, isPermissionGiven),
  );

  useEffect(() => {
    const currentFlag = getInsightsDuration(
      weeklyInsights,
      monthlyInsights,
      isPermissionGiven,
    );
    if (prevWeeklyInsights.current !== currentFlag) {
      prevWeeklyInsights.current = currentFlag;
      setInsightsDuration(currentFlag);
    }
  }, [weeklyInsights, monthlyInsights, isPermissionGiven]);

  const openCloseShowNotEnoughMoodsModal = useCallback((flag) => {
    const fn = () => setShowNotEnoughMoodsModal(flag);
    return fn;
  }, []);

  const openCloseShowNotEnoughDataModal = useCallback((flag) => {
    const fn = () => setShowNotEnoughData(flag);
    return fn;
  }, []);

  const onSyncButtonClick = useCallback(() => {
    setShowNotEnoughData(false);
    if (isFunction(onSync)) {
      const timeoutId = setTimeout(() => {
        onSync();
        clearTimeout(timeoutId);
      }, 400);
    }
  }, [onSync]);

  useEffect(() => {
    console.log('insightsDuration', insightsDuration);
    getWeekMoodData();
  }, []);

  const UserData = useSelector((state) => state.First);

  const onPressWeeklyTab = () => {
    if (getWeeklyInsightsAvailable() === true) {
      setModalDuration(insightsDurationFlags.weekly);
      if (!!weeklyInsights) {
        setInsightsDuration(insightsDurationFlags.weekly);
      } else if (getTotalMood() < 4 || !isFunction(onSync)) {
        setShowNotEnoughMoodsModal(true);
      } else {
        setShowNotEnoughData(true);
      }
    } else {
      /*
       Weekly api should be called between
       Friday @ 12am until end of Monday
       */
      dispatch?.(SetShowWeeklyInsightsModal(true));
    }
  };

  const onPressMonthlyTab = () => {
    if (getMonthlyInsightsAvailable() === true) {
      setModalDuration(insightsDurationFlags.monthly);
      if (!!monthlyInsights) {
        setInsightsDuration(insightsDurationFlags.monthly);
      } else if (getTotalMood() < 16 || !isFunction(onSync)) {
        setShowNotEnoughMoodsModal(true);
      } else {
        setShowNotEnoughData(true);
      }
    } else {
      dispatch?.(SetShowMonthlyInsightsModal(true));
    }
  };

  const getWeekMoodData = ()=>{
    const deviceId = getMyDeviceId();
    let params = { 
      "device_id": deviceId,
      "email": UserData.UserEmail,
      "user_id": UserData.UserId
  }
  console.log(`params for mood count data`, params)
  PostRequestApi('getMoodCount', params)
    .then((res) => {
      if (res.status === 200) {
        console.log(`res.data of mood count`, res.data)
          setMoodCountData(res.data.moodCount);
      }
    })
    .catch((err) => {
      console.log(`err`, err);
    });
  
  }

  let insightsDetails = dailyInsights;
  let suggestion = dailySuggestion;
  let suggestionType = dailySuggestionType;
  if (insightsDuration === insightsDurationFlags.daily) {
    insightsDetails = !!dailyInsights === true ? dailyInsights : 'Not enough high quality data yet';
    suggestion = !!dailySuggestion === true ? dailySuggestion : '';
    suggestionType = !!dailySuggestionType === true ? dailySuggestionType : '';
  } else if (insightsDuration === insightsDurationFlags.weekly) {
    insightsDetails = !!weeklyInsights === true ? weeklyInsights : 'Not enough high quality data yet';
    suggestion = !!weeklySuggestion === true ? weeklySuggestion : '';
    suggestionType = !!weeklySuggestionType === true ? weeklySuggestionType : '';
  } else if (insightsDuration === insightsDurationFlags.monthly) {
    insightsDetails = !!monthlyInsights === true ? monthlyInsights : 'Not enough high quality data yet';
    suggestion = !!monthlySuggestion === true ? monthlySuggestion : '';
    suggestionType = !!monthlySuggestionType === true ? monthlySuggestionType : '';
  }

  let insightsArray = getInsightsArray(insightsDetails);

  if (!dailyInsights) {
    return null;
  }

  const getTotalMood = () => {
    let total = 0;
    let moodCountData = MoodCountData;
    // setMoodCountData((e) => {
    //   moodCountData = e;
    //   return e;
    // });
    for (let i in moodCountData) {
      total = total + moodCountData[i].mood_count;
      console.log(`total`, total);
    }
    return total;
  };

  // console.log(`MoodCountData`, MoodCountData)

  return (
    <>
      <View style={styles.tabContainer}>
        <View style={styles.tabHeader}>
          <TouchableOpacity
            style={
              insightsDuration === insightsDurationFlags.daily
                ? styles.activeTabHeader
                : styles.inactiveTabHeader
            }
            onPress={() => setInsightsDuration(insightsDurationFlags.daily)}>
            <Text
              style={
                insightsDuration === insightsDurationFlags.daily
                  ? styles.activeTabHeaderText
                  : styles.inactiveTabHeaderText
              }>
              TODAY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            // disabled={weeklyInsights ? false : true}
            style={[
              insightsDuration === insightsDurationFlags.weekly
                ? styles.activeTabHeader
                : styles.inactiveTabHeader,
              { marginLeft: horizontalScale(10) },
            ]}
            onPress={onPressWeeklyTab}>
            <Text
              style={
                insightsDuration === insightsDurationFlags.weekly
                  ? styles.activeTabHeaderText
                  : styles.inactiveTabHeaderText
              }>
              WEEKLY
            </Text>
          </TouchableOpacity>
          {getWeeklyInsightsAvailable() !== true &&
            timeLeft !== -1 &&
            !isNaN(timeLeft) && (
              <Pressable onPress={onPressWeeklyTab}>
                <AnimatedCircularProgress
                  duration={900}
                  arcSweepAngle={360}
                  size={horizontalScale(28)}
                  padding={1}
                  width={2.5}
                  fill={(timeLeft / 5) * 100}
                  rotation={0}
                  tintColor={Colors.blueTextColor}
                  lineCap={'round'}
                  backgroundColor="#CFF9ED">
                  {(fill) => (
                    <Text allowFontScaling={false} style={styles.progressText}>
                      {timeLeft}
                    </Text>
                  )}
                </AnimatedCircularProgress>
              </Pressable>
            )}
          <TouchableOpacity
            // disabled={weeklyInsights ? false : true}
            style={[
              insightsDuration === insightsDurationFlags.monthly
                ? styles.activeTabHeader
                : styles.inactiveTabHeader,
              { marginLeft: horizontalScale(10) },
            ]}
            onPress={onPressMonthlyTab}>
            <Text
              style={
                insightsDuration === insightsDurationFlags.monthly
                  ? styles.activeTabHeaderText
                  : styles.inactiveTabHeaderText
              }>
              MONTHLY
            </Text>
          </TouchableOpacity>
          {getMonthlyInsightsAvailable() !== true &&
            getMonthlyInsightsDaysLeft() !== 0 && (
              <Pressable onPress={onPressMonthlyTab}>
                <AnimatedCircularProgress
                  duration={900}
                  arcSweepAngle={360}
                  size={horizontalScale(28)}
                  padding={1}
                  width={2.5}
                  fill={(getMonthlyInsightsDaysLeft() / getMonthlyInsightsStartEndTime().startTime.date()) * 100}
                  rotation={0}
                  tintColor={Colors.blueTextColor}
                  lineCap={'round'}
                  backgroundColor="#CFF9ED">
                  {(fill) => (
                    <Text allowFontScaling={false} style={styles.monthlyProgressText}>
                      {getMonthlyInsightsDaysLeft()}
                    </Text>
                  )}
                </AnimatedCircularProgress>
              </Pressable>
            )}
        </View>
        <Pressable style={styles.tabDetailsView} onPress={onPressInsights}>
          <Text style={styles.tabDetailsText}>
            {isPermissionGiven ? (
              ''
            ) : (
              <Text style={{fontFamily: RubikExtraBold}}>Demo: </Text>
            )}
            {insightsArray.map((e, idx) => {
              // console.log('insightsArray ----', e);
              return (
                <Text
                  key={`${idx}`}
                  style={{color: e?.color ? e.color : 'rgb(32,32,32)'}}>{`${
                  e?.text ?? ''
                } `}</Text>
              );
            })}
          </Text>
        </Pressable>
        {insightsDuration === insightsDurationFlags.weekly && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowTarget((e) => !e)}
          style={styles.TargetView}>
          <View
            style={styles.targetSubView}>
            <View style={{marginRight: 7}}>
              {ShowTarget ? <EyeClose/> : <Eye />}
            </View>
            <Text
              style={{fontFamily: RubikMedium, color: 'white', fontSize: 16}}>
              {getTotalMood()}/15 Mood Targets
            </Text>
          </View>
        </TouchableOpacity>
        )}

        {/* <View
          style={styles.progressView}>
          <Text style={{fontSize: 16, position: 'absolute', left: -30}}>M</Text>
          <ProgressBar
            dots={true}
            progress={60}
            MoodCount={2}
            height={8}
            backgroundColor="#CB9866"
          />
          <Text style={{fontSize: 16, position: 'absolute', right: -40}}>
            2/3
          </Text>
        </View> */}
        {ShowTarget && (
          <>
            <ProgressDay color={'#6FD691'} label={"M"} label2={MoodCountData[1].mood_count} progress={MoodCountData[0].mood_count} />
            <View style={styles.borderLine} />
            <ProgressDay color={'#B88DCC'} label={"T"} label2={MoodCountData[2].mood_count} progress={MoodCountData[1].mood_count} />
            <View style={styles.borderLine} />
            <ProgressDay color={'#4C5F79'} label={"W"} label2={MoodCountData[3].mood_count} progress={MoodCountData[2].mood_count} />
            <View style={styles.borderLine} />
            <ProgressDay color={Colors.blueTextColor} label={"T"} label2={MoodCountData[4].mood_count} progress={MoodCountData[3].mood_count} />
            <View style={styles.borderLine} />
            <ProgressDay color={'#7FE3F0'} label={"F"} label2={MoodCountData[5].mood_count} progress={MoodCountData[4].mood_count} />
            {/* <View style={styles.borderLine} /> */}
          </>
        )}

        {suggestion ? (
          <View style={styles.suggestionView}>
            {suggestionType ? (
              <Icon
                name="alert-circle-outline"
                size={horizontalScale(20)}
                style={styles.warningImage}
                color="rgb(136,136,136)"
              />
            ) : null}
            <View style={styles.suggestionTextView}>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </View>
          </View>
        ) : null}
      </View>
      <NotEnoughMoodsModal
        modalVisible={showNotEnoughMoodsModal}
        dismissModalHandler={openCloseShowNotEnoughMoodsModal(false)}
        image={Images.SadButRelievedFaceImg}
        textOne="Damn... not enough moods"
        textTwo={
          modalDuration === insightsDurationFlags.weekly
            ? 'Try input your mood at least 4 times per week to unlock this'
            : 'Try input your mood at least 16 times per month to unlock this'
        }
        buttonOneText={
          modalDuration === insightsDurationFlags.weekly
            ? 'Next Week!'
            : 'Next Month!'
        }
        onButtonOnePress={openCloseShowNotEnoughMoodsModal(false)}
      />
      <NotEnoughMoodsModal
        modalVisible={showNotEnoughData}
        dismissModalHandler={openCloseShowNotEnoughDataModal(false)}
        image={Images.SadButRelievedFaceImg}
        textOne={
          modalDuration === insightsDurationFlags.weekly
            ? 'Want to see your weekly insights?'
            : 'Want to see your monthly insights?'
        }
        textTwo="Sync your data to find out"
        buttonOneText="Sync"
        onButtonOnePress={onSyncButtonClick}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    alignItems: 'center',
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabHeader: {
    paddingVertical: horizontalScale(8),
    paddingHorizontal: horizontalScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'rgb(32,32,32)',
    borderBottomWidth: 2,
  },
  inactiveTabHeader: {
    paddingVertical: horizontalScale(8),
    paddingHorizontal: horizontalScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabHeaderText: {
    fontSize: getFontSize(16),
    // fontWeight: '500',
    fontFamily: RubikMedium,
    color: 'rgb(32,32,32)',
  },
  inactiveTabHeaderText: {
    fontSize: getFontSize(16),
    // fontWeight: '500',
    fontFamily: RubikMedium,
    color: 'rgb(136,136,136)',
  },
  tabDetailsView: {
    marginTop: horizontalScale(20),
    alignItems: 'center',
    marginHorizontal: horizontalScale(50),
  },
  tabDetailsText: {
    fontSize: getFontSize(18),
    // fontWeight: '500',
    fontFamily: RubikMedium,
    color: 'rgb(32,32,32)',
    textAlign: 'center',
  },
  blueText: {
    color: '#5947D0',
  },
  suggestionView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: horizontalScale(10),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: '#FFFFFF',
    marginTop: horizontalScale(20),
    width: SIZE * 0.8,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    borderRadius: horizontalScale(10),
    shadowRadius: horizontalScale(10),
    elevation: Platform.OS === 'ios' ? null : 2,
  },
  warningImage: {
    marginRight: horizontalScale(8),
  },
  suggestionTextView: {
    // flex: 1,
    // alignItems: 'center'
  },
  suggestionText: {
    fontSize: getFontSize(18),
    fontFamily: RubikMedium,
    color: 'rgb(32,32,32)',
  },
  suggestionTextBlue: {
    color: 'rgb(25,165,177)',
  },
  progressText: {
    fontSize: getFontSize(18),
    fontFamily: RubikMedium,
    color: Colors.blueTextColor,
  },
  monthlyProgressText: {
    fontSize: getFontSize(13),
    fontFamily: RubikMedium,
    color: Colors.blueTextColor,
  },
  progressView: {
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 5,
    height: 40,
  },
  borderLine:{height: 1, width: '75%', backgroundColor: '#D6D6D6'},
  TargetView:{
    backgroundColor: Colors.blueTextColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 20,
    marginBottom:20
  },
  targetSubView:{
    fontFamily: RubikMedium,
    color: 'white',
    marginVertical: 10,
    marginHorizontal: 19,
    flexDirection: 'row',
  }
});

export default memo(DataInsights);
