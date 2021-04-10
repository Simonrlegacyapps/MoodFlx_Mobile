import React, { useEffect, useState } from 'react';
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
import ProgressBar from 'react-native-animated-progress';
import ProgressBarCustom from '../../../Components/ProgressBar/ProgressBarCustom';
import HomeHeader from '../../../Components/HomeHeader/HomeHeader';
import BarGraph from '../../../Components/BarChart/BarGraph';
import BezierGraphAuto from '../../../Components/BezierGraphAuto/BezierGraphAuto';
import GraphicChart from '../../../Components/GraphicChart/GraphicChart';
import moment from 'moment';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Geocoder from 'react-native-geocoding';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-community/async-storage';
import GraphBezierCustom from '../../../Components/GraphBezierCustom/GraphBezierCustom';
import PopUp from '../../../Components/PopUp/PopUp';
import DeviceInfo from 'react-native-device-info';
import GetLocation from 'react-native-get-location';

export const { width: SIZE, height: HEIGHT } = Dimensions.get('window');

const IndicatorHelper = ({ color, text }) => {
  return (
    <View style={styles.indicatorHelperView}>
      <View style={[styles.indicatorHelper, { backgroundColor: color }]} />
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

  const a = moment().subtract(0, 'days').startOf('day').toString();
  const b = moment().subtract(1, 'days').startOf('day').toString();
  const c = moment().subtract(2, 'days').startOf('day').toString();
  const d = moment().subtract(3, 'days').startOf('day').toString();
  const e = moment().subtract(4, 'days').startOf('day').toString();
  // console.log(`b`, Date.parse(b));

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  const [openActionSheet, setOpenActionSheet] = useState(false);

  let Weather = UserData.DayTemperature;

  // console.log(`Weather`, UserData.DayTemperature);

  useEffect(() => {
    if (swiperIndex == 1) {
      getUserLocation();
    }
  }, [swiperIndex]);

  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        if (UserData.lat == null || UserData.lon == null) {
          WeatherDayData(location.latitude, location.longitude);
        }
      })
      .catch((error) => {
        const { code, message } = error;
        console.log('error', code, message);
      });
  };
  const WeatherDayData = (loc_lat, loc_long) => {
    let value = 0;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${loc_lat}&lon=${loc_long}&dt=${Date.parse(a) / 1000
        }&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
      )
      .then(async (response) => {
        // console.log(`response of weather data`, response.data);
        // await setWeatherDay(response.data);
        if (UserData.DayTemperature) {
          for (let i in response.data.hourly) {
            if (
              Weather.weather[0].description ===
              response.data.hourly[i].weather[0].description
            ) {
              value = value + 1;
              sethours(value);
            } else {
              break;
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

  const syncWeatherData = () => {
    let geocode = null;
    let city = null;
    let state = null;
    let country = null;
    // console.log(
    //   `here+=++=+++++++++=+++=====++++=====+_+_++_+_+_+_++__+_+_++++_+_++++_+_+_+_+_+_+++_+_+_+_+_+_+_++_+`,
    // );
    Geocoder.init('AIzaSyD8BafHP8VtNFGyMg4uozFJcgsBaKDxS9s');

    Geocoder.from({
      lat: UserData.lat,
      lng: UserData.lon,
    })
      .then((data) => {
        // console.log(`data==------->`, data);
        geocode = data.plus_code.compound_code;
        // const Id = data.results[0].address_components.find(({name}) => {
        //   // console.log(`name`, name);
        //   return name === Label;
        // });
        // console.log(`city`, city);
      })
      .catch((err) => console.log(`weather api location err`, err));

    const deviceId = DeviceInfo.getUniqueId();
    const data = JSON.stringify({
      user_id: UserData.UserId,
      email: UserData.UserEmail,
      device_id: deviceId,
      hours: UserData.WeatherHours,
      weather_type: 'Rainfall',
      pollen: null,
      pollen_type: 'Low',
      weather_data: [Weather],
      temp_min: Weather?.main?.temp_min,
      temp_max: Weather?.main?.temp_max,
      city: 'indore',
      state: 'madhya pradesh',
      country: 'india',
      lat: UserData.lat,
      lon: UserData.lon,
    });

    // console.log(`data of checking`, data);

    // var config = {
    //   method: 'post',
    //   url: 'https://admin.moodflo.com/api/updateWeather',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Cookie: '__cfduid=de42be196e76a7e54fe0b710d009e4dd11615455418',
    //   },
    //   data: data,
    // };

    // axios(config)
    //   .then(function (response) {
    //     console.log(
    //       JSON.stringify(' ✅ ✅ ✅ ✅ Success ✅ ✅ ✅ ✅ ', response, data),
    //     );
    //   })
    //   .catch(function (error) {
    //     console.log('❌❌❌❌Fail ❌❌❌❌', error, data);
    //   });
  };

  const th = async () => {
    WeatherDayData(UserData.lat, UserData.lon);
  };

  const VerifyDone = () => {
    setOpenActionSheet(false);
    CheckForWeather(UserData.lat, UserData.lon);
  };

  useEffect(() => {
    th();
  }, [swiperIndex]);

  useEffect(() => {
    // if (swiperIndex == 1) {
    setTimeout(() => {
      syncWeatherData();
    }, 500);
    // }
  }, []);

  useEffect(() => {
    data;
  }, [One, Two, Three, Four, Five]);

  const data = [
    { x: 1, y: One ? One?.current?.temp : 0 },
    { x: 2, y: Two ? Two?.current?.temp : 0 },
    { x: 3, y: Three ? Three?.current?.temp : 0 },
    { x: 4, y: Four ? Four?.current?.temp : 0 },
    { x: 5, y: Five ? Five?.current?.temp : 0 },
    { x: 6, y: 2 },
    { x: 7, y: 2 },
  ];

  const dataLow = [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 29 },
    { x: 4, y: 18 },
    { x: 5, y: 22 },
    { x: 6, y: 2 },
    { x: 7, y: 23 },
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

  // console.log(`Lowmax`, Lowmax, dataLow);

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
              await AsyncStorage.setItem('GiveWeatherPerm', 'true');
              setOpenActionSheet(true);
            }}
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.syncButtonView}>
              <Image
                style={{ height: 20, width: 20 }}
                source={Constants.Images.Sync}
              />
            </View>
            <View style={{ alignContent: 'center', paddingHorizontal: 15 }}>
              <Text style={styles.lightText}>Sync your</Text>
              <Text style={styles.normalText}>Weather data</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.ColoredView}>
            <Text style={styles.ColoredText}>Anonymous</Text>
          </View>
        </View>
        <View style={styles.ProgressBarView}>
          <ProgressBar
            progress={
              swiperIndex == 1
                ? ((JSON.parse(MoodCount) < 3 ? JSON.parse(MoodCount) : 3) /
                  3) *
                100
                : 0
            }
            height={10}
            backgroundColor="#CB9866"
          />
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.SmallThinText, { flex: 1 }]}>
              Try add 3 moods per day
            </Text>
            <Text
              style={
                (styles.SmallThinText, { paddingTop: 10, paddingVertical: 0 })
              }>
              {JSON.parse(MoodCount) < 3 ? JSON.parse(MoodCount) : 3}
              /3
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[styles.SmallThinText, { paddingVertical: 9 }]}>
            Activity
          </Text>
          <Text style={styles.swiperText}>
            You are more <Text style={{ color: '#5947D0' }}>energetic</Text> when
            the temperature is below <Text style={{ color: '#5947D0' }}>20ª</Text>{' '}
            and it <Text style={{ color: '#5947D0' }}>rains</Text> around{' '}
            <Text style={{ color: '#5947D0' }}>2hrs</Text>
          </Text>
        </View>

        <View style={styles.WeatherCardMain}>
          {swiperIndex == 1 && (
            <View style={styles.WeatherCard}>
              <Text
                style={[
                  styles.SmallThinText,
                  { paddingVertical: 0, paddingBottom: 4 },
                ]}>
                Today's Weather
              </Text>
              <Text style={[styles.SmallThinText, styles.city]}>
                {Weather ? Weather?.name : 'Loading ...'}
              </Text>
              <View>
                <View
                  style={{
                    width: 260,
                    backgroundColor: 'white',
                    margin: 10,
                    borderRadius: 15,
                    marginHorizontal: 20,
                  }}>
                  <View style={{ flexDirection: 'row', padding: 15 }}>
                    <Image
                      resizeMode={'contain'}
                      source={Constants.Images.Rain}
                      style={{ margin: 10, marginHorizontal: 20 }}
                    />
                    <View>
                      <Text style={[styles.Card1Text]}>
                        {Weather ? Weather.weather[0].description : 'Low'}
                      </Text>
                      <Text style={[, { fontFamily: RubikMedium, fontSize: 36 }]}>
                        {Math.round(Weather ? Weather.main.temp : '0')}ºC
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.CardsView}>
                  <View style={styles.card2View}>
                    <View style={{ flexDirection: 'row', padding: 15 }}>
                      <Image
                        resizeMode={'contain'}
                        source={Constants.Images.Rain}
                        style={styles.SmallCardImage}
                      />
                      <View>
                        <Text style={[styles.smallCardText]}>
                          {Weather ? Weather.weather[0].description : 'Low'}
                        </Text>
                        <Text
                          style={[, { fontFamily: RubikMedium, fontSize: 18 }]}>
                          {hours ? hours : 1}hr
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 120,
                      backgroundColor: 'white',
                      borderRadius: 15,
                    }}>
                    <View style={{ flexDirection: 'row', padding: 15 }}>
                      <Image
                        resizeMode={'contain'}
                        source={Constants.Images.Rain}
                        style={styles.SmallCardImage}
                      />
                      <View>
                        <Text style={[, styles.smallCardText]}>Pollen</Text>
                        <Text
                          style={[, { fontFamily: RubikMedium, fontSize: 18 }]}>
                          Low
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* <ProgressBarCustom /> */}
        <HomeHeader />
        <View style={{ marginBottom: 50, alignItems: 'center' }}>
          {swiperIndex == 1 && <BarGraph ShowPollen={true} />}
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
            {swiperIndex == 1 && (
              <View>
                <View>
                  {/* <BezierGraphAuto data={data} color={'#F4227E'} /> */}

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
                <View style={{ marginTop: 20 }}>
                  {/* <BezierGraphAuto data={dataLow} color={'#70DEEC'} /> */}
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
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <IndicatorHelper color={'#7FE3F0'} text={'Min ºC'} />
            <IndicatorHelper color={'#FC4190'} text={'Max ºC'} />
            <IndicatorHelper color={'#7265E3'} text={'Rainfall'} />
            <IndicatorHelper color={'#0DDE7A'} text={'Pollen'} />
          </View>
        </View>
        {swiperIndex == 1 && <GraphicChart />}
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
                marginTop: -160,
                fontWeight: '700',
                fontFamily: RubikExtraBold,
                fontSize: SIZE / 3.5,
                color: '#E0DDED',
                transform: [{ rotate: '-15deg' }],
              }}>
              Demo
            </Text>
          </View>
        )}
      </ScrollView>

      <PopUp
        image={Constants.Images.WeatherPopUp}
        dataType={'weather'}
        modalVisible={openActionSheet}
        dismissModalHandler={() => setOpenActionSheet(false)}
        verifyDone={() => VerifyDone()}
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
  },
  smallCardText: {
    fontFamily: RubikLight,
    fontWeight: '300',
    color: '#8A8BAB',
    fontSize: 16,
    marginBottom: 5,
  },

  ColoredView: {
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    backgroundColor: '#DED6FE',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Card1Text: {
    fontFamily: RubikLight,
    fontWeight: '300',
    color: '#8A8BAB',
    fontSize: 16,
    marginTop: 10,
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
    lineHeight: 12,
    marginVertical: 5,
  },
  normalText: {
    fontSize: 16,
    lineHeight: 16,
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
  indicatorHelper: { height: 18, width: 18, borderRadius: 5 },
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
