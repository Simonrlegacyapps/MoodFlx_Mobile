import React, {useState} from 'react';
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
import StarProgress from '../../../Components/StarProgress/StarProgress';
import PopUp from '../../../Components/PopUp/PopUp';

export const {width: SIZE, height: HEIGHT} = Dimensions.get('window');

const IndicatorHelper = ({color, text}) => {
  return (
    <View style={styles.indicatorHelperView}>
      <View style={[styles.indicatorHelper, {backgroundColor: color}]} />
      <Text style={styles.indicatorText}>{text}</Text>
    </View>
  );
};

const SleepData = ({
  CheckForSleepData,
  PermScreenTime,
  Weather,
  data,
  dataLow,
  MoodCount,
  swiperIndex,
}) => {
  const [openActionSheet, setopenActionSheet] = useState(false);
  console.log(
    `mood count in sleep`,
    MoodCount,
    swiperIndex,
    swiperIndex == 3
      ? ((JSON.parse(MoodCount) < 3 ? JSON.parse(MoodCount) : 3) / 3) * 100
      : 0,
  );

  const VerifyDone = () => {
    setopenActionSheet(false);
  };
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
              <Text style={styles.normalText}>Sleep data</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.ColoredView}>
            <Text style={styles.ColoredText}>Anonymous</Text>
          </View>
        </View>
        <View style={styles.ProgressBarView}>
          <ProgressBar
            progress={
              swiperIndex == 2
                ? ((JSON.parse(MoodCount) < 3 ? JSON.parse(MoodCount) : 3) /
                    3) *
                  100
                : 0
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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[styles.SmallThinText, {paddingVertical: 9}]}>
            SLEEP
          </Text>
          <Text style={styles.swiperText}>
            You're more likely to be{' '}
            <Text style={{color: '#5947D0'}}>excited</Text> and{' '}
            <Text style={{color: '#5947D0'}}>happy</Text> when you sleep more
            than <Text style={{color: '#5947D0'}}>7.5hrs</Text>
          </Text>
          <Text style={[styles.SmallThinText, {paddingVertical: 9}]}>
            Almost there! Try sleep a bit longer
          </Text>
        </View>

        {/* <ProgressBarCustom /> */}
        {/* <HomeHeader /> */}
        <View style={{marginBottom: 50}}>
          {/* <BarGraph /> */}
          <StarProgress />
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              marginTop: 30,
            }}>
            {/* <View>
              <View>
                <BezierGraphAuto data={data} color={'#F4227E'} />
              </View>
              <View style={{marginTop: 20}}>
                <BezierGraphAuto data={dataLow} color={'#70DEEC'} />
              </View>
            </View> */}
          </View>
          {/* <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <IndicatorHelper color={'#7FE3F0'} text={'Min ºC'} />
            <IndicatorHelper color={'#FC4190'} text={'Max ºC'} />
            <IndicatorHelper color={'#7265E3'} text={'Rainfall'} />
            <IndicatorHelper color={'#0DDE7A'} text={'Pollen'} />
          </View> */}
        </View>
        <GraphicChart />
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

      <PopUp
        permission={false}
        image={Constants.Images.Sleepimage}
        dataType={'sleep'}
        modalVisible={openActionSheet}
        dismissModalHandler={() => setOpenActionSheet(false)}
        verifyDone={() => VerifyDone()}
      />
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
    width: '70%',
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

export default SleepData;
