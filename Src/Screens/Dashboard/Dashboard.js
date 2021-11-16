import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Image,
  StyleSheet,
} from 'react-native';
import { horizontalScale, metrics } from '../../Constants/sizeChoose';
import DashboardGraph, { LightTab } from './DashboardGraph';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
const characterData = [
  { x: 'Monday', y: 18, fill: '#E74C3C' },
  { x: 'Tuesday', y: 24, fill: '#CDE73C' },
  { x: 'Wednesday', y: 8, fill: '#3FE73C' },
  { x: 'Thursday', y: 32, fill: '#3CE7E4' },
  { x: 'Friday', y: 45, fill: '#3C5EE7' },
  { x: 'Saturday', y: 80, fill: '#9C3CE7' },
  { x: 'Sunday', y: 62, fill: '#E73CB8' },
];

function getMaxima(data) {
  const groupedData = Object.keys(data[0]).reduce((memo, key) => {
    memo[key] = data.map((d) => d[key]);
    return memo;
  }, {});
  return Object.keys(groupedData).reduce((memo, key) => {
    memo[key] = Math.max(...groupedData[key]);
    return memo;
  }, {});
}

function processData(data) {
  const maxByGroup = getMaxima(data);
  const makeDataArray = (d) => {
    return Object.keys(d).map((key) => {
      return { x: key, y: d[key] / maxByGroup[key] };
    });
  };
  return data.map((datum) => makeDataArray(datum));
}

function Dashboard(props) {
  // const [data, setData] = useState(processData(characterData));
  const [data, setData] = useState(characterData);
  // const [maxima, setMaxima] = useState(getMaxima(characterData));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        )}
        <View style={styles.graphContainer}>
          <DashboardGraph data={characterData} />

          <View style={styles.tabContainer}>
            <Tab.Navigator>
              <Tab.Screen name="Light" component={LightTab} />
              <Tab.Screen name="Activity" component={() => (<View><Text>Activity</Text></View>)} />
            </Tab.Navigator>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerView: {
    marginTop: horizontalScale(24),
  },
  graphContainer: {
    flex: 1,
    marginTop: horizontalScale(50),
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flex: 1,
    width: metrics.screenWidth,
    backgroundColor: '#FFFFFF',
  },
});
