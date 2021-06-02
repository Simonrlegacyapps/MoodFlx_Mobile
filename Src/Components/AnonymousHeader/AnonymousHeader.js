import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import Constants from '../../Constants';
import ToggleSwitch from 'toggle-switch-react-native';
import AnonymousIcon from '../../../assets/commonicons/AnonymousIcon';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import {useDispatch, useSelector} from 'react-redux';
import {IsAnonymous, UserDetail} from '../../redux/actions/actions';
import AsyncStorage from '@react-native-community/async-storage';
import {PHOTO_URL} from '../../Constants/constants';
import AddNameModal from '../Modals/AddNameModal/AddNameModal';
import DeviceInfo from 'react-native-device-info';
import {dynamicSize} from '../../Constants/sizeChoose';
import { GetStaffUserData } from '../../apirequest/PostRequestApi';

const AnonymousHeader = ({backGround}) => {
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
    const deviceId = DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      device_id: deviceId,
      email: UserData.UserEmail,
      user_id: UserData.UserId,
      full_name: UserData?.UserDetails?.full_name
        ? UserData?.UserDetails?.full_name
        : name,
      pronouns: null,
      date_of_birth: null,
      gender: null,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
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
          return null;
        }
      })
      .then(async (result) => {
        if(result){
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

  // console.log(`UserData.Anonymous`, UserData.Anonymous);

  const Go = async () => {
    await AsyncStorage.setItem('Anonymous', JSON.stringify(true));
    setShowAddName(false);
    dispatch(IsAnonymous(true));
  };
  useEffect(() => {
    Go();
    setTimeout(async () => {
      if (UserData?.UserDetails?.full_name === '') {
        await AsyncStorage.setItem('Anonymous', JSON.stringify(true));
        dispatch(IsAnonymous(true));
      }
    }, 1000);
  }, []);

  const cancelled = async () => {
    await AsyncStorage.setItem('Anonymous', JSON.stringify(true));
    setShowAddName(false);
    dispatch(IsAnonymous(true));
  };

  return backGround ? (
    <View
      style={{
        zIndex: -99999,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        shadowColor: 'black',
        shadowOffset: {height: 2},
        shadowOpacity: 0.3,
      }}>
      <AddNameModal
        dataType={'weather'}
        modalVisible={ShowAddName}
        dismissModalHandler={() => cancelled()}
        verifyDone={() => VerifyDone()}
        value={name}
        onChangeText={setname}
      />
      <View
        style={{
          height: 80,
          width: '90%',
          borderRadius: 20,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            marginHorizontal: 16,
          }}>
          <View
            style={{
              height: 40,
              width: 40,
              backgroundColor: '#4C5980',
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            {UserData?.UserDetails?.profile_image && !UserData.Anonymous ? (
              <Image
                style={{height: '100%', width: '100%', resizeMode: 'cover'}}
                source={{
                  uri: `${PHOTO_URL}${UserData?.UserDetails?.profile_image}`,
                }}
              />
            ) : !UserData?.UserDetails?.profile_image &&
              !UserData.Anonymous &&
              UserData?.UserDetails?.full_name ? (
              <Text
                style={{
                  color: 'white',
                  fontSize: dynamicSize(25),
                  fontFamily: RubikRegular,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                {UserData?.UserDetails?.full_name.substring(0, 1)}
              </Text>
            ) : (
              <AnonymousIcon />
            )}
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 5,
              fontFamily: RubikMedium,
            }}>
            {UserData.Anonymous
              ? 'Anonymous'
              : UserData?.UserDetails?.full_name
              ? UserData?.UserDetails?.full_name
              : 'Anonymous'}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '400',
              color: 'grey',
              fontFamily: RubikLight,
            }}>
            {UserData.Anonymous
              ? 'Your data is private'
              : 'Saving this mood as you'}
          </Text>
        </View>
        <View style={{marginHorizontal: 16}}>
          <ToggleSwitch
            disabled={true}
            isOn={UserData.Anonymous}
            onColor="#7FE3F0"
            labelStyle={{color: 'black', fontWeight: '900'}}
            size="large"
            onToggle={async (isOn) => {
              Go();
              // await AsyncStorage.setItem('Anonymous', JSON.stringify(isOn));
              // dispatch(IsAnonymous(isOn));
              // console.log(`Full name`, UserData?.UserDetails?.full_name);
              // console.log(`UserData.Anonymous === false`, UserData.Anonymous);
              // if (isOn === false && !UserData?.UserDetails?.full_name) {
              //   setShowAddName(true);
              // }
            }}
          />
        </View>
      </View>
    </View>
  ) : (
    <View
      style={{
        zIndex: -999999,
        height: 80,
        width: '90%',
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
      <View
        style={{
          marginHorizontal: 16,
        }}>
        <View
          style={{
            height: 40,
            width: 40,
            backgroundColor: '#4C5980',
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
          {UserData?.UserDetails?.profile_image && !UserData.Anonymous ? (
            <Image
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}
              source={{
                uri: `${PHOTO_URL}${UserData?.UserDetails?.profile_image}`,
              }}
            />
          ) : !UserData?.UserDetails?.profile_image &&
            !UserData.Anonymous &&
            UserData?.UserDetails?.full_name ? (
            <Text
              style={{
                color: 'white',
                fontSize: dynamicSize(25),
                fontFamily: RubikRegular,
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              {UserData?.UserDetails?.full_name.substring(0, 1)}
            </Text>
          ) : (
            <AnonymousIcon />
          )}
        </View>
      </View>
      <View style={{flex: 1}}>
        <Text style={{fontSize: 16, fontWeight: '500', marginBottom: 5}}>
          {UserData.Anonymous
            ? 'Anonymous'
            : UserData?.UserDetails?.full_name
            ? UserData?.UserDetails?.full_name
            : 'Anonymous'}
        </Text>
        <Text style={{fontSize: 13, fontWeight: '400', color: 'grey'}}>
          {UserData.Anonymous
            ? 'Your data is private'
            : 'Saving this mood as you'}
        </Text>
      </View>
      <View style={{marginHorizontal: 16}}>
        <ToggleSwitch
          isOn={UserData.Anonymous}
          onColor="#7FE3F0"
          labelStyle={{color: 'black', fontWeight: '900'}}
          size="large"
          onToggle={async (isOn) => {
            await AsyncStorage.setItem('Anonymous', JSON.stringify(isOn));
            dispatch(IsAnonymous(isOn));
            console.log(
              `UserData.Anonymous === false`,
              UserData?.UserDetails?.full_name,
            );
            if (isOn === false && !UserData?.UserDetails?.full_name) {
              setShowAddName(true);
            }
          }}
        />
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

export default AnonymousHeader;

// console.log('changed to : ', isOn), setAnonymous(isOn);
//             dispatch(IsAnonymous(isOn));
//             if (!isOn && !UserData?.UserDetails?.full_name) {
//               setShowAddName(true);
//             } else {
//               dispatch(IsAnonymous(true));
//               await AsyncStorage.setItem('Anonymous', JSON.stringify(true));
//             }
