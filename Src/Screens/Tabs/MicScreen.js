import React, {useEffect, useState} from 'react';
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
import {useSelector} from 'react-redux';

const MicScreen = ({navigation}) => {
  const UserData = useSelector((state) => state.First);
  const [questions, setquestions] = useState(null);
  const [Loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    console.log(`refreshed here`);
    getQuestions();
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
  }, []);

  const getQuestions = () => {
    const deviceId = DeviceInfo.getUniqueId();
    var data = JSON.stringify({
      device_id: deviceId,
      email: UserData.UserEmail,
    });
    console.log(`data`, data);
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
        console.log('response of questions', result),
          await setquestions(result.questions);
        setLoading(false);
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    getQuestions();
  }, []);
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

  return (
    <View
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
          marginBottom: 60,
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
          <Image source={Constants.Images.GirlImage} style={{}} />
        </View>
        <Image style={{marginTop: -10}} source={Constants.Images.Circles} />
        <View style={{marginHorizontal: 15}}>
          <Text style={styles.normalText}>Team Pulse</Text>
          <Text style={styles.BigText}>Have your say as a collective</Text>
          {questions &&
            questions.length > 0 &&
            questions.map((item, index) => {
              return (
                <TouchableOpacity
                  // disabled={item.name ? true : false}
                  onPress={() =>
                    navigation.replace('MoodEmotionDetector', {
                      question: item.id,
                    })
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
                        Anonymous feedback
                      </Text>
                    </View>
                  )}
                  {questions.length - 1 != index && (
                    <View style={styles.line} />
                  )}
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>

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
