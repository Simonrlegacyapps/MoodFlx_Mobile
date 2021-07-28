import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  BarChart,
} from "react-native-chart-kit";
import { dataTypes, durationTypes } from '../../Constants/constants';
import { getFontSize, horizontalScale, metrics } from '../../Constants/sizeChoose';
import { RubikRegular } from '../../Constants/fonts/Fonts';

export function LightGraph({
  graphHeight,
  yAxisLabel,
  yAxisSuffix,
  yAxisInterval,
  data,
  graphType,
  setDuration,
  duration,
  graphWidth
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

  const _dataSet = useMemo(() => {
    let d = [];
    if (Array.isArray(data) && data.length === 7) {
    d.push({
      data: data.map(e => {
        return e?.y;
      })
    });
    } 
    if (d.length === 0) {
      d.push({
        data: [100, 350, 200, 400, 500, 300, 550]
      });
    }
    console.log('_dataSet', d);
    return d;
  }, [data]);


  return (
    <View
      style={{
        // backgroundColor: '#7965F6',
        marginBottom: 100,
        borderRadius: 25,
        width: metrics.screenWidth,
        // height: metrics.screenWidth / 1.8,
        // justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      {/* {graphType !== dataTypes.sleep && ( */}
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 10,
          marginTop: 20,
          justifyContent: 'flex-start',
        }}>
          <View
            style={{
              padding: 8,
              paddingHorizontal: 12,
              backgroundColor: '#5E4ADC',
              borderRadius: 5,
              marginHorizontal: 6,
            }}>
            <Text
              style={{ color: 'white', fontSize: getFontSize(13), fontFamily: RubikRegular }}>
              {"Low: < 200"}
          </Text>
          </View>
        <View
          style={{
            padding: 8,
            paddingHorizontal: 12,
            backgroundColor: '#5E4ADC',
            borderRadius: 5,
            marginHorizontal: 6,
          }}>
          <Text
            style={{ color: 'white', fontSize: getFontSize(13), fontFamily: RubikRegular }}>
            {"Ideal: 200-400"}
          </Text>
        </View>
        <View
          style={{
            padding: 8,
            paddingHorizontal: 12,
            backgroundColor: '#5E4ADC',
            borderRadius: 5,
            marginHorizontal: 6,
          }}>
          <Text
            style={{ color: 'white', fontSize: getFontSize(13), fontFamily: RubikRegular }}>
            {"High: > 400"}
          </Text>
        </View>
      </View>
      {/* )} */}
      {/* <Text>Bezier Line Chart</Text> */}
      <BarChart
        data={{
          labels: labels,
          datasets: _dataSet,
        //   legend: ["Low = < 150", "Ideal = 150 - 400", "High = < 400"]
        }}
        width={graphWidth} // from react-native
        height={220}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        yAxisInterval={1} // optional, defaults to 1
        fromZero
        chartConfig={{
            backgroundColor: "#FFFFFF",
            backgroundGradientFrom: "#FFFFFF",
            backgroundGradientTo: "#FFFFFF",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            fillShadowGradient: '#FDB007',
            fillShadowGradientOpacity: 1,
            propsForBackgroundLines:{
                stroke: '#8A959E',
                x1: horizontalScale(60),
                x2: graphWidth - horizontalScale(30),
            },
            propsForHorizontalLabels: {
                stroke: "#8A959E"
            },
          barPercentage: 0.3,
          barRadius: 8,
        }}
        segments={5}
        style={{
          marginVertical: 15,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({

});