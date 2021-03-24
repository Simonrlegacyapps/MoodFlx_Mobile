import React from 'react'
import { View, Text } from 'react-native'

const FitnessData = () => {
    return (
        <ScrollView
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
                progress={66.66}
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
                You are the <Text style={{color: '#5947D0'}}>happiest</Text>{' '}
                when you walk over <Text style={{color: '#5947D0'}}>5000</Text>{' '}
                steps before <Text style={{color: '#5947D0'}}>2PM</Text>
              </Text>
            </View>
            <View style={[styles.forCircle, {marginTop: 30}]}>
              <AnimatedCircularProgress
                style={styles.CircularProgressStyle}
                arcSweepAngle={270}
                size={180}
                width={13}
                fill={70}
                rotation={-135}
                tintColor="#9889F9"
                lineCap={'round'}
                onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#E2E4EA"></AnimatedCircularProgress>
              <View style={styles.absolute}>
                <ImageBackground
                  resizeMode={'contain'}
                  style={styles.BigCircleBackgroundImage}
                  source={Constants.Images.RunningBackground}>
                  <Image
                    source={Constants.Images.RunningMan}
                    style={{height: 30, width: 30, marginTop: 25}}
                  />
                  <Text
                    style={[styles.swiperText, {fontSize: 24, marginTop: 10}]}>
                    7,300
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
                  style={styles.CircularProgressStyle}
                  arcSweepAngle={360}
                  size={70}
                  width={10}
                  fill={80}
                  rotation={0}
                  tintColor="#30C3D6"
                  lineCap={'round'}
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#E0F8FB"
                />
                <View style={styles.absolute}>
                  <Image
                    source={Constants.Images.Calories}
                    style={{height: 25, width: 25, marginTop: -25}}
                  />
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={[styles.SmallThinBlackText]}>2345 kcal</Text>
                </View>
              </View>
              <View style={styles.forCircle}>
                <AnimatedCircularProgress
                  style={styles.CircularProgressStyle}
                  arcSweepAngle={360}
                  size={70}
                  width={10}
                  fill={80}
                  rotation={0}
                  tintColor="#F43085"
                  lineCap={'round'}
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#FDE2EF"
                />
                <View style={styles.absolute}>
                  <Image
                    source={Constants.Images.Distance}
                    style={{height: 25, width: 25, marginTop: -25}}
                  />
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={[styles.SmallThinBlackText]}>2 km</Text>
                </View>
              </View>
              <View style={styles.forCircle}>
                <AnimatedCircularProgress
                  style={styles.CircularProgressStyle}
                  arcSweepAngle={360}
                  size={70}
                  width={10}
                  fill={80}
                  rotation={0}
                  tintColor="#37DD67"
                  lineCap={'round'}
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#C6F9E8"
                />
                <View style={styles.absolute}>
                  <Image
                    source={Constants.Images.Time}
                    style={{height: 25, width: 25, marginTop: -25}}
                  />
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={[styles.SmallThinBlackText]}>23 min</Text>
                </View>
              </View>
            </View>
            <GraphicChart />
          </ScrollView>
    )
}

export default FitnessData
