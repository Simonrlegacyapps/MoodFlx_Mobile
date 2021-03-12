import React from 'react';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
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
import Svg, {Path} from 'react-native-svg';

const Tab = createBottomTabNavigator();
const WIDTH = Dimensions.get('screen').width;

const HomeScreen = ({navigation}) => {
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
                  onPress={() => navigation.navigate('MoodEmotionDetector')}>
                  <Image
                    resizeMode={'contain'}
                    style={{marginBottom: 70, height: 80}}
                    source={require('../../assets/tabicons/logo.png')}
                  />
                </TouchableOpacity>
              ) : (
                <Image
                  style={{marginBottom: 70}}
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
        <Tab.Screen name={'Home'} component={Home} />
        <Tab.Screen name={'MicScreen'} component={MicScreen} />
        <Tab.Screen name={'LogoTab'} component={LogoTab} />
        <Tab.Screen name={'Linktocompany'} component={Linktocompany} />
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
        }}>
        <Image
          resizeMode={'stretch'}
          style={{tintColor: 'white', height: 60, width: WIDTH}}
          source={require('../../assets/tabicons/Rectangle.png')}
        />
      </View>

      {/* <Svg
        height={300}
        width={WIDTH}
        style={{
          position: 'absolute',
          height: 20,
          alignSelf: 'flex-end',
          justifyContent: 'flex-end',
          // width: '100%',
          backgroundColor: 'grey',
          bottom: 40,
        }}>
        <Path
          d="M0 65.2156C0 44.1699 8.95431 35.2156 20 35.2156H130.257C139.903 35.2156 148.127 42.1388 151.229 51.2726C154.764 61.6862 160.605 74.2198 169.246 79.2604C175.148 82.7035 194.005 89.3739 210.277 76.6504C216.368 71.8872 221.851 59.6561 225.526 49.7092C228.649 41.2581 236.506 35.2156 245.516 35.2156H355C366.046 35.2156 375 44.1699 375 55.2156V116H0V55.2156Z" // put your path here
          fill="blue"
          stroke="blue"
        />
      </Svg> */}
    </View>
  );
};

export default HomeScreen;
