import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Constants from '../../../Constants';
import {
  RubikExtraBold,
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
// import ProgressBar from 'react-native-animated-progress';
import ProgressBar from '../../../Components/ProgressBar/ProgressBarCustom';
import HomeHeader from '../../../Components/HomeHeader/HomeHeader';
import BarGraph from '../../../Components/BarChart/BarGraph';
import BezierGraphAuto from '../../../Components/BezierGraphAuto/BezierGraphAuto';
import GraphicChart from '../../../Components/GraphicChart/GraphicChart';
import moment from 'moment';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-community/async-storage';
import GraphBezierCustom from '../../../Components/GraphBezierCustom/GraphBezierCustom';
import PopUp from '../../../Components/PopUp/PopUp';
import DeviceInfo from 'react-native-device-info';
import GetLocation from 'react-native-get-location';
import {dynamicSize} from '../../../Constants/sizeChoose';
import EditManualWeatherModal from '../../../Components/Modals/EditManualWeather/EditManualWeatherModal';
import {Lat, Long, WeatherPerm} from '../../../redux/actions/actions';
import DateExpiredModal from '../../../Components/Modals/DateExpiredModal/DateExpiredModal';
import AnonymousPopUp from '../../../Components/Modals/AnonymousPopUp/AnonymousPopUp';
import WeatherGraphDurationModal from '../../../Components/Modals/WeatherGraphDurationModal/WeatherGraphDurationModal';
import { weatherActions, weatherApiDataTypes, weatherTypes } from '../../../Constants/constants';

export const {width: SIZE, height: HEIGHT} = Dimensions.get('window');

const IndicatorHelper = ({color, text}) => {
  return (
    <View style={styles.indicatorHelperView}>
      <View style={[styles.indicatorHelper, {backgroundColor: color}]} />
      <Text style={styles.indicatorText}>{text}</Text>
    </View>
  );
};

const WeatherData = ({
  CheckForWeather,
  // PermWeather,
  // Weather,
  // data,
  // dataLow,
  // lat,
  // long,
  tryWeather,
  MoodCount,
  swiperIndex,
}) => {
  const [temp, settemp] = useState([]);
  const [One, setOne] = useState(null);
  const [Two, setTwo] = useState(null);
  const [Three, setThree] = useState(null);
  const [Four, setFour] = useState(null);
  const [Five, setFive] = useState(null);
  const [WeatherDay, setWeatherDay] = useState(null);
  const [hours, sethours] = useState(0);
  const [EditManualWeather, setEditManualWeather] = useState(false);
  const [ManualTemp, setManualTemp] = useState(null);
  const [ManulHours, setManulHours] = useState(null);
  const [ManulPollen, setManulPollen] = useState(null);
  const [ManualWeatherType, setManualWeatherType] = useState(null);
  const [AllDayWeather, setAllDayWeather] = useState(null);
  const [Graph, setGraph] = useState(null);
  const [WeatherPopUp, setWeatherPopUp] = useState(false);
  const [AnonymousClick, setAnonymousClick] = useState(false);
  const [WeatherDurationModal, setWeatherDurationModal] = useState(false);
  const [WeatherDuration, setWeatherDuration] = useState('Week');

  const a = moment().subtract(0, 'days').startOf('day').toString();
  const b = moment().subtract(1, 'days').startOf('day').toString();
  const c = moment().subtract(2, 'days').startOf('day').toString();
  const d = moment().subtract(3, 'days').startOf('day').toString();
  const e = moment().subtract(4, 'days').startOf('day').toString();
  // console.log('tryWeather', tryWeather);

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  const [openActionSheet, setOpenActionSheet] = useState(false);

  let Weather = UserData.DayTemperature;

  // console.log(`Weather`, UserData.DayTemperature);

  useEffect(() => {
    if (swiperIndex == 2 && UserData.WeatherPermission) {
      getUserLocation();
    }
  }, [swiperIndex]);

  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        console.log('Success', location);
        // setlat(location.latitude);
        dispatch(Lat(location.latitude));
        // setlng(location.longitude);
        dispatch(Long(location.longitude));
        if (UserData.lat == null || UserData.lon == null) {
          WeatherDayData(location.latitude, location.longitude);
        }
      })
      .catch((error) => {
        const {code, message} = error;
        console.log('error', code, message);
      });
  };

  let valueHours = 0;
  const WeatherDayData = (loc_lat, loc_long) => {
    let value = 0;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${loc_lat}&lon=${loc_long}&dt=${
          Date.parse(a) / 1000
        }&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
      )
      .then(async (response) => {
        console.log(`weather day data api success response`, response);
        console.log(`weather day data api success response`, JSON.stringify(response));
        setAllDayWeather(response.data.hourly);
        if (UserData.DayTemperature) {
          for (let i in response.data.hourly) {
            if (
              Weather.weather[0].description ===
              response.data.hourly[i].weather[0].description
            ) {
              value = value + 1;
              sethours(value);
              valueHours = value;
            }
          }
        } else {
          CheckForWeather(loc_lat, loc_long);
        }
      })
      .catch(function (error) {
        console.log(`error for weather here`, error);
      });
  };

  const findWeather = (value) => {
    console.log(`findWeather value`, value);
    const v = value?.toLowerCase?.() ?? value;
    return weatherApiDataTypes?.[v] ?? weatherTypes.Rainy;
  };
