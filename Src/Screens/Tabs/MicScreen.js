import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import HappyIcon from '../../../assets/emotionsicons/HappyIcon';
import Constants from '../../Constants';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import {dynamicSize} from '../../Constants/sizeChoose';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {useSelector} from 'react-redux';

const MicScreen = ({navigation}) => {
  const UserData = useSelector((state) => state.First);

  const getQuestions = () => {
    var axios = require('axios');
    const deviceId = DeviceInfo.getUniqueId();
    var data = JSON.stringify({
      device_id: deviceId,
      email: UserData.UserEmail,
    });
    console.log(`data`, data);
    var config = {
      method: 'get',
      url: 'https://admin.moodflo.com/api/getQuestions',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify('question here', response.data));
      })
      .catch(function (error) {
        console.log('question err', error);
      });
  };

  useEffect(() => {
    getQuestions();
  }, []);
  const Questions = [
    {
      question: 'What do you think of the CEO’s dress sense?',
      showAns: true,
    },
    {
      question: 'How did you feel about the new wage deal announcement today?',
    },
    {
      question:
        'How is the new work from home policy announced yesterday making you feel?',
    },
    {
      question:
        'How are the construction works next to the office making you feel?',
    },
    {
      question:
        'How would you feel if we moved the weekly workshop to the afternoon?',
    },
  ];

  return (
    <View
      style={{
        // alignItems: 'center',
        // justifyContent: 'center',
        flex: 1,
        backgroundColor: 'white',
      }}>
      <ScrollView
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
          {Questions &&
            Questions.length > 0 &&
            Questions.map((item, index) => {
              return (
                <TouchableOpacity
                  disabled={item.showAns ? true : false}
                  onPress={() =>
                    navigation.replace('MoodEmotionDetector', {question: true})
                  }>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.questionText, {marginHorizontal: 6}]}>
                      {index + 1}.{' '}
                    </Text>
                    <Text style={[styles.questionText, {width: '92%'}]}>
                      {item.question}
                    </Text>
                  </View>
                  {item.showAns && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View style={styles.ans}>
                        <Text
                          style={{flexDirection: 'row', marginHorizontal: 10}}>
                          Flat
                        </Text>
                        <HappyIcon />
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
                  {Questions.length - 1 != index && (
                    <View style={styles.line} />
                  )}
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
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
