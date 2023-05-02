import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Colors from '../../Constants/Colors/Colors';
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
  size,
  width,
  fontSize,
  marginTop,
  marginBottom,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          marginTop: marginTop,
          marginBottom: marginBottom,
          borderBottomWidth: border && 1,
          borderBottomColor: border && '#ebebeb',
        }]}>
      <View>
        <AnimatedCircularProgress
          duration={900}
          style={styles.CircularProgressStyle}
          arcSweepAngle={360}
          size={size ?? 60}
          width={width ?? 8}
          fill={(value / 120) * 100}
          rotation={0}
          tintColor={DarkColor}
          lineCap={'round'}
          backgroundColor={lightColor}
        />
      </View>
      <View style={{flex: 1}}>
        <Text style={[styles.labelText, {fontSize: fontSize ?? 19}]}>
          {Label}
        </Text>
      </View>
      <View>
        <Text style={[styles.timeText, {fontSize: fontSize ?? 19}]}>
          {Time}
        </Text>
      </View>
    </View>
  );
};

export default ScreenCircleBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    paddingVertical: 16,
  },
  labelText: {
    fontFamily: RubikLight,
    color: Colors.greyTwo,
    fontSize: 19,
    marginLeft: 15,
  },
  timeText: {
    fontFamily: RubikMedium,
    color: Colors.greyTwo,
    fontSize: 19,
  },
});
