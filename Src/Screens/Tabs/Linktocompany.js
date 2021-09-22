import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AnonymousHeader from '../../Components/AnonymousHeader/AnonymousHeader';
import { Picker } from '@react-native-picker/picker';
import Constants from '../../Constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  CompanyName,
  Division,
  getDivisions,
  GetUserId,
  HealthPerm,
  IsAnonymous,
  OTP_Verify,
  ResetLinkToCompanyParams,
  UserDetail,
  UserDivision,
  UserEmail,
  WeatherPerm,
} from '../../redux/actions/actions';
import { dynamicSize, getFontSize, horizontalScale } from '../../Constants/sizeChoose';
import UnlockIcon from '../../../assets/profileicons/UnlockIcon';
import {
  RubikBlack,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import PostRequestApi, {getDivisionName} from '../../apirequest/PostRequestApi';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import UnlinkConfirmModal from '../../Components/Modals/UnlinkConfirmModal/UnlinkConfirmModal';
import { getApiBaseUrl, PHOTO_URL } from '../../Constants/constants';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import {onUnlinkUpdate} from '../../services/commonService';
import CustomModal from '../../Components/Modals/CustomModal/CustomModal';
import FeedBackModal from '../../Components/Modals/FeedBackModal/FeedBackModal';
import {NoteIcon} from '../../../assets/svg/noteIcon';

const FeedbackButton = ({onClick}) => (
  <Pressable
    // disabled={selectedLanguage ? false : true}
    onPress={() => onClick?.(true)}>
    <View style={styles.feedbackButtonContainer}>
      <Text style={styles.feedbackButtonDetails}>
        We’d love to hear your anonymous feedback {'&'} recommendations!
      </Text>
      <View style={styles.sendNoteView}>
        <Text style={styles.sendNoteText}>Send a note</Text>
        <NoteIcon width={getFontSize(13.5)} height={getFontSize(12)} />
      </View>
    </View>
  </Pressable>
)

const Linktocompany = ({ navigation }) => {
  const { OTPVerified, setDivision, getDivision } = useSelector(
    (state) => state.First,
  );

  const { width, height } = Dimensions.get('window');

  const [Linked, setLinked] = useState('Link');
  const [selectedDivisionId, setSelectedDivisionId] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [Divisions, setDivisions] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [APIfail, setAPIfail] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [labelShow, setLabelShow] = useState(null);
  const [UnlinkConfirm, setUnlinkConfirm] = useState(false);
  const [CompanyDetails, setCompanyDetails] = useState(null);
  const [noDivisionMdalVisible, setNoDivisionMdalVisible] = useState(false);
  const [showFeedBack, setshowFeedBack] = useState(false)
  const [FeedbackText, setFeedbackText] = useState('')

  const dispatch = useDispatch();
  const route = useRoute();

  // console.log('route', route);
  //

  const UserData = useSelector((state) => state.First);
  // console.log(
  //   `UserData in link company`,
  //   UserData.UserEmail,
  //   UserData.UserDivision,
  // );

  useEffect(() => {
    if (UserData.isLinkToCompanyRouteParamsReset === true) {
      route?.params?.email && navigation?.setParams?.({ email: null });
      dispatch(ResetLinkToCompanyParams(false));
    }
  }, [UserData.isLinkToCompanyRouteParamsReset]);

  useEffect(() => {
    if (UserData.UserEmail && UserData.UserId) {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const deviceId = DeviceInfo.getUniqueId();
      const params = {
        device_id: deviceId,
        user_id: UserData.UserId,
        email: UserData.UserEmail
      };

      console.log('=== getDivision params ===', params);
      const isUnlinkAllowed = route?.params?.email ? false : true;
      if (route?.params?.email) {
        setLoading(true);
      }
      getDivisionName(params, dispatch, isUnlinkAllowed, function (isFinish) {
        setLoading(false);
      });

      // axios.post('https://admin.moodflo.com/api/getDivision', params)
      //   .then(async (res) => {
      //     if (Array.isArray(res?.data?.data)) {
      //       await dispatch(getDivisions(res.data.data));
      //       setDivisions(res.data.data);
      //       console.log('getDivision data =>', res.data.data);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log('getDivision error: ', error);
      //   });
    }
  }, [UserData.UserId, UserData.UserEmail, route?.params?.email]);

  useEffect(() => {
    if (!UserData.UserEmail && !UserData.UserId && labelShow) {
      setLabelShow(null);
      setSelectedDivision('');
      setSelectedDivisionId('');
    }
  }, [UserData.UserId, UserData.UserEmail, labelShow]);

  useEffect(() => {
    const deviceId = DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      device_id: deviceId,
      user_id: UserData.UserId,
    });

    console.log(`raw of company details`, raw);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    UserData.UserDivision !== null &&
      fetch(`${getApiBaseUrl()}getCompanyDetails`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log('getting company details', result);
          setCompanyDetails({...result.companyData});
          dispatch(CompanyName(result.companyData));
        })
        .catch((error) => console.log('error', error));
  }, [UserData.UserDivision, UserData.UserId]);

  useEffect(() => {
    if (Array.isArray(UserData.getDivision)) {
      console.log('UserData.getDivision: ', UserData.getDivision);
      setDivisions(UserData.getDivision);
    }
  }, [UserData.getDivision]);

  useEffect(() => {
    if (modalVisible && Array.isArray(Divisions)) {
      if (Divisions.length === 0) {
        setModalVisible(false);
        setNoDivisionMdalVisible(true);
      }
    }
  }, [modalVisible, Divisions]);

  const closeNoDivisionModal = useCallback(async () => {
    setNoDivisionMdalVisible(false);
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      const isDone = await onUnlinkUpdate(dispatch);
      dispatch(OTP_Verify(false));
      setLabelShow(null);
      setSelectedDivision('');
      setSelectedDivisionId('');
      setLoading(false);
    }, 500);
  }, [dispatch]);

  useEffect(() => {
    if (
      route?.params?.email &&
      !selectedDivisionId &&
      !labelShow &&
      UserData.UserDivision &&
      Array.isArray(UserData?.getDivision) &&
      UserData.getDivision.length > 0
    ) {
      UserData.getDivision.forEach((e) => {
        if (e?.name === UserData.UserDivision) {
          setSelectedDivisionId(e.id);
          setLabelShow({ ...e });
        }
      });
    }
  }, [
    UserData.UserDivision,
    UserData.getDivision,
    labelShow,
    route?.params?.email,
    selectedDivisionId,
  ]);

  useFocusEffect(
    useCallback(() => {
      if (UserData.UserEmail && UserData.UserId) {
        const deviceId = DeviceInfo.getUniqueId();
        const params = {
          device_id: deviceId,
          user_id: UserData.UserId,
          email: UserData.UserEmail,
        };

        console.log('===useFocusEffect getDivision params ===', params);
        const isUnlinkAllowed = route?.params?.email ? false : true;
        setDivisions(null);
        getDivisionName(params, dispatch, isUnlinkAllowed);
      } else if (labelShow) {
        setLabelShow(null);
        setSelectedDivision('');
        setSelectedDivisionId('');
      }
    }, [
      UserData.UserEmail,
      UserData.UserId,
      labelShow,
      dispatch,
    ]),
  );

  const giveFeedback = ()=>{
    const deviceId = DeviceInfo.getUniqueId();
    const params = {
      "device_id": deviceId ,
      "email": UserData.UserEmail,
      "user_id": UserData.UserId,
      "feedback":FeedbackText
  }
  console.log(`params of feedback`, params)
    PostRequestApi("staffFeedback", params).then((res)=>{if(res.status === 200){console.log(`res.data.data`, res.data)}}).catch((err)=>{console.log(`err`, err)})
  }

  const SaveFeedBack = ()=>{
    setshowFeedBack(false)
    giveFeedback()
  }

  const onLink = async (type) => {
    console.log('run');
    await navigation.navigate('EmailConfirmation');
    setLinked(type);
  };

  const onDone = (type) => {
    // const {email} = route.params;
    const params = {
      division_id: labelShow.id,
      email: UserData.UserEmail,
    };
    console.log('run', params);
    setLoading(true);
    setAPIfail(false);
    setModalVisible(false);
    // setLinked(type);
    PostRequestApi('updateStaffDivision', params)
      .then(async (resp) => {
        if (resp.status == 200) {
          setLoading(false);
          dispatch(Division(selectedDivisionId));
          console.log('set division status========>>>>>>>>', resp.data);
          setSelectedDivision(resp.data.divisionName);
          await AsyncStorage.setItem(
            'Division',
            JSON.stringify(resp.data.divisionName),
          );
          dispatch(UserDivision(resp.data.divisionName));
          route.params.email && navigation?.setParams({ email: null });
          // navigation.navigate('VerifyEmail', {
          //   code: resp.data.otp,
          //   mail: value,
          //   deviceID: deviceId,
          // });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log('err', err), setLoading(false), setAPIfail(true);
      });
  };
  // console.log(`UserData.UserDivision`, UserData.UserDivision);

  const onOpenModal = useCallback(() => {
    setModalVisible(true);
  });

  const cancelled = () => {
    setUnlinkConfirm(false);
  };

  const VerifyDone = async (type) => {
    const params = {
      email: UserData.UserEmail,
      user_id: UserData.UserId,
    };
    console.log('verify', type);
    if (type === 'Yes') {
      PostRequestApi('unlinkToCompany', params)
        .then(async (resp) => {
          setUnlinkConfirm(false);
          const timeoutId = setTimeout(async () => {
            setLoading(true);
            const isDone = await onUnlinkUpdate(dispatch);
            dispatch(OTP_Verify(false));
            setLabelShow(null);
            setSelectedDivision('');
            setSelectedDivisionId('');
            setLoading(false);
            clearTimeout(timeoutId);
          }, 500);
        })
        .catch((err) => {
          console.log('unlink api failed error: ', err);
        });
      // dispatch(Division(null));
      // await AsyncStorage.removeItem('UserId');
      // await AsyncStorage.removeItem('Anonymous');
      // await AsyncStorage.removeItem('Email');
      // await AsyncStorage.removeItem('Division');
      // await AsyncStorage.removeItem('Email');
      // dispatch(UserDivision(null));
      // dispatch(UserEmail(null));
      // dispatch(GetUserId(null));
      // dispatch(IsAnonymous(true));
      // dispatch(UserDetail(null));
    } else {
      setUnlinkConfirm(false);
    }
    // setLinked(type);
  };
  // console.log(`UserData ---------->>>>`, Divisions);
  // console.log(`UserData.NameCompany`, UserData.NameCompany);
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      {/* {console.log('REDUX DATA ==============>', getDivision[0].id)} */}
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible && Divisions?.length > 0}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
            }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{backgroundColor:'black', width:'100%', height:'100%', position:'absolute', opacity:0.4}}></TouchableOpacity>
            <View
              style={{
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                width: '80%',
                minHeight: 100,
                maxHeight:dynamicSize(400),
                borderRadius: 15,
                paddingTop: 14,
                paddingBottom: 14,
              }}>
                <ScrollView>
                
              {Divisions &&
                Divisions.length > 0 &&
                Divisions.map((item, index) => {
                  // console.log(`item`, item);
                  return (
                    <TouchableOpacity
                      onPress={async () => {
                        setSelectedDivisionId(item.id);
                        setLabelShow({ ...item });
                        setModalVisible(false);
                      }}
                      key={`${index}`}>
                      <Text
                        style={{
                          textAlign: 'center',
                          marginVertical: 10,
                          fontSize: 18,
                          fontFamily: RubikRegular,
                        }}>
                        {item.name}
                      </Text>
                      {index != Divisions.length - 1 && (
                        <View
                          style={{
                            alignSelf: 'center',
                            width: '90%',
                            borderBottomColor: '#ebebeb',
                            borderBottomWidth: 1,
                            height: 1,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
                </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      <AnonymousHeader backGround />
      <ScrollView>
      {!UserData.UserDivision && !UserData.UserEmail && (
        <View
          style={{ flex: 1, alignItems: 'center', marginTop: dynamicSize(95) }}>
          <Text style={{ fontWeight: '500', fontSize: dynamicSize(24) }}>
            Connect to a company
          </Text>
          <Text
            numberOfLines={4}
            style={{
              lineHeight: 28,
              fontWeight: '300',
              fontSize: dynamicSize(14),
              marginTop: dynamicSize(12),
              // marginLeft: 62,
              // marginRight: 62,
              textAlign: 'center',
              width: 270,
            }}>
            Your mood is anonymous, why not link it to your company and help
            them better understand the mood pulse of their staff
          </Text>
          <TouchableOpacity onPress={() => onLink('Complete')}>
            <View
              style={{
                marginTop: dynamicSize(48),
                height: dynamicSize(56),
                width: dynamicSize(250),
                backgroundColor: '#7265E3',
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: dynamicSize(15),
                  color: '#FFFFFF',
                  fontFamily: RubikMedium,
                }}>
                Connect Now
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.lineSeperator} />
          <FeedbackButton onClick={setshowFeedBack} />
        </View>
      )}
      {UserData.UserEmail && (UserData.UserDivision === null || route?.params?.email) && (
        <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
          {APIfail && (
            <Text
              style={{
                fontWeight: '300',
                letterSpacing: 0.2,
                fontSize: 12,
                marginTop: dynamicSize(10),
                marginLeft: 62,
                marginRight: 62,
                textAlign: 'center',
                // width: '60%',
                color: 'red',
              }}>
              Sever Error: Please try again
            </Text>
          )}
          <Text style={{ fontWeight: '500', fontSize: dynamicSize(24) }}>
            What division are you in?
          </Text>
          <Text
            numberOfLines={3}
            style={{
              lineHeight: 28,
              fontWeight: '300',
              fontSize: dynamicSize(14),
              marginTop: 12,
              // marginLeft: 62,
              // marginRight: 62,
              textAlign: 'center',
              width: dynamicSize(230),
            }}>
            This, and which region you are located, are the only things
            {/* <Text
              style={{
                lineHeight: 28,
                fontWeight: '500',
                fontSize: dynamicSize(14),
                marginTop: 12,
                // marginLeft: 62,
                // marginRight: 62,

                textAlign: 'center',
                width: dynamicSize(230),
              }}> */}{' '}
            {UserData?.NameCompany?.full_name
              ? UserData?.NameCompany?.full_name
              : ''}{' '}
            {/* </Text> */}
            will know about you
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              marginTop: 20,
              height: 50,
              width: 300,
              backgroundColor: 'white',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              shadowColor: 'black',
              shadowOffset: { height: 2 },
              shadowOpacity: 0.3,
            }}>
            <Text
              style={{
                fontWeight: '300',
                flex: 1,
                fontSize: 16,
                // textAlign: 'center',
                width: 270,
                marginHorizontal: 18,
              }}>
              {labelShow ? labelShow.name : 'Select division'}
            </Text>
            <Image
              resizeMode={'contain'}
              style={{ marginHorizontal: dynamicSize(16), height: 15, width: 15 }}
              source={Constants.Images.DropDown}
            />

            {/* <Picker
              style={{}}
              selectedValue={selectedDivisionId}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedDivisionId(itemValue);
                {
                  console.log(
                    'selectedLanguage',
                    selectedDivisionId,
                    itemIndex,
                  );
                }
              }}>
              {getDivision &&
                getDivision.length > 0 &&
                getDivision.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.name}
                      value={item.id}
                      key={index}
                    />
                  );
                })}
            </Picker> */}
          </TouchableOpacity>
          <Text
            style={{
              lineHeight: 28,
              fontWeight: '300',
              fontSize: 14,
              marginTop: dynamicSize(10),
              textAlign: 'center',
              width: 270,
            }}>
            E.g. Anonymous in Melbourne is Excited
          </Text>
          <TouchableOpacity
            disabled={selectedDivisionId ? false : true}
            onPress={() => onDone('Done')}>
            <View
              style={{
                marginTop: dynamicSize(18),
                height: 56,
                width: dynamicSize(235),
                backgroundColor: '#7265E3',
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontWeight: '500', fontSize: 16, color: '#FFFFFF' }}>
                Done
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {UserData.UserDivision !== null && !route?.params?.email && (
        <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
          {/* <Text style={{fontWeight: '500', fontSize: 26}}>
            What division are you in?
          </Text> */}
          <View style={{}}>
            {console.log(
              'https://super.moodflo.com/' + UserData?.NameCompany?.logo,
            )}
            {UserData?.NameCompany?.logo ? (
              <Image
                style={{
                  height: dynamicSize(80),
                  width: dynamicSize(122),
                  resizeMode: 'contain',
                  // backgroundColor: 'grey',
                  // borderRadius: dynamicSize(40),
                }}
                source={{
                  uri:
                    'https://super.moodflo.com/' + UserData?.NameCompany?.logo,
                  // UserData?.NameCompany?.company_logo,
                }}
              // style={{backgroundColor: '#4C5980'}}
              />
            ) : CompanyDetails && CompanyDetails?.logo ? (
              <View
                style={{
                  shadowColor: '#ebebeb',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  borderRadius: 5,
                  overflow: 'hidden',
                }}>
                <Image
                  style={{
                    height: dynamicSize(80),
                    width: dynamicSize(80),
                    resizeMode: 'contain',
                    // backgroundColor: 'grey',
                    // borderRadius: dynamicSize(40),
                  }}
                  source={{
                    uri: 'https://super.moodflo.com/' + CompanyDetails?.logo,
                    // UserData?.NameCompany?.company_logo,
                  }}
                // style={{backgroundColor: '#4C5980'}}
                />
              </View>
            ) : (
              <Image
                style={{
                  height: dynamicSize(80),
                  width: dynamicSize(80),
                  resizeMode: 'contain',
                  borderWidth: 0.3,
                  borderColor: '#ebebeb',
                  borderRadius: dynamicSize(40),
                }}
                source={{
                  uri: 'https://admin.launchnet.works/images/logo/ic_mood.jpg',
                  // UserData?.NameCompany?.company_logo,
                }}
              // style={{backgroundColor: '#4C5980'}}
              />
            )}
          </View>
          <Text
            numberOfLines={2}
            style={{
              lineHeight: 28,
              fontWeight: '300',
              fontSize: 16,
              marginTop: dynamicSize(52),
              // marginLeft: 62,
              // marginRight: 62,
              textAlign: 'center',
              width: 270,
            }}>
            You are anonymously linked to your company under the division
          </Text>
          <Text
            style={{
              lineHeight: 28,
              fontWeight: '500',
              fontSize: 16,
              marginTop: 12,
              marginLeft: 62,
              marginRight: 62,
              textAlign: 'center',
              marginBottom: horizontalScale(42),
              width: 270,
            }}>
            {UserData?.UserDivision ?? ''}
          </Text>
          <TouchableOpacity
            // disabled={selectedLanguage ? false : true}
            onPress={() => setUnlinkConfirm(true)}>
            <View
              style={{
                // marginTop: 20,
                height: dynamicSize(56),
                width: dynamicSize(250),
                backgroundColor: '#7265E3',
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <UnlockIcon />
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 16,
                  color: '#FFFFFF',
                  marginLeft: dynamicSize(11),
                }}>
                Unlink
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.lineSeperator} />
          <FeedbackButton onClick={setshowFeedBack} />

          {/* <Text
            style={{
              lineHeight: 28,
              fontWeight: '300',
              fontSize: 14,
              marginTop: 12,
              marginLeft: 62,
              marginRight: 62,
              textAlign: 'center',
              width: 270,
            }}>
            E.g. Anonymous in Melbourne is Excited
          </Text> */}
        </View>
      )}
      </ScrollView>
      {Loading && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.2)',
            // opacity: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color='#9889F9' size="large" />
        </View>
      )}

      <FeedBackModal
      text={setFeedbackText}
        moodText={'okayy'}
        modalVisible={showFeedBack}
        dismissModalHandler={()=>{setshowFeedBack(false)}}
        // emotionText={emotionText}
        onClickButtonOne={() => SaveFeedBack()}
      />

      <UnlinkConfirmModal
        CompanyName={CompanyDetails?.full_name}
        modalVisible={UnlinkConfirm}
        dismissModalHandler={() => cancelled()}
        verifyDone={(value) => VerifyDone(value)}
      />
      <CustomModal
        modalVisible={!Loading && noDivisionMdalVisible}
        dismissModalHandler={closeNoDivisionModal}
        modalText="There's no room for you to join right now, please speak with your HR Manager or email us at help@moodflo.com"
        onClickButtonOne={closeNoDivisionModal}
        buttonOneText="Okay"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkaCompanyText: {
    fontWeight: '500',
    fontSize: 24,
  },
  moodTextStyle: {
    fontWeight: '400',
    fontSize: 16,
    marginTop: 12,
    marginLeft: 62,
    marginRight: 62,
    textAlign: 'center',
  },
  buttonStyle: {
    marginTop: 48,
    height: 56,
    width: 250,
    backgroundColor: '#7265E3',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkNowText: {
    fontWeight: '500',
    fontSize: 16,
    color: '#FFFFFF',
  },
  lineSeperator: {
    marginTop: horizontalScale(44),
    marginBottom: horizontalScale(40),
    height: horizontalScale(1),
    width: '90%',
    backgroundColor: 'rgba(0,0,0, 0.07)',
  },
  feedbackButtonContainer: {
    width: dynamicSize(250),
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: horizontalScale(120),
  },
  feedbackButtonDetails: {
    fontWeight: '400',
    fontSize: getFontSize(13),
    textAlign: 'center',
    color: '#9C9EB9',
  },
  sendNoteView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: horizontalScale(10),
  },
  sendNoteText: {
    color: '#7265E3',
    fontWeight: '500',
    fontFamily: RubikRegular,
    fontSize: getFontSize(15),
    marginRight: horizontalScale(8),
  },
});

export default Linktocompany;

//

// <View style={styles.centeredView}>
