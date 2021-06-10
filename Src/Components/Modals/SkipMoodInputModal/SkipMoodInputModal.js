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
import PropTypes from 'prop-types';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import {metrics, getFontSize, getLineHeight, horizontalScale} from '../../../Constants/sizeChoose';

const {width} = Dimensions.get('window');
const SkipMoodInputModal = ({
  modalVisible,
  dismissModalHandler,
  onClickButtonOne,
  onClickButtonTwo,
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
          <View style={{flex: 1, backgroundColor: '#000000'}} />
        </TouchableWithoutFeedback>
      }>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={dismissModalHandler}
          style={[styles.dismissView, {backgroundColor: color}]} />
        <View style={styles.upperContainer}>
          <Text
            style={styles.textOne}>
            Skip adding your mood this time?
          </Text>

          <TouchableOpacity style={[styles.buttonOne, { 
              marginTop: horizontalScale(40),
              marginBottom: horizontalScale(10),
              }]} onPress={onClickButtonOne}>
          <Text
            style={styles.buttonOneText}>
            {"Yes, I'm done"}
          </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonOne, { 
              marginBottom: horizontalScale(30),
              }]} onPress={onClickButtonTwo}>
          <Text
            style={styles.buttonOneText}>
            {"No, let's do this!"}
          </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

SkipMoodInputModal.propTypes = {
    modalVisible: PropTypes.bool,
    dismissModalHandler: PropTypes.func,
    onClickButtonOne: PropTypes.func,
    buttonOneText: PropTypes.string,
};

export default SkipMoodInputModal;
const fontSize = getFontSize(22);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 30,
    // padding:20,
  },
  dismissView: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    opacity: 0.2,
    position: 'absolute',
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  upperContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: horizontalScale(15),
    width: '80%',
    // height: (metrics.screenWidth * 0.8) / 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textOne: {
    marginTop: horizontalScale(30),
    fontFamily: RubikRegular,
    fontSize: fontSize,
    // textAlign: 'center'
  },
  buttonOne: {
    width: '100%',
    backgroundColor: '#7265E3',
    paddingVertical: horizontalScale(10),
    borderRadius: horizontalScale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOneText: {
    fontFamily: RubikRegular,
    fontSize: getFontSize(18),
    color: '#FFFFFF'
  },
});
