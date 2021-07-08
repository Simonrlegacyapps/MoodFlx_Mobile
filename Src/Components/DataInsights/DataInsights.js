import React, {useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {getFontSize, horizontalScale} from '../../Constants/sizeChoose';
import {RubikBold, RubikMedium} from '../../Constants/fonts/Fonts';
const {width: SIZE, height: HEIGHT} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function DataInsights({
  dailyInsights,
  weeklyInsights,
  dailySuggestion,
  dailySuggestionType,
  weeklySuggestion,
  weeklySuggestionType,
}) {
  const [isDailyInsights, setIsDailyInsights] = useState(true);

  let insightsDetails = isDailyInsights
    ? dailyInsights
      ? dailyInsights
      : 'No insights available'
    : weeklyInsights
    ? weeklyInsights
    : 'No weekly insights available';

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
          style={[(!isDailyInsights
            ? styles.activeTabHeader
              : styles.inactiveTabHeader),
            {marginLeft: horizontalScale(10)},
          ]}
          onPress={() => setIsDailyInsights(false)}>
          <Text
            style={
              !isDailyInsights
                ? styles.activeTabHeaderText
                : styles.inactiveTabHeaderText
            }>
            THIS WEEK
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabDetailsView}>
        <Text style={styles.tabDetailsText}>{insightsDetails}</Text>
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
    fontFamily: RubikBold,
    color: 'rgb(60,60,60)',
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
    paddingHorizontal: horizontalScale(10),
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
    fontFamily: RubikBold,
    color: 'rgb(60,60,60)',
  },
  suggestionTextBlue: {
    color: 'rgb(25,165,177)',
  },
});