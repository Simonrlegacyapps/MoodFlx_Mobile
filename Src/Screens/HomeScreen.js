import React, { useEffect, useState } from 'react';
import { Image, View, Dimensions, Pressable, Platform, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Tabs/Home';
import Linktocompany from './Tabs/Linktocompany';
import MicScreen from './Tabs/MicScreen';
import LogoTab from './Tabs/LogoTab';
import ProfileTab from './Tabs/ProfileTab';
import ProfileActive from '../../assets/tabicons/ProfileActive';
import Profile from '../../assets/tabicons/Profile';
import HomeIcon from '../../assets/tabicons/HomeIcon';
import HomeActiveIcon from '../../assets/tabicons/HomeActiveIcon';
import MicIcon from '../../assets/tabicons/MicIcon';
import MicActiveIcon from '../../assets/tabicons/MicActiveIcon';
import LinkActive from '../../assets/tabicons/LinkActive';
import LinkIcon from '../../assets/tabicons/LinkIcon';
import LinkCompanyStackNavigation from '../navigator/LinkCompanyStackNavigation';
import MainProfileTab from './Profile/MainProfileTab';
import {useDispatch, useSelector} from 'react-redux';
import { dynamicSize, horizontalScale } from '../Constants/sizeChoose';
import DropShadow from 'react-native-drop-shadow';
import { logger } from '../..';
import { getMyDeviceId } from '../services/commonService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetStaffUserData } from '../apirequest/PostRequestApi';
import { UserDetail } from '../redux/actions/actions';

const Tab = createBottomTabNavigator();
const WIDTH = Dimensions.get('screen').width;

const HomeScreen = ({ navigation, route }) => {
  const isDivisionSelected = useSelector((state) => state.First?.isDivisionSelected);
  const reduxVitalityId = useSelector((state) => state.First?.UserDetails?.vitality_member_id);

  const [vitality_member_id, setIsVitalityMemberId] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // logger("reduxVitalityId132",reduxVitalityId)

  // Runs when either `reduxVitalityId` changes OR when screen first mounts
  useEffect(() => {
    // setIsVitalityMemberId(reduxVitalityId);
    // if (route?.params?.from === "Skip" && reduxVitalityId == undefined) {
    if (reduxVitalityId == undefined) {
      doGetData();
    } else {
      setIsVitalityMemberId(reduxVitalityId);
    }
  }, [reduxVitalityId]); // re-run when Redux value changes

   const doGetData = async () => {
    try {
      setLoading(true); // show loader
      // logger("result?.userData IN HOME SCREEN11")
      const deviceId = getMyDeviceId();
      let UserId = await AsyncStorage.getItem('UserId');
      let Id = await JSON.parse(UserId);
      let p = await AsyncStorage.getItem('Email');
      let e = await JSON.parse(p);
      var raw = {
        device_id: deviceId,
        email: e,
        user_id: Id,
      };
      const message = "From HomeScreen"
      const result = await GetStaffUserData(message, raw, dispatch);

      if (result?.userData?.status !== 2) {
        if (result?.userData?.vitality_member_id) {
          setIsVitalityMemberId(result?.userData?.vitality_member_id);
        } else {
          setIsVitalityMemberId(undefined);
        }
        // await dispatch(UserDetail(result?.userData));
        // setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      logger("❌ Error Get Staff User Data ❌", error)
    } finally {
      // setLoading(false); // hide loader
    }
  }
  
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName={route.params.screen}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (loading) {
              return null;
            }
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? <HomeActiveIcon isVitalityUser={vitality_member_id} /> : <HomeIcon isVitalityUser={vitality_member_id} />;
            } else if (route.name === 'MicScreen') {
              iconName = focused ? <MicActiveIcon /> : <MicIcon />;
            } else if (route.name === 'LogoTab') {
              iconName = (
                <Pressable
                  disabled={!isDivisionSelected}
                  onPress={() => navigation.replace('MoodEmotionDetector')}>
                  {/* <Image
                    resizeMode={'contain'}
                    // activeOpacity={1}
                    style={{ marginBottom: 75, width: 65, height: 65 }}
                    source={require('../../assets/tabicons/logo.png')}
                  /> */}
                  <View style={{ marginBottom: dynamicSize(67),borderRadius: 100, width: 65, height: 65 }} />
                </Pressable>
              );
            } else if (route.name === 'LinkCompanyStackNavigation') {
              iconName = focused ? <LinkActive /> : <LinkIcon />;
            } else if (route.name === 'MainProfileTab' || route.name === 'ProfileTab' ) {
              iconName = focused ? <ProfileActive isVitalityUser={vitality_member_id} /> : <Profile isVitalityUser={vitality_member_id} />;
            }
            return iconName;
          },
        })}
        tabBarOptions={{
          showLabel: false,
          style: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            position: 'absolute',
            paddingTop: Platform.OS == 'ios' ? dynamicSize(25) : 'auto',
            paddingBottom:Platform.OS == 'ios' ? dynamicSize(20) :dynamicSize(30),
            zIndex: loading ? 0 : 9999,
            elevation: 0,
          },
        }}>
        <Tab.Screen
          name={'Home'}
          component={Home}
          initialParams={{ cord: route.params }}
          listeners={{
            tabPress: e => {
              // Prevent default action
              !isDivisionSelected && e.preventDefault();
            },
          }}
        />
        {!vitality_member_id && <Tab.Screen
          name={'MicScreen'}
          component={MicScreen}
          listeners={{
            tabPress: e => {
              // Prevent default action
              !isDivisionSelected && e.preventDefault();
            },
          }}
        /> }
        <Tab.Screen
          name={'LogoTab'}
          component={LogoTab}
          // options={{tabBarVisible: false}}
          listeners={{
            tabPress: e => {
              // Prevent default action
              // !isDivisionSelected && e.preventDefault();
              e.preventDefault();
            },
          }}
        />
        {!vitality_member_id && <Tab.Screen
          name={'LinkCompanyStackNavigation'}
          component={LinkCompanyStackNavigation}
        />}
        {/* <Tab.Screen name={'ProfileTab'} component={ProfileTab} /> */}
        <Tab.Screen
          name={vitality_member_id ? 'ProfileTab' : 'MainProfileTab'}
          component={vitality_member_id ? ProfileTab : MainProfileTab}
          listeners={{
            tabPress: e => {
              // Prevent default action
              !isDivisionSelected && e.preventDefault();
            },
          }}
        />
      </Tab.Navigator>
      {!loading&&<View
        style={{
          position: 'absolute',
          alignSelf: 'flex-end',
          justifyContent: 'flex-end',
          bottom: 0,
        }}>
        <DropShadow
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
          }}>
          <Image
            resizeMode={'stretch'}
            style={{ tintColor: 'white', height: dynamicSize(70), width: WIDTH }}
            source={require('../../assets/tabicons/Rectangle.png')}
          />
        </DropShadow>
      </View>}
      {!loading&&<View
        style={{
        bottom: Platform.OS === 'android' ? horizontalScale(35) : horizontalScale(35),
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 100,
      }}>
        <Pressable
          disabled={!isDivisionSelected}
          onPress={() => navigation.replace('MoodEmotionDetector')}>
          <Image
            resizeMode={'contain'}
            // activeOpacity={1}
            style={{ width: 65, height: 65 }}
            source={require('../../assets/tabicons/logo.png')}
          />
        </Pressable>
      </View>}

      {loading && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          elevation: 99999
        }}>
          <ActivityIndicator size="large" color="#9889F9" />
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
