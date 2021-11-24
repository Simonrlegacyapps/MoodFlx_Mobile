import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  StyleSheet,
} from 'react-native';
import { getFontSize, horizontalScale, isTablet, metrics } from '../../Constants/sizeChoose';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryArea,
  VictoryPolarAxis,
  VictoryLabel,
  VictoryScatter,
} from 'victory-native';
import LightGraph from '../../Components/LightGraph/LightGraph';
import { getLightGraphData, getMyDeviceId, getScreenGraphData, getStandGraphData, getWeeklyHealthGraphData } from '../../services/commonService';
import getStore from '../../redux';
import axios from 'axios';
import moment from 'moment';
import PostRequestApi from '../../apirequest/PostRequestApi';
import { dataTypes, getApiBaseUrl } from '../../Constants/constants';
import ScreenCircleBar from '../../Components/ScreenCircleBar/ScreenCircleBar';
import ScreenTimeBarGraph from '../../Components/ScreenTimeGraph/ScreenTimeBarGraph';
import {useSelector, useDispatch} from 'react-redux';
import GraphicChart from '../../Components/GraphicChart/GraphicChart';
import GraphBezierCustom from '../../Components/GraphBezierCustom/GraphBezierCustom';
import BarGraph from '../../Components/BarChart/BarGraph';
import { IndicatorHelper } from '../../Components/CommonComponents/CommonComponents';
import { getSleepGraphData } from '../Home/SleepData/sleepDataService';
// const characterData = [
//   { x: 'Monday', y: 18, fill: '#E74C3C' },
//   { x: 'Tuesday', y: 24, fill: '#CDE73C' },
//   { x: 'Wednesday', y: 8, fill: '#3FE73C' },
//   { x: 'Thursday', y: 32, fill: '#3CE7E4' },
//   { x: 'Friday', y: 45, fill: '#3C5EE7' },
//   { x: 'Saturday', y: 80, fill: '#9C3CE7' },
//   { x: 'Sunday', y: 62, fill: '#E73CB8' },
// ];
const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: horizontalScale(38),
  },
  progressContainer: {
    marginTop: horizontalScale(5),
  },
});

export function LightTab(props) {
  const [lightGraphData, setLightGraphData] = useState(null);
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  
  const callGetLightApi = () => {
    const deviceId = getMyDeviceId();
    const params = {
      "device_id": deviceId,
      "email": getStore?.()?.getState?.().First.UserEmail ?? "",
      "user_id": getStore?.()?.getState?.().First.UserId ?? ""
    };
    console.log('callGetLightApi params ==> ', params);
    axios.post(`${getApiBaseUrl()}getLightReport`, params)
      .then(function (response) {
        console.log('✅ ✅ ✅ ✅ Success Get Light Data ✅ ✅ ✅ ✅');
        console.log('Get Light Data response: ', response?.data?.lightData);
        console.log('Get Light Data response: ', Object.values(response?.data?.lightData));
        if (response?.data?.lightData) {
          const lightArray = Object.values(response?.data?.lightData);
          if (Array.isArray(lightArray) && lightArray.length > 0) {
            const lightGraphData = getLightGraphData(lightArray);
            console.log('lightGraphData: ', lightGraphData);
            setLightGraphData(lightGraphData);
          }
        }
      })
      .catch(function (error) {
        console.log('❌ ❌ ❌ ❌ Error Get Light Data ❌ ❌ ❌ ❌', error, 'params', params);
      });
  };

  useEffect(() => {
    callGetLightApi();
  }, []);

  return (
    <View style={lightStyles.container}>
      <LightGraph data={lightGraphData} graphWidth={metrics.screenWidth} />
      <View style={lightStyles.progressContainer}>
        <ScreenCircleBar
          DarkColor="#FDB007"
          lightColor="#E5F9FC"
          Label="Av. High"
          Time="24%"
          value={15}
          size={horizontalScale(36)}
          width={horizontalScale(5)}
          fontSize={getFontSize(15)}
        />
        <ScreenCircleBar
          DarkColor="#FDB007"
          lightColor="#E5F9FC"
          Label="Av. Ideal"
          Time="42%"
          value={15}
          size={horizontalScale(36)}
          width={horizontalScale(5)}
          fontSize={getFontSize(15)}
        />
        <ScreenCircleBar
          DarkColor="#FDB007"
          lightColor="#E5F9FC"
          Label="Av. Low"
          Time="34%"
          value={15}
          size={horizontalScale(36)}
          width={horizontalScale(5)}
          fontSize={getFontSize(15)}
        />
      </View>
    </View>
  );
}

const standTimeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: horizontalScale(38),
  },
});

export function StandTimeTab(props) {
  const [graphData, setGraphData] = useState(null);
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  
  const getStandTimeApi = () => {
    const params = {
      device_id: getMyDeviceId(),
      email: getStore?.()?.getState?.()?.First?.UserEmail,
      user_id: getStore?.()?.getState?.()?.First?.UserId,
    };
    PostRequestApi('getStandingTimeReport', params)
      .then((data) => {
        console.log('✅ ✅ ✅ ✅ getStandingTimeReport api success✅ ✅ ✅ ✅ -data---->', data?.data?.standingData);
        let standDataArray = Object.values(data?.data?.standingData);
        if (Array.isArray(standDataArray) && standDataArray.length > 0) {
          setGraphData(getStandGraphData(standDataArray));
        }
      })
      .catch((error) => {
        console.log('❌ ❌ ❌ ❌ Error in get set Standing Time DATA❌ ❌ ❌ ❌ : ', error);
      });
  };

  useEffect(() => {
    if (UserData.StandTimePermission === true) {
      getStandTimeApi();
    }
  }, [UserData.StandTimePermission]);

  return (
    <View style={standTimeStyles.container}>
      <ScreenTimeBarGraph graphWidth={metrics.screenWidth} data={graphData} />
    </View>
  );
}

const screenTimeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: horizontalScale(38),
  },
});

export function ScreenTimeTab(props) {
  const [graphData, setGraphData] = useState(null);
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  
  const getScreenTimeApi = () => {
    const params = {
      device_id: getMyDeviceId(),
      email: getStore?.()?.getState?.()?.First?.UserEmail,
      user_id: getStore?.()?.getState?.()?.First?.UserId,
    };
    PostRequestApi('getScreenTimeReport', params)
      .then((data) => {
        console.log('✅ ✅ ✅ ✅ getScreenTimeReport api success✅ ✅ ✅ ✅ -data---->', data?.data);
        let screenDataArray = Object.values(data?.data?.screenData);
        if (Array.isArray(screenDataArray) && screenDataArray.length > 0) {
          setGraphData(getScreenGraphData(screenDataArray));
        }
      })
      .catch((error) => {
        console.log('❌ ❌ ❌ ❌ Error in get set Standing Time DATA❌ ❌ ❌ ❌ : ', error);
      });
  };

  useEffect(() => {
    if (UserData.ScreenTimePermission === true) {
      getScreenTimeApi();
    }
  }, [UserData.ScreenTimePermission]);

  return (
    <View style={screenTimeStyles.container}>
      <ScreenTimeBarGraph graphWidth={metrics.screenWidth} data={graphData} />
    </View>
  );
}

const fitnessStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: horizontalScale(38),
  },
});

export function FitnessTab(props) {
  const [weeklyHealthGraphData, setWeeklyHealthGraphData] = useState(null);
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  
  const callGetHealthDataApi = () => {
    const deviceId = getMyDeviceId();
    const store = getStore?.()?.getState?.();
    const params = {
      device_id: deviceId,
      email: store?.First?.UserEmail ?? '',
      user_id: store?.First?.UserId ?? '',
    };
    console.log('getHealthData params --->', params);
    PostRequestApi('getHealthData', params)
      .then((res) => {
        console.log('✅ ✅ ✅ ✅ Success getHealthData ✅ ✅ ✅ ✅', res?.data);
        setWeeklyHealthGraphData(getWeeklyHealthGraphData(res?.data?.healthData));
      })
      .catch(function (error) {
        console.log('❌ ❌ ❌ ❌ Error getHealthData ❌ ❌ ❌ ❌', error);
      });
  };

  useEffect(() => {
    if (UserData.HealthPermission === true) {
      callGetHealthDataApi();
    }
  }, [UserData.HealthPermission]);

  return (
    <View style={fitnessStyles.container}>
      <GraphicChart
        fitness={true}
        graphType={dataTypes.activity}
        // zero={zero}
        // ones={ones}
        // twos={twos}
        // threes={threes}
        // fours={fours}
        // fives={fives}
        weeklyHealthGraphData={weeklyHealthGraphData}
      />
    </View>
  );
}

const weatherStyles = StyleSheet.create({
  subContainer: {
    marginBottom: horizontalScale(50),
    alignItems: 'center',
  },
  graphContainer: {
    position: 'absolute',
    left: metrics.screenWidth / 6,
    marginTop: horizontalScale(30),
  },
  indicatorHelperContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: horizontalScale(15),
  },

});

