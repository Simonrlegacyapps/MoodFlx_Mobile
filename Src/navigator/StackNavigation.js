import React from 'react';
import HomeScreen from '../Screens/HomeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import MoodEmotionDetector from '../Screens/MoodDetector';
import EmailConfirmation from '../Screens/EmailConfirmation/EmailConfirmation';
import VerifyEmail from '../Screens/VerifyEmail/VerifyEmail';
import {Platform} from 'react-native';
import ButtonCheck from '../Screens/ButtonCheck/ButtonCheck';
import ProfileTab from '../Screens/Tabs/ProfileTab';
import ProgressScreens from '../Screens/WalkThrough/ProgressScreens';
import Dashboard from '../Screens/Dashboard/Dashboard';
import BackIcon from '../../assets/svg/backIcon';
import {horizontalScale} from '../Constants/sizeChoose';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="MoodEmotionDetector">
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
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: 'Dashboard',
          headerBackImage: () => (
            <BackIcon
              width={horizontalScale(24)}
              height={horizontalScale(22)}
            />
          ),
          headerStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0,
          },
          // headerTransparent: true,
          headerLeftContainerStyle:
            Platform.OS === 'ios'
              ? {
                  paddingLeft: horizontalScale(10),
                }
              : undefined,
          headerTitleContainerStyle: {
            left: horizontalScale(42),
          },
          headerTitleAlign: 'left',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="EmailConfirmation"
        component={EmailConfirmation}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="buttonCheck"
        component={ButtonCheck}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="ProgressScreens"
        component={ProgressScreens}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
