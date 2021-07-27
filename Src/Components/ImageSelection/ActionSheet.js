import React, {Component, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {RubikRegular} from '../../Constants/fonts/Fonts';
import {dynamicSize} from '../../Constants/sizeChoose';
type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
  modalRef: Object,
};

const ActionSheet = ({
  modalVisible,
  dismissModalHandler,
  selectedValue,
  modalRef,
}: props) => {
  const [color, setcolor] = useState('black');
  const UserData = useSelector((state) => state.First);
  return (
    <Modal
      style={styles.modalView}
      testID={'modal'}
      onSwipeComplete={dismissModalHandler}
      useNativeDriverForBackdrop
      ref={modalRef}
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
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.2,
            position: 'absolute',
          }}></TouchableOpacity>
        <View style={styles.upperContainer}>
          {/* <View style={styles.upperHandel} /> */}
          <TouchableOpacity
            onPress={() => selectedValue(1)}
            activeOpacity={0.9}
            style={styles.buttonsStyle}>
            <Text style={styles.textStyles}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectedValue(2)}
            activeOpacity={0.9}
            style={[
              styles.buttonsStyle,
              {borderBottomWidth: UserData?.UserDetails?.profile_image ? 1 : 0},
            ]}>
            <Text style={styles.textStyles}>Photo Library</Text>
          </TouchableOpacity>
          {UserData?.UserDetails?.profile_image && (
            <TouchableOpacity
              onPress={() => selectedValue(3)}
              activeOpacity={0.9}
              style={[styles.buttonsStyle, {borderBottomWidth: 0}]}>
              <Text style={styles.textStyles}>Remove Photo</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* <TouchableOpacity
          onPress={dismissModalHandler}
          activeOpacity={0.9}
          style={styles.cancelButtonStyle}>
          <Text style={styles.textStyles}>Cancel</Text>
        </TouchableOpacity> */}
      </View>
    </Modal>
  );
};

export default ActionSheet;

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
  upperContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 10,
    minWidth: '75%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upperHandel: {
    height: 7,
    width: 70,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#ebebeb',
    marginTop: 10,
  },
  upperDetailStyle: {
    height: 60,
    width: '95%',
    alignSelf: 'center',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsStyle: {
    height: 55,
    // width: '100%',
    borderBottomWidth: 1,
    width: dynamicSize(200),
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderTopColor: '#ebebeb',
    // borderTopWidth: 1,
  },
  cancelButtonStyle: {
    height: 55,
    width: '95%',
    backgroundColor: 'red',
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyles: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
    fontFamily: RubikRegular,
  },
});
