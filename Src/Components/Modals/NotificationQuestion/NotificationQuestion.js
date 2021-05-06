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
  RubikBlack,
  RubikBold,
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import {dynamicSize} from '../../../Constants/sizeChoose';
import AnonymousIcon from '../../../../assets/commonicons/AnonymousIcon';

type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const {width} = Dimensions.get('window');
const NotificationQuestion = ({
  modalVisible,
  dismissModalHandler,
  verifyDone,
}: props) => {
  const [color, setcolor] = useState('black');
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();

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
            // alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.2,
            position: 'absolute',
          }}></TouchableOpacity>
        <View style={styles.upperContainer}>
          <Text
            style={{
              fontWeight: '500',
              fontSize: 16,
              color: '#9C9EB9',
              textAlign: 'center',
              marginTop: 20,
            }}>
            New Question
          </Text>
          <Text
            numberOfLines={4}
            style={{
              fontWeight: '500',
              // letterSpacing: 1,
              fontFamily: RubikBold,

              fontSize: dynamicSize(20),
              marginTop: 12,
              alignSelf: 'center',
              // marginLeft: 62,
              // marginRight: 62,
              textAlign: 'center',
              width: dynamicSize(240),
              lineHeight: dynamicSize(26),
            }}>
            You are not anonymous for this mood input. Save this mood with your
            name?
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity
              onPress={() => {
                verifyDone('Yes');
              }}
              style={{alignItems: 'center'}}>
              <View
                style={{
                  marginTop: 48,
                  height: dynamicSize(53),
                  width: dynamicSize(130),
                  backgroundColor: '#E4DFFF',
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
                }}>
                <Text
                  style={{fontWeight: '500', fontSize: 16, color: '#7265E3'}}>
                  Answer
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                verifyDone('No');
              }}
              style={{alignItems: 'center'}}>
              <View
                style={{
                  marginTop: 48,
                  height: dynamicSize(53),
                  width: dynamicSize(130),
                  backgroundColor: '#7265E3',
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
                }}>
                <Text
                  style={{fontWeight: '500', fontSize: 16, color: '#FFFFFF'}}>
                  Later
                </Text>
              </View>
            </TouchableOpacity>
          </View>
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

NotificationQuestion.propTypes = {
  modalVisible: PropTypes.bool,
  dismissModalHandler: PropTypes.func,
};

export default NotificationQuestion;
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
  upperContainer: {
    backgroundColor: 'white',
    borderRadius: 30,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    width: '90%',
    overflow: 'hidden',
    justifyContent: 'center',
    // alignItems: 'center',
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
    width: '100%',
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
  smallText: {
    fontFamily: RubikLight,
    paddingHorizontal: 12,
    paddingBottom: 10,
    //   paddingVertical:10
  },
  bigText: {
    fontFamily: RubikMedium,
    fontSize: width / 20,
    paddingHorizontal: 12,
    marginRight: 12,
    // width:'80%'
  },
});
