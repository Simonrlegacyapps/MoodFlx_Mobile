import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import Mood from '../../../assets/svg/mood';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
  RubikSemiBold,
} from '../../Constants/fonts/Fonts';
import {
  dynamicSize,
  getFontSize,
  horizontalScale,
} from '../../Constants/sizeChoose';
import Anonimity from '../../../assets/svg/Anonimity';
import Science from '../../../assets/svg/science';
import Rewards from '../../../assets/svg/rewards';
import Lock from '../../../assets/svg/lock';
import ScienceG from '../../../assets/svg/ScienceG';
import RewardG from '../../../assets/svg/RewardG';
import Graph from '../../../assets/svg/graph';
import BackIcon from '../../../assets/svg/backIcon';
import {GetStaffUserData} from '../../apirequest/PostRequestApi';
import {useDispatch, useSelector} from 'react-redux';
import {getMyDeviceId} from '../../services/commonService';
import {BitCoinIcon} from '../../../assets/svg/bitCoin';
import Constants from '../../Constants';
import Colors from '../../Constants/Colors/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logger} from '../../..';

const {height} = Dimensions.get('window');

const Screen1 = ({onDone}) => {
  const [number, setnumber] = useState(0);
  const [isHowMoodFloWorksPtsGiven, setIsHowMoodFloWorksPtsGiven] =
    useState(true);
  const UserData = useSelector(state => state.First);
  const dispatch = useDispatch();
  const [updatedSplash, setUpdatedSplash] = useState();
  const data = [
    {
      img1: <Lock />,
      label: 'Anonymity',
      t1: "We really don't care who you are.",
      t2: 'We really care how you feel.',
      t3: 'Feel Secure',
      t4: "You're completely anonymous unless you say otherwise",
      button: 'Next',
    },
    {
      img1: <Lock />,
      label: 'Anonymity',
      t1: '',
      t2: 'Complete Anonymity.',
      t3: 'Daily data is stored on your personal device',
      t4: "Your data is grouped with 19 others to make sure you're completely private",
      button: 'Next',
    },
    {
      img1: <Lock />,
      label: 'Anonymity',
      t1: 'flx creates a unified voice for you & your team ',
      t2: 'via Team Pulses.',
      t3: '',
      t4: 'This is what the boss sees',
      img2: <Graph />,
      button: 'Next',
    },
    {
      img1: <ScienceG />,
      label: 'The Science',
      t1: 'flx can use your data. ',
      t2: 'The more data, the more smarter!',
      t3: '',
      t4: 'Let flx understand your environment and how it impacts your mood',
      button: 'Next',
    },
    {
      img1: <RewardG />,
      label: 'Rewards',
      t1: 'More data = more accurate insights + ',
      t2: 'more rewards.',
      t3: 'Get Rewarded!',
      t4: 'Spend your Flx Points on things that make you feel good',
      button: 'Done',
    },
  ];

  const checkHowMoodFloWorksPtsGive = (userEmail, userId) => {
    // console.log('called called called called called called');
    const deviceId = getMyDeviceId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    GetStaffUserData(
      {
        device_id: deviceId,
        email: userEmail,
        user_id: userId,
      },
      dispatch,
    )
      .then(async result => {
        console.log(
          '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
          result?.userData,
        );
        setIsHowMoodFloWorksPtsGiven(result?.specialPointFlag === 1);
      })
      .catch(error =>
        console.log('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error),
      );
  };

  useEffect(() => {
    checkHowMoodFloWorksPtsGive(UserData.UserEmail, UserData.UserId);
  }, [UserData.UserEmail, UserData.UserId]);
  useEffect(() => {
    replashSplash();
  }, []);
  const replashSplash = async () => {
    const nextUrl = await AsyncStorage.getItem('nextSplashURL');
    setUpdatedSplash(nextUrl);
    if (nextUrl) {
      try {
        await AsyncStorage.setItem('splashURL', nextUrl);
        logger('splash replaced with nextsplash');
      } catch (error) {
        logger('Async Storage setItem error: ', error);
      }
    }
  };
  return (
    <View>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Image source={{uri: updatedSplash}} style={{height: 0, width: 0}} />
      <ImageBackground
        source={require('../../../assets/newImage/WalkThrough/Onboarding.png')}
        style={{height: '100%', width: '100%'}}>
        <View>
          {number === 0 ? (
            <View style={styles.Container}>
              <View style={{marginTop: dynamicSize(80)}}>
                <Mood />
              </View>
              <View style={{width: '100%', paddingHorizontal: dynamicSize(13)}}>
                <Text allowFontScaling={false} style={styles.bigText}>
                  It's time to {'\n'}unleash your {'\n'}untapped!
                </Text>
                <Text allowFontScaling={false} style={styles.smallText0}>
                  Let's take you through flx's features
                </Text>
              </View>
              <View style={styles.bottomButtons}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: dynamicSize(15),
                  }}>
                  <TouchableOpacity onPress={onDone} style={{flex: 1}}>
                    <Text allowFontScaling={false} style={styles.skip}>
                      Skip >>
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setnumber(number + 1);
                    }}
                    style={{
                      backgroundColor: Colors.blueTextColor,
                      borderRadius: 10,
                    }}>
                    <Text allowFontScaling={false} style={styles.next}>
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.Container}>
              <View style={styles.topBar}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingBottom: dynamicSize(25),
                  }}>
                  <View style={{width: '33%' , justifyContent: 'center'}}>
                    <TouchableOpacity
                    style={{width: '30%' , marginLeft: 10}}
                      onPress={() => {
                        setnumber(number - 1);
                      }}>
                      <BackIcon w={dynamicSize(22)} h={dynamicSize(22)} />
                    </TouchableOpacity>
                  </View>

                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: getFontSize(22),
                      fontFamily: RubikMedium,
                      // marginTop: dynamicSize(30),
                      color:
                        number <= 3
                          ? Colors.blueTextColor
                          : number === 4
                          ? '#3FD7C8'
                          : '#EE64DB',
                    }}>
                    {/* {number <= 3
                    ? 'Anonymity'
                    : number === 4
                    ? 'The Science'
                    : 'Rewards'} */}
                    {data[number - 1].label}
                  </Text>
                  <Text style={{width: '33%'}}></Text>
                </View>

                <View style={styles.rewardsTypes}>
                  <Anonimity
                    color={
                      data[number - 1].label === 'Anonymity'
                        ? Colors.blueTextColor
                        : Colors.greyColorCode
                    }
                  />
                  <Science
                    color={
                      data[number - 1].label === 'The Science'
                        ? '#3FD7C8'
                        : Colors.greyColorCode
                    }
                  />
                  <Rewards
                    color={
                      data[number - 1].label === 'Rewards'
                        ? '#EE64DB'
                        : Colors.greyColorCode
                    }
                  />
                </View>
                {console.log(`number`, number)}
              </View>

              <View style={{paddingHorizontal: 30}}>
                <ScrollView style={{height: '100%'}}>
                  <View style={styles.whiteBox}>
                    <View style={{marginBottom: 20}}>
                      {data[number - 1].img1}
                    </View>
                    {data[number - 1].t1 != '' && (
                      <Text allowFontScaling={false} style={styles.blackText}>
                        {data[number - 1].t1}
                      </Text>
                    )}
                    {data[number - 1].t2 != '' && (
                      <Text
                        allowFontScaling={false}
                        style={[styles.blackText, styles.purpleText]}>
                        {data[number - 1].t2}
                      </Text>
                    )}
                    {data[number - 1].t3 != '' && (
                      <Text allowFontScaling={false} style={styles.smallText}>
                        {data[number - 1].t3}
                      </Text>
                    )}
                    {data[number - 1].t4 != '' && (
                      <Text allowFontScaling={false} style={styles.smallGrey}>
                        {data[number - 1].t4}
                      </Text>
                    )}
                    {data[number - 1].t4 != null && (
                      <View style={{}}>{data[number - 1].img2}</View>
                    )}
                  </View>
                  <View style={{paddingBottom: 100}} />
                </ScrollView>
              </View>

              {/* // bottom buttons */}
              <View style={styles.bottomButtons}>
                {isHowMoodFloWorksPtsGiven === false &&
                data[number - 1].button === 'Done' ? (
                  <TouchableOpacity
                    onPress={() => onDone()}
                    style={styles.bottomFlatlistContainer}>
                    <View>
                      <Text style={styles.anonymousTextStyle}>
                        {data[number - 1].button}
                      </Text>
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
                          +50 Pointsee
                        </Text>
                      </ImageBackground>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: dynamicSize(15),
                    }}>
                    <TouchableOpacity onPress={() => onDone(false)}>
                      <Text allowFontScaling={false} style={styles.skip}>
                        Skip >>
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        data[number - 1].button === 'Next'
                          ? setnumber(number + 1)
                          : onDone();
                      }}
                      style={styles.nextButton}>
                      <Text allowFontScaling={false} style={styles.next}>
                        {data[number - 1].button}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  next: {
    color: 'white',
    fontFamily: RubikRegular,
    fontSize: getFontSize(16),
    paddingVertical: 6,
    paddingHorizontal: 17,
  },
  skip: {
    color: 'white',
    fontFamily: RubikRegular,
    fontSize: getFontSize(16),
  },
  bottomButtons: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  bottomFlatlistContainer: {
    flexDirection: 'row',
    paddingTop: horizontalScale(15),
    marginTop: dynamicSize(10),
    marginBottom: dynamicSize(20),
    backgroundColor: Colors.blueTextColor,
    borderRadius: 7,
    alignItems: 'center',
  },
  anonymousTextStyle: {
    color: Colors.WhiteColor,
    fontSize: dynamicSize(16),
    fontWeight: '500',
    marginVertical: dynamicSize(8),
    marginHorizontal: dynamicSize(16),
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
  bitCoinIconView: {
    top: horizontalScale(7),
    marginRight: horizontalScale(3),
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
  nextButton: {
    backgroundColor: Colors.blueTextColor,
    borderRadius: 10,
  },
  smallText0: {
    marginTop: dynamicSize(10),
    fontSize: dynamicSize(23),
    paddingRight: 5,
    fontFamily: RubikRegular,
    color: 'white',
  },
  bigText: {
    marginTop: dynamicSize(70),
    fontSize: dynamicSize(40),
    // paddingRight: 5,
    lineHeight: dynamicSize(41),
    fontFamily: RubikSemiBold,
    color: 'white',
  },
  Container: {alignItems: 'center', height: '100%', width: '100%'},
  rewardsTypes: {
    flexDirection: 'row',
    // marginVertical: 22,
    // marginTop: 35,
    justifyContent: 'space-around',
    width: '100%',
  },
  topBar: {
    height: dynamicSize(130),
    backgroundColor: 'white',
    // top: dynamicSize(10),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  whiteBox: {
    backgroundColor: 'white',
    marginTop: 60,
    alignItems: 'center',
    paddingVertical: 30,
    borderRadius: 12,
    paddingHorizontal: horizontalScale(30),
  },
  blackText: {
    textAlign: 'center',
    fontSize: getFontSize(28),
    color: Colors.blackColorCode,
    fontFamily: RubikMedium,
  },
  purpleText: {
    color: Colors.blueTextColor,
    marginTop: 0,
  },
  smallText: {
    textAlign: 'center',
    fontSize: getFontSize(20),
    fontFamily: RubikMedium,
    color: Colors.blackColorCode,
    marginTop: 19,
  },
  smallGrey: {
    color: Colors.greyColorCode,
    textAlign: 'center',
    fontSize: getFontSize(16),
    fontFamily: RubikRegular,
    marginTop: horizontalScale(9),
    paddingHorizontal: horizontalScale(20),
  },
});

export default Screen1;
