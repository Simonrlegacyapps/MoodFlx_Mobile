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
} from 'react-native';
import ProfilePlaceholder from '../../../assets/profileicons/ProfilePlaceholder';
import AddButton from '../../Components/buttons/AddButton';
import Constants from '../../Constants';
import { dynamicSize } from '../../Constants/sizeChoose';
import PrivacyIcon from '../../../assets/profileicons/PrivacyIcon';
import PickImageIcon from '../../../assets/profileicons/PickImageIcon';
import FaqIcon from '../../../assets/profileicons/FaqIcon';
import TermsIcon from '../../../assets/profileicons/TermsIcon';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from '../../Components/ImageSelection/ActionSheet';
import { useDispatch, useSelector } from 'react-redux';
import AddAnswer from '../../Components/AddAnswer/AddAnswer';
import DeviceInfo from 'react-native-device-info';
import { NotificationPerm, SetSleepDataSyncStatus, UserDetail } from '../../redux/actions/actions';
import { GetStaffUserData } from '../../apirequest/PostRequestApi';
import { AppPermissions, activityHealthKitOptions } from '../../services/appPermissions';
import { useFocusEffect } from '@react-navigation/native';
import { getSleepDataAfterPermissionIOS } from '../Home/SleepData/sleepDataService';
import BackIcon from '../../../assets/svg/backIcon';
import { openHealthApp } from '../../services/commonService';

const listData = [
  { name: 'Name', value: 'Annonymous' },
  { name: 'Gender', value: 'Annonymous' },
  { name: 'Birthday', value: 'Annonymous' },
  { name: 'Pronoun', value: 'Annonymous' },
];

const bottomList = [
  // {name: 'FAQ', icon: <FaqIcon />},
  {
    name: 'Terms & Conditions',
    icon: <TermsIcon />,
    link: 'https://admin.moodflo.com/terms&conditions',
  },
  {
    name: 'Privacy Policy',
    icon: <PrivacyIcon />,
    link: 'https://admin.moodflo.com/privacy_policy',
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
  // const [userData, setUserData] = useState(null);

  const dispatch = useDispatch();

  const addAnswer = (item, index) => {
    setedit(!edit);
  };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const updateName = useCallback((text) => {
    setname('Tester');
  }, []);

  const getProfileUserData = () => {
    // console.log('called called called called called called');
    const deviceId = DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    GetStaffUserData(
      {
        device_id: deviceId,
        email: UserData.UserEmail,
        user_id: UserData.UserId,
      },
      dispatch,
    )
      .then(async (result) => {
        console.log(
          '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
          result?.userData,
        );
        if (result?.userData?.status !== 2) {
          // console.log('UserDetaills', result.userData);
          dispatch(UserDetail(result.userData));
          setImageLoading(false);
        }
      })
      .catch((error) =>
        console.log('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error),
      );
    setImageLoading(false);
    // fetch('https://admin.moodflo.com/api/getStaffUserData', requestOptions)
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log('UserDetaills', result.userData);
    //     dispatch(UserDetail(result.userData));
    //     setImageLoading(false);
    //   })
    //   .catch((error) => console.log('error', error));
    // setImageLoading(false);
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
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
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

    fetch('https://admin.moodflo.com/api/getGenderPronoun', requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log('Gender Pronoun Data', await result),
          await setComingGenderPronoun(result);
      })
      .catch((error) => console.log('error', error));
  }, []);

  const imagePostFunction = (imageData) => {
    setImageLoading(true);
    const deviceId = DeviceInfo.getUniqueId();
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
    fetch('https://admin.moodflo.com/api/updateStaffProfileImage', {
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
      cropping: true,
      // compressImageQuality:0.6
    }).then((i) => {
      let source = {
        uri: i.path,
        type: i.mime,
        name: Platform.OS === 'android' ? i.path : i.path,
      };
      const images = [source];

      imagePostFunction(source);
      setOpenActionSheet(false);
      console.log('images', images);
    });
  };
  console.log('ProfileTab Pronoun: ', Pronoun);

  const ProfileApiCallHere = async ({ _name, _gender, _pronoun }) => {
    const name_ = _name ? _name : name;
    const deviceId = DeviceInfo.getUniqueId();
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

    await fetch(
      'https://admin.moodflo.com/api/updateStaffProfile',
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => {
        console.log('profile updated', result), getProfileUserData();
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

  const onOpenHealthApp = useCallback(openHealthApp, []);

  // console.log(
  //   "name != '' && UserData?.UserDetails?.full_name",
  //   name != 'Anonymous'
  //     ? name
  //     : name != '' && UserData?.UserDetails?.full_name
  //     ? UserData?.UserDetails?.full_name
  //     : name,
  // );

  return (
    <>
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
                      uri: `https://admin.moodflo.com/${UserData?.UserDetails?.profile_image}`,
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
                <TouchableOpacity onPress={() => setOpenActionSheet(true)}>
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
              <Text>PERSONAL DETAILS</Text>
              <View
                style={[styles.borderStyle, { marginLeft: dynamicSize(11) }]}
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20, top: 10, padding:5 }}>
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
            <Text>SYNC YOUR DATA</Text>
            <View
              style={[
                styles.borderStyle,
                { marginLeft: dynamicSize(11), width: dynamicSize(134) },
              ]}
            />
          </View>
          {Platform.OS === 'ios' && (
            <View style={styles.permissionTileContainer}>
              <Text style={styles.permissionText}>Notification</Text>
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
            <Text style={styles.permissionText}>Health Permission</Text>
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
          <View style={styles.headerContainerStyle}>
            <View
              style={[
                styles.borderStyle,
                { marginRight: dynamicSize(17), width: dynamicSize(134) },
              ]}
            />
            <Text>MORE</Text>
            <View
              style={[
                styles.borderStyle,
                { marginLeft: dynamicSize(11), width: dynamicSize(134) },
              ]}
            />
          </View>
          <View
            style={[styles.flatlistContainer, { marginBottom: dynamicSize(56) }]}>
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
    </>
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
  profileImageStyle: {
    marginTop: dynamicSize(40),
    alignSelf: 'center',
  },
  // bottomContainer: {
  //   flex: 1,
  // },
  borderStyle: {
    height: 1,
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
    fontWeight: '500',
    marginTop: dynamicSize(8),
  },
  flatlistContainer: {
    flex: 1,
    marginTop: dynamicSize(10),
    marginLeft: dynamicSize(20),
    marginRight: dynamicSize(20),
  },
  headerContainerStyle: {
    marginTop: dynamicSize(30),
    alignSelf: 'center',
    flexDirection: 'row',
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
    fontWeight: '500',
    alignSelf: 'center',
    fontSize: dynamicSize(14),
  },
  permissionText: {
    color: Constants.Colors.blackColorCode,
    fontWeight: '500',
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
});

export default ProfileTab;
