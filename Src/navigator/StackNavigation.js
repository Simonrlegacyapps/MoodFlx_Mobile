import React from 'react';
import HomeScreen from '../Screens/HomeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import MoodEmotionDetector from '../Screens/MoodEmotionDetector';


const Stack = createStackNavigator();


const StackNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MoodEmotionDetector" component={MoodEmotionDetector} options={{ header: () => null }} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ header: () => null }} />
        </Stack.Navigator>
    )
}

export default StackNavigation