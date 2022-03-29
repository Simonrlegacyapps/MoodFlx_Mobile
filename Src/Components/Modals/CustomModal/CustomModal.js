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
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import {
  getFontSize,
  horizontalScale,
} from '../../../Constants/sizeChoose';

const {width} = Dimensions.get('window');
const CustomModal = ({
  modalVisible,
  dismissModalHandler,
  modalText,
  onClickButtonOne,
  buttonOneText,
  onClickButtonTwo,
  buttonTwoText,
  buttonOneStyle,
  modalTextStyle,
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
      <View style={[styles.container,]}>
        <TouchableOpacity
          onPress={dismissModalHandler}
          style={[styles.dismissView, {backgroundColor: color}]}
        />
        <View style={[styles.upperContainer, ]}>
          <Text style={modalTextStyle}>{modalText ?? ''}</Text>
          {(!!onClickButtonOne || !!onClickButtonTwo) && (
            <View style={styles.buttonsContainer}>
              {!!onClickButtonOne && (
                <TouchableOpacity
                  style={[styles.buttonOne, buttonOneStyle]}
                  onPress={onClickButtonOne}>
                  <Text style={styles.buttonOneText}>
                    {buttonOneText ?? 'Yes'}
                  </Text>
                </TouchableOpacity>
              )}
              {!!onClickButtonTwo && (
                <TouchableOpacity
                  style={styles.buttonOne}
                  onPress={onClickButtonTwo}>
                  <Text style={styles.buttonOneText}>
                    {buttonTwoText ?? 'No'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

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
    paddingBottom: horizontalScale(30),
  },
  textOne: {
    marginTop: horizontalScale(30),
    fontFamily: RubikRegular,
    fontSize: fontSize,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: horizontalScale(30),
  },
  buttonOne: {
    // marginTop: horizontalScale(40),
    // marginBottom: horizontalScale(30),
    // width: '100%',
    flex: 0.4,
    backgroundColor: '#7265E3',
    paddingVertical: horizontalScale(8),
    borderRadius: horizontalScale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOneText: {
    fontFamily: RubikRegular,
    fontSize: getFontSize(18),
    color: '#FFFFFF',
  },
});

CustomModal.propTypes = {
  modalVisible: PropTypes.bool,
  dismissModalHandler: PropTypes.func,
  modalText: PropTypes.string,
  onClickButtonOne: PropTypes.func,
  buttonOneText: PropTypes.string,
  onClickButtonTwo: PropTypes.func,
  buttonTwoText: PropTypes.string,
  modalTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

CustomModal.defaultProps = {
  modalTextStyle: styles.textOne,
};

export default CustomModal;
