import React, {Component, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import {metrics, getFontSize, getLineHeight} from '../../../Constants/sizeChoose';

type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const {width} = Dimensions.get('window');
const SaveMoodConfirmModal = ({
  modalVisible,
  dismissModalHandler
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
            Thank you!
          </Text>
          <Text
            style={styles.textTwo}>
            Flo feels you
          </Text>
        </View>
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
    width: '80%',
    height: (metrics.screenWidth * 0.8) / 1.5,
    justifyContent: 'center',
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
});
