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
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import { getFontSize, horizontalScale } from '../../../Constants/sizeChoose';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
  RubikSemiBold,
} from '../../../Constants/fonts/Fonts';

type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const { width } = Dimensions.get('window');
const NotEnoughMoodsModal = ({
  modalVisible,
  dismissModalHandler,
  image,
  textOne,
  textTwo,
  buttonOneText,
  onButtonOnePress,
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
          <View style={styles.customBackDrop} />
        </TouchableWithoutFeedback>
      }>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={dismissModalHandler}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: color,
            // alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.2,
            position: 'absolute',
          }} />
        <View style={styles.upperContainer}>
          <Image source={image} style={styles.topImage} />
          <Text style={styles.bigText}>{textOne}</Text>
          <Text style={styles.smallText}>{textTwo}</Text>
          <TouchableOpacity
            style={styles.buttonView}
            onPress={onButtonOnePress}>
            <Text style={styles.buttonText}>{buttonOneText}</Text>
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
    borderRadius: 20,
    // padding:20,
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
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    width: '75%',
    overflow: 'hidden',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  topImage: {
    height: horizontalScale(80),
    width: horizontalScale(80),
    // margin: horizontalScale(15),
    marginTop: horizontalScale(41),
    marginBottom: horizontalScale(25),
    resizeMode: 'contain',
  },
  textStyles: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
    fontFamily: RubikRegular,
  },
  smallText: {
    fontFamily: RubikRegular,
    marginTop: horizontalScale(10),
    color: '#9C9EB9',
    fontSize: getFontSize(16),
  },
  bigText: {
    fontFamily: RubikMedium,
    fontSize: getFontSize(23),
  },
  buttonView: {
    alignSelf: 'center',
    marginTop: horizontalScale(24),
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
export default NotEnoughMoodsModal;
