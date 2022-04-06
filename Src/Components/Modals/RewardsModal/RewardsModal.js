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
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Modal from 'react-native-modal';
import Constants from '../../../Constants';
import Colors from '../../../Constants/Colors/Colors';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import {
  dynamicSize,
  getFontSize,
  horizontalScale,
} from '../../../Constants/sizeChoose';

const {width} = Dimensions.get('window');
const RewardsModal = ({
  modalVisible,
  dismissModalHandler,
  title,
  description,
  rewardImageSource,
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
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: color,
            justifyContent: 'center',
            opacity: 0.2,
            position: 'absolute',
          }}></TouchableOpacity>
        <View style={styles.upperContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={dismissModalHandler}>
            <Image
              source={Constants.Images.PlusBlack}
              style={styles.cancelIcon}
            />
          </TouchableOpacity>
          {rewardImageSource && (
            <Image source={rewardImageSource} style={styles.topImage} />
          )}
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      </View>
    </Modal>
  );
};

RewardsModal.defaultProps = {
  buttonText: 'Save',
  title: 'Congrats!',
  description: `To claim your reward, contact Telstra rewards activations on xxx@telstrahealth.com or ${'\n'} 02 9481 1111`,
};

export default RewardsModal;
const styles = StyleSheet.create({
  container: {
    // height: 400,
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 30,
    // padding:20,
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  cancelButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WhiteColor,
    height: dynamicSize(27),
    width: dynamicSize(27),
    borderRadius: dynamicSize(16),
  },
  cancelIcon: {
    height: dynamicSize(18),
    width: dynamicSize(18),
    resizeMode: 'stretch',
  },
  upperContainer: {
    backgroundColor: 'white',
    borderRadius: 30,
    marginHorizontal: 10,
    paddingBottom: horizontalScale(50),
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: '100%',
    height: horizontalScale(209),
    resizeMode: 'stretch',
  },
  titleText: {
    fontWeight: Platform.OS === 'android' ? '700' : '500',
    fontSize: dynamicSize(26),
    textAlign: 'center',
    marginTop: 50,
    fontFamily: RubikRegular,
  },
  descriptionText: {
    fontWeight: '300',
    letterSpacing: 1,
    fontSize: Platform.OS === 'android' ? getFontSize(16) : dynamicSize(14),
    marginTop: 12,
    // marginLeft: 62,
    // marginRight: 62,
    textAlign: 'center',
    width: '60%',
    lineHeight: dynamicSize(26),
  },
});
