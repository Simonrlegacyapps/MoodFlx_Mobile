import React, {useState, useCallback} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import Mood from '../../../assets/svg/mood';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import {dynamicSize, getFontSize, horizontalScale} from '../../Constants/sizeChoose';
import Anonimity from '../../../assets/svg/Anonimity';
import Science from '../../../assets/svg/science';
import Rewards from '../../../assets/svg/rewards';
import Lock from '../../../assets/svg/lock';
import ScienceG from '../../../assets/svg/ScienceG';
import RewardG from '../../../assets/svg/RewardG';
import Graph from '../../../assets/svg/graph';
import BackIcon from '../../../assets/svg/backIcon';
import getStore from '../../redux';
import {getUpdateRewardPoint} from '../../apirequest/PostRequestApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LvlUpModal from '../../Components/Modals/LvlUpModal/LvlUpModal';
import {getIsMoodLvlUp, getMyDeviceId} from '../../services/commonService';
import {useDispatch} from 'react-redux';
import Colors from '../../Constants/Colors/Colors';

const {height} = Dimensions.get("window")

const ProgressScreen = ({navigation, route}) => {
  const [number, setnumber] = useState(0);
  const [isOpenLvlUpModal, setIsOpenLvlUpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const goBack = () => {
    const timeoutId = setTimeout(() => {
      navigation.goBack();
      clearTimeout(timeoutId);
    }, 400);
  };

  const closeLvlUpModal = useCallback(() => {
    setIsOpenLvlUpModal(false);
    goBack();
  }, []);

  const checkStorage = async () => {
    let p = await AsyncStorage.getItem('givePoints');
    let points = await JSON.parse(p);
    console.log(`points`, points);
    if (points === null) {
      await AsyncStorage.setItem('givePoints', '1');
      howMoodfloWorks();
    } else {
      navigation.goBack();
    }
  };

  const howMoodfloWorks = () => {
    const userData = getStore?.()?.getState?.()?.First;
    const prevRewardPts = userData?.floCoins;
    const deviceId = getMyDeviceId();
    let params = {
      "device_id": deviceId,
      "email": userData?.UserEmail ?? null,
      "user_id": userData?.UserId ?? null,
      "section_index": 1,
      "reward_point": 50,
      "description": "How moodflo works"
    };
    console.log(`params of how mood flx works 50 coins`, params);
    setIsLoading(true);
    function onError() {
      setIsLoading(false);
      goBack();
    }
    getUpdateRewardPoint(params, dispatch, onError).then((res) => {
      console.log('getUpdateRewardPoint res.data----', res?.data);
      setIsLoading(false);
      if (
        res?.data?.reward_point &&
        getIsMoodLvlUp(prevRewardPts, res.data.reward_point)
      ) {
        const timeoutId = setTimeout(() => {
          setIsOpenLvlUpModal(true);
          clearTimeout(timeoutId);
        }, 400);
      } else {
        goBack();
      }
    });
  };

  const onDone = (isClickFromDoneButton) => () => {
    if (isClickFromDoneButton && route?.params?.howMoodFloWorks) {
      checkStorage();
    } else {
      navigation.goBack();
    }
  };

  const data = [
    {
      img1: <Lock />,
      label:"Anonymity",
      t1: "We really don't care who you are.",
      t2: 'We really care how you feel.',
      t3: 'Feel Secure',
      t4: "You're completely anonymous unless you say otherwise",
      button: "Next"
    },
    {
      img1: <Lock />,
      label:"Anonymity",
      t1: '',
      t2: 'Complete Anonymity.',
      t3: 'Daily data is stored on your personal device',
      t4:
        "Your data is grouped with 19 others to make sure you're completely private",
        button: "Next"
    },
    {
      img1: <Lock />,
      label:"Anonymity",
      t1: 'flx creates a unified voice for you & your team ',
      t2: 'via Team Pulses.',
      t3: '',
      t4: 'This is what the boss sees',
      img2: <Graph />,
      button: "Next"
    },
    {
      img1: <ScienceG />,
      label:"The Science",
      t1: 'flx can use your data. ',
      t2: 'The more data, the more smarter!',
      t3: '',
      t4: 'Let flx understand your environment and how it impacts your mood',
      button: "Next"
    },
    {
      img1: <RewardG />,
      label:"Rewards",
      t1: 'More data = more accurate insights + ',
      t2: 'more rewards.',
      t3: 'Get Rewarded!',
      t4: 'Spend your Flx Points on things that make you feel good',
      button: "Done"
    },
  ];

  return (
    <>
      <View>
        <ImageBackground
          source={require('../../../assets/newImage/WalkThrough/Onboarding.png')}
          style={{ height: '100%', width: '100%' }}>
          <SafeAreaView>
            {number === 0 ? (
              <View style={styles.Container}>
                <View style={{ marginTop: dynamicSize(80) }}>
                  <Mood />
                </View>
                <View style={{ width: '100%', paddingHorizontal: dynamicSize(13) }}>
                  <Text allowFontScaling={false} style={styles.bigText}>
                    It's time to unleash your untapped!
                  </Text>
                  <Text allowFontScaling={false} style={styles.smallText0}>
                    Let's take you through flx's features
                  </Text>
                </View>
                <View style={styles.bottomButtons}>
                  <TouchableOpacity onPress={onDone(false)} style={{ flex: 1 }}>
                    <Text allowFontScaling={false} style={styles.skip}>Skip > ></Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setnumber(number + 1);
                    }}
                    style={{ backgroundColor: Colors.blueTextColor, borderRadius: 7 }}>
                    <Text allowFontScaling={false} style={styles.next}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.Container}>
                <View style={styles.topBar}>
                  <TouchableOpacity onPress={() => { setnumber(number - 1) }} style={{ position: 'absolute', left: 10, top: 10 }}>
                    <BackIcon w={dynamicSize(22)} h={dynamicSize(22)} />
                  </TouchableOpacity>
                  <Text allowFontScaling={false}
                    style={{
                      fontSize: getFontSize(22),
                      fontFamily: RubikMedium,
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
                  <View style={styles.rewardsTypes}>
                    <Anonimity color={data[number - 1].label === "Anonymity" ? Colors.blueTextColor : Colors.greyColorCode} />
                    <Science color={data[number - 1].label === "The Science" ? '#3FD7C8' : Colors.greyColorCode} />
                    <Rewards color={data[number - 1].label === "Rewards" ? '#EE64DB' : Colors.greyColorCode} />
                  </View>
                  {console.log(`number`, number)}
                </View>

                <View style={{ paddingHorizontal: 30 }}>
                  <ScrollView style={{ height: '100%' }}>
                    <View style={styles.whiteBox}>
                      <View style={{ marginBottom: 20 }}>
                        {data[number - 1].img1}
                      </View>
                      {data[number - 1].t1 != '' && (
                        <Text allowFontScaling={false} style={styles.blackText}>{data[number - 1].t1}</Text>
                      )}
                      {data[number - 1].t2 != '' && (
                        <Text allowFontScaling={false} style={[styles.blackText, styles.purpleText]}>
                          {data[number - 1].t2}
                        </Text>
                      )}
                      {data[number - 1].t3 != '' && (
                        <Text allowFontScaling={false} style={styles.smallText}>{data[number - 1].t3}</Text>
                      )}
                      {data[number - 1].t4 != '' && (
                        <Text allowFontScaling={false} style={styles.smallGrey}>{data[number - 1].t4}</Text>
                      )}
                      {data[number - 1].t4 != null && (
                        <View style={{}}>{data[number - 1].img2}</View>
                      )}
                    </View>
                    <View style={{ paddingBottom: 100 }} />
                  </ScrollView>
                </View>

                {/* // bottom buttons */}
                <View style={styles.bottomButtons}>
                  <TouchableOpacity onPress={onDone(false)} style={{ flex: 1 }}>
                    <Text allowFontScaling={false} style={styles.skip}>Skip >></Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      data[number - 1].button === "Next" ? setnumber(number + 1) : onDone(true)();
                    }}
                    style={{ backgroundColor: Colors.blueTextColor, borderRadius: 7 }}>
                    <Text allowFontScaling={false} style={styles.next}>
                      {data[number - 1].button}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </SafeAreaView>
        </ImageBackground>
      </View>
      {isLoading && !isOpenLvlUpModal && (
        <View style={styles.loader}>
          <ActivityIndicator color='#9889F9' size="large" />
        </View>
      )}
      <LvlUpModal
        bigText="You’ve leveled up!"
        modalVisible={isOpenLvlUpModal && !isLoading}
        dismissModalHandler={closeLvlUpModal}
        buttonText="Let's Go!"
        verifyDone={closeLvlUpModal}
        smallText="Check out what rewards you’ve unlocked"
      />
    </>
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
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    paddingRight: 5,
    fontFamily: RubikRegular,
    color: 'white',
  },
  Container: {alignItems: 'center', height: '100%', width: '100%'},
  rewardsTypes: {
    flexDirection: 'row',
    marginVertical: 22,
    marginTop: 35,
    justifyContent: 'space-around',
    width: '100%',
  },
  topBar: {
    height: dynamicSize(160),
    backgroundColor: 'white',
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
    // paddingHorizontal: 40,
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

export default ProgressScreen;
