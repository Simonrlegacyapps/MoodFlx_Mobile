import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProgressScreens from '../Screens/WalkThrough/ProgressScreens';
import Screen1 from '../Screens/WalkThrough/Screen1';


const Stack = createStackNavigator();

const BoardingNavigation = () => {
  return (
    <Stack.Navigator>
      
      {/* <Stack.Screen
        name="MoodEmotionDetector"
        component={MoodEmotionDetector}
        options={{
          header: () => null,
          animationEnabled: false,
          gestureEnabled: false,
        }}
      /> */}
      <Stack.Screen
        name="Screen1"
        component={Screen1}
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

export default BoardingNavigation;
