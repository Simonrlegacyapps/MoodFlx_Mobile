import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import HappyIcon from '../../../assets/emotionsicons/HappyIcon';
import Constants from '../../Constants';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import Svg, {Path, SvgUri} from 'react-native-svg';
import {dynamicSize} from '../../Constants/sizeChoose';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import DateExpiredModal from '../../Components/Modals/DateExpiredModal/DateExpiredModal';
import AsyncStorage from '@react-native-community/async-storage';
import {GetUserId, UserEmail} from '../../redux/actions/actions';
import {useFocusEffect} from '@react-navigation/native';

const MicScreen = ({navigation}) => {
  const UserData = useSelector((state) => state.First);
  const [questions, setquestions] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [DateExpired, setDateExpired] = useState(false);

  const [refreshing, setRefreshing] = React.useState(false);
  const dispatch = useDispatch();

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setquestions(null);
    console.log(`refreshed here`);
    getQuestions();
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
  }, []);

  const getQuestions = async () => {
    let UserId = await AsyncStorage.getItem('UserId');
    let Id = await JSON.parse(UserId);
    dispatch(GetUserId(Id));
    let p = await AsyncStorage.getItem('Email');
    let e = await JSON.parse(p);
    console.log(`e`, e);
    dispatch(UserEmail(e));
    const deviceId = DeviceInfo.getUniqueId();
    var data = JSON.stringify({
      device_id: deviceId,
      email: e,
      user_id: Id,
    });
    console.log(`data of questions`, data);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow',
    };
    setLoading(true);
    fetch('https://admin.moodflo.com/api/getQuestions', requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log(`called here`, result);
        // console.log('response of questions', result),
        await setquestions(result.questions);
        setLoading(false);
      })
      .catch((error) => console.log('error', error));
  };

  useFocusEffect(
    useCallback(() => {
      getQuestions();
    }, []),
  );

  useEffect(() => {
    getQuestions();
  }, [navigation]);
  // const Questions = [
  //   {
  //     question: 'What do you think of the CEO’s dress sense?',
  //     showAns: true,
  //   },
  //   {
  //     question: 'How did you feel about the new wage deal announcement today?',
  //   },
  //   {
  //     question:
  //       'How is the new work from home policy announced yesterday making you feel?',
  //   },
  //   {
  //     question:
  //       'How are the construction works next to the office making you feel?',
  //   },
  //   {
  //     question:
  //       'How would you feel if we moved the weekly workshop to the afternoon?',
  //   },
  // ];

  // console.log(`questions`, questions);

  const cancelled = () => {
    setDateExpired(false);
  };

  const VerifyDone = (value) => {
    setDateExpired(false);
  };

  return (
    <View
      check={() => onRefresh()}
      style={{
        // alignItems: 'center',
        // justifyContent: 'center',
        flex: 1,
        backgroundColor: 'white',
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          // alignItems: 'center',
          // justifyContent: 'center',
          flex: 1,
          backgroundColor: 'white',
          // paddingBottom: 60,
        }}>
        <View
          style={{
            height: dynamicSize(300),
            width: '100%',
            backgroundColor: '#89A1F7',
            alignItems: 'center',
            justifyContent: 'center',
            // flex: 1,
          }}>
          <Image
            source={Constants.Images.GirlImage}
            style={{
              height: dynamicSize(300),
              width: dynamicSize(300),
              resizeMode: 'contain',
            }}
          />
        </View>
        <Image style={{marginTop: -10}} source={Constants.Images.Circles} />
        <View style={{marginHorizontal: 15, paddingBottom: 90}}>
          <Text style={styles.normalText}>Team Pulse</Text>
          <Text>
            {UserData.UserEmail ? (
              questions && questions.length > 0 ? (
                <Text style={styles.BigText}>
                  Have your say as a collective
                </Text>
              ) : (
                <Text
                  style={{textAlign: 'center', alignSelf: 'center', flex: 1}}>
                  <Text
                    numberOfLines={4}
                    style={{
                      alignSelf: 'center',
                      lineHeight: 28,
                      fontWeight: '500',
                      fontSize: dynamicSize(18),
                      marginTop: dynamicSize(12),
                      // marginLeft: 62,
                      // marginRight: 62,
                      textAlign: 'center',
                      // width: dynamicSize(290),
                    }}>
                    Anonymously answer Team Pulses with how you feel.
                  </Text>
                  {'\n'}
                  <Text
                    numberOfLines={4}
                    style={{
                      lineHeight: 28,
                      fontWeight: '500',
                      fontSize: dynamicSize(18),
                      marginTop: dynamicSize(12),
                      // marginLeft: 62,
                      // marginRight: 62,
                      textAlign: 'center',
                      alignSelf: 'center',
                      // width: dynamicSize(270),
                    }}>
                    You'll get a notification when a Team Pulse is available,
                    stay tuned!
                  </Text>
                </Text>
              )
            ) : (
              <Text
                numberOfLines={4}
                style={{
                  lineHeight: 28,
                  fontWeight: '500',
                  fontSize: dynamicSize(18),
                  marginTop: dynamicSize(12),
                  // marginLeft: 62,
                  // marginRight: 62,
                  textAlign: 'center',
                  width: dynamicSize(250),
                }}>
                {/* <TouchableOpacity onPress={()=>navigation.navigate('LinkCompanyStackNavigation')}><Text style={{textDecorationLine:'underline', fontWeight: 'bold',
                  fontSize: dynamicSize(18),textAlign: 'center',}}> */}
                Connect with your company to answer Team Pulses anonymously
                {/* </Text></TouchableOpacity>   */}
                {/* <Text style={{alignSelf:'center', textAlign:'center'}}>{" "} */}
                {/* </Text> */}
              </Text>
            )}
          </Text>
          {questions &&
            questions.length > 0 &&
            questions.map((item, index) => {
              let givenDate = new Date(moment(item.end_date)).getTime();
              let todayDate = new Date().getTime();
              // console.log(`todayDate`, item.end_date, givenDate, todayDate);
              return (
                <TouchableOpacity
                  // disabled={givenDate >= todayDate ? false : true}
                  onPress={() =>
                    givenDate >= todayDate
                      ? navigation.replace('MoodEmotionDetector', {
                          question: item.id,
                        })
                      : setDateExpired(true)
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.questionText, {marginHorizontal: 6}]}>
                      {index + 1}.{' '}
                    </Text>
                    <Text style={[styles.questionText, {width: '92%'}]}>
                      {item.question}
                    </Text>
                  </View>
                  {item.name && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View style={styles.ans}>
                        <Text
                          style={{flexDirection: 'row', marginHorizontal: 10}}>
                          {item.name}
                        </Text>
                        {/* <HappyIcon /> */}
                        <SvgUri
                          width={20}
                          height={20}
                          // viewBox="0 0 24 24"
                          fill="none"
                          uri={`https://super.moodflo.com/${item.icon}`}
                          // uri="http://super.moodflo.com/mood_icons/161616176321272238406054abe3bb450.svg"
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: RubikLight,
                          color: '#9C9EB9',
                        }}>
                        {item.is_anonymous === 0
                          ? 'Answered by you'
                          : 'Anonymous feedback'}
                      </Text>
                    </View>
                  )}
                  {questions.length - 1 != index && (
                    <View style={styles.line} />
                  )}
                </TouchableOpacity>
              );
            })}
          {!UserData.UserEmail && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('LinkCompanyStackNavigation');
              }}
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <View
                style={{
                  marginTop: dynamicSize(48),
                  height: dynamicSize(53),
                  width: dynamicSize(230),
                  backgroundColor: '#E4DFFF',
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
                }}>
                <Text
                  style={{fontWeight: '500', fontSize: 16, color: '#7265E3'}}>
                  Connect
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <DateExpiredModal
        modalVisible={DateExpired}
        dismissModalHandler={() => cancelled()}
        verifyDone={(value) => VerifyDone(value)}
      />

      {Loading && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  normalText: {
    fontSize: 16,
    lineHeight: 16,
    fontFamily: RubikRegular,
    color: '#7265E3',
  },
  BigText: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: RubikRegular,
    marginVertical: 10,
  },
  questionText: {
    fontFamily: RubikLight,
    fontSize: 17,
    fontWeight: '300',
    marginVertical: 6,
  },
  line: {
    width: '95%',
    alignSelf: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F2F2',
    marginVertical: 10,
    // marginHorizontal: 7,
  },
  ans: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F6FA',
    padding: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 15,
    marginVertical: 10,
  },
});

export default MicScreen;
