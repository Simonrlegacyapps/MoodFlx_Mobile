import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {
  getFontSize,
  horizontalScale,
  metrics,
} from '../../Constants/sizeChoose';
import {RubikMedium, RubikRegular} from '../../Constants/fonts/Fonts';
import {durationTypes} from '../../Constants/constants';

export default function ScreenTimeLineGraph({yAxisLabel, yAxisSuffix, data}) {
  const [duration, setDuration] = useState(durationTypes.week);

  const labels = useMemo(() => {
    console.log('DataGraph labels', data);
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
          data: [6],
        },
      );
    }
    if (d.length === 0) {
      d.push({
        data: [3, 4, 3.5, 4.5, 5, 6, 3],
        color: () => '#7FE3F0',
      });
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
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 10,
          marginTop: 20,
          justifyContent: 'flex-start',
        }}>
        <TouchableOpacity
          onPress={() => {
            setDuration(durationTypes.daily);
          }}
          style={{
            padding: 8,
            paddingHorizontal: 12,
            backgroundColor:
              duration === durationTypes.daily ? '#5E4ADC' : '#7965F6',
            borderRadius: 14,
            marginHorizontal: 6,
          }}>
          <Text
            style={{ color: 'white', fontSize: 13, fontFamily: RubikRegular }}>
            DAY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setDuration(durationTypes.week);
          }}
          style={{
            padding: 8,
            paddingHorizontal: 12,
            backgroundColor:
              duration === durationTypes.week ? '#5E4ADC' : '#7965F6',
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
            setDuration(durationTypes.monthly);
          }}
          style={{
            padding: 8,
            paddingHorizontal: 12,
            backgroundColor:
              duration === durationTypes.monthly ? '#5E4ADC' : '#7965F6',
            borderRadius: 14,
            marginHorizontal: 6,
          }}>
          <Text
            style={{color: 'white', fontSize: 13, fontFamily: RubikRegular}}>
            MONTH
          </Text>
        </TouchableOpacity>
      </View>
      <LineChart
        data={{
          labels: labels,
          datasets: _dataSet,
          //   legend: ["Low = < 150", "Ideal = 150 - 400", "High = < 400"]
        }}
        // width={graphWidth} // from react-native
        width={Dimensions.get("window").width} // from react-native
        height={160}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        yAxisInterval={1} // optional, defaults to 1
        fromZero
        chartConfig={{
          backgroundColor: '#7965F6',
          backgroundGradientFrom: '#7965F6',
          backgroundGradientTo: '#7965F6',
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '3',
            //   strokeWidth: "2",
            // strokeWidth: '2',
            stroke: '#FFFFFF',
            //   stroke: "transparent"
          },
        }}
        segments={3}
        bezier
        style={{
          marginVertical: 8,
          paddingVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#7965F6',
    marginBottom: 100,
    borderRadius: 25,
    width: metrics.screenWidth,
    // height: metrics.screenWidth / 1.8,
    // justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
