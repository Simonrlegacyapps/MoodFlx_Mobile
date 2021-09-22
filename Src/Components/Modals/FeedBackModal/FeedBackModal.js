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
import {IsAnonymous, UserDetail} from '../../../redux/actions/actions';
import AddNameModal from '../AddNameModal/AddNameModal';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import {GetStaffUserData} from '../../../apirequest/PostRequestApi';
import AnonymousIcon from '../../../../assets/commonicons/AnonymousIcon';
import {getApiBaseUrl, PHOTO_URL} from '../../../Constants/constants';
import Constants from '../../../Constants';

type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const {width} = Dimensions.get('window');
const FeedBackModal = ({
  modalVisible,
  dismissModalHandler,
  emotionText,
  onClickButtonOne,
  onClickButtonTwo,
  moodText,
  text
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
          <Text style={styles.textOne}>We value your opinion!</Text>
          {/* <Text style={styles.textTwo}>Flo feels you</Text> */}
          {/* <Text style={styles.textTwo}>{moodText?.confirmation_text}</Text> */}
          {/* <Text style={styles.textThree}>
            Feeling{' '}
            <Text style={styles.textThreeBold}>{emotionText}</Text>
          </Text> */}
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
                          uri: `${PHOTO_URL}${UserData?.UserDetails?.profile_image}`,
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
              {borderWidth: 0.6, borderColor: ShowPurple ? '#7265E3' : 'white'},
            ]}>
            <TextInput
              value={note}
              onChangeText={(i) => {
                setnote(i), setShowPurple(false), text(i)
              }}
              returnKeyType={'done'}
              onSubmitEditing={() => Keyboard.dismiss()}
              numberOfLines={4}
              style={styles.feedBackInput}
              placeholder={`Please let us know how we can improve... \n\nThis is completely anonymous`}
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
                setnote("")
              } else {
                setShowPurple(true);
              }
            }}>
            <Text style={styles.buttonOneText}>{'Save'}</Text>
            {/* {emotionText != 'Slide finger' &&<View style={styles.pupView}>
            <Image resizeMode={"contain"} source={require("../../../../assets/newImage/AddCoinsPopUp/popUp.png")} style={styles.Pup}/>
            <Text allowFontScaling={false} style={{position:'absolute', top:26, color:'white', fontSize:13, fontFamily:RubikRegular}}>+{UserData?.UserMoodCount >= 3 ? "4" : "3"} coins</Text>
            </View>} */}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonOne,
              {
                backgroundColor: 'white',
              },
            ]}
            onPress={dismissModalHandler}>
            <Text style={styles.buttonTwoText}>{'No feedback for now'}</Text>
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

FeedBackModal.propTypes = {
  modalVisible: PropTypes.bool,
  dismissModalHandler: PropTypes.func,
};

export default FeedBackModal;
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
    borderWidth: 0.5,
    marginVertical: 15,
    borderWidth: 0.6,
    borderColor: '#cbcbcb',
    paddingHorizontal: 9,
    borderRadius: 5,
    overflow: 'hidden',
    paddingVertical: 5,
  },
  imageView: {
    height: horizontalScale(20),
    width: horizontalScale(20),
    backgroundColor: '#4C5980',
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
    fontSize: Platform.OS === 'ios' ? getFontSize(13) : getFontSize(15),
    fontFamily: RubikRegular,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textOne: {
    fontFamily: RubikRegular,
    fontSize: fontSize,
  },
  textTwo: {
    fontFamily: RubikRegular,
    fontSize: getFontSize(16),
    marginTop: 7,
    color:"#9C9EB9"
  },
  textThree: {
    fontFamily: RubikLight,
    fontSize: getFontSize(13),
    marginTop: 15,
    color: '#9C9EB9',
  },
  textThreeBold: {
    fontFamily: RubikMedium,
    color: '#9C9EB9',
  },
  buttonOne: {
    minWidth: '66%',
    backgroundColor: '#7265E3',
    paddingVertical: horizontalScale(10),
    borderRadius: horizontalScale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOneText: {
    fontFamily: RubikRegular,
    fontSize: getFontSize(15),
    color: '#FFFFFF',
  },
  buttonTwoText: {
    fontFamily: RubikMedium,
    fontSize: getFontSize(14),
    color: '#9C9EB9',
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
    color: '#CBCBCB',
    shadowColor: '#000',
    fontFamily:RubikMedium
  },
  AnonymousButtonAnnon:{
    fontFamily:RubikMedium,
    color: '#CBCBCB',
    paddingVertical: 4,
    borderWidth: 0.6,
    borderColor: '#cbcbcb',
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
  pupView:{  position:'absolute', alignSelf:'center', height:90, bottom:1, alignItems:'center', justifyContent:'center'},
  Pup:{
    tintColor:'black',
    height:90,
    width:90, resizeMode:'contain',
    // position:'absolute',
    // bottom:10
  },
  feedBackInput: {
    letterSpacing: 1,
    textAlignVertical: 'top',
    ...Platform.select({
      ios: {
        height: getFontSize(70),
      },
      android: {
        maxHeight: getFontSize(100),
      },
    }),
  },
});
