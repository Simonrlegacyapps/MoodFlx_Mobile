import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {
  RubikBold,
  RubikLight,
  RubikMedium,
  RubikRegular,
  RubikSemiBold,
} from '../../Constants/fonts/Fonts';

export const {width: SIZE, height: HEIGHT} = Dimensions.get('window');

const ScreenCircleBar = ({
  DarkColor,
  lightColor,
  Label,
  Time,
  value,
  border,
}) => {
  return (
    <View
      style={{
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
        paddingVertical: 16,

        borderBottomWidth: border && 1,
        borderBottomColor: border && '#ebebeb',
      }}>
      <View>
        <AnimatedCircularProgress
          duration={900}
          style={styles.CircularProgressStyle}
          arcSweepAngle={360}
          size={60}
          width={8}
          fill={(value / 120) * 100}
          rotation={0}
          tintColor={DarkColor}
          lineCap={'round'}
          backgroundColor={lightColor}
        />
      </View>
      <View style={{flex: 1}}>
        <Text style={{fontFamily: RubikLight, fontSize: 19, marginLeft: 15}}>
          {Label}
        </Text>
      </View>
      <View>
        <Text style={{fontFamily: RubikMedium, fontSize: 19}}>{Time}</Text>
      </View>
    </View>
  );
};

export default ScreenCircleBar;

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
