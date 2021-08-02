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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
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
import { IsAnonymous, UserDetail } from '../../../redux/actions/actions';
import AddNameModal from '../AddNameModal/AddNameModal';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import { GetStaffUserData } from '../../../apirequest/PostRequestApi';

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
  const [AnonymousStatus, setAnonymousStatus] = useState(true)
  const [ShowAddName, setShowAddName] = useState(false);
  const [name, setname] = useState('');

  const dispatch = useDispatch()
  const UserData = useSelector((state) => state.First);

  const Anonymous = async () => {
    setAnonymousStatus(!AnonymousStatus)
    await AsyncStorage.setItem('Anonymous', JSON.stringify(AnonymousStatus));
    dispatch(IsAnonymous(AnonymousStatus));
    if (!AnonymousStatus && UserData?.UserDetails?.full_name == null) {
      setShowAddName(true);
    }
  }

  // console.log(`ShowAddName`, AnonymousStatus)

  const cancelled = async () => {
    await AsyncStorage.setItem('Anonymous', JSON.stringify(true));
    setShowAddName(false);
    dispatch(IsAnonymous(true));
  };

  const VerifyDone = async () => {
    ProfileApiCallHere();
  };

  const ProfileApiCallHere = () => {
    const deviceId = DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    var raw = {
      device_id: deviceId,
      email: UserData.UserEmail,
      user_id: UserData.UserId,
      full_name: UserData?.UserDetails?.full_name
        ? UserData?.UserDetails?.full_name
        : name,
      pronouns: null,
      date_of_birth: null,
      gender: null,
    };

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: 'follow',
    };

    console.log(`raw`, raw);

    GetStaffUserData(
      {
        device_id: deviceId,
        email: UserData.UserEmail,
        user_id: UserData.UserId,
      }, dispatch)
      .then(async (result) => {
        // console.log(
        //   '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
        //   result?.userData
        // );
        if (result?.userData?.status !== 2) {
          return fetch('https://admin.moodflo.com/api/updateStaffProfile', requestOptions);
        } else {
          raw.email = '';
          raw.user_id = '';
          requestOptions.body = JSON.stringify(raw);
          return fetch('https://admin.moodflo.com/api/updateStaffProfile', requestOptions);
        }
      })
      .then(async (result) => {
        if (result) {
          await AsyncStorage.setItem('Anonymous', JSON.stringify(false));
          dispatch(IsAnonymous(false));
          setShowAddName(false);
          // console.log('profile updated', result), getProfileUserData();
          console.log(
            '✅ ✅ ✅ ✅ Success Update Staff Profile ✅ ✅ ✅ ✅',
            result
          );
          getProfileUserData();
        }
      })
      .catch((error) => console.log('❌ ❌ ❌ ❌ Error Update Staff Profile ❌ ❌ ❌ ❌', error));

  };

  const getProfileUserData = () => {
    console.log(`called called called called called called`);
    const deviceId = DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      device_id: deviceId,
      email: UserData.UserEmail,
      user_id: UserData.UserId,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://admin.moodflo.com/api/getStaffUserData', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('UserDetail', result.userData);
        dispatch(UserDetail(result.userData));
      })
      .catch((error) => console.log('error', error));
  };


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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableOpacity
          onPress={dismissModalHandler}
          style={[styles.dismissView, { backgroundColor: color }]} />
        <View onStartShouldSetResponder={Keyboard.dismiss} style={[styles.upperContainer]}>
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
          <TouchableOpacity onPress={() => Anonymous()} activeOpacity={0.7}>
            {UserData?.UserDetails?.full_name ? <Text style={styles.AnonymousButton}>
              Saved as {UserData.Anonymous ? "Anonymous" : `${UserData?.UserDetails?.full_name}`}
            </Text> :
              <Text style={styles.AnonymousButton}>
                Saved as Anonymous
            </Text>}
          </TouchableOpacity>
          <View style={styles.inputBox}>
            <TextInput returnKeyType={"done"} onSubmitEditing={()=>Keyboard.dismiss()} style={{ letterSpacing: 1, }} placeholder={`Quick note about why you're ${emotionText} today?`} multiline={true} />
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


      </KeyboardAvoidingView>
      <AddNameModal
        dataType={'weather'}
        modalVisible={ShowAddName}
        dismissModalHandler={() => cancelled()}
        verifyDone={() => VerifyDone()}
        value={name}
        onChangeText={setname}
      />
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
