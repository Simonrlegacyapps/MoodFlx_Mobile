import React from 'react';
import { Image, View, Dimensions, Pressable, Platform } from 'react-native';
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
import {useSelector} from 'react-redux';
import { horizontalScale } from '../Constants/sizeChoose';
import DropShadow from 'react-native-drop-shadow';

const Tab = createBottomTabNavigator();
const WIDTH = Dimensions.get('screen').width;

const HomeScreen = ({ navigation, route }) => {
  const isDivisionSelected = useSelector((state) => state.First?.isDivisionSelected);
  const vitality_member_id = useSelector(state => state.First?.UserDetails?.vitality_member_id);
  
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName={route.params.screen}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
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
                  <View style={{ marginBottom: 75, width: 65, height: 65 }} />
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
            zIndex: 9999,
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
      <View
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
            style={{ tintColor: 'white', height: 60, width: WIDTH }}
            source={require('../../assets/tabicons/Rectangle.png')}
          />
        </DropShadow>
      </View>
      <View
        style={{
        bottom: Platform.OS === 'android' ? horizontalScale(20) : horizontalScale(30),
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 100
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
      </View>
    </View>
  );
};

export default HomeScreen;
