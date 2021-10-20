import React, { Component, useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import { getFontSize, horizontalScale, metrics } from '../../../Constants/sizeChoose';
import {
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import { NoInternetImage } from '../../../../assets/svg/NoInternetImage';

type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const { width } = Dimensions.get('window');
const NoInternetModal = ({
  modalVisible,
  dismissModalHandler,
  onButtonOnePress,
}: props) => {

  return (
    <Modal
      style={styles.modalView}
      testID={'modal'}
      onSwipeComplete={dismissModalHandler}
      useNativeDriverForBackdrop
      swipeDirection={['down']}
      isVisible={modalVisible}
      coverScreen
      customBackdrop={
        <TouchableWithoutFeedback>
          <View style={styles.customBackDrop} />
        </TouchableWithoutFeedback>
      }>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={dismissModalHandler}
          style={styles.fullScreenView} />
        <View style={styles.upperContainer}>
          <NoInternetImage
            width={metrics.screenWidth * 0.7}
            height={metrics.screenWidth * 0.7}
          />
          <Text style={styles.bigText}>Oops! No Internet</Text>
          <Text style={styles.smallText}>Try turning on your mobile data or connecting to a wifi</Text>
          <TouchableOpacity
            style={styles.buttonView}
            onPress={onButtonOnePress}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    // height: 400,
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    // borderRadius: 20,
    // padding:20,
  },
  fullScreenView: {
    height: '100%',
    width: '100%',
    backgroundColor: '#000000',
    // alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.2,
    position: 'absolute',
  },
  customBackDrop: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  upperContainer: {
    backgroundColor: 'white',
    // borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallText: {
    alignSelf: 'center',
    width: '70%',
    textAlign: 'center',
    fontFamily: RubikRegular,
    marginTop: horizontalScale(12),
    color: '#9C9EB9',
    fontSize: getFontSize(16),
  },
  bigText: {
    // width: '70%',
    marginTop: horizontalScale(20),
    fontFamily: RubikMedium,
    fontSize: getFontSize(23),
  },
  buttonView: {
    alignSelf: 'center',
    marginTop: horizontalScale(40),
    width: '70%',
    backgroundColor: '#7265E3',
    borderRadius: horizontalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: horizontalScale(23),
  },
  buttonText: {
    fontWeight: '500',
    fontSize: getFontSize(16),
    color: '#FFFFFF',
    paddingVertical: horizontalScale(16),
  },
});
export default NoInternetModal;
