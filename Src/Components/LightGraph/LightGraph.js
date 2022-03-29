import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {
  LineChart
} from "react-native-chart-kit";
import { getFontSize, horizontalScale, metrics } from '../../Constants/sizeChoose';
import { RubikMedium, RubikRegular } from '../../Constants/fonts/Fonts';

export default function LightGraph({
  yAxisLabel,
  yAxisSuffix,
  data,
}) {

  const labels = useMemo(() => {
    // console.log('DataGraph labels', data);
    let l = null;
    if (Array.isArray(data) && data.length === 7) {
      l = data.map(e => {
        return e?.day;
      });
    }
    if (l == null) {
      l = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    }
    return l;
  }, [data]);

  const _dataSet = useMemo(() => {
    let d = [];
    if (Array.isArray(data) && data.length === 7) {
      d.push({
          data: data.map((e) => {
            return !isNaN(e?.y) && e?.y > 500 ? 500 : e?.y;
          }),
        },
        {
          data: [500],
        },
      );
    }
    if (d.length === 0) {
      d.push({
          data: [100, 350, 200, 400, 500, 300, 450],
        },
        {
          data: [500],
        },
      );
    }
    // d.push({
    //   // data: [100, 350, 200, 400, 500, 300, 550]
    //   data: [100, 350, 200, 300, 350, 150, 250]
    // }, {
    //   data: [500]
    // });
    console.log('_dataSet', d);
    return d;
  }, [data]);

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: labels,
          datasets: _dataSet,
        //   legend: ["Low = < 150", "Ideal = 150 - 400", "High = < 400"]
          // legend: [" LUX"],
        }}
        // width={graphWidth} // from react-native
        width={metrics.screenWidth * 0.8} // from react-native
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
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            //   r: "6",
            r: "0",
            //   strokeWidth: "2",
            strokeWidth: "0",
            stroke: "#ffa726"
            //   stroke: "transparent"
          },
        }}
        formatYLabel={(v) => v == '500' ? '500+' : v}
        segments={5}
        style={{
          marginVertical: 15,
        }}
      />
      <View style={styles.rightLabelsView}>
        <Text style={[styles.rightLabelsText, {color: '#A5ABBF'}]}>High</Text>
        <Text style={[styles.rightLabelsText, {color: '#4C5980'}]}>Ideal</Text>
        <Text style={[styles.rightLabelsText, {color: '#A5ABBF'}]}>Low</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // backgroundColor: '#7965F6',
    borderRadius: 25,
    width: metrics.screenWidth,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  rightLabelsView: {
    height: 230,
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingBottom: 35,
    flex: 1,
    alignItems: 'center',
    paddingRight: horizontalScale(15),
  },
  rightLabelsText: {
    fontSize: getFontSize(13),
    fontFamily: RubikRegular,
    color: '#4C5980',
  },
});