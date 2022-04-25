import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { getFontScale } from 'react-native/Libraries/Utilities/PixelRatio';
import BigRing from '../../../assets/svg/BigRing';
import Rings from '../../../assets/svg/rings';
import Colors from '../../Constants/Colors/Colors';
import { RubikLight, RubikMedium, RubikRegular } from '../../Constants/fonts/Fonts';
import { dynamicSize, getFontSize, horizontalScale } from '../../Constants/sizeChoose';

const BoldHeader = ({label}) => {
  return (
    <View style={styles.boldHeaderWrapper}>
      <Text style={styles.boldHeaderText}>{label}</Text>
    </View>
  );
};

const SimpleText = ({label, text, mt}) => {
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flexDirection: 'row',
        marginTop: mt ? mt : 0,
        alignItems: 'center',
        marginBottom: horizontalScale(14),
      }}>
      <Text
        style={styles.simpleTextLabel}>
        {label}
      </Text>
      <Text
        style={styles.simpleTextCoins}>
        <Rings w={14} h={14} />
        {text}
      </Text>
    </View>
  );
};

const HowTo = ({setIsLevelsHide, islevelsHide}) => {
  const offset = useRef(0);
  const isHidden = useRef(false);

  useEffect(() => {
    if (!islevelsHide) {
      isHidden.current = false;
    }
  }, [islevelsHide]);

  const onScroll = useCallback(
    event => {
      var currentOffset = event.nativeEvent.contentOffset.y;
      var isDown = currentOffset > offset.current;
      offset.current = currentOffset;
      if (!islevelsHide && !isHidden.current && isDown && currentOffset > 0) {
        isHidden.current = true;
        setIsLevelsHide(true);
      } else if (!isDown && currentOffset <= 0 && islevelsHide) {
        isHidden.current = false;
        setIsLevelsHide(false);
      }
    },
    [setIsLevelsHide],
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      onScroll={onScroll}
      style={styles.scrollViewStyle}>
      <View style={styles.flxCoinImageWrapper}>
        <BigRing />
      </View>
      <View style={styles.topHeaderWrapper}>
        <Text style={styles.topHeaderText}>Earn flx Coins</Text>
        <Text style={styles.topHeaderDescription}>
          Advance your Mood Status, unlock more rewards and cash in your flx Coins!
        </Text>
        <View>
          <BoldHeader label={'Mood Inputs'} />
          <SimpleText label={'Per mood'} text={' 3 coins'} />
          <View style={styles.lineSeperator} />
          <SimpleText label={'3+ moods/day'} text={' 1 bonus coin'} mt={12} />
          <Text style={styles.smallHeaderText}>Recommended</Text>
          <Text style={styles.hoursIntervalHeaderText}>6-HOUR INTERVALS</Text>
          <View style={styles.intervalWrapper}>
            <View style={styles.intervalTextWrapper}>
              <Text style={styles.hours}>12:00 AM - 6:00 AM</Text>
              <Text style={styles.hours}>6:00 AM - 12:00 PM</Text>
              <Text style={styles.hours}>12:00 PM - 6:00 PM</Text>
              <Text style={styles.hours}>6:00 PM - 12:00 AM</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.intervalDetailsWrapper}>
              <Text style={[styles.text, { marginBottom: horizontalScale(10), letterSpacing: 0.7 }]}>2 moods per interval</Text>
              <Text style={[styles.text, {textAlign: 'center', letterSpacing: 0.7}]}>earn coins if there is a 2 hour gap between each mood</Text>
            </View>
          </View>
        </View>
        <View>
          <BoldHeader label={'Mood Journaling'} />
          <SimpleText label={'Per note'} text={' 3 coins'} />
          <View style={styles.lineSeperator} />
          <SimpleText label={'3+ notes/day'} text={' 1 bonus coin'} mt={12} />
          <Text style={styles.smallHeaderText}>Recommended</Text>
          <Text style={styles.hoursIntervalHeaderText}>6-HOUR INTERVALS</Text>
          <View style={styles.intervalWrapper}>
            <View style={styles.intervalTextWrapper}>
              <Text style={styles.hours}>12:00 AM - 6:00 AM</Text>
              <Text style={styles.hours}>6:00 AM - 12:00 PM</Text>
              <Text style={styles.hours}>12:00 PM - 6:00 PM</Text>
              <Text style={styles.hours}>6:00 PM - 12:00 AM</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.intervalDetailsWrapper}>
              <Text style={[styles.text, {  marginBottom: horizontalScale(10), letterSpacing: 0.7 }]}>2 notes per interval</Text>
              <Text style={[styles.text, { textAlign: 'center', letterSpacing: 0.7 }]}>earn coins if there is a 2 hour gap between each note</Text>
            </View>
          </View>
        </View>
        <View>
          <BoldHeader label={'Mood Status'} />
          <View style={styles.levelRowView}>
            <Text style={styles.smallHeaderText}>Level</Text>
            <Text style={styles.smallHeaderText}>flx coins</Text>
          </View>
          <SimpleText label={'Mood Activator'} text={' 0 - 100'} />
          <SimpleText label={'Mood Navigator'} text={' 100 - 1,000'} />
          <SimpleText label={'Mood Fit'} text={' 1,000 - 5,000'} />
          <SimpleText label={'Mood Powerhouse'} text={' 5,000 - 10,000'} />
          <SimpleText label={'Mood Unleashed'} text={' 10,000 - 20,000'} />

        </View>
      </View>

      <View style={{ marginBottom: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewStyle: {
    height: '100%',
    width: '100%',
    paddingBottom: 100,
    backgroundColor: 'white',
  },
  flxCoinImageWrapper: {
    alignItems: 'center',
    marginTop: horizontalScale(30),
  },
  topHeaderWrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: horizontalScale(12),
  },
  topHeaderText: {
    textAlign: 'center',
    fontFamily: RubikMedium,
    marginVertical: 10,
    fontSize: 21,
    color: Colors.blackColorCode,
  },
  topHeaderDescription: {
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: RubikLight,
    marginVertical: horizontalScale(10),
    fontSize: getFontSize(14),
    width: '80%',
    color: Colors.greyTwo,
  },
  lineSeperator: {
    height: 0.6,
    width: '100%',
    backgroundColor: '#ebebeb'
  },
  smallHeaderText: {
    fontSize: getFontSize(12),
    fontFamily: RubikLight,
    color: Colors.greyColorCode,
  },
  hoursIntervalHeaderText: {
    fontFamily: RubikRegular,
    fontSize: getFontSize(12),
    color: Colors.blueTextColor,
    marginVertical: horizontalScale(10)
  },
  intervalWrapper: {
    flexDirection: 'row',
    width: '100%',
  },
  intervalTextWrapper: {
    width: '50%',
  },
  intervalDetailsWrapper: {
    width: '50%',
    padding: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hours: {
    color: Colors.greyTwo,
    fontSize: 13,
    margin: 8,
    marginLeft: 0
  },
  verticalDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    height: '100%',
    // marginLeft: horizontalScale(37),
    // marginRight: horizontalScale(18),
  },
  text: {
    fontSize: 12,
    color: Colors.greyTwo,
  },
  levelRowView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: horizontalScale(10),
  },
  boldHeaderWrapper: {
    marginTop: horizontalScale(50),
    marginBottom: horizontalScale(30),
  },
  boldHeaderText: {
    fontFamily: RubikMedium,
    color: Colors.blackColorCode,
    fontSize: getFontSize(18),
  },
  simpleTextLabel: {
    flex: 1,
    marginTop: 5,
    fontFamily: RubikRegular,
    color: Colors.blackColorCode,
    fontSize: getFontSize(15),
  },
  simpleTextCoins: {
    marginTop: 5,
    color: '#FB8D09',
    fontFamily: RubikRegular,
    fontSize: getFontSize(15),
  },
})

export default HowTo;
