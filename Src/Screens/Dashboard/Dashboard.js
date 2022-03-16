import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { getFontSize, horizontalScale, metrics } from '../../Constants/sizeChoose';
import Images from '../../Constants/Images/Images';
import DashboardGraph, {
  FitnessTab,
  LightTab,
  ScreenTimeTab,
  SleepQualityTab,
  StandTimeTab,
  WeatherTab,
} from './DashboardGraph';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {getMyDeviceId} from '../../services/commonService';
import {useDispatch, useSelector} from 'react-redux';
import PostRequestApi from '../../apirequest/PostRequestApi';
import moment from 'moment';
import getStore from '../../redux';
import { RubikMedium, RubikRegular } from '../../Constants/fonts/Fonts';
import { ViewIcon } from '../../../assets/svg/ViewIcon';
import {SetDashboardMoodData} from '../../redux/actions/actions';

const Tab = createMaterialTopTabNavigator();
// const characterDemoData = [
//   { x: 'Monday', y: 18, fill: '#E74C3C' },
//   { x: 'Tuesday', y: 24, fill: '#CDE73C' },
//   { x: 'Wednesday', y: 8, fill: '#3FE73C' },
//   { x: 'Thursday', y: 32, fill: '#3CE7E4' },
//   { x: 'Friday', y: 45, fill: '#3C5EE7' },
//   { x: 'Saturday', y: 80, fill: '#9C3CE7' },
//   { x: 'Sunday', y: 62, fill: '#E73CB8' },
// ];

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
  const [moods, setMoods] = useState(null);
  const [moodId, setMoodId] = useState(null);
  const [characterData, setCharacterData] = useState(null);
  // const [maxima, setMaxima] = useState(getMaxima(characterData));
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();

  const getMoodsApi = useCallback((id) => {
    const deviceId = getMyDeviceId();
    const params = {
      device_id: deviceId,
      email: getStore?.()?.getState?.()?.First?.UserEmail ?? '',
      user_id: getStore?.()?.getState?.()?.First?.UserId ?? '',
      start_date: moment()
        .subtract(7, 'days')
        .utcOffset(600)
        .format('YYYY-MM-DD'),
      end_date: moment().utcOffset(600).format('YYYY-MM-DD'),
      mood_id: id ?? '',
    };
    console.log('getRadarGraphMoodPercent api params --->', params);
    PostRequestApi('getRadarGraphMoodPercent', params)
      .then((res) => {
        console.log('✅ ✅ ✅ getRadarGraphMoodPercent api success✅ ✅ ✅', res?.data?.staffMoods, res?.data?.mood_data);
        if (Array.isArray(res?.data?.staffMoods)) {
          setMoods([...res.data.staffMoods]);
          setCharacterData(res.data.staffMoods?.map((e, idx) => ({
            x: e?.moodName ?? '',
            y: !isNaN(e?.percentage) ? Number(e.percentage) : 0,
            fill: e?.color ?? '#648DE7',
          })));
        } else if (res?.data?.mood_data) {
          let c = '';
          res.data.mood_data.forEach((e) => {
            if (c === '') {
              c = e?.color;
            }
          });
          setCharacterData(res.data.mood_data?.map((e, idx) => ({
            x: e?.day ?? '',
            y: !isNaN(e?.percentage) ? Number(e.percentage) : 0,
            fill: c,
          })));
        } else {
          setCharacterData(null);
        }
      })
      .catch((error) => {
        console.log('❌❌❌❌getRadarGraphMoodPercent error:❌❌❌❌', error);
      });
  }, []);

  const onPressMoodItem = useCallback((item) => () => {
      let m = getStore?.().getState?.()?.First?.dashboardMoodId ?? null;
      let n = getStore?.().getState?.()?.First?.dashboardMoodName ?? null;
      if (item.id === m) {
        m = '';
        n = '';
        getMoodsApi();
      } else {
        m = item.id;
        n = item?.moodName ?? '';
        getMoodsApi(item.id);
      }
      dispatch(SetDashboardMoodData({dashboardMoodId: m, dashboardMoodName: n}));
    }, []);

  useEffect(() => {
    getMoodsApi();
  }, []);

  const moodItem = (item, index) => {
    let id = getStore?.()?.getState?.()?.First?.dashboardMoodId ?? '';
    // let id = null;
    // setMoodId((e) => {
    //   id = e;
    //   return e;
    // });
    if (id !== '' && id !== item.id) {
      return null;
    }
    const isActive = id === item.id;
    return (
      <View style={styles.itemContainer} key={item?.id ?? String(index)}>
        <Image source={Images[item?.moodName?.toLowerCase?.() ?? 'happy']} />
        <View style={styles.itemSubView}>
          <View style={styles.itemMoodTextContainer}>
            <Text style={styles.itemMoodName}>{item.moodName}</Text>
            <Text style={styles.itemMoodValue}>{`${item.percentage}%`}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.itemMoodProgress,
                {
                  backgroundColor: item?.color ?? '#648DE7',
                  width: `${item?.percentage ?? 0}%`,
                },
              ]}
            />
          </View>
        </View>
        <TouchableOpacity
          style={
            isActive === true
              ? styles.viewActiveButton
              : styles.viewInactiveButton
          }
          onPress={onPressMoodItem(item, index)}>
          <ViewIcon
            width={horizontalScale(18)}
            height={horizontalScale(14)}
            color={isActive === true ? '#FFFFFF' : '#7265E3'}
          />
          <Text
            style={
              isActive === true
                ? styles.viewActiveText
                : styles.viewInactiveText
            }>
            View
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        )}
        <View style={styles.graphContainer}>
          {Array.isArray(characterData) && characterData.length > 0 && (
            <DashboardGraph data={characterData} />
          )}
          {
            (Array.isArray(moods)) && moods.length > 0 && (
              <View style={styles.moodsContainer}>
                {
                  moods.map((item, index) => <>{moodItem(item, index)}</>)
                }
              </View>
            )
          }
          <View style={styles.tabContainer}>
            <Tab.Navigator
              tabBarOptions={{
                labelStyle: styles.tabLabelStyle,
                tabStyle: styles.tabStyle,
                scrollEnabled: true,
              }}>
              <Tab.Screen name="Light" options={{ tabBarLabel: 'Light' }} component={LightTab} />
              {Platform.OS === 'ios' && <Tab.Screen name="Standing" options={{ tabBarLabel: 'Standing' }} component={StandTimeTab} />}
              {Platform.OS === 'android' && <Tab.Screen name="Screen Time" options={{ tabBarLabel: 'Screen Time' }} component={ScreenTimeTab} />}
              <Tab.Screen name="Activity" options={{ tabBarLabel: 'Activity' }} component={FitnessTab} />
              <Tab.Screen name="Weather" options={{ tabBarLabel: 'Weather' }} component={WeatherTab} />
              <Tab.Screen name="Sleep Quality" options={{ tabBarLabel: 'Sleep Quality' }} component={SleepQualityTab} />
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
    marginTop: horizontalScale(50),
    backgroundColor: '#FFFFFF',
  },
  moodsContainer: {
    width: '100%',
    marginTop: horizontalScale(55),
  },
  tabContainer: {
    flex: 1,
    width: metrics.screenWidth,
    backgroundColor: '#FFFFFF',
  },
  tabLabelStyle: {
    fontSize: getFontSize(12),
    textTransform: 'none',
  },
  tabStyle: {
    width: horizontalScale(120),
  },
  itemContainer: {
    flexDirection: 'row',
    width: metrics.screenWidth,
    alignItems: 'center',
    paddingHorizontal: horizontalScale(15),
    marginBottom: horizontalScale(43),
  },
  itemSubView: {
    flex: 1,
    marginLeft: horizontalScale(18),
  },
  itemMoodTextContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  itemMoodName: {
    fontSize: getFontSize(14),
    fontFamily: RubikRegular,
    color: '#4C5F79',
  },
  itemMoodValue: {
    fontSize: getFontSize(14),
    fontFamily: RubikMedium,
    color: '#4C5F79',
  },
  progressBarContainer: {
    marginTop: horizontalScale(7),
    height: horizontalScale(7),
    borderRadius: horizontalScale(7),
    width: '100%',
    backgroundColor: '#F1F1F1',
  },
  itemMoodProgress: {
    height: horizontalScale(7),
    borderRadius: horizontalScale(7),
    // width: '0%',
    backgroundColor: '#F1F1F1',
  },
  viewInactiveButton: {
    flexDirection: 'row',
    padding: horizontalScale(8),
    borderWidth: 1,
    borderColor: '#7265E3',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginLeft: horizontalScale(28),
  },
  viewActiveButton: {
    flexDirection: 'row',
    padding: horizontalScale(8),
    backgroundColor: '#7265E3',
    borderRadius: 2,
    marginLeft: horizontalScale(28),
  },
  viewInactiveText: {
    marginLeft: horizontalScale(8),
    fontSize: getFontSize(12),
    fontFamily: RubikMedium,
    color: '#7265E3',
  },
  viewActiveText: {
    marginLeft: horizontalScale(8),
    fontSize: getFontSize(12),
    fontFamily: RubikMedium,
    color: '#FFFFFF',
  },
});
