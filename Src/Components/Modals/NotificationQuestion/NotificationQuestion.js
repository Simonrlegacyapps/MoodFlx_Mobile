import React, {Component, useEffect, useState} from 'react';
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
import Constants from '../../../Constants';
import Colors from '../../../Constants/Colors/Colors';

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
  question,
  navigation,
}: props) => {
  const [color, setcolor] = useState('black');
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(`navigation`, navigation.dangerouslyGetParent);
  }, []);

  const questionMain = question?.data?.question;
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
          <TouchableOpacity
            onPress={dismissModalHandler}
            style={{
              // flex: 1,
              position: 'absolute',
              alignSelf: 'flex-end',
              justifyContent: 'flex-start',
              top: 0,
              right: 5,
              marginBottom: 8,
            }}>
            <Image
              source={Constants.Images.PlusBlack}
              style={{
                height: dynamicSize(30),
                width: dynamicSize(30),
                marginTop: 15,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontWeight: '500',
              fontSize: 16,
              color: Colors.greyColorCode,
              textAlign: 'center',
              marginTop: 20,
            }}>
            Team Pulse
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
            {questionMain}
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
                  // width: dynamicSize(130),
                  backgroundColor: '#E4DFFF',
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
                }}>
                <Text
                  style={{
                    fontWeight: '500',
                    marginHorizontal: 20,
                    fontSize: 16,
                    color: Colors.blueTextColor,
                  }}>
                  Answer with mood
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
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
