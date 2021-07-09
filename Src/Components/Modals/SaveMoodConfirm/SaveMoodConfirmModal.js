import React, { Component, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import { metrics, getFontSize, getLineHeight, dynamicSize, horizontalScale } from '../../../Constants/sizeChoose';

type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const { width } = Dimensions.get('window');
const SaveMoodConfirmModal = ({
  modalVisible,
  dismissModalHandler,
  emotionText,
  onClickButtonOne,
  onClickButtonTwo
}: props) => {
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
          <View style={{ flex: 1, backgroundColor: '#000000' }} />
        </TouchableWithoutFeedback>
      }>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={dismissModalHandler}
          style={[styles.dismissView, { backgroundColor: color }]} />
        <View style={styles.upperContainer}>
          <Text
            style={styles.textOne}>
            Thank you!
          </Text>
          <Text
            style={styles.textTwo}>
            Flo feels you
          </Text>
          <Text
            style={styles.textThree}>
            Your input was: <Text style={styles.textThreeBold}>{emotionText}</Text>
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.AnonymousButton}>
              Saved as Anonymous
            </Text>
          </TouchableOpacity>
          <View style={styles.inputBox}>
            <TextInput style={{ letterSpacing: 1, }} placeholder={`Quick note about why you're ${emotionText} today?`} multiline={true} />
          </View>
          <TouchableOpacity style={[styles.buttonOne, {
            marginTop: horizontalScale(28),
            marginBottom: horizontalScale(10),
            paddingVertical: 15
          }]} onPress={onClickButtonOne}>
            <Text
              style={styles.buttonOneText}>
              {"Add Note"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonOne, {

            backgroundColor: "white"
          }]} onPress={onClickButtonOne}>
            <Text
              style={styles.buttonTwoText}>
              {"Not this time"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.purpleBackground} />


      </View>
    </Modal>
  );
};

SaveMoodConfirmModal.propTypes = {
  modalVisible: PropTypes.bool,
  dismissModalHandler: PropTypes.func
};

export default SaveMoodConfirmModal;
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
    paddingVertical: 20,
    width: '80%',
    // height: (metrics.screenWidth * 0.8) / 1.5,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  textOne: {
    fontFamily: RubikRegular,
    fontSize: fontSize,
  },
  textTwo: {
    fontFamily: RubikRegular,
    fontSize: fontSize,
    marginTop: 7,
  },
  textThree: {
    fontFamily: RubikLight,
    fontSize: getFontSize(13),
    marginTop: 15,
    color: "#9C9EB9"
  },
  textThreeBold: {
    fontFamily: RubikMedium,
    color: "#9C9EB9"
  },
  buttonOne: {
    width: '50%',
    backgroundColor: '#7265E3',
    paddingVertical: horizontalScale(10),
    borderRadius: horizontalScale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOneText: {
    fontFamily: RubikRegular,
    fontSize: getFontSize(15),
    color: '#FFFFFF'
  },
  buttonTwoText: {
    fontFamily: RubikRegular,
    fontSize: getFontSize(15),
    color: '#9C9EB9'
  },
  purpleBackground: { position: 'absolute', backgroundColor: "#3F2E64", height: '100%', width: '100%', zIndex: -100, opacity: 0.5 },
  AnonymousButton: {
    color: "#CBCBCB", paddingVertical: 4, borderWidth: 0.6, borderColor: "#cbcbcb", marginVertical: 15, paddingHorizontal: 18, shadowColor: "#000",
    borderRadius: 5,
    overflow: 'hidden'
  },
  inputBox: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    backgroundColor: 'white',
    elevation: 1,
    minHeight: getFontSize(60),
    padding: 8,
    borderRadius: 15,
    width: '80%',
    paddingHorizontal: 15

  }
});