export function WeatherTab(props) {
  const [minMaxGraphHeight, setMinMaxGraphHeight] = useState(horizontalScale(200));
  const [weatherDuration, setWeatherDuration] = useState('Week');
  const [Graph, setGraph] = useState(null);

  const isMinMaxHeightSet = useRef(false);

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  let widthProp = isTablet
    ? Math.round(metrics.screenWidth - metrics.screenWidth * 0.48)
    : Math.round(metrics.screenWidth - 138);

  const onLayoutMinMaxGraphView = (e) => {
    !isMinMaxHeightSet.current &&
      setMinMaxGraphHeight((h) =>
        !isNaN(e?.nativeEvent?.layout?.height)
          ? Math.floor(e.nativeEvent.layout.height)
          : h,
      );
    isMinMaxHeightSet.current = true;
  };

  const getWeather = () => {
    const deviceId = getMyDeviceId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      device_id: deviceId,
      email: getStore?.()?.getState?.().First.UserEmail ?? "",
      user_id: getStore?.()?.getState?.().First.UserId ?? ""
    });

    // console.log(`raw of weather graph data`, raw);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    console.log(`Weather Graph Data Params`, raw);
    fetch(`${getApiBaseUrl()}getWeatherReport`, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log('Get weather Graph data', result);
        console.log(' ✅ ✅ ✅ ✅ Get Weather Success ✅ ✅ ✅ ✅ ');
        setGraph(result.weatherData);
        // data.push({});
        // await syncWeatherData();
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    if (UserData.WeatherPermission === true) {
      getWeather();
    }
  }, [UserData.WeatherPermission]);

  const data = [
    {
      x: 1,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[6]?.temp_max
            ? 0
            : Graph[6] && Graph[6].temp_max
          : 0,
    },
    {
      x: 2,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[5]?.temp_max
            ? 0
            : Graph[5].temp_max
          : 0,
    },
    {
      x: 3,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[4]?.temp_max
            ? 0
            : Graph[4].temp_max
          : 0,
    },
    {
      x: 4,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[3]?.temp_max
            ? 0
            : Graph[3].temp_max
          : 0,
    },
    {
      x: 5,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[2]?.temp_max
            ? 0
            : Graph[2].temp_max
          : 0,
    },
    {
      x: 6,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[1]?.temp_max
            ? 0
            : Graph[1].temp_max
          : 0,
    },
    {
      x: 7,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[0]?.temp_max
            ? 0
            : Graph[0].temp_max
          : 0,
    },
  ];

  const dataLow = [
    {
      x: 1,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[6]?.temp_min
            ? 0
            : Graph[6] && Graph[6].temp_min
          : 0,
    },
    {
      x: 2,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[5]?.temp_min
            ? 0
            : Graph[5].temp_min
          : 0,
    },
    {
      x: 3,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[4]?.temp_min
            ? 0
            : Graph[4].temp_min
          : 0,
    },
    {
      x: 4,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[3]?.temp_min
            ? 0
            : Graph[3].temp_min
          : 0,
    },
    {
      x: 5,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[2]?.temp_min
            ? 0
            : Graph[2].temp_min
          : 0,
    },
    {
      x: 6,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[1]?.temp_min
            ? 0
            : Graph[1].temp_min
          : 0,
    },
    {
      x: 7,
      y:
        Graph && weatherDuration === 'Week'
          ? !Graph[0]?.temp_min
            ? 0
            : Graph[0].temp_min
          : 0,
    },
  ];

  const max =
    data &&
    Math.max.apply(
      Math,
      data.map(function (o) {
        return o.y;
      }),
    );

  const Lowmax =
    dataLow &&
    Math.max.apply(
      Math,
      dataLow.map(function (o) {
        return o.y;
      }),
    );

  const Lowmin =
    dataLow &&
    Math.min.apply(
      Math,
      dataLow.map(function (o) {
        return o.y;
      }),
    );

  return (
    <View style={standTimeStyles.container}>
      <View style={weatherStyles.subContainer}>
        {/* {swiperIndex == index && ( */}
        {true && (
          <BarGraph
            max={max}
            min={Lowmin}
            color={'#7265E3'}
            TopLabels
            ShowPollen={true}
            RightBar={true}
          />
        )}
        <View
          style={weatherStyles.graphContainer}>
          {/* {swiperIndex == index && ( */}
          <View onLayout={onLayoutMinMaxGraphView}>
            <View style={{ position: 'absolute' }}>
              <GraphBezierCustom
                // abs
                heightProp={minMaxGraphHeight}
                stroke="#F4227E"
                widthProp={widthProp}
                data={data}
                max={max}
                H={9}
              />
            </View>
            <View style={{ marginTop: 0 }}>
              <GraphBezierCustom
                heightProp={minMaxGraphHeight}
                stroke="#70DEEC"
                widthProp={widthProp}
                data={dataLow}
                max={Lowmax}
                H={9}
              />
            </View>
          </View>
        </View>
        <View
          style={weatherStyles.indicatorHelperContainer}>
          <IndicatorHelper color={'#7FE3F0'} text={'Min ºC'} />
          <IndicatorHelper color={'#FC4190'} text={'Max ºC'} />
          <IndicatorHelper color={'#7265E3'} text={'Rainfall'} />
          <IndicatorHelper color={'#0DDE7A'} text={'Pollen'} />
        </View>
      </View>
    </View>
  );
}

const sleepQualityStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: horizontalScale(38),
  },
  progressContainer: {
    marginTop: horizontalScale(5),
  },
});

export function SleepQualityTab(props) {
  const [graphData, setGraphData] = useState(null);
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  
  const callGetSleepDataApi = () => {
    const deviceId = getMyDeviceId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var params = {
      device_id: deviceId,
      email: getStore?.()?.getState?.().First.UserEmail ?? "",
      user_id: getStore?.()?.getState?.().First.UserId ?? ""
    };
    // var raw = JSON.stringify({
    //   device_id: deviceId,
    //   email: UserData?.UserEmail ?? '',
    //   user_id: UserData?.UserId ?? '',
    // });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(params),
      // redirect: 'follow',
    };

    console.log(`Get Sleep Data Params`, params);
    fetch(`${getApiBaseUrl()}getSleepQualityReport`, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log(' ✅ ✅ ✅ ✅ Get Sleep Data Success ✅ ✅ ✅ ✅ ', JSON.stringify(result));
        const inBedArray = result?.sleepData?.INBED ? Object.values(result.sleepData.INBED) : [];
        const asleepArray = result?.sleepData?.ASLEEP ? Object.values(result.sleepData.ASLEEP) : [];
        const graphData = getSleepGraphData({ weeklyData: { ASLEEP: asleepArray, INBED: inBedArray } });
        console.log('graphData: ', graphData);
        setGraphData(graphData);
      })
      .catch(function (error) {
        console.log('❌❌❌❌Fail Get Sleep Data❌❌❌❌', error, params);
      });
  };

  useEffect(() => {
    if (UserData.SleepPermission === true) {
      callGetSleepDataApi();
    }
  }, [UserData.SleepPermission]);

  return (
    <View style={sleepQualityStyles.container}>
      <GraphicChart
        isDailyDisabled={true}
        sleepGraphData={graphData}
        graphType={dataTypes.sleep}
      />
    </View>
  );
}

function DashboardGraph({data}) {
  return (
    <VictoryChart polar
      theme={VictoryTheme.material}
      startAngle={90}
      endAngle={450}
      // domain={{ y: [0, 100] }}
    >
      <VictoryGroup colorScale={["#648DE7", "orange", "tomato"]}
        style={{ data: { fillOpacity: 0.2, strokeWidth: 2 } }}
      >
        <VictoryArea key={100} data={data} />
      </VictoryGroup>
      <VictoryScatter
        style={{ data: { fill: ({ datum }) => datum?.fill } }}
        size={5}
        data={data}
      />
      {
        data.map((e, i) => {
          return (
            <VictoryPolarAxis key={i} dependentAxis
              style={{
                axisLabel: { padding: 20 },
                axis: { stroke: "none" },
                grid: { stroke: "grey", strokeWidth: 0.25, opacity: 0.5 },
              }}
              tickLabelComponent={
                <VictoryLabel labelPlacement="vertical" />
              }
              labelPlacement="perpendicular"
              axisValue={i + 1}
              label={e.x}
              tickFormat={(t) => e.x === data?.[0]?.x ? t : ""}
            // tickValues={[0.25, 0.5, 0.75]}
            />
          );
        })
      }
      <VictoryPolarAxis
        labelPlacement="parallel"
        tickFormat={() => ""}
        style={{
          axis: { stroke: "none" },
          grid: { stroke: "grey", opacity: 0.5 }
        }}
      />
    </VictoryChart>
  );
}

export default DashboardGraph;
