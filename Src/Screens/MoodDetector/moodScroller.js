/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Dimensions
} from 'react-native';
import Svg, { Path, SvgUri, G } from 'react-native-svg';
import { getFontSize, getLineHeight } from '../../Constants/sizeChoose';
import { getScrollerWheelSize, initialEmotionTextData, largeWheelSize, largeWheelSizeArray, mediumWheelSize, mediumWheelSizeArray, regularWheelSize, regularWheelSizeArray } from './moodService';
import CustomFastSVG from '../../Components/CustomFastSVG/CustomFastSVG';
const { height, width } = Dimensions.get('window');

export default function MoodScroller({
  scrollerStyle,
  scrollerPanResponder,
  toolTipData,
  isAllMoodsDataAvailable,
  scrollerRef,
  emotionText,
  toolTipRef,
  onToolTipLayout,
  scrollerContainerRef,
  onLayoutScrollerContainer,
  wheelSize,
  forceUpdate,
  iconColor,
}) {
  if (emotionText === initialEmotionTextData.text && scrollerStyle?.left === 0) {
    return null;
  }
  let scale = 1;
  let scaleOne = 1;
  let scaleTwo = 1;
  let scaleThree = 1;
  let scaleFour = 1;
  let marginTop = -10;
  let wheelSizeArray = regularWheelSizeArray
  if (wheelSize === mediumWheelSize) {
    marginTop = ((mediumWheelSize - regularWheelSize) / 2) - 10
    scale = 2.5;
    left = regularWheelSize / 2
  } else if (wheelSize === largeWheelSize) {
    marginTop = ((largeWheelSize - regularWheelSize) / 2) - 10
    scale = 3.5;
  }
  scaleOne = wheelSize === mediumWheelSize ? 0.95 : 0.9;
  scaleTwo = wheelSize === mediumWheelSize ? 0.95 : 0.85;
  scaleThree = wheelSize === mediumWheelSize ? 0.95 : 0.9;
  const circleOne = useRef(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(
      circleOne.current,
      {
        toValue: scale,
        duration: 0.3 * 1000,
        useNativeDriver: false,
      }
    ).start(({finished}) => {
      console.log('finished: ', finished)
      if(finished) {
        forceUpdate();
      }
    });
  }, [wheelSize])

  return (
    <>
      <Animated.View
        ref={scrollerContainerRef}
        onLayout={onLayoutScrollerContainer}
        style={[
          styles.container, scrollerStyle,
          scrollerStyle?.top?._value ? {
            top: scrollerStyle.top._value - marginTop,
            // left: scrollerStyle.left._value - wheelSize !== regularWheelSize ? (regularWheelSize / 2) : 0
          } : {}
          // { transform: [{ scale: circleOne.current }] }
        ]}
        // {...(isAllMoodsDataAvailable && wheelSize === regularWheelSize) ? scrollerPanResponder.panHandlers : {}}
        pointerEvents="none"
      >
        {isAllMoodsDataAvailable && (
          <View
            ref={toolTipRef}
            onLayout={onToolTipLayout}
            style={[styles.toolTipView,
              // {transform: [{ scale: 1 }]}
              {marginBottom: marginTop}
            ]}>
            <View
              style={styles.toolTipTextView}>
              <Text style={styles.toolTipText}>
                {emotionText}
              </Text>
              {emotionText !== 'Slide finger' && (
                <CustomFastSVG
                  width={getFontSize(20)}
                  height={getFontSize(20)}
                  // viewBox="0 0 24 24"
                  fill='none'
                  stroke={iconColor}
                  source={{uri: `https://super.moodflo.com/${toolTipData?.img
                    ? toolTipData.img
                    : 'mood_icons/161616176321272238406054abe3bb450.svg'
                    }`}}
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
        <View style={styles.circleView}>
          <Animated.View
            style={[styles.circle1, {
              height: wheelSizeArray[3] * scaleFour,
              width: wheelSizeArray[3] * scaleFour,
              borderRadius: (wheelSizeArray[3] * scaleFour) / 2,
              transform: [{ scale: circleOne.current }]
            }]}
            ref={scrollerRef}
          >
            <Animated.View style={{
              ...styles.circle2,
              height: wheelSizeArray[2] * scaleThree,
              width: wheelSizeArray[2] * scaleThree,
              borderRadius: (wheelSizeArray[2] * scaleThree) / 2,
              // transform: [{ scale: (scale * scaleThree) }]
            }} >
              <Animated.View style={{
                ...styles.circle3,
                height: wheelSizeArray[1] * scaleTwo,
                width: wheelSizeArray[1] * scaleTwo,
                borderRadius: (wheelSizeArray[1] * scaleTwo) / 2,
                // transform: [{ scale: (scale * scaleTwo) }]
              }} >
                <Animated.View style={{
                  ...styles.circle4,
                  height: wheelSizeArray[0] * scaleOne,
                  width: wheelSizeArray[0] * scaleOne,
                  borderRadius: (wheelSizeArray[0] * scaleOne) / 2,
                  // transform: [{ scale: (scale * scaleOne) }]
                }} />
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </View>
      </Animated.View>
    </>
  )
}

const fontSize = getFontSize(14);
const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: height / 2,
      left: width / 2,
      alignItems: 'center',
      zIndex: 10,
      // backgroundColor: '#000000'
    },
    circleView: {
      // marginTop: 20
    },
    circle1: {
      //  position: 'absolute',
      // opacity: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255, 0.2)',
      // height: regularWheelSizeArray[3],
      // width: regularWheelSizeArray[3],
      // borderRadius: regularWheelSizeArray[3] / 2,
      zIndex: 5
    },
    circle2: {
      // position: 'absolute',
      backgroundColor: 'rgba(255,255,255, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      // height: regularWheelSizeArray[2],
      // width: regularWheelSizeArray[2],
      // borderRadius: regularWheelSizeArray[2] / 2,
      // opacity: 0.4,
      zIndex: 10,
    },
    circle3: {
      // position: 'absolute',
      backgroundColor: 'rgba(255,255,255, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      // height: regularWheelSizeArray[1],
      // width: regularWheelSizeArray[1],
      // borderRadius: regularWheelSizeArray[1] / 2,
      // opacity: 0.6,
      zIndex: 15,
    },
    circle4: {
      // position: 'absolute',
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      // height: regularWheelSizeArray[0],
      // width: regularWheelSizeArray[0],
      // borderRadius: regularWheelSizeArray[0] / 2,
      zIndex: 20,
    },
    toolTipView: {
      zIndex: 30,
      alignItems: 'center',
      // marginBottom: -10,

    },
    toolTipTextView: {
      zIndex: 5,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      backgroundColor: 'white',
      borderRadius: 8,
    },
    toolTipText: {
      margin: 7,
      marginRight: 7,
      lineHeight: getLineHeight(fontSize),
      fontSize: fontSize,
    },
    toolTipImg: {
      height: getFontSize(20),
      width: getFontSize(20)
    }
  })
