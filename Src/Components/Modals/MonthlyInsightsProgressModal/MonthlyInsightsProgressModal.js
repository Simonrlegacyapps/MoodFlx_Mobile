import moment from 'moment';
import React, {Component, useState} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import { MonthlyInsightsProgressImage } from '../../../../assets/svg/weeklyInsightsProgress';
import { getMonthlyInsightsDaysLeft, getMonthlyInsightsStartEndTime } from '../../../Constants/constants';
import {RubikMedium, RubikRegular} from '../../../Constants/fonts/Fonts';
import { getFontSize, horizontalScale } from '../../../Constants/sizeChoose';

const getProgressWidth = () => {
  const day = moment().date();
  const progress = getMonthlyInsightsDaysLeft();
  const startTime = getMonthlyInsightsStartEndTime().startTime.date();
  return ((300 * (startTime - progress)) / startTime);
};

const {width} = Dimensions.get('window');
const MonthlyInsightsProgress = ({
  modalVisible,
  dismissModalHandler,
  verifyDone,
}) => {
  const [color, setcolor] = useState('black');

  return (
    <Modal
      style={styles.modalView}
      testID={'modal'}
      onSwipeComplete={dismissModalHandler}
      useNativeDriverForBackdrop
      swipeDirection={['down']}
      isVisible={modalVisible}
      onSwipeMove={() => {
        setcolor('transparent');
      }}
      customBackdrop={
        <TouchableWithoutFeedback onPress={dismissModalHandler}>
          <View style={styles.customBackgropView} />
        </TouchableWithoutFeedback>
      }>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={dismissModalHandler}
          style={[styles.subContainer, {backgroundColor: color}]}
        />
        <View style={styles.upperContainer}>
          <Text style={styles.bigText}>
            {`Monthly insight will be ready on ${getMonthlyInsightsStartEndTime().startTime.format('Do MMM YYYY')}`}
          </Text>
          <View style={styles.imageContainer}>
            <MonthlyInsightsProgressImage
            // width={220}
            // height={220}
            // stroke={getBulbColorFromLux(lux)}
            timeLeft={getProgressWidth()}
            />
          </View>
          <TouchableOpacity style={styles.buttonView} onPress={verifyDone}>
            <Text style={styles.buttonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export default MonthlyInsightsProgress;
const styles = StyleSheet.create({
  container: {
    // height: 400,
    
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,
    // padding:20,
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  customBackgropView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  subContainer: {
    height: '100%',
    width: '100%',
    // alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.2,
    position: 'absolute',
  },
  upperContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical:10,
    paddingHorizontal:5,
    // marginHorizontal: 10,
    // paddingHorizontal: 20,
    width: '75%',
    overflow: 'hidden',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  bigText: {
    fontFamily: RubikMedium,
    fontSize: width / 20,
    paddingHorizontal: 12,
    marginRight: 12,
    color: '#2D3142',
    // width:'80%'
    textAlign: 'center',
    marginTop: horizontalScale(20),
  },
  imageContainer: {
    marginVertical: horizontalScale(20),
    alignSelf: 'center',
  },
  buttonView: {
    // marginTop: horizontalScale(24),
    // height: horizontalScale(56),
    // width: 250,
    backgroundColor: '#7265E3',
    borderRadius: horizontalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: horizontalScale(20),
    marginBottom: horizontalScale(20),
  },
  buttonText: {
    padding: horizontalScale(8),
    fontWeight: '500',
    fontSize: getFontSize(16),
    color: '#FFFFFF',
  },
});
