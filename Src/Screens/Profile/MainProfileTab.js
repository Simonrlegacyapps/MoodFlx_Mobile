import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import Crown from '../../../assets/svg/Crown';
import Constants from '../../Constants';
import {
    RubikLight,
    RubikMedium,
    RubikRegular,
} from '../../Constants/fonts/Fonts';
import ProfileHeader from './ProfileHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProfileTab from '../../Screens/Tabs/ProfileTab';
import Rewards from './Rewards';
import History from './History';
import HowTo from './HowTo';

const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get("screen")

const MainProfileTab = ({ navigation }) => {
    const UserData = useSelector((state) => state.First);
    return (
        <View style={styles.container}>
            <ProfileHeader navigation={navigation} />
            <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
                <View style={styles.nameTexts}>
                    <Text style={styles.since}>Your Ranking</Text>
                    <Text style={styles.name}>Mood Legend</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={['#7265E3', '#58A0E3']}
                        style={styles.linearGradient}>
                        <View style={{ marginHorizontal: 15 }}>
                            <Text style={{ color: 'white', fontFamily: RubikRegular }}>
                                <Crown /> 12600
              </Text>
                        </View>
                    </LinearGradient>
                </View>
            </View>
            <Tab.Navigator swipeEnabled={true}
                tabBarOptions={{
                    style: { height: 30 },
                    labelStyle: {
                        marginTop: -10,
                        fontFamily: RubikRegular,
                        color: '#6A6D90',
                        letterSpacing: 1,
                    },
                    activeTintColor: '#6A6D90',
                    inactiveTintColor: '#9C9EB9',
                    indicatorStyle: { borderColor: "#6A6D90", borderWidth: 1, paddingHorizontal: 10, width: 87, left: width / 19 },
                    tabStyle: { borderWidth: 0 }
                }}>
                <Tab.Screen name="Rewards" component={Rewards} options={{}} />
                <Tab.Screen name="History" component={History} />
                <Tab.Screen name="How To" component={HowTo} />
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
    },
    nameTexts: { marginVertical: 20, flex: 1 },
    since: {
        fontFamily: RubikLight,
        color: Constants.Colors.greyColorCode,
        fontSize: 12,
    },
    name: { fontFamily: RubikMedium, fontSize: 17, marginTop: 4 },
    edit: { justifyContent: 'flex-end', marginRight: 5 },
    linearGradient: {
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default MainProfileTab;
