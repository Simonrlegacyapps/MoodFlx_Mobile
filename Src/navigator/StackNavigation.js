import React from 'react';
import HomeScreen from '../Screens/HomeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import MoodEmotionDetector from '../Screens/MoodEmotionDetector';
import MoodEmotionDetectorTouch from '../Screens/MoodEmotionDetectorTouch';
import EmailConfirmation from '../Screens/EmailConfirmation/EmailConfirmation';
import VerifyEmail from '../Screens/VerifyEmail/VerifyEmail';
import {Animated, Easing} from 'react-native';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="MoodEmotionDetectorTouch"
        component={MoodEmotionDetectorTouch}
        options={{header: () => null}}
      /> */}
      <Stack.Screen
        name="MoodEmotionDetector"
        component={MoodEmotionDetector}
        options={{
          header: () => null,
          animationEnabled: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="EmailConfirmation"
        component={EmailConfirmation}
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

export default StackNavigation;
