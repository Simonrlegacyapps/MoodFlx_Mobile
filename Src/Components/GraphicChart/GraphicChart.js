import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  monotoneCubicInterpolation,
} from '@rainbow-me/animated-charts';
import {RubikLight, RubikRegular} from '../../Constants/fonts/Fonts';

export const {width: SIZE} = Dimensions.get('window');

// export const data = [
//   {x: 1, y: 1},
//   {x: 2, y: 12},
//   {x: 3, y: 3},
//   {x: 4, y: 4},
//   {x: 5, y: 10},
//   {x: 6, y: 6},
//   {x: 7, y: 7},
// ];

const BasicExample = ({day, zero, ones, twos, threes, fours, fives}) => {
  const [Duration, setDuration] = useState('Daily');

  const data = [
    {x: 1, y: 0},
    {x: 2, y: zero ? zero : 0},
    {x: 3, y: ones ? ones : 1},
    {x: 4, y: twos ? twos : 0},
    {x: 5, y: threes ? threes : 0},
    {x: 6, y: fours ? fours : 0},
    {x: 7, y: fives ? fives : 0},
  ];

  const points = monotoneCubicInterpolation({data, range: 40});
  return (
    <View
      style={{
        backgroundColor: '#7965F6',
        marginBottom: 100,
        borderRadius: 25,
        width: SIZE,
        height: SIZE / 1.8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      <View style={{flexDirection: 'row', marginBottom: 10, marginTop: -14}}>
        <TouchableOpacity
          onPress={() => {
            setDuration('Daily');
          }}
          style={{
            padding: 8,
            paddingHorizontal: 12,
            backgroundColor: Duration === 'Daily' ? '#5E4ADC' : '#7965F6',
            borderRadius: 14,
            marginHorizontal: 6,
          }}>
          <Text
            style={{color: 'white', fontSize: 13, fontFamily: RubikRegular}}>
            DAILY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setDuration('Week');
          }}
          style={{
            padding: 8,
            paddingHorizontal: 12,
            backgroundColor: Duration === 'Week' ? '#5E4ADC' : '#7965F6',
            borderRadius: 14,
            marginHorizontal: 6,
          }}>
          <Text
            style={{color: 'white', fontSize: 13, fontFamily: RubikRegular}}>
            WEEK
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setDuration('Monthly');
          }}
          style={{
            padding: 8,
            paddingHorizontal: 12,
            backgroundColor: Duration === 'Monthly' ? '#5E4ADC' : '#7965F6',
            borderRadius: 14,
            marginHorizontal: 6,
          }}>
          <Text
            style={{color: 'white', fontSize: 13, fontFamily: RubikRegular}}>
            MONTH
          </Text>
        </TouchableOpacity>
      </View>
      <ChartPathProvider
        data={{
          points,
          smoothingStrategy: 'bezier',
        }}>
        <ChartPath height={SIZE / 3.8} stroke="#70DEEC" width={SIZE - 100} />
        <ChartDot
          style={{
            backgroundColor: 'blue',
          }}
        />
        <View style={{position: 'absolute', flex: 1}}>
          <View style={{flexDirection: 'row', flex: 1, marginLeft: 30}}>
            <View>
              <View style={styles.lineParent}>
                <View style={styles.LineParentView} />
              </View>
              <Text style={styles.DayText}>
                {Duration == 'Daily' ? '0' : 'Mo'}
              </Text>
            </View>
            <View>
              <View style={styles.lineParent}>
                <View style={styles.LineParentView} />
              </View>
              <Text style={styles.DayText}>
                {Duration == 'Daily' ? '4' : 'Tu'}
              </Text>
            </View>
            <View>
              <View style={styles.lineParent}>
                <View style={styles.LineParentView} />
              </View>
              <Text style={styles.DayText}>
                {Duration == 'Daily' ? '8' : 'We'}
              </Text>
            </View>
            <View>
              <View style={styles.lineParent}>
                <View style={styles.LineParentView} />
              </View>
              <Text style={styles.DayText}>
                {Duration == 'Daily' ? '12' : 'Th'}
              </Text>
            </View>
            <View>
              <View style={styles.lineParent}>
                <View style={styles.LineParentView} />
              </View>
              <Text style={styles.DayText}>
                {Duration == 'Daily' ? '16' : 'Fr'}
              </Text>
            </View>
            <View>
              <View style={styles.lineParent}>
                <View style={styles.LineParentView} />
              </View>
              <Text style={styles.DayText}>
                {Duration == 'Daily' ? '20' : 'Sa'}
              </Text>
            </View>
            <View>
              <View style={styles.lineParent}>
                <View style={styles.LineParentView} />
              </View>
              <Text style={styles.DayText}>
                {Duration == 'Daily' ? '24' : 'Sa'}
              </Text>
            </View>
            {/* <Text style={{width: (SIZE - 70) / 7}}>Tu</Text>
            <Text style={{width: (SIZE - 70) / 7}}>We</Text>
            <Text style={{width: (SIZE - 70) / 7}}>Th</Text>
            <Text style={{width: (SIZE - 70) / 7}}>Fr</Text>
            <Text style={{width: (SIZE - 70) / 7}}>Sa</Text>
            <Text style={{width: (SIZE - 70) / 7}}>Su</Text> */}
          </View>
        </View>
        {/* <Text>Hi</Text> */}
      </ChartPathProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  LineParentView: {
    borderRightWidth: 1,
    height: '100%',
    borderColor: 'white',
    alignSelf: 'flex-start',
    paddingLeft: 5,
    opacity: 0.5,
  },
  lineParent: {
    height: SIZE / 3.7,
  },
  DayText: {
    width: (SIZE - 70) / 7,
    marginBottom: -50,
    marginTop: 7,
    color: 'white',
    fontFamily: RubikLight,
  },
});

export default BasicExample;
