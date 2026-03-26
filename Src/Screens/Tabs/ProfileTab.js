import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AppState,
  StatusBar,
  Pressable,
  Alert,
  ImageBackground,
  PermissionsAndroid,
  NativeModules
} from 'react-native';
import ProfilePlaceholder from '../../../assets/profileicons/ProfilePlaceholder';
import AppInstalledChecker from '../../nativeModules/react-native-check-app-install/appInstallChecker';
import AddButton from '../../Components/buttons/AddButton';
import RNShare from 'react-native-share';
import Constants from '../../Constants';
import { dynamicSize, getFontSize, horizontalScale } from '../../Constants/sizeChoose';
import PrivacyIcon from '../../../assets/profileicons/PrivacyIcon';
import PickImageIcon from '../../../assets/profileicons/PickImageIcon';
import FaqIcon from '../../../assets/profileicons/FaqIcon';
import TermsIcon from '../../../assets/profileicons/TermsIcon';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from '../../Components/ImageSelection/ActionSheet';
import { useDispatch, useSelector } from 'react-redux';
import AddAnswer from '../../Components/AddAnswer/AddAnswer';
import { NotificationPerm, SetShowIsDevServerModal, UserDetail } from '../../redux/actions/actions';
import PostRequestApi, { GetStaffUserData } from '../../apirequest/PostRequestApi';
import { AppPermissions } from '../../services/appPermissions';
import { useFocusEffect } from '@react-navigation/native';
import { getSleepDataAfterPermissionIOS } from '../Home/SleepData/sleepDataService';
import BackIcon from '../../../assets/svg/backIcon';
import { getMyDeviceId, onUnlinkUpdate, openHealthApp } from '../../services/commonService';
import PlayButton from '../../../assets/svg/playButton';
import {
  BASE_URL_PRODUCTION_API,
  FAQ_URL,
  getApiBaseUrl,
  getPhotoUrl,
  PRIVACY_POLICY_URL,
  SUPPORT_EMAIL,
  TERMS_OF_USE_URL,
} from '../../Constants/constants';
import Colors from '../../Constants/Colors/Colors';
import { BitCoinIcon } from '../../../assets/svg/bitCoin';
import { RubikMedium, RubikRegular } from '../../Constants/fonts/Fonts';
import Clipboard from '@react-native-clipboard/clipboard';
import getStore from '../../redux';
import { VitalityIcon } from '../../../assets/svg/VitalityIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERMISSIONS } from 'react-native-permissions';
import { logger } from '../../..';
import ContactUsIcon from '../../../assets/profileicons/ContactUsIcon';
import * as Email from '../../../Src/share_module/index';
import { SafeAreaView } from 'react-native-safe-area-context';
const listData = [
  { name: 'Name', value: 'Anonymous' },
  { name: 'Gender', value: 'Anonymous' },
  { name: 'Birthday', value: 'Anonymous' },
  { name: 'Pronoun', value: 'Anonymous' },
];

const FAQ_DETAILS = {
  id: "1",
  name: 'FAQ',
  icon: <FaqIcon />,
  link: FAQ_URL,
}

const CONTACT_US = {
  id: "4",
  name: 'Contact Us',
  icon: <ContactUsIcon />,
  link: `mailto:${SUPPORT_EMAIL}`,
}

const bottomList = [
  // {
  //   id: "2",
  //   name: 'Terms & Conditions',
  //   icon: <TermsIcon />,
  //   link: TERMS_OF_USE_URL,
  // },
  {
    id: "3",
    name: 'Privacy Policy',
    icon: <PrivacyIcon />,
    link: PRIVACY_POLICY_URL,
  },
];

