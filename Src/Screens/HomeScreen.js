import React from 'react';
import {Image, View} from 'react-native';
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

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  {
    /* <View
              style={{
                position: 'absolute',
                height: 20,
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
                width: '100%',
                backgroundColor: 'grey',
                bottom: 40,
              }}
            /> */
  }

  return (
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
              <Image
                style={{marginBottom: 30}}
                source={require('../../assets/tabicons/logo.png')}
              />
            ) : (
              <Image
                style={{marginBottom: 30}}
                source={require('../../assets/tabicons/logo.png')}
              />
            );
          } else if (route.name === 'Linktocompany') {
            iconName = focused ? <LinkActive /> : <LinkIcon />;
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? <ProfileActive /> : <Profile />;
          }
          return iconName;
        },
      })}
      tabBarOptions={{showLabel: false}}>
      <Tab.Screen name={'Home'} component={Home} />
      <Tab.Screen name={'MicScreen'} component={MicScreen} />
      <Tab.Screen name={'LogoTab'} component={LogoTab} />
      <Tab.Screen name={'Linktocompany'} component={Linktocompany} />
      <Tab.Screen name={'ProfileTab'} component={ProfileTab} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
