import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {
  getFontSize,
  horizontalScale,
  metrics,
} from '../../Constants/sizeChoose';
import {
  RubikBold,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import LinearGradient from 'react-native-linear-gradient';

export default function ScreenTimeBarGraph({
  graphHeight,
  yAxisLabel,
  yAxisSuffix,
  yAxisInterval,
  data,
  graphType,
  setDuration,
  duration,
  graphWidth,
}) {
  const labels = useMemo(() => {
    // console.log('DataGraph labels', data);
    let l = null;
    if (Array.isArray(data) && data.length === 7) {
      l = data.map((e) => {
        return e?.day;
      });
    }
    if (l == null) {
      l = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    }
    return l;
  }, [data]);

  const _dataSet = useMemo(() => {
    let d = [];
    if (Array.isArray(data) && data.length === 7) {
      d.push(
        {
          data: data.map((e) => {
            return !isNaN(e?.y) && e?.y > 6 ? 6 : e?.y;
          }),
        },
        {
          data: [500],
        },
      );
    }
    if (d.length === 0) {
      d.push({
        data: [2.5, 3.5, 2, 1, 4, 3, 6],
      });
    }
    console.log('_dataSet', d);
    return d;
  }, [data]);

  return (
    <View style={styles.container}>
      <Text style={styles.yLabelTopText}>Hrs</Text>
      <LinearGradient
        colors={['rgba(140,128,248,0)', '#rgba(140,128,248,0.3)']}
        style={styles.linearGradient}
      />
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
        //   fromZero
        chartConfig={{
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          fillShadowGradient: '#16B7C7',
          fillShadowGradientOpacity: 1,
          propsForBackgroundLines: {
            stroke: '#8A959E',
            x1: horizontalScale(60),
            x2: graphWidth - horizontalScale(30),
          },
          propsForHorizontalLabels: {
            stroke: '#8A959E',
          },
          barPercentage: 0.4,
          barRadius: 8,
        }}
        segments={5}
        // style={{
        //   marginVertical: 15,
        // }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: metrics.screenWidth,
  },
  linearGradient: {
    width: metrics.screenWidth - horizontalScale(85),
    left: horizontalScale(60),
    marginTop: 35,
    height: 110,
    position: 'absolute',
    zIndex: 50,
  },
  yLabelTopText: {
    marginLeft: horizontalScale(37),
    fontSize: getFontSize(14),
    fontFamily: RubikMedium,
    color: '#4C5980',
    marginBottom: 15,
  },
});
