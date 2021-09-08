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
import MedalPopUp from '../../../../assets/svg/medalPopUp';
import {getFontSize, horizontalScale} from '../../../Constants/sizeChoose';
import {RubikLight, RubikMedium} from '../../../Constants/fonts/Fonts';
import {getLvlName} from '../../../services/commonService';
type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const {width} = Dimensions.get('window');
const LvlUpModal = ({
  bigText,
  modalVisible,
  dismissModalHandler,
  buttonText,
  verifyDone,
  smallText,
}: props) => {
  const [color, setcolor] = useState('black');
  if (getLvlName() === null) {
    return null;
  }
  const {title, type} = getLvlName();

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
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: color,
            justifyContent: 'center',
            opacity: 0.2,
            position: 'absolute',
          }}
        />
        <View style={styles.upperContainer}>
          <View style={styles.medalImageView}>
            <MedalPopUp type={type} />
          </View>
          {title && <Text style={styles.titleText}>{title}</Text>}
          {bigText && typeof bigText === 'string' && (
            <Text style={styles.bigText}>{bigText}</Text>
          )}
          {smallText && typeof smallText === 'string' && (
            <Text style={styles.smallText}>{smallText}</Text>
          )}
          <TouchableOpacity style={styles.buttonOne} onPress={verifyDone}>
            <Text style={styles.buttonOneText}>
              {buttonText ? buttonText : "Let's Go!"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export default LvlUpModal;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  upperContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    width: '75%',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingTop: 10,
  },
  medalImageView: {
    alignItems: 'center',
    marginTop: horizontalScale(30),
  },
  titleText: {
    fontFamily: RubikMedium,
    fontSize: getFontSize(30),
    color: '#7265E3',
    marginTop: horizontalScale(30),
    textAlign: 'center',
  },
  bigText: {
    fontFamily: RubikMedium,
    fontSize: getFontSize(22),
    marginTop: horizontalScale(7),
    color: '#2D3142',
    textAlign: 'center',
  },
  smallText: {
    alignSelf: 'center',
    width: '80%',
    fontSize: getFontSize(16),
    textAlign: 'center',
    fontFamily: RubikLight,
    color: '#9C9EB9',
    marginTop: horizontalScale(19),
  },
  buttonOne: {
    alignSelf: 'center',
    marginTop: horizontalScale(20),
    marginBottom: horizontalScale(40),
    paddingVertical: horizontalScale(12),
    paddingHorizontal: horizontalScale(18),
    backgroundColor: '#7265E3',
    borderRadius: horizontalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOneText: {
    fontWeight: '500',
    fontSize: getFontSize(16),
    color: '#FFFFFF',
  },
});
