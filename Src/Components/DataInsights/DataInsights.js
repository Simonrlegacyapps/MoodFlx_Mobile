import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
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
import {SetShowWeeklyInsightsModal} from '../../redux/actions/actions';
import {getWeeklyInsightsAvailable} from '../../Constants/constants';
import {getMoodsArray} from '../../services/commonService';
import NotEnoughMoodsModal from '../Modals/NotEnoughtMoodsModal/NotEnoughMoodsModal';
import Images from '../../Constants/Images/Images';
import Eye from '../../../assets/svg/Eye';
import EyeClose from '../../../assets/svg/EyeClose';
import ProgressBar from '../../Components/ProgressBar/ProgressBarCustom';
import { useSelector } from 'react-redux';
import PostRequestApi from '../../apirequest/PostRequestApi'
import DeviceInfo from 'react-native-device-info';

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

export default function DataInsights({
  dailyInsights,
  weeklyInsights,
  dailySuggestion,
  dailySuggestionType,
  weeklySuggestion,
  weeklySuggestionType,
  timeLeft,
  isPermissionGiven,
  dispatch,
}) {
  const [isDailyInsights, setIsDailyInsights] = useState(
    getWeeklyInsightsAvailable() !== true ||
    !weeklyInsights ||
    !isPermissionGiven
  );
  const [showNotEnoughMoodsModal, setShowNotEnoughMoodsModal] = useState(false);
  const [ShowTarget, setShowTarget] = useState(false)
  const [MoodCountData, setMoodCountData] = useState(null)

  const openCloseShowNotEnoughMoodsModal = useCallback((flag) => {
    const fn = () => setShowNotEnoughMoodsModal(flag);
    return fn;
  }, []);

  useEffect(() => {
    console.log(`isDailyInsights`, isDailyInsights)
    getWeekMoodData()
  }, [])

  const UserData = useSelector((state) => state.First);

  const onPressWeeklyTab = () => {
    if (getWeeklyInsightsAvailable() === true) {
      if (weeklyInsights) {
        setIsDailyInsights(false);
      } else {
        setShowNotEnoughMoodsModal(true);
      }
    } else {
      /*
       Weekly api should be called between
       Friday @ 12pm until Saturday 6pm
       */
      dispatch?.(SetShowWeeklyInsightsModal(true));
    }
  };

  const getWeekMoodData = ()=>{
    const deviceId = DeviceInfo.getUniqueId();
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

  let insightsDetails = isDailyInsights
    ? dailyInsights
      ? dailyInsights
      : 'Not enough high quality data yet'
    : weeklyInsights
    ? weeklyInsights
    : 'Not enough high quality data yet';

  let suggestion = isDailyInsights
    ? dailySuggestion
      ? dailySuggestion
      : ''
    : weeklySuggestion
    ? weeklySuggestion
    : '';

  let suggestionType = isDailyInsights
    ? dailySuggestionType
      ? dailySuggestionType
      : ''
    : weeklySuggestionType
    ? weeklySuggestionType
    : '';

  let insightsArray = getInsightsArray(insightsDetails);

  if (!dailyInsights) {
    return null;
  }

  const ProgressDay=({label, color, label2})=>{
    return(
      <View
          style={styles.progressView}>
          <Text style={{fontSize: 16, position: 'absolute', left: -30}}>{label}</Text>
          <ProgressBar
            dot1={true}
            dot2={true}
            dot3={true}
            dot4={true}
            progress={((label2 > 3 ? 3 : label2)/3)*100}
            MoodCount={2}
            height={8}
            backgroundColor={color}
          />
          <Text style={{fontSize: 16, position: 'absolute', right: -40}}>
            {label2}/3
          </Text>
        </View>
    )
  }

  const getTotalMood = ()=>{
    let total = 0
    for(let i in MoodCountData){
      total = total + MoodCountData[i].mood_count
      console.log(`total`, total)
    }
    return total
  }

  // console.log(`MoodCountData`, MoodCountData)

  return (
    <>
      <View style={styles.tabContainer}>
        <View style={styles.tabHeader}>
          <TouchableOpacity
            style={
              isDailyInsights
                ? styles.activeTabHeader
                : styles.inactiveTabHeader
            }
            onPress={() => setIsDailyInsights(true)}>
            <Text
              style={
                isDailyInsights
                  ? styles.activeTabHeaderText
                  : styles.inactiveTabHeaderText
              }>
              TODAY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            // disabled={weeklyInsights ? false : true}
            style={[
              !isDailyInsights
                ? styles.activeTabHeader
                : styles.inactiveTabHeader,
              {marginLeft: horizontalScale(10)},
            ]}
            onPress={onPressWeeklyTab}>
            <Text
              style={
                !isDailyInsights
                  ? styles.activeTabHeaderText
                  : styles.inactiveTabHeaderText
              }>
              THIS WEEK
            </Text>
          </TouchableOpacity>
          {getWeeklyInsightsAvailable() !== true &&
            timeLeft !== -1 &&
            !isNaN(timeLeft) && (
              <AnimatedCircularProgress
                duration={900}
                arcSweepAngle={360}
                size={horizontalScale(28)}
                padding={1}
                width={2.5}
                fill={(timeLeft / 5) * 100}
                rotation={0}
                tintColor="#7265E3"
                lineCap={'round'}
                backgroundColor="#CFF9ED">
                {(fill) => (
                  <Text allowFontScaling={false} style={styles.progressText}>
                    {timeLeft}
                  </Text>
                )}
              </AnimatedCircularProgress>
            )}
        </View>
        <View style={styles.tabDetailsView}>
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
        </View>
         {!isDailyInsights &&  
        <TouchableOpacity activeOpacity={0.7} onPress={() => setShowTarget((e) => !e)}
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
        </TouchableOpacity>}

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
        {ShowTarget && <>
        <ProgressDay color={'#6FD691'} label={"M"} label2={MoodCountData[1].mood_count}  progress={MoodCountData[0].mood_count}/>
        <View style={styles.borderLine} />
        <ProgressDay color={'#B88DCC'} label={"T"} label2={MoodCountData[2].mood_count} progress={MoodCountData[1].mood_count}/>
        <View style={styles.borderLine} />
        <ProgressDay color={'#4C5F79'} label={"W"} label2={MoodCountData[3].mood_count} progress={MoodCountData[2].mood_count}/>
        <View style={styles.borderLine} />
        <ProgressDay color={'#7265E3'} label={"T"} label2={MoodCountData[4].mood_count} progress={MoodCountData[3].mood_count}/>
        <View style={styles.borderLine} />
        <ProgressDay color={'#7FE3F0'} label={"F"} label2={MoodCountData[5].mood_count} progress={MoodCountData[4].mood_count}/>
        {/* <View style={styles.borderLine} /> */}
        </>}

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
        textTwo="Try input your mood at least 3 times per week to unlock this"
        buttonOneText="Next Week!"
        onButtonOnePress={openCloseShowNotEnoughMoodsModal(false)}
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
    color: '#7265E3',
  } ,
  progressView:{
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 5,
    height: 40,

  },
  borderLine:{height: 1, width: '75%', backgroundColor: '#D6D6D6'},
  TargetView:{
    backgroundColor: '#7265E3',
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
