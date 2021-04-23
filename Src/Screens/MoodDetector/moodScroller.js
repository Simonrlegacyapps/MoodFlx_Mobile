/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Dimensions
} from 'react-native';
import Svg, { Path, SvgUri, G } from 'react-native-svg';
import { horizontalScale } from '../../Constants/sizeChoose';
import { scrollerWheelSize } from './moodService';

const {height, width} = Dimensions.get('window');

export default function MoodScroller({
  scrollerStyle,
  scrollerPanResponder,
  toolTipData,
  isAllMoodsDataAvailable,
  scrollerRef,
  emotionText,
  setToolTipRef,
  setScrollerContainerRef
}) {

  return (
    <>
      <Animated.View 
        ref={setScrollerContainerRef}
        style={{position: 'absolute'}}
        {...scrollerPanResponder.panHandlers}
        >
        {isAllMoodsDataAvailable && (
          <View
            ref={setToolTipRef}
            style={[
              {
                zIndex: 9999999,
                alignItems: 'center',
                position: 'absolute',
                top: height/2,
                left: width/2
                //   position: 'absolute',
              //   elevation: 3,
              //   top: parseFloat(locationY - 133),
              //   left:
              //     Label?.length >= 8 &&
              //       Label?.length <= 12 &&
              //       Label === 'Slide finger'
              //       ? parseFloat(locationX - 50)
              //       : Label?.length >= 5 && Label?.length <= 6
              //         ? parseFloat(locationX - 45)
              //         : Label?.length > 6 && Label?.length <= 7
              //           ? parseFloat(locationX - 49)
              //           : Label?.length >= 7 && Label?.length <= 8
              //             ? parseFloat(locationX - 47)
              //             : Label?.length >= 8 && Label?.length <= 12
              //               ? parseFloat(locationX - 63)
              //               : parseFloat(locationX - 35),
              },
            ]}>
            <View
              style={{
                zIndex: 9999999,
                flexDirection: 'row',
                alignItems: 'center',
                padding: 7,
                paddingHorizontal: 10,
                backgroundColor: 'white',
                borderRadius: 8,
                // overflow: 'hidden',
              }}>
              <Text style={{ paddingHorizontal: 7, zIndex: 9999999 }}>
                <Text>{emotionText}</Text>
              </Text>
              {emotionText !== 'Slide finger' && (
                <SvgUri
                  width={20}
                  height={20}
                  // viewBox="0 0 24 24"
                  fill="none"
                  uri={`https://super.moodflo.com/${toolTipData?.img
                      ? toolTipData.img
                      : 'mood_icons/161616176321272238406054abe3bb450.svg'
                    }`}
                // uri="http://super.moodflo.com/mood_icons/161616176321272238406054abe3bb450.svg"
                />
              )}
            </View>

            <Svg
              style={{ marginTop: -4, marginLeft: -12 }}
              width={38}
              height={25}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <Path
                fill="#fff"
                d="M8.5 2.4H28c-.384 0-.75.16-1.011.441l-7.066 7.624a2 2 0 01-2.892.044l-7.604-7.72a1.302 1.302 0 00-.927-.39z"></Path>
            </Svg>
          </View>
        )}
        <Animated.View
          style={[styles.circle1, scrollerStyle]}
          ref={scrollerRef}
          {...scrollerPanResponder.panHandlers}
        >
          <View style={styles.circle2} >
            <View style={styles.circle3} >
              <View style={styles.circle4} />
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 200,
    top: 200,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  circle1: {
    position: 'absolute',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(255,255,255)',
    height: scrollerWheelSize,
    width: scrollerWheelSize,
    borderRadius: scrollerWheelSize / 2,
    zIndex: 5
  },
  circle2: {
    position: 'absolute',
    backgroundColor: 'rgb(255,255,255)',
    justifyContent: 'center',
    alignItems: 'center',
    height: scrollerWheelSize * 0.75,
    width: scrollerWheelSize * 0.75,
    borderRadius: (scrollerWheelSize * 0.75) / 2,
    zIndex: 10,
  },
  circle3: {
    position: 'absolute',
    backgroundColor: 'rgb(255,255,255)',
    justifyContent: 'center',
    alignItems: 'center',
    height: scrollerWheelSize * 0.5,
    width: scrollerWheelSize * 0.5,
    borderRadius: (scrollerWheelSize * 0.5) / 2,
    zIndex: 15,
  },
  circle4: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: scrollerWheelSize * 0.25,
    width: scrollerWheelSize * 0.25,
    borderRadius: (scrollerWheelSize * 0.25) / 2,
    zIndex: 20,
  },
  toolTipView: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10
  },
  toolTipText: {
    fontSize: 14,
    color: '#4C5980',
    fontWeight: '500',
    marginRight: 10
  },
  toolTipImg: {
    height: 21,
    width: 21
  }
})
