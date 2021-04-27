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
  onLayoutScrollerContainer
}) {

  return (
    <>
      <Animated.View
        ref={scrollerContainerRef}
        onLayout={onLayoutScrollerContainer}
        style={[styles.container, scrollerStyle]}
        {...scrollerPanResponder.panHandlers}
      >
        {isAllMoodsDataAvailable && (
          <View
            ref={toolTipRef}
            onLayout={onToolTipLayout}
            style={styles.toolTipView}>
            <View
              style={styles.toolTipTextView}>
              <Text style={styles.toolTipText}>
              {emotionText}
              </Text>
              {emotionText !== 'Slide finger' && (
                <SvgUri
                  width={20}
                  height={20}
                  // viewBox="0 0 24 24"
                  fill="none"
                  uri={`https://super.moodflo.com/${
                    toolTipData?.img
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
          style={[styles.circle1]}
          ref={scrollerRef}
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
    top: height / 2,
    left: width / 2,
    alignItems: 'center',
    // backgroundColor: '#000000'
  },
  circle1: {
    //  position: 'absolute',
    // opacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255, 0.2)',
    height: scrollerWheelSize,
    width: scrollerWheelSize,
    borderRadius: scrollerWheelSize / 2,
    zIndex: 5
  },
  circle2: {
    // position: 'absolute',
    backgroundColor: 'rgba(255,255,255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    height: scrollerWheelSize * 0.75,
    width: scrollerWheelSize * 0.75,
    borderRadius: (scrollerWheelSize * 0.75) / 2,
    // opacity: 0.4,
    zIndex: 10,
  },
  circle3: {
    // position: 'absolute',
    backgroundColor: 'rgba(255,255,255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    height: scrollerWheelSize * 0.5,
    width: scrollerWheelSize * 0.5,
    borderRadius: (scrollerWheelSize * 0.5) / 2,
    // opacity: 0.6,
    zIndex: 15,
  },
  circle4: {
    // position: 'absolute',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: scrollerWheelSize * 0.25,
    width: scrollerWheelSize * 0.25,
    borderRadius: (scrollerWheelSize * 0.25) / 2,
    zIndex: 20,
  },
  toolTipView: {
    zIndex: 30,
    alignItems: 'center',
    marginBottom: -10,

  },
  toolTipTextView: {
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  toolTipText: {
    paddingRight: 7,
    lineHeight: 23,
    fontSize: horizontalScale(14)
  },
  toolTipImg: {
    height: 21,
    width: 21
  }
})
