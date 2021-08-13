import React, {useState} from 'react';
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
import {RubikBold, RubikExtraBold, RubikMedium} from '../../Constants/fonts/Fonts';
const {width: SIZE, height: HEIGHT} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { SetShowWeeklyInsightsModal } from '../../redux/actions/actions';
import { getWeeklyInsightsAvailable } from '../../Constants/constants';
import { getMoodsArray } from '../../services/commonService';

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
      moods.forEach(e => {
        let mArray = r.match(new RegExp(e, 'i'));
        if (Array.isArray(mArray) && mArray.length > 0) {
          // console.log('mArray ----', mArray);
          if (index === 0) {
            let x = l?.slice?.(index, idx)?.join?.(' ');
            x !== undefined && typeof x === 'string' && insights.push({text: x.trim(), color: ''});
            typeof r === 'string' && insights.push({text: r, color: '#7265e3'});
          } else {
            let x = l?.slice?.(index + 1, idx)?.join?.(' ');
            x !== undefined && typeof x === 'string' && insights.push({text: x.trim(), color: ''});
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
  const [isDailyInsights, setIsDailyInsights] = useState(true);

  const onPressWeeklyTab = () => {
    if (getWeeklyInsightsAvailable() === true) {
      setIsDailyInsights(false);
    } else {
      /*
       Weekly api should be called between
       Friday @ 12pm until Saturday 6pm
       */
      dispatch?.(SetShowWeeklyInsightsModal(true));
    }
  };

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

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={
            isDailyInsights ? styles.activeTabHeader : styles.inactiveTabHeader
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
          style={[(!isDailyInsights
              ? styles.activeTabHeader
              : styles.inactiveTabHeader),
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
        {getWeeklyInsightsAvailable() !== true && timeLeft !== -1 && !isNaN(timeLeft) && (
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
            {(fill) => <Text allowFontScaling={false} style={styles.progressText}>{timeLeft}</Text>}
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
              <Text style={{color: e?.color ? e.color : 'rgb(32,32,32)'}}>{`${e?.text ?? ''} `}</Text>
            );
          })}
        </Text>
      </View>
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
    shadowOffset: { width: 0, height: 2 },
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
  },
});