console.log('UserData?.DayTemperature?.weather', UserData?.DayTemperature)
  const syncWeatherData = async () => {
    let geocode = null;
    Geocoder.init('AIzaSyD8BafHP8VtNFGyMg4uozFJcgsBaKDxS9s');
    var state_info = '';
    var city_info = '';
    var country_info = '';
    await Geocoder.from({
      lat: UserData.lat,
      lng: UserData.lon,
    })
      .then((data) => {
        geocode = data.plus_code.compound_code;
        const address_list = data.results[0].address_components;
        for (i = 0; i < address_list.length; i++) {
          if (address_list[i].types.includes('country')) {
            country_info = address_list[i].long_name;
          }
          if (address_list[i].types.includes('administrative_area_level_1')) {
            state_info = address_list[i].long_name;
          }
          if (address_list[i].types.includes('administrative_area_level_2')) {
            city_info = address_list[i].long_name;
          }
        }
      })
      .catch((err) => console.log(`weather api location err`, err));
    
    const deviceId = DeviceInfo.getUniqueId();
    const data = JSON.stringify({
      user_id: UserData.UserId,
      email: UserData.UserEmail,
      device_id: deviceId,
      hours: ManulHours ? ManulHours : hours,
      weather_type: ManualWeatherType
        ? ManualWeatherType
        : findWeather(UserData?.DayTemperature?.weather?.[0]?.main),
      pollen: null,
      pollen_type: ManulPollen ? ManulPollen : 'Low',
      weather_data: UserData.DayTemperature,
      temp_min: Weather?.main?.temp_min,
      temp_max: Weather?.main?.temp_max,
      city: city_info,
      state: state_info,
      country: country_info,
      lat: UserData.lat,
      lon: UserData.lon,
    });

    // console.log('weather', data);
    var config = {
      method: 'post',
      url: 'https://admin.moodflo.com/api/updateWeather',
      headers: {
        'Content-Type': 'application/json',
        Cookie: '__cfduid=de42be196e76a7e54fe0b710d009e4dd11615455418',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(' ✅ ✅ ✅ ✅ Update Weather Success ✅ ✅ ✅ ✅ ', data);
      })
      .catch(function (error) {
        console.log('❌❌❌❌ Update Weather Fail ❌❌❌❌', error, data);
      });
  };

  const th = async () => {
    WeatherDayData(UserData.lat, UserData.lon);
  };

  const VerifyDone = async () => {
    getUserLocation();
    await AsyncStorage.setItem('GiveWeatherPerm', 'true');
    setOpenActionSheet(false);
    // CheckForWeather(UserData.lat, UserData.lon);
    syncWeatherData();
    let Wp = await AsyncStorage.getItem('GiveWeatherPerm');
    let WeatherP = await JSON.parse(Wp);
    console.log(`WeatherPerm`, WeatherP);
    dispatch(WeatherPerm(WeatherP));
  };

  useEffect(() => {
    th();
  }, [swiperIndex]);

  useEffect(() => {
    // if (swiperIndex == 1) {
    const timeOutId = setTimeout(() => {
      syncWeatherData();
      clearTimeout(timeOutId);
    }, 500);
    // }
  }, []);

  useEffect(() => {
    const deviceId = DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      device_id: deviceId,
      email: UserData.UserEmail,
      user_id: UserData.UserId,
    });

    // console.log(`raw of weather graph data`, raw);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    let timeOutId = setTimeout(() => {
      console.log(`Weather Graph Data Params`, raw);
      fetch('https://admin.moodflo.com/api/getWeatherReport', requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          console.log('Get weather Graph data', result),
          console.log(' ✅ ✅ ✅ ✅ Get Weather Success ✅ ✅ ✅ ✅ ');
            setGraph(result.weatherData);
          data.push({});
          await syncWeatherData();
        })
        .catch((error) => console.log('error', error));
        clearTimeout(timeOutId);
        timeOutId = null;
    }, 1000);
    return () => {
      if(timeOutId !== null) {
        clearTimeout(timeOutId);
        timeOutId = null;
      }
    }
  }, [One, Two, Three, Four, Five]);

  const data = [
    {
      x: 1,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[0]?.temp_max
            ? 0
            : Graph[0].temp_max
          : 0,
    },
    {
      x: 2,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[1]?.temp_max
            ? 0
            : Graph[1].temp_max
          : 0,
    },
    {
      x: 3,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[2]?.temp_max
            ? 0
            : Graph[2].temp_max
          : 0,
    },
    {
      x: 4,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[3]?.temp_max
            ? 0
            : Graph[3].temp_max
          : 0,
    },
    {
      x: 5,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[4]?.temp_max
            ? 0
            : Graph[4].temp_max
          : 0,
    },
    {
      x: 6,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[5]?.temp_max
            ? 0
            : Graph[5].temp_max
          : 0,
    },
    {
      x: 7,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[6]?.temp_max
            ? 0
            : Graph[6] && Graph[6].temp_max
          : 0,
    },
  ];

  const dataLow = [
    {
      x: 1,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[0]?.temp_min
            ? 0
            : Graph[0].temp_min
          : 0,
    },
    {
      x: 2,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[1]?.temp_min
            ? 0
            : Graph[1].temp_min
          : 0,
    },
    {
      x: 3,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[2]?.temp_min
            ? 0
            : Graph[2].temp_min
          : 0,
    },
    {
      x: 4,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[3]?.temp_min
            ? 0
            : Graph[3].temp_min
          : 0,
    },
    {
      x: 5,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[4]?.temp_min
            ? 0
            : Graph[4].temp_min
          : 0,
    },
    {
      x: 6,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[5]?.temp_min
            ? 0
            : Graph[5].temp_min
          : 0,
    },
    {
      x: 7,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[6]?.temp_min
            ? 0
            : Graph[6] && Graph[6].temp_min
          : 0,
    },
  ];

  let heightProp = SIZE / 4.3;
  let widthProp = Math.round(SIZE - 138);

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

  const WeatherDurations = [{label: 'Day'}, {label: 'Week'}, {label: 'Month'}];

  // console.log(`Lowmax`, data, dataLow);

  const editTemp = () => {
    setEditManualWeather(true);
  };
  const cancelled = () => {
    setEditManualWeather(false);
  };

  const EditDone = () => {
    cancelled();
    syncWeatherData();
  };

  const WeatherPopUpcancelled = () => {
    setWeatherPopUp(false);
  };

  const AnonymousPopUpcancelled = () => {
    setAnonymousClick(false);
  };

  const WeatherDurationModalCancelled = () => {
    setWeatherDurationModal(false);
  };

  const dataOfWeatherGraph = [
    {
      x: 1,
      y:
        AllDayWeather != null && AllDayWeather[0] != undefined
          ? AllDayWeather[0].temp
          : 0,
    },
    {
      x: 2,
      y:
        AllDayWeather != null && AllDayWeather[3] != undefined
          ? AllDayWeather[3].temp
          : 0,
    },
    {
      x: 3,
      y:
        AllDayWeather != null && AllDayWeather[7] != undefined
          ? AllDayWeather[7].temp
          : 0,
    },
    {
      x: 4,
      y:
        AllDayWeather != null && AllDayWeather[11] != undefined
          ? AllDayWeather[11].temp
          : 0,
    },
    {
      x: 5,
      y:
        AllDayWeather != null && AllDayWeather[15] != undefined
          ? AllDayWeather[15].temp
          : 0,
    },
    {
      x: 6,
      y:
        AllDayWeather != null && AllDayWeather[19] != undefined
          ? AllDayWeather[19].temp
          : 0,
    },
    {
      x: 7,
      y:
        AllDayWeather != null && AllDayWeather[23] != undefined
          ? AllDayWeather[23].temp
          : 0,
    },
  ];
  // console.log(`AllDayWeather`, AllDayWeather);

  const _weatherType = ManualWeatherType
  ? ManualWeatherType
  : Weather
  ? findWeather(Weather?.weather?.[0]?.main)
  : weatherTypes.Rainy;

  const _weatherAction = weatherActions?.[_weatherType] ?? weatherActions.Rainy;

  const _largeWeatherImg = Constants.Images?.[_weatherType] ?? Constants.Images.Rain;

  return (
    <View>
      {/* {console.log(`data`, data)} */}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.HeaderView}>
          <TouchableOpacity
            onPress={async () => {
              setOpenActionSheet(true);
            }}
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.syncButtonView}>
              <Image
                style={{height: 20, width: 20}}
                source={Constants.Images.Sync}
              />
            </View>
            <View style={{alignContent: 'center', paddingHorizontal: 15}}>
              <Text style={styles.lightText}>
                {UserData.WeatherPermission ? 'Syncing your' : 'Sync your'}
              </Text>
              <Text style={styles.normalText}>Weather data</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setAnonymousClick(true)}
            style={styles.ColoredView}>
            <Text style={styles.ColoredText}>Anonymous</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ProgressBarView}>
          <ProgressBar
            progress={
              // swiperIndex == 1
              ((JSON.parse(MoodCount) < 3 ? JSON.parse(MoodCount) : 3) / 3) *
              100
              // : 0
            }
            height={10}
            backgroundColor="#CB9866"
          />
          <View style={{flexDirection: 'row'}}>
            <Text numberOfLines={1} style={[styles.SmallThinText, {flex: 1}]}>
              {JSON.parse(MoodCount) < 3
                ? 'Try add 3 moods per day'
                : `Boom! You've added ${JSON.parse(MoodCount)} moods today`}
            </Text>
            <Text
              style={
                (styles.SmallThinText, {paddingTop: 10, paddingVertical: 0})
              }>
              {JSON.parse(MoodCount) === null ? 0 : JSON.parse(MoodCount)}
              /3
            </Text>
          </View>
        </View>
        <View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={[styles.SmallThinText, {paddingVertical: 9}]}>
              WEATHER
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                // fontSize: SIZE / 14,
                // fontWeight: '500',
                alignItems: 'center',
                width: '100%',
              }}
              onPress={() => setWeatherPopUp(true)}>
              <Text style={styles.swiperText}>
                You are more <Text style={{color: '#5947D0'}}>energetic</Text>{' '}
                when the temperature is below{' '}
                <Text style={{color: '#5947D0'}}>20°</Text> and it{' '}
                <Text style={{color: '#5947D0'}}>rains</Text> around{' '}
                <Text style={{color: '#5947D0'}}>2hrs</Text>
              </Text>
            </TouchableOpacity>

            {UserData.WeatherPermission && (
              <View
                style={{
                  position: 'absolute',
                  zIndex: -234234,
                  justifyContent: 'center',
                  top: SIZE / 2.2,
                }}>
                <Text
                  style={{
                    marginTop: -160,
                    fontWeight: '700',
                    fontFamily: RubikExtraBold,
                    fontSize: SIZE / 5.5,
                    color: '#E0DDED',
                    transform: [{rotate: '-15deg'}],
                  }}>
                  Demo
                </Text>
              </View>
            )}
          </View>

          <View style={styles.WeatherCardMain}>
            {swiperIndex == 2 && (
              <View style={styles.WeatherCard}>
                <Text
                  style={[
                    styles.SmallThinText,
                    {paddingVertical: 0, paddingBottom: 4},
                  ]}>
                  Today's Weather
                </Text>
                <Text style={[styles.SmallThinText, styles.city]}>
                  {Weather ? Weather?.name : 'Sync your weather'}
                </Text>
                <View>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={editTemp}
                    style={{
                      width: 260,
                      backgroundColor: 'white',
                      margin: 10,
                      borderRadius: 15,
                      marginHorizontal: 20,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 15,
                        overflow: 'hidden',
                      }}>
                      <Image
                        resizeMode={'contain'}
                        source={_largeWeatherImg}
                        style={{margin: 10, marginHorizontal: 20}}
                      />
                      <View>
                        <Text style={[styles.Card1Text]}>
                          {_weatherType}
                        </Text>
                        <Text
                          style={[
                            ,
                            {
                              fontFamily: RubikMedium,
                              fontSize: dynamicSize(32),
                            },
                          ]}>
                          {ManualTemp
                            ? ManualTemp
                            : Math.round(Weather ? Weather.main.temp : '0')}
                          ºC
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={editTemp}>
                      <Image
                        style={{
                          resizeMode: 'contain',
                          height: dynamicSize(21),
                          width: dynamicSize(21),
                          marginTop: -25,
                          right: 5,
                          bottom: 7,
                          alignSelf: 'flex-end',
                        }}
                        source={Constants.Images.Edit}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                  <View style={styles.CardsView}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={editTemp}
                      style={styles.card2View}>
                      <View style={{flexDirection: 'row', padding: 15}}>
                        <Image
                          resizeMode={'contain'}
                          source={Constants.Images.RainyHour}
                          style={styles.SmallCardImage}
                        />
                        <View>
                          <Text style={[styles.smallCardText]}>
                            {_weatherAction}
                          </Text>
                          <Text
                            style={[
                              ,
                              {
                                fontFamily: RubikMedium,
                                fontSize: dynamicSize(15),
                              },
                            ]}>
                            {ManulHours ? ManulHours : hours ? hours : 1}hr
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={editTemp}>
                        <Image
                          style={{
                            resizeMode: 'contain',
                            height: dynamicSize(19),
                            width: dynamicSize(19),
                            marginTop: -18,
                            right: 5,
                            bottom: 7,
                            alignSelf: 'flex-end',
                          }}
                          source={Constants.Images.Edit}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={editTemp}
                      style={{
                        width: 120,
                        backgroundColor: 'white',
                        borderRadius: 15,
                      }}>
                      <View style={{flexDirection: 'row', padding: 15}}>
                        <Image
                          resizeMode={'contain'}
                          source={Constants.Images.Pollen}
                          style={{
                            margin: 5,
                            height: 15,
                            width: 15,
                            justifyContent: 'center',
                            marginTop: 10,
                            marginLeft: -5,
                            marginRight: 10,
                          }}
                        />
                        <View>
                          <Text style={[, styles.smallCardText]}>Pollen</Text>
                          <Text
                            style={[
                              {
                                fontFamily: RubikMedium,
                                fontSize: dynamicSize(14.5),
                              },
                            ]}>
                            {ManulPollen ? ManulPollen : 'Low'}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={editTemp}>
                        <Image
                          style={{
                            resizeMode: 'contain',
                            height: dynamicSize(19),
                            width: dynamicSize(19),
                            marginTop: -18,
                            right: 5,
                            bottom: 8,
                            alignSelf: 'flex-end',
                          }}
                          source={Constants.Images.Edit}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* <ProgressBarCustom /> */}
          <HomeHeader
            click={() => setWeatherDurationModal(true)}
            value={WeatherDuration}
          />
          <View style={{marginBottom: 50, alignItems: 'center'}}>
            {swiperIndex == 2 && (
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
              style={{
                // flex: 1,
                position: 'absolute',
                left: SIZE / 6,
                // alignSelf: 'center',
                // alignItems: 'center',
                // justifyContent: 'center',
                marginTop: 30,
              }}>
              {swiperIndex == 2 && (
                <View>
                  <View>
                    <GraphBezierCustom
                      // abs
                      heightProp={heightProp}
                      stroke="#F4227E"
                      widthProp={widthProp}
                      data={data}
                      max={max}
                      H={9}
                    />
                  </View>
                  <View style={{marginTop: 20}}>
                    <GraphBezierCustom
                      heightProp={heightProp}
                      stroke="#70DEEC"
                      widthProp={widthProp}
                      data={dataLow}
                      max={Lowmax}
                      H={4}
                    />
                  </View>
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: 15,
              }}>
              <IndicatorHelper color={'#7FE3F0'} text={'Min ºC'} />
              <IndicatorHelper color={'#FC4190'} text={'Max ºC'} />
              <IndicatorHelper color={'#7265E3'} text={'Rainfall'} />
              <IndicatorHelper color={'#0DDE7A'} text={'Pollen'} />
            </View>
          </View>
          {swiperIndex == 2 && (
            <GraphicChart
              dataOfWeatherGraph={dataOfWeatherGraph}
              fitness={false}
            />
          )}
          {!UserData.WeatherPermission && (
            <View
              style={{
                position: 'absolute',
                top: 420,
                alignItems: 'center',
                height: '100%',
                width: '100%',
                zIndex: -234234,
              }}>
              <Text
                style={{
                  marginTop: dynamicSize(-300),
                  fontWeight: '700',
                  fontFamily: RubikExtraBold,
                  fontSize: SIZE / 3.5,
                  color: '#E0DDED',
                  transform: [{rotate: '-15deg'}],
                }}>
                Demo
              </Text>
            </View>
          )}
          {!UserData.WeatherPermission && (
            <TouchableOpacity
              activeOpacity={0}
              onPress={async () => {
                // await AsyncStorage.setItem('GiveHealthPerm', 'true');
                setOpenActionSheet(true);
              }}
              style={{
                position: 'absolute',
                flex: 1,
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                opacity: 0,
              }}></TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <EditManualWeatherModal
        modalVisible={EditManualWeather}
        dismissModalHandler={() => cancelled()}
        verifyDone={(value) => EditDone(value)}
        Weather={Weather}
        hours={hours}
        Temp={
          ManualTemp
            ? ManualTemp
            : Math.round(Weather ? Weather.main.temp : '0')
        }
        EditTemp={setManualTemp}
        Hour={ManulHours ? ManulHours : hours ? hours : 1}
        EditHour={setManulHours}
        Pollen={ManulPollen}
        EditPollen={setManulPollen}
        WeatherType={ManualWeatherType}
        EditWeatherType={setManualWeatherType}
      />
      <PopUp
        permission={UserData.WeatherPermission}
        image={Constants.Images.WeatherPopUp}
        dataType={'weather'}
        modalVisible={openActionSheet}
        dismissModalHandler={() => setOpenActionSheet(false)}
        verifyDone={() => VerifyDone()}
      />

      <DateExpiredModal
        WeatherPopUp
        modalVisible={WeatherPopUp}
        dismissModalHandler={() => WeatherPopUpcancelled()}
        verifyDone={() => WeatherPopUpcancelled()}
      />

      <AnonymousPopUp
        modalVisible={AnonymousClick}
        dismissModalHandler={() => AnonymousPopUpcancelled()}
        verifyDone={() => AnonymousPopUpcancelled()}
      />

      <WeatherGraphDurationModal
        data={WeatherDurations}
        modalVisible={WeatherDurationModal}
        onChangeText={setWeatherDuration}
        value={WeatherDuration}
        dismissModalHandler={() => setWeatherDurationModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    // backgroundColor: '#FFF',
    height: '100%',
    paddingBottom: 400,
  },
  //   body: {
  //     // backgroundColor: '#FFF',
  //   },
  //   sectionContainer: {
  //     marginTop: 32,
  //     paddingHorizontal: 24,
  //   },
  //   sectionTitle: {
  //     fontSize: 24,
  //     fontWeight: '600',
  //     color: '#000',
  //   },
  //   sectionDescription: {
  //     marginTop: 8,
  //     fontSize: 18,
  //     fontWeight: '400',
  //     color: '#555',
  //   },
  //   sectionDescriptionError: {
  //     marginTop: 8,
  //     fontSize: 18,
  //     fontWeight: '400',
  //     color: '#A00000',
  //   },

  WeatherCardMain: {
    flexDirection: 'row',
    width: 320,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: '#F1F4F9',
    borderRadius: 18,
    paddingVertical: 20,
    minHeight: 250,
  },
  WeatherCard: {
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingBottom: 8,
  },
  city: {
    paddingVertical: 0,
    color: '#3B456D',
    fontSize: 18,
    fontFamily: RubikRegular,
  },
  CardsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  card2View: {
    width: 120,
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 15,
  },
  SmallCardImage: {
    margin: 5,
    height: 20,
    width: 20,
    marginLeft: -5,
  },
  smallCardText: {
    fontFamily: RubikLight,
    fontWeight: '300',
    color: '#8A8BAB',
    fontSize: dynamicSize(13),
    marginBottom: 5,
  },

  ColoredView: {
    height: 40,
    marginHorizontal: dynamicSize(10),
    paddingHorizontal: dynamicSize(20),
    backgroundColor: '#DED6FE',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Card1Text: {
    fontFamily: RubikLight,
    fontWeight: '300',
    color: '#8A8BAB',
    fontSize: dynamicSize(15),
    width: dynamicSize(70),
  },
  HeaderView: {
    height: 80,
    paddingTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  syncButtonView: {
    height: 40,
    width: 40,
    backgroundColor: '#DED6FE',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightText: {
    fontSize: 13,
    color: '#8A8BAB',
    fontFamily: RubikLight,
    // lineHeight: 12,
    // marginVertical: 5,
  },
  normalText: {
    fontSize: 16,
    marginTop: 4,
    // lineHeight: 16,
    fontFamily: RubikRegular,
  },
  ColoredText: {
    fontSize: 16,
    color: '#5947D0',
  },
  ProgressBarView: {
    width: '88%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  //   CircularProgressStyle: {
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     alignSelf: 'center',
  //   },
  SmallThinText: {
    paddingVertical: 12,
    fontFamily: RubikLight,
    color: '#747690',
  },
  //   SmallThinBlackText: {
  //     fontFamily: RubikLight,
  //     // color: '#3B456D',
  //     fontSize: 12.5,
  //   },
  //   wrapper: {
  //     height: 200,
  //     // backgroundColor: 'lightgreen',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     marginBottom: 7,
  //   },
  swiperText: {
    fontSize: SIZE / 14,
    fontWeight: '500',
    width: '75%',
    textAlign: 'center',
    fontFamily: RubikMedium,
    color: '#222432',
  },
  //   forCircle: {alignItems: 'center', justifyContent: 'center', flex: 1},
  //   BigCircleBackgroundImage: {
  //     height: 140,
  //     width: 130,
  //     marginBottom: 16,
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
  //   absolute: {
  //     flex: 1,
  //     position: 'absolute',
  //   },
  indicatorHelper: {height: 18, width: 18, borderRadius: 5},
  indicatorHelperView: {
    flexDirection: 'row',
    marginHorizontal: 3,
    marginTop: 10,
  },
  indicatorText: {
    marginHorizontal: 10,
    color: '#4C5980',
    fontFamily: RubikRegular,
  },
});

export default WeatherData;

// skeleton placeholder

// ) : (
//   <View
//     style={{
//       backgroundColor: '#F4F6FA',
//       // width: '90%',
//       alignSelf: 'center',
//       minHeight: 300,
//       marginTop: 50,
//       padding: 20,
//       borderRadius: 20,
//     }}>
//     <SkeletonPlaceholder>
//       <SkeletonPlaceholder.Item
//         alignSelf={'center'}
//         width={SIZE / 1.5}
//         height={100}
//         marginTop={40}
//         borderRadius={10}></SkeletonPlaceholder.Item>
//       <View
//         style={{flexDirection: 'row', justifyContent: 'space-around'}}>
//         <SkeletonPlaceholder.Item
//           alignSelf={'center'}
//           width={SIZE / 3.4}
//           height={80}
//           marginTop={40}
//           borderRadius={10}
//         />
//         <SkeletonPlaceholder.Item
//           alignSelf={'center'}
//           width={SIZE / 3.4}
//           height={80}
//           marginTop={40}
//           borderRadius={10}
//         />
//       </View>
//     </SkeletonPlaceholder>
//   </View>
// )}
