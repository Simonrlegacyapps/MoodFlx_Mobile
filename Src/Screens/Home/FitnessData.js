import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import ProgressBar from 'react-native-animated-progress';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Constants from '../../Constants';
import {
  RubikExtraBold,
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import GraphicChart from '../../Components/GraphicChart/GraphicChart';
import AsyncStorage from '@react-native-community/async-storage';
import {useSelector} from 'react-redux';

export const {width: SIZE, height: HEIGHT} = Dimensions.get('window');

const FitnessData = ({
  Perm,
  checkStorage,
  TodayStep,
  TodayCalories,
  TodayDistance,
  MoveTime,
  zero,
  ones,
  twos,
  threes,
  fours,
  fives,
  MoodCount,
  Loading,
}) => {
  // useEffect(() => {
  //   checkThis();
  // }, [TodayStep]);
  // const [anime, setanime] = useState(false)

  const UserData = useSelector((state) => state.First);

  // console.log(`UserData`, UserData);

  const {
    UserMoodCount,
    UserSteps,
    UserCalories,
    UserDistance,
    UserMoveTime,
  } = UserData;
  // const checkThis = () => {
  //   return (
  //     // </AnimatedCircularProgress>
  //   );
  // };

  return (
    <View>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.HeaderView}>
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.setItem('GiveHealthPerm', 'true');
              checkStorage();
              // OnAutoSync();
              // filterDates();
              // filterSteps();
              // AddDataToFilter();
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
              <Text style={styles.normalText}>Fitness data</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.ColoredView}>
            <Text style={styles.ColoredText}>Anonymous</Text>
          </View>
        </View>
        <View style={styles.ProgressBarView}>
          <ProgressBar
            progress={
              !Loading
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
              {UserMoodCount < 3 ? UserMoodCount : 3}/3
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
            You are the <Text style={{color: '#5947D0'}}>happiest</Text> when
            you walk over <Text style={{color: '#5947D0'}}>5000</Text> steps
            before <Text style={{color: '#5947D0'}}>2PM</Text>
          </Text>
        </View>
        {/* {UserData.TodayAllSteps !== null &&
          !Loading &&
          UserData.UserMoodCount !== null &&
          UserData.UserSteps !== null &&
          UserData.UserCalories !== null &&
          UserData.UserDistance !== null &&
          UserData.UserMoveTime !== null && ( */}
        <View style={[styles.forCircle, {marginTop: 30}]}>
          {/* {setTimeout(() => {
                
              }, timeout)} */}
          {/* {checkThis()} */}
          <AnimatedCircularProgress
            duration={3000}
            style={styles.CircularProgressStyle}
            arcSweepAngle={270}
            size={180}
            width={13}
            fill={!Loading ? (UserSteps / 10000) * 100 : 0}
            // fill={!Loading ? 50 : 0}
            prefill={1}
            rotation={-135}
            tintColor="#9889F9"
            lineCap={'round'}
            // onAnimationComplete={() => console.log('onAnimationComplete')}
            backgroundColor="#E2E4EA"
          />

          <View style={styles.absolute}>
            <ImageBackground
              resizeMode={'contain'}
              style={styles.BigCircleBackgroundImage}
              source={Constants.Images.RunningBackground}>
              <Image
                source={Constants.Images.RunningMan}
                style={{height: 30, width: 30, marginTop: 25}}
              />
              <Text style={[styles.swiperText, {fontSize: 24, marginTop: 10}]}>
                {/* {(TodayStep * 100).toFixed(0)} */}
                {UserSteps}
              </Text>
              <Text
                style={[
                  styles.SmallThinText,
                  {paddingVertical: 0, color: '#3B456D'},
                ]}>
                steps
              </Text>
            </ImageBackground>
          </View>
        </View>
        {/* )} */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '80%',
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 40,
          }}>
          <View style={styles.forCircle}>
            <AnimatedCircularProgress
              duration={1500}
              style={styles.CircularProgressStyle}
              arcSweepAngle={360}
              size={70}
              width={10}
              fill={!Loading ? (UserCalories / 1000) * 100 : 0}
              // fill={0}
              rotation={0}
              tintColor="#30C3D6"
              lineCap={'round'}
              // // onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="#E0F8FB"
            />
            <View style={styles.absolute}>
              <Image
                source={Constants.Images.Calories}
                style={{height: 25, width: 25, marginTop: -25}}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={[styles.SmallThinBlackText]}>
                {UserCalories} kcal
              </Text>
            </View>
          </View>
          <View style={styles.forCircle}>
            <AnimatedCircularProgress
              duration={1500}
              style={styles.CircularProgressStyle}
              arcSweepAngle={360}
              size={70}
              width={10}
              fill={!Loading ? (UserDistance / 5000) * 100 : 0}
              // fill={50}
              rotation={0}
              tintColor="#F43085"
              lineCap={'round'}
              // // onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="#FDE2EF"
            />
            <View style={styles.absolute}>
              <Image
                source={Constants.Images.Distance}
                style={{height: 25, width: 25, marginTop: -25}}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={[styles.SmallThinBlackText]}>
                {((UserDistance / 5000) * 5).toFixed(1)} km
              </Text>
            </View>
          </View>
          <View style={styles.forCircle}>
            <AnimatedCircularProgress
              duration={900}
              style={styles.CircularProgressStyle}
              arcSweepAngle={360}
              size={70}
              width={10}
              fill={!Loading ? (UserMoveTime / 120) * 100 : 0}
              // fill={25}
              rotation={0}
              tintColor="#37DD67"
              lineCap={'round'}
              // // onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="#C6F9E8"
            />
            <View style={styles.absolute}>
              <Image
                source={Constants.Images.Time}
                style={{height: 25, width: 25, marginTop: -25}}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={[styles.SmallThinBlackText]}>
                {UserMoveTime.toFixed(0)} min
              </Text>
            </View>
          </View>
        </View>
        <GraphicChart
          day
          zero={zero}
          ones={ones}
          twos={twos}
          threes={threes}
          fours={fours}
          fives={fives}
        />
        {!UserData.HealthPermission && (
          <View
            style={{
              // backgroundColor: 'blue',
              position: 'absolute',
              // flex: 1,
              top: 420,
              alignItems: 'center',
              // justifyContent: 'center',
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
  body: {
    // backgroundColor: '#FFF',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#555',
  },
  sectionDescriptionError: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#A00000',
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
  CircularProgressStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  SmallThinText: {
    paddingVertical: 12,
    fontFamily: RubikLight,
    color: '#747690',
  },
  SmallThinBlackText: {
    fontFamily: RubikLight,
    // color: '#3B456D',
    fontSize: 12.5,
  },
  wrapper: {
    height: 200,
    // backgroundColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },
  swiperText: {
    fontSize: SIZE / 14,
    fontWeight: '500',
    width: '75%',
    textAlign: 'center',
    fontFamily: RubikMedium,
    color: '#222432',
  },
  forCircle: {alignItems: 'center', justifyContent: 'center', flex: 1},
  BigCircleBackgroundImage: {
    height: 140,
    width: 130,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    flex: 1,
    position: 'absolute',
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

export default FitnessData;
