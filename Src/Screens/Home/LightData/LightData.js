import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  NativeModules,
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
import BezierGraphAuto from '../../../Components/BezierGraphAuto/BezierGraphAuto';
import GraphicChart from '../../../Components/GraphicChart/GraphicChart';
import WeatherGraphDurationModal from '../../../Components/Modals/WeatherGraphDurationModal/WeatherGraphDurationModal';
import GraphBezierCustom from '../../../Components/GraphBezierCustom/GraphBezierCustom';
import ScreenCircleBar from '../../../Components/ScreenCircleBar/ScreenCircleBar';
import BarGraph from '../../../Components/BarChart/BarGraph';
import PopUp from '../../../Components/PopUp/PopUp';
import {dynamicSize} from '../../../Constants/sizeChoose';
const {SensorManager} = NativeModules;

export const {width: SIZE, height: HEIGHT} = Dimensions.get('window');

const IndicatorHelper = ({color, text}) => {
  return (
    <View style={styles.indicatorHelperView}>
      <View style={[styles.indicatorHelper, {backgroundColor: color}]} />
      <Text style={styles.indicatorText}>{text}</Text>
    </View>
  );
};

const LightData = ({
  CheckForLightData,
  PermScreenTime,
  Weather,
  // data,
  // dataLow,
  MoodCount,
  swiperIndex,
}) => {
  const [ScreenTimeDuration, setScreenTimeDuration] = useState(false);
  const [ScreenDuration, setScreenDuration] = useState('Week');
  const [Graph, setGraph] = useState(null);
  const [openActionSheet, setopenActionSheet] = useState(false);

  const lines = [
    {value: 500, hours: 'Perfect', bold: false},
    {value: 400, hours: 'Almost', bold: false},
    {value: 300, hours: 'Good', bold: true},
    {value: 200, hours: 'Better', bold: false},
    {value: 100, hours: 'Fine', bold: false},
    {value: 0, hours: 'Poor', bold: false},
  ];

  const data = [
    {
      x: 1,
      y: Graph && WeatherDuration === 'Week' ? (true ? 3 : 0) : 3,
    },
    {
      x: 2,
      y: Graph && WeatherDuration === 'Week' ? (true ? 5 : 0) : 5,
    },
    {
      x: 3,
      y: Graph && WeatherDuration === 'Week' ? (true ? 4 : 0) : 4,
    },
    {
      x: 4,
      y: Graph && WeatherDuration === 'Week' ? (true ? 2 : 0) : 2,
    },
    {
      x: 5,
      y: Graph && WeatherDuration === 'Week' ? (true ? 1 : 0) : 1,
    },
    {
      x: 6,
      y: Graph && WeatherDuration === 'Week' ? (true ? 5 : 0) : 5,
    },
    {
      x: 7,
      y: Graph && WeatherDuration === 'Week' ? (true ? 3 : 0) : 3,
    },
  ];

  const dataLow = [
    {
      x: 1,
      y: Graph && WeatherDuration === 'Week' ? (true ? 4 : 0) : 4,
    },
    {
      x: 2,
      y: Graph && WeatherDuration === 'Week' ? (true ? 7 : 0) : 7,
    },
    {
      x: 3,
      y: Graph && WeatherDuration === 'Week' ? (true ? 4 : 0) : 4,
    },
    {
      x: 4,
      y: Graph && WeatherDuration === 'Week' ? (true ? 6 : 0) : 6,
    },
    {
      x: 5,
      y: Graph && WeatherDuration === 'Week' ? (true ? 2 : 0) : 2,
    },
    {
      x: 6,
      y: Graph && WeatherDuration === 'Week' ? (true ? 0 : 0) : 0,
    },
    {
      x: 7,
      y: Graph && WeatherDuration === 'Week' ? (true ? 6 : 0) : 6,
    },
  ];

  let heightProp = SIZE / 4.3;
  let widthProp = Math.round(SIZE - 138);

  const max =
    data &&
    Math.max.apply(
      Math,
      data.map(function (o) {
        return 5;
        // return o.y;
      }),
    );

  const Lowmax =
    dataLow &&
    Math.max.apply(
      Math,
      dataLow.map(function (o) {
        return 7;
        // return o.y;
      }),
    );

  const VerifyDone = async () => {
    // await AsyncStorage.setItem('GiveSleepPerm', 'true');

    setopenActionSheet(false);
    // let Sp = await AsyncStorage.getItem('GiveSleepPerm');
    // let SleepP = await JSON.parse(Sp);
    // console.log(`SleepPerm`, SleepP);
    // dispatch(SleepPerm(SleepP));
  };

  // Light data using react-native-sensor-manager
  // useEffect(() => {
  //   SensorManager.startLightSensor(5000);
  //   function lightSensorCallback(data) {
  //     console.log('LigntSensorData: ', data);
  //   }
  //   DeviceEventEmitter.addListener('LightSensor', lightSensorCallback);
  //   return () => {
  //      SensorManager.stopLightSensor();
  //   }
  // }, [])

  const ScreenDurations = [{label: 'Day'}, {label: 'Week'}, {label: 'Month'}];
  return (
    <View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.HeaderView}>
          <TouchableOpacity
            onPress={async () => {
              CheckForLightData();
              setopenActionSheet(true);
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
              <Text style={styles.lightText}>Sync your</Text>
              <Text style={styles.normalText}>Light data</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.ColoredView}>
            <Text style={styles.ColoredText}>Anonymous</Text>
          </View>
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
            <Text style={[styles.SmallThinText, {flex: 1}]}>
              Try add 3 moods per day
            </Text>
            <Text
              style={
                (styles.SmallThinText, {paddingTop: 10, paddingVertical: 0})
              }>
              {JSON.parse(MoodCount) === null ? 0 : JSON.parse(MoodCount)}/3
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
              LIGHT
            </Text>
            <Text style={styles.swiperText}>
              You seem to be a bit more{' '}
              <Text style={{color: '#5947D0'}}>anxious</Text> when light lux is
              under <Text style={{color: '#5947D0'}}>250</Text> for over{' '}
              <Text style={{color: '#5947D0'}}>4 hours</Text>
            </Text>
            {/* <Text style={[styles.SmallThinText, {paddingVertical: 9}]}>
            Try get less than 3hrs a day
          </Text> */}
          </View>

          {/* <ProgressBarCustom /> */}
          {/* <HomeHeader
          click={() => setScreenTimeDuration(false)}
          value={ScreenDuration}
        /> */}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 30,
            }}>
            <Image
              source={Constants.Images.Bulb}
              style={{height: 220, width: 220, resizeMode: 'contain'}}
            />
          </View>
          <View style={{marginBottom: 100, alignItems: 'center'}}>
            {swiperIndex == 4 && (
              <BarGraph
                BarsMarginLeft={dynamicSize(44)}
                width={dynamicSize(240)}
                barsWidth={dynamicSize(260)}
                sideLabels={lines}
                color={'#EEA402'}
                ShowPollen={false}
                RightBar={true}
                lightScreen={true}
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
              {swiperIndex == 4 && (
                <View>
                  {/* <View>

                    <GraphBezierCustom
                      // abs
                      heightProp={heightProp}
                      stroke="#FDBB29"
                      widthProp={widthProp}
                      data={data}
                      max={max}
                      H={9}
                    />
                  </View>
                  <View style={{marginTop: 20}}>
                    <GraphBezierCustom
                      heightProp={heightProp}
                      stroke="#FDBB29"
                      widthProp={widthProp}
                      data={dataLow}
                      max={Lowmax}
                      H={4}
                    />
                  </View> */}
                </View>
              )}
            </View>
          </View>

          {/* <View style={{marginBottom: 20}}>
          <ScreenCircleBar
            DarkColor="#0DDE79"
            lightColor="#CFF9ED"
            Label="Morning"
            Time="1hr 34min"
            value={54}
            border={true}
          />
          <ScreenCircleBar
            DarkColor="#F992BE"
            lightColor="#FEE9F2"
            Label="Afternoon"
            Time="1hr 34min"
            value={32}
            border={true}
          />
          <ScreenCircleBar
            DarkColor="#21CDDE"
            lightColor="#E5F9FC"
            Label="Evening"
            Time="1hr 34min"
            value={92}
          />
        </View> */}
          {/* <GraphicChart /> */}
          {false && (
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
                  transform: [{rotate: '-15deg'}],
                }}>
                Demo
              </Text>
            </View>
          )}

          {!PermScreenTime && (
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
                  marginTop: -300,
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

          {true && (
            <TouchableOpacity
              activeOpacity={0}
              onPress={async () => {
                // await AsyncStorage.setItem('GiveHealthPerm', 'true');
                setopenActionSheet(true);
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

      <PopUp
        permission={false}
        ComingUp
        image={Constants.Images.Sleepimage}
        dataType={'light'}
        modalVisible={openActionSheet}
        dismissModalHandler={() => setopenActionSheet(false)}
        verifyDone={() => VerifyDone()}
      />

      {/* <WeatherGraphDurationModal
        data={ScreenDurations}
        modalVisible={ScreenDuration}
        onChangeText={setScreenDuration}
        value={ScreenDuration}
        dismissModalHandler={() => setScreenDuration(false)}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
    paddingBottom: 400,
  },
  WeatherCardMain: {
    flexDirection: 'row',
    width: 320,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: '#F1F4F9',
    borderRadius: 18,
    paddingVertical: 20,
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
  SmallThinText: {
    paddingVertical: 12,
    fontFamily: RubikLight,
    color: '#747690',
  },
  swiperText: {
    fontSize: SIZE / 14,
    fontWeight: '500',
    width: '75%',
    textAlign: 'center',
    fontFamily: RubikMedium,
    color: '#222432',
  },
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

export default LightData;
