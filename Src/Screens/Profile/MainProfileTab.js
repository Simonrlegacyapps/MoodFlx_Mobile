import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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

const MainProfileTab = ({navigation}) => {
  const [inProgress, setinProgress] = useState(false)
  const [openActionSheet, setopenActionSheet] = useState(false)

  const VerifyDone = () => {
    setopenActionSheet(false)
}

  const UserData = useSelector((state) => state.First);
  return (
    <View style={styles.container}>
      <ProfileHeader navigation={navigation} />
      <View style={{flexDirection: 'row', marginHorizontal: 15}}>
        <View style={styles.nameTexts}>
          {/* <Text style={styles.since}>Points</Text> */}
          <Text style={styles.name}>
            Mood status / <Rings />{' '}
            <Text
              style={{color: '#FB8D09', fontFamily: RubikLight, fontSize: 14}}>
              03 until promotion
            </Text>
          </Text>
          <View style={{flexDirection: 'row', marginTop: 10, }}>
            <View style={[styles.medal]}>
              {inProgress && <AnimatedCircularProgress
                duration={1500}
                style={styles.CircularProgressStyle}
                arcSweepAngle={360}
                size={60}
                width={6}
                fill={70}
                // fill={0}
                rotation={0}
                tintColor="#AF8EFF"
                lineCap={'round'}
                // // onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#F0EBFF"
              />}
              <View style={{position:inProgress ?'absolute': "relative",  paddingRight:7, marginVertical:5}}>
              <GoldMedal
                w={30}
                h={30}
                a
                c1={true ? '#FFE609' : true ? "F1ECFF" : '#E5E5E6'}
                c2={true ? '#FFBD20' :true ? "968DFD": '#B5BDC5'}
              />
              </View>
              {true &&<Text allowFontScaling={false} style={{fontSize:11, color:"#FFBD20", marginBottom:-5}}>Activator</Text>}
            </View>
            <TouchableOpacity onPress={()=> setopenActionSheet(true)} style={styles.medal}>
              {true && <AnimatedCircularProgress
                duration={1500}
                style={styles.CircularProgressStyle}
                arcSweepAngle={360}
                size={60}
                width={6}
                fill={70}
                // fill={0}
                rotation={0}
                tintColor="#AF8EFF"
                lineCap={'round'}
                // // onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#F0EBFF"
              />}
              <View style={{position:true ?'absolute': "relative",  paddingRight:7}}>
              <GoldMedal
                w={30}
                h={30}
                n
                c1={false ? '#FFE609' : true ? "#F1ECFF" : '#E5E5E6'}
                c2={false ? '#FFBD20' :true ? "#968DFD": '#B5BDC5'}
              />
              </View>
              {false &&<Text allowFontScaling={false} style={{fontSize:11, color:"#FFBD20", marginBottom:-5}}>Activator</Text>}
            </TouchableOpacity>
            <View style={styles.medal}>
              {inProgress && <AnimatedCircularProgress
                duration={1500}
                style={styles.CircularProgressStyle}
                arcSweepAngle={360}
                size={60}
                width={6}
                fill={70}
                // fill={0}
                rotation={0}
                tintColor="#AF8EFF"
                lineCap={'round'}
                // // onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#F0EBFF"
              />}
              <View style={{position:inProgress ?'absolute': "relative",  paddingRight:7}}>
              <GoldMedal
                w={30}
                h={30}
                f
                c1={true ? '#FFE609' : true ? "F1ECFF" : '#E5E5E6'}
                c2={true ? '#FFBD20' :true ? "968DFD": '#B5BDC5'}
              />
              </View>
              {false &&<Text allowFontScaling={false} style={{fontSize:11, color:"#FFBD20", marginBottom:-5}}>Activator</Text>}
            </View>
            <View style={styles.medal}>
              {inProgress && <AnimatedCircularProgress
                duration={1500}
                style={styles.CircularProgressStyle}
                arcSweepAngle={360}
                size={60}
                width={6}
                fill={70}
                // fill={0}
                rotation={0}
                tintColor="#AF8EFF"
                lineCap={'round'}
                // // onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#F0EBFF"
              />}
              <View style={{position:inProgress ?'absolute': "relative",  paddingRight:7}}>
              <GoldMedal
                w={30}
                h={30}
                u
                c1={true ? '#FFE609' : true ? "F1ECFF" : '#E5E5E6'}
                c2={true ? '#FFBD20' :true ? "968DFD": '#B5BDC5'}
              />
              </View>
              {false &&<Text allowFontScaling={false} style={{fontSize:11, color:"#FFBD20", marginBottom:-5}}>Activator</Text>}
            </View>
            <View style={styles.medal}>
              {inProgress && <AnimatedCircularProgress
                duration={1500}
                style={styles.CircularProgressStyle}
                arcSweepAngle={360}
                size={60}
                width={6}
                fill={70}
                // fill={0}
                rotation={0}
                tintColor="#AF8EFF"
                lineCap={'round'}
                // // onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#F0EBFF"
              />}
              <View style={{position:inProgress ?'absolute': "relative",  paddingRight:7}}>
              <GoldMedal
                w={30}
                h={30}
                p
                c1={true ? '#FFE609' : true ? "F1ECFF" : '#E5E5E6'}
                c2={true ? '#FFBD20' :true ? "968DFD": '#B5BDC5'}
              />
              </View>
              {false &&<Text allowFontScaling={false} style={{fontSize:11, color:"#FFBD20", marginBottom:-5}}>Activator</Text>}
            </View>
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
      <ProfileCoinModal
      title={"Mood Navigator"}
                permission={"100 - 1,000 Flo Coins"}
                // image={Constants.Images.FitnessPopUp}
                dataType={'fitness'}
                smallText={"Level not reached yet"}
                ButtonText={"Let's Go!"}
                medal={true}
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
    flex:1/5,
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