const ProfileTab = ({ navigation }) => {

  const [openActionSheet, setOpenActionSheet] = useState(false);
  // const [value, onChangeText] = React.useState('');
  const UserData = useSelector((state) => state.First);

  const [name, setname] = useState('Anonymous');
  const [gender, setgender] = useState('');
  const [Birthday, setBirthday] = useState('');
  const [Pronoun, setPronoun] = useState('');
  const [date, setdate] = useState('');
  const [edit, setedit] = useState(false);
  const [ImageLoading, setImageLoading] = useState(false);
  const [ComingGenderPronoun, setComingGenderPronoun] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [Loading, setLoading] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [isHowMoodFloWorksPtsGiven, setIsHowMoodFloWorksPtsGiven] = useState(true);
  // const [prevVitalityMemberId, setPrevVitalityMemberId] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);
  // const [userData, setUserData] = useState(null);

  const dispatch = useDispatch();

  const addAnswer = (item, index) => {
    setedit(!edit);
  };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const updateName = useCallback((text) => {
    // setname('Tester');
    setname(text);
  }, []);

  const getProfileUserData = () => {
    // console.log('called called called called called called');
    const userData = getStore?.()?.getState?.()?.First;
    const deviceId = getMyDeviceId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const message = "from ProfileTab, inside getProfileUserData() method ==>";
    GetStaffUserData(message,
      {
        device_id: deviceId,
        email: userData.UserEmail && userData.UserId ? userData.UserEmail : null,
        user_id: userData.UserEmail && userData.UserId ? userData.UserId : null,
      },
      dispatch,
    )
      .then(async (result) => {
        logger(
          '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
          result?.userData,
        );
        setIsHowMoodFloWorksPtsGiven(result?.specialPointFlag === 1);
        if (result?.userData?.status !== 2) {
          // console.log('UserDetaills', result.userData);
          dispatch(UserDetail(result.userData));
          setImageLoading(false);
        }
      })
      .catch((error) =>
        logger('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error),
      );
    setImageLoading(false);
  };

  const onRefresh = () => {
    setgender('');
    setPronoun('');

    console.log('refreshed here');
    setRefreshing(true);
    getProfileUserData();
    wait(1000).then(() => setRefreshing(false));
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('ProfileTab focused');
      getProfileUserData();
      AppPermissions.checkAppPermissions(dispatch);

      return () => {
        // screen is out of focus
        console.log('ProfileTab blured');
      };
    }, [dispatch, UserData.UserEmail, UserData.UserId]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      subscription?.remove?.();
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      AppPermissions.checkAppPermissions(dispatch);
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  const requestNotificationPerm = useCallback(async () => {
    AppPermissions.requestNotificationPermission()
      .then((result) => {
        console.log('notificationPermission isGiven', result);
        if (result === false) {
          AppPermissions.gotoSettingsForNotificationPermission();
        } else {
          dispatch(NotificationPerm(true));
        }
      })
      .catch((error) => {
        console.log(
          'requestNotificationPerm notification request error',
          error,
        );
      });
  }, [dispatch]);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Cookie',
      '__cfduid=dcc52dc3ea7bfd9948604c5b092925bc81618561732',
    );

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${getApiBaseUrl()}getGenderPronoun`, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log('Gender Pronoun Data', await result),
          await setComingGenderPronoun(result);
      })
      .catch((error) => console.log('error', error));
  }, []);

  const imagePostFunction = (imageData) => {
    setImageLoading(true);
    const deviceId = getMyDeviceId();
    const imageResponse = imageData
      ? {
        ...imageData,
      }
      : null;
    console.log('imageResponse', imageResponse);
    let formData = new FormData();
    formData.append('user_id', UserData.UserId ?? '');
    formData.append('email', UserData.UserEmail ?? '');
    formData.append('device_id', deviceId);
    formData.append(
      'image',
      imageResponse
        ? {
          name:
            Platform.OS === 'android'
              ? imageResponse.uri
              : imageResponse.uri.replace('file://', ''),
          type: imageResponse.type,
          uri:
            Platform.OS === 'android'
              ? imageResponse.uri
              : imageResponse.uri.replace('file://', ''),
        }
        : '',
    );
    console.warn('this data', JSON.stringify(formData));
    fetch(`${getApiBaseUrl()}updateStaffProfileImage`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(async (res) => {
        // console.log('res', res);
        console.warn('res of image succed', res);
        getProfileUserData();

        // setCommentText('');
        // console.log("add live well success", JSON.stringify(data, undefined, 2));
      })
      .catch((error) => {
        console.log('error come', error);
        setImageLoading(false);
      });
  };

  const imageSelectType = (select_type) => {
    if (select_type === 1) {
      openCameraFunction();
    } else if (select_type === 2) {
      openLibraryFunction();
    } else if (select_type === 3) {
      imagePostFunction(null);
      setOpenActionSheet(false);
    }
  };

  const openCameraFunction = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      // compressImageQuality:0.6
    }).then((i) => {
      console.log('i', i);
      let source = {
        uri: i.path,
        type: i.mime,
        name: Platform.OS === 'android' ? i.path : i.path,
      };
      imagePostFunction(source);
      setOpenActionSheet(false);
      // console.log('source', source);
    });
  };

  const openLibraryFunction = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
      // compressImageQuality:0.6
    }).then((i) => {

      const allowedExtensions = ['jpeg', 'png', 'jpg'];
      const fileExtension = i.filename.split('.').pop().toLowerCase();

      if (fileExtension == "gif") {

        let source = {
          uri: i.path,
          type: i.mime,
          name: Platform.OS === 'android' ? i.path : i.path,
        };
        const images = [source];

        imagePostFunction(source);
        setOpenActionSheet(false);
        console.log('images', images);

      } else if (allowedExtensions.includes(fileExtension)) {

        ImagePicker.openCropper({
          path: i.path,
          width: 300,
          height: 400
        }).then(image => {

          let source = {
            uri: image.path,
            type: image.mime,
            name: Platform.OS === 'android' ? image.path : image.path,
          };
          const images = [source];

          imagePostFunction(source);
          setOpenActionSheet(false);
          console.log('images', images);

        });

      } else {
        alert("Invalid file type selected! Please choose an image in one of the following formats: JPG, JPEG, PNG, or GIF.");
        setOpenActionSheet(false);
      }
    });
  };

  const ProfileApiCallHere = async ({ _name, _gender, _pronoun }) => {
    const name_ = _name ? _name : name;
    const deviceId = getMyDeviceId();
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      device_id: deviceId,
      email: UserData.UserEmail,
      user_id: UserData.UserId,
      full_name:
        name_ != 'Anonymous'
          ? name_
          : name_ != '' && UserData?.UserDetails?.full_name
            ? UserData?.UserDetails?.full_name
            : name_,
      pronouns: _pronoun
        ? _pronoun.name
        : UserData?.UserDetails?.pronouns
          ? UserData?.UserDetails?.pronouns
          : '',
      date_of_birth: UserData?.UserDetails?.date_of_bitrh
        ? UserData?.UserDetails?.date_of_bitrh
        : Birthday,
      gender: _gender
        ? _gender.id
        : UserData?.UserDetails?.gender
          ? UserData?.UserDetails?.gender
          : '',
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    console.log('raw', raw);
    setLoading(true);

    await fetch(`${getApiBaseUrl()}updateStaffProfile`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(
          '✅ ✅ ✅ ✅ Success Update Staff Profile ✅ ✅ ✅ ✅',
          result,
        );
        getProfileUserData();
      })
      .catch((error) => console.log('error', error));
    setLoading(false);
  };

  const checkGenderName = (value) => {
    // console.log(`value`, value, ComingGenderPronoun.gender);

    const Id = ComingGenderPronoun.gender.find(({ id }) => {
      // console.log(`name`, id, value);
      return id == value;
    });
    // console.log(`Id`, Id);
    return Id.name;
  };

  const onSetGender = useCallback(
    (value) => {
      setgender(value);
      ProfileApiCallHere({ _gender: value });
    },
    [setgender, ProfileApiCallHere],
  );

  const onSetPronoun = useCallback(
    (value) => {
      setPronoun(value);
      ProfileApiCallHere({ _pronoun: value });
    },
    [setPronoun, ProfileApiCallHere],
  );

  const requestSleepPerm = useCallback(async () => {
    if (Platform.OS === 'android') {
      AppPermissions.requestActivityPermission(dispatch);
    } else {
      getSleepDataAfterPermissionIOS({
        askPermission: true,
        dispatch: dispatch,
      });
    }
  }, [dispatch]);

  const onUnlink = useCallback(async () => {
    setDisconnecting(true);
    let unlinkReason = {
      id: 2,
      fileName: "ProfileTab",
      email: getStore?.()?.getState?.()?.First?.UserEmail,
      user_id: getStore?.()?.getState?.()?.First?.UserId,
      vitality_member_id: UserData?.UserDetails?.vitality_member_id,
    }
    PostRequestApi('unlinkToCompany', {
      email: getStore?.()?.getState?.()?.First?.UserEmail,
      user_id: getStore?.()?.getState?.()?.First?.UserId,
      unlink_reason: JSON.stringify(unlinkReason)
    })
      .then(async resp => {
        const isDone = await onUnlinkUpdate(dispatch);
        console.log('unlinkToCompanyDone isDone =====', isDone);
        setDisconnecting(false);
      })
      .catch(err => {
        console.log('unlink api failed error: ', err);
        setDisconnecting(false);
      });
  }, [dispatch]);

  const onLink = useCallback(async () => {
    let url = '';
    url = 'https://v2020.page.link/mentalact';
    Linking.openURL(url).catch(error => {
      console.log('error redirecting to link url');
    });
    // if (Platform.OS === 'ios') {
    //   // url = 'https://apps.apple.com/au/app/aia-vitality-australia/id1584775072';
    //   url = 'https://v2020.page.link/mentalact';
    //   Linking.openURL(url).catch(error => {
    //     console.log('error redirecting to link url');
    //   });
    // } else if (Platform.OS === 'android') {
    //   RNShare.isPackageInstalled('com.aia.gr.rn.au.v2020.vitality')
    //     .then(( response ) => {
    //       console.log('response :: ', response);
    //     if(response.isInstalled){
    //       url = 'https://play.google.com/store/apps/details?id=com.aia.gr.rn.au.v2020.vitality';
    //       Linking.openURL(url).catch(error => {
    //         console.log('error redirecting to link url');
    //       });
    //     }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //       // { error }
    //   });
    // }
  }, []);

  const onOpenHealthApp = useCallback(openHealthApp, []);

  // console.log(
  //   "name != '' && UserData?.UserDetails?.full_name",
  //   name != 'Anonymous'
  //     ? name
  //     : name != '' && UserData?.UserDetails?.full_name
  //     ? UserData?.UserDetails?.full_name
  //     : name,
  // );

  async function requestPermission0() {
    try {
      const permissions = [
        PERMISSIONS.ANDROID.CAMERA,
        Platform.Version >= 30
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ].filter(Boolean);
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const allPermissionsGranted = Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED,
      );
      if (allPermissionsGranted) {
        logger('Camera and gallery permissions granted');
        return true;
      } else {
        logger('Camera and/or gallery permissions denied');
        return false;
      }
    } catch (err) {
      logger('Error requesting permissions:', err);
      return false;
    }
  }

  async function requestPermission0() {
    try {
      const permissions = [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, // For Android 10-12
      ];

      if (Platform.Version >= 31) {
        permissions.push(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES); // Android 13+
      }

      console.log('Requesting permissions:', permissions);

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      console.log('Permissions granted:', granted);

      const allPermissionsGranted = Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );

      if (allPermissionsGranted) {
        console.log('✅ Camera and gallery permissions granted');
        return true;
      } else {
        console.log('❌ Camera and/or gallery permissions denied');
        return false;
      }
    } catch (err) {
      console.error('🚨 Error requesting permissions:', err);
      return false;
    }
  }

  async function requestPermission() {
    try {
      const permissions = [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, // For Android 10-12
      ];

      if (Platform.Version >= 31) {
        permissions.push(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES); // Android 13+
      }

      console.log('Requesting permissions:', permissions);

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      console.log('Permissions granted:', granted);

      const allPermissionsGranted = Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );

      if (allPermissionsGranted) {
        console.log('✅ Camera and gallery permissions granted');
        return true;
      } else {
        console.log('❌ Camera and/or gallery permissions denied');
        return false;
      }
    } catch (err) {
      console.error('🚨 Error requesting permissions:', err);
      return false;
    }
  }


  const handleEmail = () => {
    Email.openComposer({
      to: 'example@example.com',
      subject: 'Hello',
      body: 'How are you?',
    })
      .catch((err) => {
        Alert.alert('Error', 'Unable to open the email client.');
        logger("OpenComposer Err", err)
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.profileImageStyle}>
            <View style={styles.imageViewStyle}>
              {UserData?.UserDetails?.profile_image ? (
                <View>
                  <Image
                    style={styles.profileImage}
                    source={{
                      uri: `${getPhotoUrl()}${UserData?.UserDetails?.profile_image}`,
                    }}
                  />
                </View>
              ) : (
                <ProfilePlaceholder
                  width={dynamicSize(160)}
                  height={dynamicSize(160)}
                />
              )}
              <View style={styles.pickupIconStyle}>
                <TouchableOpacity
                  onPress={async () => {
                    const isPermission = await requestPermission();
                    if (Platform.OS === "android") {
                      if (isPermission) {
                        setOpenActionSheet(true);
                      }
                    } else {
                      setOpenActionSheet(true);
                    }
                  }}
                >
                  <PickImageIcon />
                </TouchableOpacity>
              </View>
              {ImageLoading && (
                <View style={styles.imageLoader}>
                  <ActivityIndicator color='#9889F9' size="large" />
                </View>
              )}
            </View>
            <View style={styles.headerContainerStyle}>
              <View
                style={[styles.borderStyle, { marginRight: dynamicSize(17) }]}
              />
              <Text
                style={styles.personalDetails}
                onPress={() => Alert.alert('Personal Details', JSON.stringify({
                  device_id: getMyDeviceId(),
                  email: UserData.UserEmail,
                  user_id: UserData.UserId,
                  division: UserData.UserDivision,
                  server: getApiBaseUrl() === BASE_URL_PRODUCTION_API ? "ADMIN" : "DEV"
                }), [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  {
                    text: "Copy", onPress: () => Clipboard.setString(JSON.stringify({
                      device_id: getMyDeviceId(),
                      email: UserData.UserEmail,
                      user_id: UserData.UserId,
                      division: UserData.UserDivision,
                      server: getApiBaseUrl() === BASE_URL_PRODUCTION_API ? "ADMIN" : "DEV"
                    }))
                  }
                ])}
              // onLongPress={() => dispatch(SetShowIsDevServerModal(true))}
              >PERSONAL DETAILS</Text>
              <View
                style={[styles.borderStyle, { marginLeft: dynamicSize(11) }]}
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', marginTop: dynamicSize(30), left: 20, top: 10, padding: 5 }}>
            <BackIcon />
          </TouchableOpacity>
          <View style={styles.flatlistContainer}>
            {/* <FlatList data={listData} renderItem={renderList} /> */}

            <AddAnswer
              checkedit={UserData?.UserDetails?.full_name ? true : false}
              ProfileApiCallHere={ProfileApiCallHere}
              label={'Name'}
              navigation={navigation}
              value={
                name != 'Anonymous'
                  ? name
                  : name != '' && UserData?.UserDetails?.full_name
                    ? UserData?.UserDetails?.full_name
                    : name
              }
              onChangeText={updateName}
            />
            <AddAnswer
              checkedit={UserData?.UserDetails?.gender ? true : false}
              ProfileApiCallHere={(value) => ProfileApiCallHere(value)}
              data={ComingGenderPronoun ? ComingGenderPronoun?.gender : null}
              label={'Gender'}
              navigation={navigation}
              value={
                gender
                  ? gender.name
                  : UserData?.UserDetails?.gender && ComingGenderPronoun
                    ? checkGenderName(UserData?.UserDetails?.gender)
                    : gender
              }
              onChangeText={onSetGender}
              popUp
            />
            {/* <AddAnswer
            label={'Birthday'}
            value={Birthday}
            navigation={navigation}
            onChangeText={setBirthday}
            date={setdate}
            datePicker
            popUp
          /> */}
            <AddAnswer
              checkedit={UserData?.UserDetails?.pronouns ? true : false}
              ProfileApiCallHere={ProfileApiCallHere}
              navigation={navigation}
              data={ComingGenderPronoun ? ComingGenderPronoun?.pronoun : null}
              label={'Pronouns'}
              // value={Pronoun}
              value={
                Pronoun
                  ? Pronoun.name
                  : UserData?.UserDetails?.pronouns
                    ? UserData?.UserDetails?.pronouns
                    : Pronoun.name
              }
              gender={gender}
              onChangeText={onSetPronoun}
              popUp
            />
          </View>
          <View style={styles.headerContainerStyle}>
            <View
              style={[
                styles.borderStyle,
                { marginRight: dynamicSize(17), width: dynamicSize(134) },
              ]}
            />
            <Text style={styles.personalDetails}>SYNC YOUR DATA</Text>
            <View
              style={[
                styles.borderStyle,
                { marginLeft: dynamicSize(11), width: dynamicSize(134) },
              ]}
            />
          </View>
          {Platform.OS === 'ios' && (
            <View style={styles.permissionTileContainer}>
              <Text style={styles.permissionText}>Notifications</Text>
              {UserData.NotificationPermission ? (
                <Text style={styles.allowed}>Enabled</Text>
              ) : (
                <TouchableOpacity onPress={requestNotificationPerm}>
                  <AddButton label="Enable" />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.permissionTileContainer}>
            <Text style={styles.permissionText}>Weather Permission</Text>
            {UserData.WeatherPermission ? (
              <Text style={styles.allowed}>Syncing</Text>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  AppPermissions.requestLocationPermission(dispatch)
                }>
                <AddButton
                  containerStyle={styles.startSyncButton}
                  label="Start Syncing"
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.permissionTileContainer}>
            <Text style={styles.permissionText}>Activity Permission</Text>
            {UserData.HealthPermission ? (
              <Pressable style={styles.syncingButton} onPress={onOpenHealthApp}>
                <Text style={styles.allowed}>
                  {Platform.OS === 'ios' && UserData.fitnessSyncText
                    ? UserData.fitnessSyncText
                    : 'Syncing'}
                </Text>
              </Pressable>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  AppPermissions.requestActivityPermission(dispatch)
                }>
                <AddButton
                  containerStyle={styles.startSyncButton}
                  label="Start Syncing"
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.permissionTileContainer}>
            <Text style={styles.permissionText}>Sleep Permission</Text>
            {UserData.SleepPermission ? (
              <Pressable style={styles.syncingButton} onPress={onOpenHealthApp}>
                <Text style={styles.allowed}>
                  {UserData.sleepDataSyncStatus ? 'Syncing' : 'Not Syncing'}
                </Text>
              </Pressable>
            ) : (
              <TouchableOpacity onPress={requestSleepPerm}>
                <AddButton
                  containerStyle={styles.startSyncButton}
                  label="Start Syncing"
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.headerContainerStyle, styles.marginTop41]}>
            <View
              style={[
                styles.borderStyle,
                { marginRight: dynamicSize(17), width: dynamicSize(134) },
              ]}
            />
            <Text style={styles.personalDetails}>AIA VITALITY</Text>
            <View
              style={[
                styles.borderStyle,
                { marginLeft: dynamicSize(11), width: dynamicSize(134) },
              ]}
            />
          </View>
          <View style={styles.permissionTileContainer}>
            <View style={styles.row}>
              <VitalityIcon />
              <View style={styles.marginLeft12}>
                <Text style={styles.vitalityMemberIdTxt}>
                  {UserData?.UserDetails?.vitality_member_id
                    ? `Member #${UserData?.UserDetails?.vitality_member_id ?? ''
                    }`
                    : 'Link to AIA Vitality'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              disabled={disconnecting}
              style={styles.disconnectButton}
              onPress={
                UserData?.UserDetails?.vitality_member_id ? onUnlink : onLink
              }>
              {disconnecting && (
                <View style={styles.disconnectingBox}>
                  <ActivityIndicator color="#9889F9" size="small" />
                </View>
              )}
              <AddButton
                label={
                  UserData?.UserDetails?.vitality_member_id
                    ? 'Disconnect'
                    : 'Link'
                }
                containerStyle={[
                  styles.unlinkButton,
                  !UserData?.UserDetails?.vitality_member_id &&
                  styles.linkButton,
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.headerContainerStyle, styles.marginTop41]}>
            <View
              style={[
                styles.borderStyle,
                { marginRight: dynamicSize(17), width: dynamicSize(134) },
              ]}
            />
            <Text style={styles.personalDetails}>MORE</Text>
            <View
              style={[
                styles.borderStyle,
                { marginLeft: dynamicSize(11), width: dynamicSize(134) },
              ]}
            />
          </View>
          <View
            style={[styles.flatlistContainer, { marginBottom: dynamicSize(56) }]}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProgressScreens", { howMoodFloWorks: true })}>
              <View style={[styles.bottomFlatlistContainer, { paddingTop: horizontalScale(15) }]}>
                <View style={{ marginTop: dynamicSize(7) }}><PlayButton /></View>
                <View>
                  <Text
                    style={[
                      styles.anonymousTextStyle,
                      { marginLeft: dynamicSize(16) },
                    ]}>
                    How moodflx Works
                  </Text>
                  {isHowMoodFloWorksPtsGiven === false && (
                    <ImageBackground
                      style={styles.pupView}
                      imageStyle={styles.pup}
                      source={require('../../../assets/newImage/AddCoinsPopUp/popUp.png')}>
                      <BitCoinIcon
                        style={styles.bitCoinIconView}
                        color={'#FFFFFF'}
                        w={getFontSize(12.5)}
                        h={getFontSize(12.5)}
                      />
                      <Text allowFontScaling={false} style={styles.coinText}>
                        +50 Points
                      </Text>
                    </ImageBackground>
                  )}
                </View>
              </View>
            </TouchableOpacity>
            {/* {
              !UserData?.UserDetails?.vitality_member_id &&
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(FAQ_DETAILS.link);
                }}>
                <View style={styles.bottomFlatlistContainer}>
                  <View style={{ marginTop: dynamicSize(5) }}>{FAQ_DETAILS.icon}</View>
                  <Text
                    style={[
                      styles.anonymousTextStyle,
                      { marginLeft: dynamicSize(16) },
                    ]}>
                    {FAQ_DETAILS.name}
                  </Text>
                </View>
              </TouchableOpacity>
            } */}
            {bottomList.map((item, idx) => (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(item.link);
                }}>
                <View style={styles.bottomFlatlistContainer}>
                  <View style={{ marginTop: dynamicSize(5) }}>{item.icon}</View>
                  <Text
                    style={[
                      styles.anonymousTextStyle,
                      { marginLeft: dynamicSize(16) },
                    ]}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            {
              UserData?.UserDetails?.vitality_member_id &&
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(CONTACT_US.link);

                }}>
                <View style={styles.bottomFlatlistContainer}>
                  <View style={{ marginTop: dynamicSize(5) }}>{CONTACT_US.icon}</View>
                  <Text
                    style={[
                      styles.anonymousTextStyle,
                      { marginLeft: dynamicSize(16) },
                    ]}>
                    {CONTACT_US.name}
                  </Text>
                </View>
              </TouchableOpacity>
            }
            <View style={styles.bottomFlatlistContainer} />
          </View>
        </View>
        <ActionSheet
          modalVisible={openActionSheet}
          dismissModalHandler={() => setOpenActionSheet(false)}
          selectedValue={(i) => imageSelectType(i)}
        />
      </ScrollView>
      {Loading && !openActionSheet && (
        <View style={styles.loader}>
          <ActivityIndicator color='#9889F9' size="large" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Constants.Colors.WhiteColor,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  personalDetails: {
    fontSize: getFontSize(12),
    fontFamily: RubikMedium,
    color: Colors.greyTwo,
  },
  profileImageStyle: {
    marginTop: dynamicSize(70),
    alignSelf: 'center',
  },
  vitalityMemberIdTxt: {
    color: Constants.Colors.blackColorCode,
    fontSize: dynamicSize(16),
    fontFamily: RubikMedium,
  },
  disconnectingBox: {
    position: 'absolute',
    zIndex: 200,
  },
  disconnectButton: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkButton: {
    width: dynamicSize(100),
  },
  unlinkButton: {
    paddingVertical: dynamicSize(10),
    paddingHorizontal: dynamicSize(16),
    backgroundColor: Constants.Colors.MagoliaColor,
    borderRadius: dynamicSize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  // bottomContainer: {
  //   flex: 1,
  // },
  borderStyle: {
    height: 1.2,
    width: 77,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
  },
  imageViewStyle: {
    backgroundColor: '#F4F6FA',
    width: dynamicSize(160),
    height: dynamicSize(160),
    borderRadius: dynamicSize(160),
    alignSelf: 'center',
  },
  anonymousTextStyle: {
    color: Constants.Colors.blackColorCode,
    fontSize: dynamicSize(16),
    fontFamily: RubikMedium,
    marginTop: dynamicSize(8),
  },
  flatlistContainer: {
    // flex: 1,
    marginTop: dynamicSize(10),
    marginLeft: dynamicSize(20),
    marginRight: dynamicSize(20),
  },
  marginLeft12: {
    marginLeft: dynamicSize(12),
  },
  marginTop41: {
    marginTop: dynamicSize(41),
  },
  headerContainerStyle: {
    marginTop: dynamicSize(30),
    alignSelf: 'center',
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vitalityBox: {
    width: '100%',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: dynamicSize(16),
  },
  profileImage: {
    height: dynamicSize(160),
    width: dynamicSize(160),
    resizeMode: 'cover',
    borderRadius: dynamicSize(160),
  },
  pickupIconStyle: {
    position: 'absolute',
    top: dynamicSize(116),
    right: dynamicSize(0),
  },
  imageLoader: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    // opacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dynamicSize(160),
  },
  bottomFlatlistContainer: {
    flexDirection: 'row',
    marginTop: dynamicSize(10),
    marginBottom: dynamicSize(20),
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    // opacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionTileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: dynamicSize(32),
    marginLeft: dynamicSize(20),
    marginRight: dynamicSize(20),
    alignItems: 'center',
  },
  allowed: {
    // width: dynamicSize(68),
    color: Constants.Colors.blackColorCode,
    fontFamily: RubikMedium,
    alignSelf: 'center',
    fontSize: dynamicSize(14),
  },
  permissionText: {
    color: Constants.Colors.blackColorCode,
    fontFamily: RubikMedium,
    fontSize: dynamicSize(16),
    alignSelf: 'center',
  },
  syncingButton: {
    // padding: dynamicSize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  startSyncButton: {
    padding: dynamicSize(10),
    backgroundColor: Constants.Colors.MagoliaColor,
    borderRadius: dynamicSize(12),
    justifyContent: 'center',
    alignItems: 'center',
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
  pup: {
    height: horizontalScale(45),
    width: horizontalScale(100),
    resizeMode: 'stretch',
    tintColor: Colors.coinOrange,
  },
  coinText: {
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
    color: '#FFFFFF',
    fontSize: getFontSize(12.5),
    fontFamily: RubikRegular,
  },
  bitCoinIconView: {
    top: horizontalScale(7),
    marginRight: horizontalScale(3),
  },
});

export default ProfileTab;
