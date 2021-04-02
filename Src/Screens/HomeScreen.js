import React from 'react';
import {Image, View, Dimensions, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
import MoodEmotionDetector from './MoodEmotionDetector';

const Tab = createBottomTabNavigator();
const WIDTH = Dimensions.get('screen').width;

const HomeScreen = ({navigation, route}) => {
  // console.log(`route`, route);
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? <HomeActiveIcon /> : <HomeIcon />;
            } else if (route.name === 'MicScreen') {
              iconName = focused ? <MicActiveIcon /> : <MicIcon />;
            } else if (route.name === 'LogoTab') {
              iconName = focused ? (
                <TouchableOpacity
                  onPress={() => navigation.replace('MoodEmotionDetector')}>
                  <Image
                    resizeMode={'contain'}
                    style={{marginBottom: 75, width: 65, height: 65}}
                    source={require('../../assets/tabicons/logo.png')}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => navigation.navigate('MoodEmotionDetector')}>
                  <Image
                    style={{
                      marginBottom: 75,
                      width: 65,
                      height: 65,
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/tabicons/logo.png')}
                  />
                </TouchableOpacity>
              );
            } else if (route.name === 'LinkCompanyStackNavigation') {
              iconName = focused ? <LinkActive /> : <LinkIcon />;
            } else if (route.name === 'ProfileTab') {
              iconName = focused ? <ProfileActive /> : <Profile />;
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
            // left: 50,
            // right: 50,
            // bottom: 20,
            // height: 100,
          },
        }}>
        <Tab.Screen
          name={'Home'}
          component={Home}
          initialParams={{cord: route.params}}
        />
        <Tab.Screen name={'MicScreen'} component={MicScreen} />
        <Tab.Screen
          name={'LogoTab'}
          component={LogoTab}
          //   options={{tabBarVisible: false}}
        />
        <Tab.Screen
          name={'LinkCompanyStackNavigation'}
          component={LinkCompanyStackNavigation}
        />
        <Tab.Screen name={'ProfileTab'} component={ProfileTab} />
      </Tab.Navigator>
      <View
        style={{
          position: 'absolute',
          // height: 20,
          alignSelf: 'flex-end',
          justifyContent: 'flex-end',
          // width: '100%',
          // backgroundColor: 'grey',
          bottom: 0,
          shadowColor: 'black',
          shadowOffset: {height: 2},
          shadowOpacity: 0.3,
        }}>
        <Image
          resizeMode={'stretch'}
          style={{tintColor: 'white', height: 60, width: WIDTH}}
          source={require('../../assets/tabicons/Rectangle.png')}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
