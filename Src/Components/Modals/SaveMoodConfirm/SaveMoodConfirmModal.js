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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ImageBackground,
} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import {
  metrics,
  getFontSize,
  getLineHeight,
  dynamicSize,
  horizontalScale,
} from '../../../Constants/sizeChoose';
import Colors from '../../../Constants/Colors/Colors';
import {IsAnonymous, UserDetail} from '../../../redux/actions/actions';
import AddNameModal from '../AddNameModal/AddNameModal';
import AsyncStorage from '@react-native-community/async-storage';
import {GetStaffUserData} from '../../../apirequest/PostRequestApi';
import AnonymousIcon from '../../../../assets/commonicons/AnonymousIcon';
import {getApiBaseUrl, getPhotoUrl} from '../../../Constants/constants';
import Constants from '../../../Constants';
import {BitCoinIcon} from '../../../../assets/svg/bitCoin';
import { getMyDeviceId } from '../../../services/commonService';

type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const {width} = Dimensions.get('window');
const SaveMoodConfirmModal = ({
  modalVisible,
  dismissModalHandler,
  emotionText,
  onClickButtonOne,
  onClickButtonTwo,
  moodText,
  setText,
  notesInputRewardPoints,
}: props) => {
  const [color, setcolor] = useState('black');
  const [AnonymousStatus, setAnonymousStatus] = useState(true);
  const [ShowAddName, setShowAddName] = useState(false);
  const [name, setname] = useState('');
  const [note, setnote] = useState('');
  const [ShowPurple, setShowPurple] = useState(false);

  const dispatch = useDispatch();
  const UserData = useSelector((state) => state.First);

  let Anon = true;

  // console.log(`moodTexts`, moodText)

  const Anonymous = async () => {
    let flag = false;
    setAnonymousStatus((v) => {
      flag = !v;
      return flag;
    });
    // console.log(`AnonymousStatus`, AnonymousStatus)
    await AsyncStorage.setItem('Anonymous', JSON.stringify(flag));
    dispatch(IsAnonymous(flag));
    // console.log(`UserData Anonymous`, UserData.Anonymous)
    if (!flag && UserData?.UserDetails?.full_name == null) {
      setShowAddName(true);
    }
  };

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
    const deviceId = getMyDeviceId();
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
      },
      dispatch,
    )
      .then(async (result) => {
        // console.log(
        //   '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
        //   result?.userData
        // );
        if (result?.userData?.status !== 2) {
          return fetch(`${getApiBaseUrl()}updateStaffProfile`, requestOptions);
        } else {
          raw.email = '';
          raw.user_id = '';
          requestOptions.body = JSON.stringify(raw);
          return fetch(`${getApiBaseUrl()}updateStaffProfile`, requestOptions);
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
            result,
          );
          getProfileUserData();
        }
      })
      .catch((error) =>
        console.log(
          '❌ ❌ ❌ ❌ Error Update Staff Profile ❌ ❌ ❌ ❌',
          error,
        ),
      );
  };

  const getProfileUserData = () => {
    console.log(`called called called called called called`);
    const deviceId = getMyDeviceId();
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
    console.log('SaveMoodConfirmModal getStafUserData params --->', raw);
    fetch(`${getApiBaseUrl()}getStaffUserData`, requestOptions)
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
          <View style={{flex: 1, backgroundColor: '#000000'}} />
        </TouchableWithoutFeedback>
      }>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity
          onPress={dismissModalHandler}
          style={[styles.dismissView, {backgroundColor: color}]}
        />
        <View
          onStartShouldSetResponder={Keyboard.dismiss}
          style={[styles.upperContainer]}>
          <Text style={styles.textOne}>{moodText?.confirmation_text}</Text>
          {/* <Text style={styles.textTwo}>flx feels you</Text> */}
          {/* <Text style={styles.textTwo}>{moodText?.confirmation_text}</Text> */}
          <Text style={styles.textThree}>
            Feeling{' '}
            <Text style={styles.textThreeBold}>{emotionText}</Text>
          </Text>
          <TouchableOpacity disabled={true}
            onPress={() => {
              Anonymous();
            }}
            activeOpacity={0.7}>
            {UserData?.UserDetails?.full_name ? (
              <View style={styles.imageContainer}>
                <Text style={styles.AnonymousButton}>as </Text>
                {!UserData.Anonymous ? (
                  <View style={styles.imageView}>
                    {UserData?.UserDetails?.profile_image &&
                    !UserData.Anonymous ? (
                      <Image
                        style={styles.profileImage}
                        source={{
                          uri: `${getPhotoUrl()}${UserData?.UserDetails?.profile_image}`,
                        }}
                      />
                    ) : (
                      !UserData?.UserDetails?.profile_image &&
                      !UserData.Anonymous &&
                      UserData?.UserDetails?.full_name && (
                        <Text style={styles.fullNameText}>
                          {UserData?.UserDetails?.full_name.substring(0, 1)}
                        </Text>
                      )
                    )}
                  </View>
                ) : null}
                <Text style={styles.AnonymousButton}>
                  {UserData.Anonymous
                    ? 'Anonymous'
                    : ` ${UserData?.UserDetails?.full_name}`}
                </Text>
              </View>
            ) : (
              <Text style={styles.AnonymousButtonAnnon}>as Anonymous</Text>
            )}
          </TouchableOpacity>
          <View
            style={[
              styles.inputBox,
              {borderWidth: 0.6, borderColor: ShowPurple ? Colors.blueTextColor : 'white'},
            ]}>
            <TextInput
              value={note}
              onChangeText={(i) => {
                setnote(i), setShowPurple(false), setText(i);
              }}
              returnKeyType={'done'}
              onSubmitEditing={() => Keyboard.dismiss()}
              style={{letterSpacing: 1}}
              placeholder={`Quick note about why you're ${emotionText} today?`}
              multiline={true}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.buttonOne,
              {
                marginTop: horizontalScale(28),
                marginBottom: horizontalScale(10),
                paddingVertical: 15,
              },
            ]}
            onPress={() => {
              if (note != '') {
                onClickButtonOne();
              } else {
                setShowPurple(true);
              }
            }}>
            <Text style={styles.buttonOneText}>{'Add Note'}</Text>
            {emotionText != 'Slide finger' &&
              notesInputRewardPoints !== 0 &&
              !isNaN(notesInputRewardPoints) && (
              <ImageBackground
                style={styles.pupView}
                imageStyle={styles.Pup}
                source={require('../../../../assets/newImage/AddCoinsPopUp/popUp.png')}>
                <BitCoinIcon
                  style={styles.bitCoinIconView}
                  color={'#FFFFFF'}
                  w={getFontSize(11.5)}
                  h={getFontSize(11.5)}
                />
                <Text allowFontScaling={false} style={styles.coinText}>
                  + {`${notesInputRewardPoints}`} coins
                </Text>
              </ImageBackground>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonOne,
              {
                backgroundColor: 'white',
              },
            ]}
            onPress={onClickButtonTwo}>
            <Text style={styles.buttonTwoText}>{'Not this time'}</Text>
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
  dismissModalHandler: PropTypes.func,
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
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    borderWidth: 0.6,
    borderColor: Colors.greyFive,
    paddingHorizontal: 9,
    borderRadius: 5,
    overflow: 'hidden',
    paddingVertical: 5,
  },
  imageView: {
    height: horizontalScale(20),
    width: horizontalScale(20),
    backgroundColor: Colors.greyTwo,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  fullNameText: {
    color: 'white',
    // fontSize: Platform.OS === 'ios' ? getFontSize(13) : getFontSize(15),
    fontSize: getFontSize(13),
    fontFamily: RubikRegular,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textOne: {
    fontFamily: RubikRegular,
    fontSize: fontSize,
    textAlign: 'center',
    color: Colors.blackColorCode,
    paddingHorizontal: 10,
  },
  textTwo: {
    fontFamily: RubikRegular,
    fontSize: getFontSize(16),
    marginTop: 7,
    color: Colors.greyColorCode,
  },
  textThree: {
    fontFamily: RubikLight,
    fontSize: getFontSize(13),
    marginTop: 15,
    color: Colors.greyColorCode,
  },
  textThreeBold: {
    fontFamily: RubikMedium,
    color: Colors.greyColorCode,
  },
  buttonOne: {
    width: '50%',
    backgroundColor: Colors.blueTextColor,
    paddingVertical: horizontalScale(10),
    borderRadius: horizontalScale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOneText: {
    fontWeight: '500',
    fontFamily: RubikMedium,
    fontSize: getFontSize(15),
    color: '#FFFFFF',
  },
  buttonTwoText: {
    fontWeight: '500',
    fontFamily: RubikMedium,
    fontSize: getFontSize(15),
    color: Colors.greyColorCode,
  },
  purpleBackground: {
    position: 'absolute',
    backgroundColor: '#3F2E64',
    height: '100%',
    width: '100%',
    zIndex: -100,
    opacity: 0.5,
  },
  AnonymousButton: {
    color: Colors.greyFive,
    shadowColor: '#000',
    fontSize: getFontSize(15),
    fontFamily: RubikMedium,
  },
  AnonymousButtonAnnon:{
    fontFamily: RubikMedium,
    color: Colors.greyFive,
    borderWidth: 0.6,
    borderColor: Colors.greyFive,
    paddingHorizontal: 9,
    borderRadius: 5,
    overflow: 'hidden',
    paddingVertical: 5,
    marginVertical: 15,
    // paddingHorizontal: 18,
    shadowColor: '#000',
  },
  inputBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    backgroundColor: 'white',
    elevation: 1,
    minHeight: getFontSize(60),
    padding: 8,
    borderRadius: 15,
    width: '80%',
    paddingHorizontal: 15,
  },
  pupView: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    height: horizontalScale(45),
    width: horizontalScale(100),
    top: horizontalScale(-25),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  Pup: {
    height: horizontalScale(45),
    width: horizontalScale(100),
    resizeMode: 'stretch',
    tintColor: Colors.coinOrange,
  },
  bitCoinIconView: {
    top: horizontalScale(7),
    marginRight: horizontalScale(3),
  },
  coinText: {
    color: '#FFFFFF',
    ...Platform.select({
      android: {
        top: horizontalScale(6),
      },
      ios: {
        top: horizontalScale(5),
      },
      default: {
        // other platforms, web for example
        top: horizontalScale(6),
      },
    }),
    fontSize: getFontSize(11.5),
    fontFamily: RubikRegular,
  },
});
