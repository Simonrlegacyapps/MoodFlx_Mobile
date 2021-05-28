import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { dataTypes, durationTypes } from '../../Constants/constants';
import { metrics } from '../../Constants/sizeChoose';
import { RubikLight, RubikRegular } from '../../Constants/fonts/Fonts';

export function DataGraph({
  graphHeight,
  yAxisLabel,
  yAxisSuffix,
  yAxisInterval,
  data,
  graphType,
  setDuration,
  duration
}) {


  const labels = useMemo(() => {
    console.log('DataGraph labels', data);
    let l = null;
    if (Array.isArray(data) && data.length === 7) {
      l = data.map(e => {
        return e?.day;
      })
    }
    if (l == null) {
      l = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    }
    return l;
  }, [data]);

  const _data = useMemo(() => {
    let d = null;
    if (Array.isArray(data) && data.length === 7) {
      d = data.map(e => {
        return e?.y;
      })
    }
    if (d == null) {
      d = [10, 15, 20, 15, 10, 15];
    }
    return d;
  }, [data]);

console.log('datagraph duration: ', duration)

  return (
    <View
      style={{
        backgroundColor: '#7965F6',
        marginBottom: 100,
        borderRadius: 25,
        width: metrics.screenWidth,
        // height: metrics.screenWidth / 1.8,
        // justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 10,
          marginTop: 20,
          justifyContent: 'flex-start',
        }}>
        {graphType !== dataTypes.sleep && (
          <TouchableOpacity
            onPress={() => {
              setDuration(durationTypes.daily);
            }}
            style={{
              padding: 8,
              paddingHorizontal: 12,
              backgroundColor: Duration === durationTypes.daily ? '#5E4ADC' : '#7965F6',
              borderRadius: 14,
              marginHorizontal: 6,
            }}>
            <Text
              style={{ color: 'white', fontSize: 13, fontFamily: RubikRegular }}>
              DAY
          </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            setDuration(durationTypes.week);
          }}
          style={{
            padding: 8,
            paddingHorizontal: 12,
            backgroundColor: duration === durationTypes.week ? '#5E4ADC' : '#7965F6',
            borderRadius: 14,
            marginHorizontal: 6,
          }}>
          <Text
            style={{ color: 'white', fontSize: 13, fontFamily: RubikRegular }}>
            WEEK
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setDuration(durationTypes.monthly);
          }}
          style={{
            padding: 8,
            paddingHorizontal: 12,
            backgroundColor: duration === durationTypes.monthly ? '#5E4ADC' : '#7965F6',
            borderRadius: 14,
            marginHorizontal: 6,
          }}>
          <Text
            style={{ color: 'white', fontSize: 13, fontFamily: RubikRegular }}>
            MONTH
          </Text>
        </TouchableOpacity>
      </View>
      {/* <Text>Bezier Line Chart</Text> */}
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: _data
            }
          ]
        }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#7965F6",
          backgroundGradientFrom: "#7965F6",
          backgroundGradientTo: "#7965F6",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            //   r: "6",
            r: "0",
            //   strokeWidth: "2",
            strokeWidth: "0",
            stroke: "#ffa726"
            //   stroke: "transparent"
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({

});