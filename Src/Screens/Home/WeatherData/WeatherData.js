import React from 'react';
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
  PermWeather,
  Weather,
  data,
  dataLow,
}) => {
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
              CheckForWeather();
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
              <Text style={styles.normalText}>Weather data</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.ColoredView}>
            <Text style={styles.ColoredText}>Anonymous</Text>
          </View>
        </View>
        <View style={styles.ProgressBarView}>
          <ProgressBar progress={66.66} height={10} backgroundColor="#CB9866" />
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.SmallThinText, {flex: 1}]}>
              Try add 3 moods per day
            </Text>
            <Text
              style={
                (styles.SmallThinText, {paddingTop: 10, paddingVertical: 0})
              }>
              2/3
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[styles.SmallThinText, {paddingVertical: 9}]}>
            Activity
          </Text>
          <Text style={styles.swiperText}>
            You are more <Text style={{color: '#5947D0'}}>energetic</Text> when
            the temperature is below <Text style={{color: '#5947D0'}}>20ª</Text>{' '}
            and it <Text style={{color: '#5947D0'}}>rains</Text> around{' '}
            <Text style={{color: '#5947D0'}}>2hrs</Text>
          </Text>
        </View>

        <View style={styles.WeatherCardMain}>
          <View style={styles.WeatherCard}>
            <Text
              style={[
                styles.SmallThinText,
                {paddingVertical: 0, paddingBottom: 4},
              ]}>
              Today's Weather
            </Text>
            <Text style={[styles.SmallThinText, styles.city]}>
              {Weather ? Weather?.name : 'Loading ...'}
              {/* {'Loading ...'} */}
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
                <View style={{flexDirection: 'row', padding: 15}}>
                  <Image
                    resizeMode={'contain'}
                    source={Constants.Images.Rain}
                    style={{margin: 10, marginHorizontal: 20}}
                  />
                  <View>
                    <Text style={[styles.Card1Text]}>
                      {Weather ? Weather.weather[0].description : 'Low'}
                      {/* {'Low'} */}
                    </Text>
                    <Text style={[, {fontFamily: RubikMedium, fontSize: 36}]}>
                      {Math.round(Weather ? Weather.main.temp : '0')}ºC
                      {/* {'0'}ºC */}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.CardsView}>
                <View style={styles.card2View}>
                  <View style={{flexDirection: 'row', padding: 15}}>
                    <Image
                      resizeMode={'contain'}
                      source={Constants.Images.Rain}
                      style={styles.SmallCardImage}
                    />
                    <View>
                      <Text style={[styles.smallCardText]}>Rainfall</Text>
                      <Text style={[, {fontFamily: RubikMedium, fontSize: 18}]}>
                        1hr
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
                  <View style={{flexDirection: 'row', padding: 15}}>
                    <Image
                      resizeMode={'contain'}
                      source={Constants.Images.Rain}
                      style={styles.SmallCardImage}
                    />
                    <View>
                      <Text style={[, styles.smallCardText]}>Pollen</Text>
                      <Text style={[, {fontFamily: RubikMedium, fontSize: 18}]}>
                        Low
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* <ProgressBarCustom /> */}
        <HomeHeader />
        <View style={{marginBottom: 50}}>
          <BarGraph ShowPollen={true} />
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              marginTop: 30,
            }}>
            <View>
              <View>
                <BezierGraphAuto data={data} color={'#F4227E'} />
              </View>
              <View style={{marginTop: 20}}>
                <BezierGraphAuto data={dataLow} color={'#70DEEC'} />
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <IndicatorHelper color={'#7FE3F0'} text={'Min ºC'} />
            <IndicatorHelper color={'#FC4190'} text={'Max ºC'} />
            <IndicatorHelper color={'#7265E3'} text={'Rainfall'} />
            <IndicatorHelper color={'#0DDE7A'} text={'Pollen'} />
          </View>
        </View>
        <GraphicChart />
        {!PermWeather && (
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
                fontSize: 120,
                color: '#E0DDED',
                transform: [{rotate: '-15deg'}],
              }}>
              Demo
            </Text>
          </View>
        )}
      </ScrollView>
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
