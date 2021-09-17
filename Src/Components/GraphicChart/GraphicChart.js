import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
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
import { RubikLight, RubikRegular } from '../../Constants/fonts/Fonts';
import { useSelector } from 'react-redux';
import GraphBezierCustom from '../GraphBezierCustom/GraphBezierCustom';
import moment, { duration } from 'moment';
import { DataGraph } from '../DataGraph/DataGraph';
import { dataTypes, durationTypes } from '../../Constants/constants';

export const { width: SIZE } = Dimensions.get('window');

// export const data = [
//   {x: 1, y: 1},
//   {x: 2, y: 12},
//   {x: 3, y: 3},
//   {x: 4, y: 4},
//   {x: 5, y: 10},
//   {x: 6, y: 6},
//   {x: 7, y: 7},
// ];

const BasicExample = ({
  day,
  zero,
  ones,
  twos,
  threes,
  fours,
  fives,
  dataOfWeatherGraph,
  weeklyHealthGraphData,
  fitness,
  sleepGraphData,
  isDailyDisabled,
  graphType,
}) => {
  const [Duration, setDuration] = useState(sleepGraphData ? durationTypes.week : durationTypes.daily);

  const UserData = useSelector((state) => state.First);

  useEffect(() => {
    if(graphType === dataTypes.sleep) {
      setDuration(durationTypes.week);
    }
  }, [])
  // console.log(`UserData.MainSteps --------->>> `, UserData.MainSteps);
  // useEffect(() => {
  //   // dataFunction();
  // }, []);

  let onez = 0;
  let two = 0;
  let three = 0;
  let four = 0;
  let five = 0;
  let six = 0;
  let seven = 0;
  let eight = 0;
  let nine = 0;
  let ten = 0;
  let eleven = 0;
  let twelve = 0;
  let thirteen = 0;
  let fourteen = 0;
  let fifteen = 0;
  let sixteen = 0;
  let seventeen = 0;
  let eighteen = 0;
  let nineteen = 0;
  let twenty = 0;
  let twentyOne = 0;
  let twentyTwo = 0;
  let twentyThree = 0;
  let twentyFour = 0;
  let dataValue = [];

  const dataFunction = () => {
    let steps = UserData.MainSteps;
    // console.log(`STEPS============`, UserData.MainSteps);

    for (let i in steps) {
      let date = moment(steps[i].endDate).hour();
      if (date + 1 === 1) {
        onez = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 2) {
        two = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 3) {
        three = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 4) {
        four = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 5) {
        five = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 6) {
        six = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 7) {
        seven = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 8) {
        eight = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 9) {
        nine = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 10) {
        ten = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 11) {
        eleven = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 12) {
        twelve = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 13) {
        thirteen = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 14) {
        fourteen = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 15) {
        fifteen = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 16) {
        sixteen = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 17) {
        seventeen = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 18) {
        eighteen = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 19) {
        nineteen = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 20) {
        twenty = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 21) {
        twentyOne = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 22) {
        twentyTwo = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 23) {
        twentyThree = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      } else if (date + 1 === 24) {
        twentyFour = Platform.OS === 'ios' ? steps[i].value : steps[i].steps;
      }
    }
    // console.log(`dataValue +++++++++++++++=`, dataValue);
    return (dataValue = [
      { x: 1, y: onez },
      { x: 2, y: two },
      { x: 3, y: three },
      { x: 4, y: four },
      { x: 5, y: five },
      { x: 6, y: six },
      { x: 7, y: seven },
      { x: 8, y: eight },
      { x: 9, y: nine },
      { x: 10, y: ten },
      { x: 11, y: eleven },
      { x: 12, y: twelve },
      { x: 13, y: thirteen },
      { x: 14, y: fourteen },
      { x: 15, y: fifteen },
      { x: 16, y: sixteen },
      { x: 17, y: seventeen },
      { x: 18, y: eighteen },
      { x: 19, y: nineteen },
      { x: 20, y: twenty },
      { x: 21, y: twentyOne },
      { x: 22, y: twentyTwo },
      { x: 23, y: twentyThree },
      { x: 24, y: twentyFour },
    ]);
  };
  // console.log(`dataValue --?`, dataFunction());

  let demoData = [
    { x: 1, y: 0 },
    {
      x: 2,
      y:
        Duration === durationTypes.daily
          ? UserData.TodayAllSteps !== null
            ? 1 + UserData.TodayAllSteps[0].two
            : 0
          : 0,
    },
    {
      x: 3,
      y:
        Duration === durationTypes.daily
          ? UserData.TodayAllSteps !== null
            ? UserData.TodayAllSteps[0].three
            : 1
          : 1,
    },
    {
      x: 4,
      y:
        Duration === durationTypes.daily
          ? UserData.TodayAllSteps !== null
            ? UserData.TodayAllSteps[0].four
            : 0
          : 0,
    },
    {
      x: 5,
      y:
        Duration === durationTypes.daily
          ? UserData.TodayAllSteps !== null
            ? UserData.TodayAllSteps[0].five
            : 0
          : 0,
    },
    {
      x: 6,
      y:
        Duration === durationTypes.daily
          ? UserData.TodayAllSteps !== null
            ? UserData.TodayAllSteps[0].six
            : 0
          : 0,
    },
    {
      x: 7,
      y:
        Duration === durationTypes.daily
          ? UserData.TodayAllSteps !== null
            ? UserData.TodayAllSteps[0].seven
            : 0
          : 0,
    },
  ];


  const data =
    dataOfWeatherGraph && Duration === durationTypes.daily
      ? dataOfWeatherGraph
      : fitness && Duration === durationTypes.daily
        ? dataFunction()
        : demoData;

  const max =
    data &&
    Math.max.apply(
      Math,
      data.map(function (o) {
        return o.y;
      }),
    );

  let heightProp = SIZE / 3.8;
  let widthProp = SIZE - 114;
  // console.log(`max`, max);

  const points = monotoneCubicInterpolation({ data, range: 40 });
  if(sleepGraphData) {
    return (
      <DataGraph 
        data={sleepGraphData?.weeklyData}
        yAxisLabel=''
        yAxisSuffix='hr'
        graphType={graphType}
        setDuration={setDuration}
        duration={Duration}
      />
    );
  } else if (dataOfWeatherGraph) {
    return (
      <DataGraph 
        data={dataOfWeatherGraph}
        yAxisLabel=''
        yAxisSuffix=" &#186;C"
        graphType={graphType}
        // setDuration={setDuration}
        duration={durationTypes.daily}
      />
    );
  } else if (weeklyHealthGraphData) {
    return (
      <DataGraph
        data={weeklyHealthGraphData}
        yAxisLabel=""
        yAxisSuffix=""
        graphType={graphType}
        // setDuration={setDuration}
        duration={durationTypes.week}
      />
    );
  }
  return (
    <View
      style={{
        backgroundColor: '#7965F6',
        marginBottom: 100,
        borderRadius: 25,
        width: SIZE,
        height: SIZE / 1.8,
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
        {!isDailyDisabled && (
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
            backgroundColor: Duration === durationTypes.week ? '#5E4ADC' : '#7965F6',
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
            backgroundColor: Duration === durationTypes.monthly ? '#5E4ADC' : '#7965F6',
            borderRadius: 14,
            marginHorizontal: 6,
          }}>
          <Text
            style={{ color: 'white', fontSize: 13, fontFamily: RubikRegular }}>
            MONTH
          </Text>
        </TouchableOpacity>
      </View>
      {/* <ChartPathProvider
        data={{
          points,
          smoothingStrategy: 'bezier',
        }}> */}
      {/* <ChartPath height={SIZE / 3.8} stroke="#70DEEC" width={SIZE - 100} /> */}
      {/* <ChartDot
          style={{
            backgroundColor: 'blue',
          }}
        /> */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', flex: 1, marginLeft: 30 }}>
          <View style={styles.lineDayContainer}>
            <View style={styles.lineParent}>
              <View style={styles.LineParentView} />
            </View>
            {/* <Text style={[styles.DayText, {left: -10}]}> */}
            <Text style={[styles.DayText]}>
              {Duration == durationTypes.daily ? '12 AM' : data?.[0]?.day ?? 'Mo'}
            </Text>
          </View>
          <View>
            <View style={styles.lineParent}>
              <View style={styles.LineParentView} />
            </View>
            <Text style={styles.DayText}>
              {Duration == durationTypes.daily ? '4' : data?.[1]?.day ?? 'Tu'}
            </Text>
          </View>
          <View>
            <View style={styles.lineParent}>
              <View style={styles.LineParentView} />
            </View>
            <Text style={styles.DayText}>
              {Duration == durationTypes.daily ? '8' : data?.[2]?.day ?? 'We'}
            </Text>
          </View>
          <View>
            <View style={styles.lineParent}>
              <View style={styles.LineParentView} />
            </View>
            {/* <Text style={[styles.DayText, {left: -10}]}> */}
            <Text style={[styles.DayText]}>
              {Duration == durationTypes.daily ? '12 PM' : data?.[3]?.day ?? 'Th'}
            </Text>
          </View>
          <View>
            <View style={styles.lineParent}>
              <View style={styles.LineParentView} />
            </View>
            <Text style={styles.DayText}>
              {Duration == durationTypes.daily ? '4' : data?.[4]?.day ?? 'Fr'}
            </Text>
          </View>
          <View>
            <View style={styles.lineParent}>
              <View style={styles.LineParentView} />
            </View>
            <Text style={styles.DayText}>
              {Duration == durationTypes.daily ? '8' : data?.[5]?.day ?? 'Sa'}
            </Text>
          </View>
          <View>
            <View style={styles.lineParent}>
              <View style={styles.LineParentView} />
            </View>
            {/* <Text style={[styles.DayText, {left: -10}]}> */}
            <Text style={[styles.DayText]}>
              {Duration == durationTypes.daily ? '12 AM' : data?.[6]?.day ?? 'Sa'}
            </Text>
          </View>
          {/* <Text style={{width: (SIZE - 70) / 7}}>Tu</Text>
            <Text style={{width: (SIZE - 70) / 7}}>We</Text>
            <Text style={{width: (SIZE - 70) / 7}}>Th</Text>
            <Text style={{width: (SIZE - 70) / 7}}>Fr</Text>
            <Text style={{width: (SIZE - 70) / 7}}>Sa</Text>
            <Text style={{width: (SIZE - 70) / 7}}>Su</Text> */}
          {data !== null && (
            <GraphBezierCustom
              abs
              heightProp={heightProp}
              H={4.8}
              stroke="#70DEEC"
              widthProp={widthProp}
              fitness={fitness}
              sleep={sleepGraphData}
              Duration={Duration}
              // W={100}
              check={dataFunction()}
              data={data}
              max={max}
            />
          )}
        </View>
      </View>
      {/* <Text>Hi</Text> */}
      {/* </ChartPathProvider> */}
    </View>
  );
};

const styles = StyleSheet.create({
  lineDayContainer: {
    // alignItems: 'center'
  },
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

//Early way if graph in steps

// [
//   {x: 1, y: 0},
//   {
//     x: 2,
//     y:
//       Duration === durationTypes.daily
//         ? UserData.TodayAllSteps !== null
//           ? 1 + UserData.TodayAllSteps[0].two
//           : 0
//         : 0,
//   },
//   {
//     x: 3,
//     y:
//       Duration === durationTypes.daily
//         ? UserData.TodayAllSteps !== null
//           ? UserData.TodayAllSteps[0].three
//           : 1
//         : 1,
//   },
//   {
//     x: 4,
//     y:
//       Duration === durationTypes.daily
//         ? UserData.TodayAllSteps !== null
//           ? UserData.TodayAllSteps[0].four
//           : 0
//         : 0,
//   },
//   {
//     x: 5,
//     y:
//       Duration === durationTypes.daily
//         ? UserData.TodayAllSteps !== null
//           ? UserData.TodayAllSteps[0].five
//           : 0
//         : 0,
//   },
//   {
//     x: 6,
//     y:
//       Duration === durationTypes.daily
//         ? UserData.TodayAllSteps !== null
//           ? UserData.TodayAllSteps[0].six
//           : 0
//         : 0,
//   },
//   {
//     x: 7,
//     y:
//       Duration === durationTypes.daily
//         ? UserData.TodayAllSteps !== null
//           ? UserData.TodayAllSteps[0].seven
//           : 0
//         : 0,
//   },
// ];
