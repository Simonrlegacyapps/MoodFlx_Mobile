import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  StyleSheet,
} from 'react-native';
import { getFontSize, horizontalScale, metrics } from '../../Constants/sizeChoose';
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
import { getLightGraphData, getMyDeviceId } from '../../services/commonService';
import getStore from '../../redux';
import axios from 'axios';
import moment from 'moment';
import PostRequestApi from '../../apirequest/PostRequestApi';
import { getApiBaseUrl } from '../../Constants/constants';
import ScreenCircleBar from '../../Components/ScreenCircleBar/ScreenCircleBar';

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

function DashboardGraph({data}) {
  return (
    <VictoryChart polar
      theme={VictoryTheme.material}
      startAngle={90}
      endAngle={450}
      domain={{ y: [0, 100] }}
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
              tickFormat={(t) => e.x === 'Monday' ? t : ""}
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
