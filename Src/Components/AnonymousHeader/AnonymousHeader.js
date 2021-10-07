import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import Constants from '../../Constants';
// import ToggleSwitch from 'toggle-switch-react-native';
import AnonymousIcon from '../../../assets/commonicons/AnonymousIcon';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { IsAnonymous, UserDetail } from '../../redux/actions/actions';
import AsyncStorage from '@react-native-community/async-storage';
import { getApiBaseUrl, getPhotoUrl } from '../../Constants/constants';
import AddNameModal from '../Modals/AddNameModal/AddNameModal';
import { dynamicSize, getFontSize, horizontalScale } from '../../Constants/sizeChoose';
import { GetStaffUserData } from '../../apirequest/PostRequestApi';
import { FloCoinIcon } from '../../../assets/svg/floCoinIcon';
import { getFloCoins, getMyDeviceId, getPrevFloCoins } from '../../services/commonService';
import CustomSwitch from '../CustomSwitch/CustomSwitch';
import AnimatedNumber from '../AnimatedNumber/AnimatedNumber';

const AnonymousHeader = ({ backGround, isShowPrevFloCoins }) => {
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  const [Anonymous, setAnonymous] = useState(false);
  const [ShowAddName, setShowAddName] = useState(false);
  const [name, setname] = useState('');
  // console.log(`UserData.Anonymous`, UserData?.UserDetails);

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
      }, dispatch)
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
            result
          );
          getProfileUserData();
        }
      })
      .catch((error) => console.log('❌ ❌ ❌ ❌ Error Update Staff Profile ❌ ❌ ❌ ❌', error));

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

    fetch(`${getApiBaseUrl()}getStaffUserData`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('UserDetail', result.userData);
        dispatch(UserDetail(result.userData));
      })
      .catch((error) => console.log('error', error));
  };

  // console.log(`UserData.Anonymous`, UserData.Anonymous);

  const Go = async () => {
    await AsyncStorage.setItem('Anonymous', JSON.stringify(true));
    setShowAddName(false);
    dispatch(IsAnonymous(true));
  };
  useEffect(() => {
    Go();
    const timeoutId = setTimeout(async () => {
      if (UserData?.UserDetails?.full_name === '') {
        await AsyncStorage.setItem('Anonymous', JSON.stringify(true));
        dispatch(IsAnonymous(true));
      }
      clearTimeout(timeoutId);
    }, 1000);
  }, []);

  const cancelled = async () => {
    await AsyncStorage.setItem('Anonymous', JSON.stringify(true));
    setShowAddName(false);
    dispatch(IsAnonymous(true));
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.floIconView}>
          <FloCoinIcon />
        </View>
        <View>
          <AnimatedNumber
            includeComma
            animateToNumber={isShowPrevFloCoins ? getPrevFloCoins() : UserData.floCoins}
            fontStyle={styles.floCoinsTextOne}
          />
          <Text style={styles.floCoinsTextTwo}>Flo Coins</Text>
        </View>
        <View style={styles.verifcalBarView} />
        <View
          style={{
            marginRight: horizontalScale(14),
          }}>
          <View style={styles.imageContainer}>
            {UserData?.UserDetails?.profile_image && !UserData.Anonymous ? (
              <Image
                style={styles.profileImage}
                source={{
                  uri: `${getPhotoUrl()}${UserData?.UserDetails?.profile_image}`,
                }}
              />
            ) : !UserData?.UserDetails?.profile_image &&
              !UserData.Anonymous &&
              UserData?.UserDetails?.full_name ? (
              <Text
                style={styles.fullNameText}>
                {UserData?.UserDetails?.full_name.substring(0, 1)}
              </Text>
            ) : (
              <AnonymousIcon height={horizontalScale(20)} width={horizontalScale(18)}/>
            )}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text allowFontScaling={false} 
            style={styles.fullNameTextTwo}>
            {UserData.Anonymous
              ? 'Anonymous'
              : UserData?.UserDetails?.full_name
                ? UserData?.UserDetails?.full_name
                : 'Anonymous'}
          </Text>
          <Text allowFontScaling={false} 
            style={styles.detailsText}>
            {UserData.Anonymous
              ? 'Your data is private'
              : 'Saving as you'}
          </Text>
        </View>
        <View style={{ marginRight:10 }}>
          <CustomSwitch
            disabled={backGround ? true : false}
            isOn={UserData.Anonymous}
            onColor="#7FE3F0"
            labelStyle={{ color: 'black', fontWeight: '900' }}
            size="mediumOne"
            onToggle={async (isOn) => {
              console.log('background ====', backGround, isOn);
              if (backGround) {
                Go();
              } else {
                await AsyncStorage.setItem('Anonymous', JSON.stringify(isOn));
                dispatch(IsAnonymous(isOn));
                console.log(
                  `UserData.Anonymous === false`,
                  isOn,
                  UserData?.UserDetails?.full_name,
                );
                if (isOn === false && !UserData?.UserDetails?.full_name) {
                  setShowAddName(true);
                }
              }
            }}
          />
        </View>
      </View>
      <AddNameModal
        dataType={'weather'}
        modalVisible={ShowAddName}
        dismissModalHandler={() => cancelled()}
        verifyDone={() => VerifyDone()}
        value={name}
        onChangeText={setname}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: -99999,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  subContainer: {
    // height: horizontalScale(65),
    width: '93%',
    borderRadius: 20,
    paddingVertical: horizontalScale(15),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  floIconView: {
    marginLeft: horizontalScale(14),
    marginRight: horizontalScale(10)
  },
  floCoinsTextOne: {
    fontSize: Platform.OS === 'ios' ? getFontSize(14) : getFontSize(16),
    fontWeight: '500',
    // marginBottom: 5,
    fontFamily: RubikMedium,
  },
  floCoinsTextTwo: {
    marginTop: horizontalScale(3),
    fontSize: Platform.OS === 'ios' ? getFontSize(12) : getFontSize(14),
    fontWeight: '400',
    color: 'grey',
    fontFamily: RubikLight,
  },
  verifcalBarView: {
    height: '80%',
    width: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: horizontalScale(14),
  },
  imageContainer: {
    height: horizontalScale(30),
    width: horizontalScale(30),
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
    fontSize: Platform.OS === 'ios' ? getFontSize(23) : getFontSize(25),
    fontFamily: RubikRegular,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  fullNameTextTwo: {
    fontSize: Platform.OS === 'ios' ? getFontSize(14) : getFontSize(16),
    fontWeight: '500',
    marginBottom: 5,
    fontFamily: RubikMedium,
  },
  detailsText: {
    fontSize: Platform.OS === 'ios' ? getFontSize(11) : getFontSize(13),
    fontWeight: '400',
    color: 'grey',
    fontFamily: RubikLight,
    // backgroundColor:'blue'
  },
});

export default AnonymousHeader;

// console.log('changed to : ', isOn), setAnonymous(isOn);
//             dispatch(IsAnonymous(isOn));
//             if (!isOn && !UserData?.UserDetails?.full_name) {
//               setShowAddName(true);
//             } else {
//               dispatch(IsAnonymous(true));
//               await AsyncStorage.setItem('Anonymous', JSON.stringify(true));
//             }
