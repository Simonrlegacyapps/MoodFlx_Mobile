import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import Crown from '../../../assets/svg/Crown';
import Constants from '../../Constants';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import ProfileHeader from './ProfileHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ProfileTab from '../../Screens/Tabs/ProfileTab';
import Rewards from './Rewards';
import History from './History';
import HowTo from './HowTo';
import {getFloCoins} from '../../services/commonService';
import Rings from '../../../assets/svg/rings';
import GoldMedal from '../../../assets/svg/goldMedal';
import Medal from '../../../assets/svg/medal';
import {dynamicSize} from '../../Constants/sizeChoose';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import ProfileCoinModal from '../../Components/PopUp/profileCoinModal';

const Tab = createMaterialTopTabNavigator();
const {width} = Dimensions.get('screen');

const modalComments = {
  lvlPassed: 'You’ve already smashed this level',
  lvlNotUnlocked: "You've not unlocked this level yet!",
};

const MainProfileTab = ({navigation}) => {
  const [inProgress, setinProgress] = useState(false);
  const [openActionSheet, setopenActionSheet] = useState(false);
  const [CoinLevel, setCoinLevel] = useState('');
  const [CoinComment, setCoinComment] = useState('');
  const [lvlName, setLvlName] = useState('');
  const [type, setType] = useState('');

  const UserData = useSelector((state) => state.First);
  const {Scrolling, floCoins} = UserData;

  // let floCoins = 3000

  const VerifyDone = () => {
    setopenActionSheet(false);
  };

  const getPromotionCoinLeft = () => {
    return floCoins >= 0 && floCoins < 100
      ? 100 - floCoins
      : floCoins >= 100 && floCoins < 1000
      ? 1000 - floCoins
      : floCoins >= 1000 && floCoins < 5000
      ? 5000 - floCoins
      : floCoins >= 5000 && floCoins < 10000
      ? 10000 - floCoins
      : floCoins >= 10000 && floCoins < 20000
      ? 20000 - floCoins
      : 0;
  };
  const getCoinsLabel = (min, max) => {
    // return floCoins >= min && floCoins < max ? `> ${getFloCoins(min)}` : floCoins >= min ?`> ${getFloCoins(max)}` : `${getFloCoins(min)} - ${getFloCoins(max)}`
    return floCoins >= min && floCoins < max
      ? `> ${getFloCoins(max)}`
      : floCoins < min
      ? `+ ${getFloCoins(min)}`
      : `> ${getFloCoins(max)}`;
  };

  const getCommentLabel = (min, max) => {
    // return floCoins >= min && floCoins < max ? `You’ve already smashed this level` : floCoins > min ?  `You’ve already smashed this level` : `Just another ${getPromotionCoinLeft()} until you’re promoted!`
    return floCoins >= min && floCoins < max
      ? `Just another ${getPromotionCoinLeft()} until you’re promoted!`
      : floCoins > min
      ? modalComments.lvlPassed
      : modalComments.lvlNotUnlocked;
  };

  let lightGold = '#FFE609';
  let Gold = '#FFBD20';
  let lightGrey = '#F1ECFF';
  let Purple = '#968DFD';
  let lightGray = '#E5E5E6';
  let Gray = '#B5BDC5';

  const onClickMedalIcon = ({min, max, type, LevelName}) => {
    setCoinLevel(getCoinsLabel(min, max));
    setCoinComment(getCommentLabel(min, max));
    setLvlName(LevelName);
    setType(type);
    setopenActionSheet(true);
  };

  const Medals = ({min, max, type, LevelName}) => {
    console.log(
      `floCoins - min === 0 ? 1 : floCoins- min / max - min`,
      (floCoins - min === 0 ? 1 : floCoins - min) / (max - min),
    );
    return (
      <TouchableOpacity
        onPress={() => onClickMedalIcon({min, max, type, LevelName: `Mood ${LevelName}`})}
        style={[styles.medal]}>
        {floCoins >= min && floCoins < max && (
          <AnimatedCircularProgress
            duration={1500}
            style={styles.CircularProgressStyle}
            arcSweepAngle={360}
            size={60}
            width={6}
            fill={
              ((floCoins - min === 0 ? 1 : floCoins - min) / (max - min)) * 100
            }
            // fill={0}
            rotation={0}
            tintColor="#AF8EFF"
            lineCap={'round'}
            // // onAnimationComplete={() => console.log('onAnimationComplete')}
            backgroundColor="#F0EBFF"
          />
        )}
        <View
          style={{
            position:
              floCoins >= min && floCoins < max ? 'absolute' : 'relative',
            paddingRight: 7,
            marginVertical: 5,
          }}>
          <GoldMedal
            w={30}
            h={30}
            type={type}
            c1={
              floCoins >= max
                ? lightGold
                : floCoins >= min && floCoins < max
                ? lightGrey
                : lightGray
            }
            c2={
              floCoins >= max
                ? Gold
                : floCoins >= min && floCoins < max
                ? Purple
                : Gray
            }
          />
        </View>
        {floCoins >= max && (
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 11,
              color: '#FFBD20',
              marginBottom: -5,
              fontFamily: RubikLight,
              width: 65,
              textAlign: 'center',
            }}>
            {LevelName}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  let rewardPointPopUpButtonText = "Let's Go!";
  if (CoinComment === modalComments.lvlPassed) {
    rewardPointPopUpButtonText = "I'm Good";
  }
  return (
    <View style={styles.container}>
      <ProfileHeader navigation={navigation} />
      {/* {!Scrolling && <View style={{flexDirection: 'row', marginHorizontal: 15}}> */}
      {/* <ScrollView> */}
        <View style={{flexDirection: 'row', marginHorizontal: 15}}>
          <View style={styles.nameTexts}>
            {/* <Text style={styles.since}>Points</Text> */}
            <Text style={styles.name}>
              Mood status | <Rings />{' '}
              <Text
                style={{
                  color: '#FB8D09',
                  fontFamily: RubikLight,
                  fontSize: 14,
                }}>
                {getPromotionCoinLeft()} until promotion
              </Text>
            </Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Medals min={0} max={100} type={'a'} LevelName="Activator" />
              <Medals
                min={100}
                max={1000}
                type={'n'}
                LevelName="Navigator"
              />
              <Medals min={1000} max={5000} type={'f'} LevelName="Fit" />
              <Medals
                min={5000}
                max={10000}
                type={'p'}
                LevelName="Powerhouse"
              />
              <Medals
                min={10000}
                max={20000}
                type={'u'}
                LevelName="Unleashed"
              />
            </View>
          </View>
          {/* <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#7265E3', '#58A0E3']}
            style={styles.linearGradient}>
            <View style={{ marginHorizontal: 15, flexDirection: 'row', alignItems: 'center' }}>
              <Crown />
              <Text style={{ color: 'white', fontFamily: RubikRegular, marginLeft: 10 }}>
                {getFloCoins(UserData.floCoins)}
              </Text>
            </View>
          </LinearGradient>
        </View> */}
        </View>
        {/* </View>} */}
        {/* <ScrollView> */}
        <Tab.Navigator
          swipeEnabled={true}
          tabBarOptions={{
            // style: { height: 30 },
            labelStyle: {
              // marginTop: -10,
              fontFamily: RubikRegular,
              color: '#7265E3',
              letterSpacing: 1,
            },
            activeTintColor: '#6A6D90',
            inactiveTintColor: '#6A6D90',
            indicatorStyle: {borderColor: '#7265E3', borderWidth: 1.5},
            // tabStyle: { borderWidth: 0 }
          }}>
          <Tab.Screen name="Rewards" component={Rewards} options={{}} />
          <Tab.Screen name="History" component={History} />
          <Tab.Screen name="How To" component={HowTo} />
        </Tab.Navigator>
      {/* </ScrollView> */}
      <ProfileCoinModal
        title={lvlName}
        permission={`${CoinLevel} Flo coins`}
        // image={Constants.Images.FitnessPopUp}
        dataType={'fitness'}
        smallText={CoinComment}
        ButtonText={rewardPointPopUpButtonText}
        medal={true}
        type={type}
        left={getPromotionCoinLeft()}
        modalVisible={openActionSheet}
        dismissModalHandler={() => setopenActionSheet(false)}
        verifyDone={() => VerifyDone()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  nameTexts: {
    marginVertical: 20,
    flex: 1,
  },
  since: {
    fontFamily: RubikLight,
    color: Constants.Colors.greyColorCode,
    fontSize: 12,
  },
  name: {
    fontFamily: RubikMedium,
    fontSize: 17,
    marginTop: 4,
  },
  edit: {
    justifyContent: 'flex-end',
    marginRight: 5,
  },
  linearGradient: {
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medal: {
    // margin: 10,
    // marginTop: 20,
    flex: 1 / 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: dynamicSize(7),
  },
  CircularProgressStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default MainProfileTab;
