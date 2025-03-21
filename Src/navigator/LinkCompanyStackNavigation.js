import React from 'react';
// import HomeScreen from '../Screens/HomeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import EmailConfirmation from '../Screens/EmailConfirmation/EmailConfirmation';
import VerifyEmail from '../Screens/VerifyEmail/VerifyEmail';
import {Animated, Easing} from 'react-native';
import Linktocompany from '../Screens/Tabs/Linktocompany';
import MicScreen from '../Screens/Tabs/MicScreen';

const Stack = createStackNavigator();

const LinkComanyStackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Linktocompany"
        component={Linktocompany}
        options={{
          header: () => null,
          //   animationEnabled: false,
          //   gestureEnabled: false,
        }}
      />
      {/* <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{header: () => null}}
      /> */}
      <Stack.Screen
        name="EmailConfirmation"
        component={EmailConfirmation}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="MicScreen"
        component={MicScreen}
        options={{header: () => null}}
      />

      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  );
};

export default LinkComanyStackNavigation;
