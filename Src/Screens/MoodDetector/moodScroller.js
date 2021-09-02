/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, useRef, useEffect, useCallback, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import Svg, {Path, SvgUri, G} from 'react-native-svg';
import {getFontSize, getLineHeight, isTablet} from '../../Constants/sizeChoose';
import {
  getScrollerWheelSize,
  initialEmotionTextData,
  largeWheelSize,
  largeWheelSizeArray,
  mediumWheelSize,
  mediumWheelSizeArray,
  regularWheelSize,
  regularWheelSizeArray,
} from './moodService';
import CustomFastSVG from '../../Components/CustomFastSVG/CustomFastSVG';
// import { Easing } from 'react-native-reanimated';
const {height, width} = Dimensions.get('window');

export default function MoodScroller({
  scrollerStyle,
  toolTipStyle,
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
}) {
  const circleOne = useRef(new Animated.Value(1));
  const [toolTipHeight, setToolTipHeight] = useState(0);
  const [toolTipWidth, setToolTipWidth] = useState(0);
  let scale = 1;
  let scaleOne = 1;
  let scaleTwo = 1;
  let scaleThree = 1;
  let scaleFour = 1;
  let marginTop = -10;
  let wheelSizeArray = regularWheelSizeArray;
  if (wheelSize === mediumWheelSize) {
    marginTop = (mediumWheelSize - regularWheelSize) / 2 - 10;
    scale = 2.5;
  } else if (wheelSize === largeWheelSize) {
    marginTop = (largeWheelSize - regularWheelSize) / 2 - 10;
    scale = 3.5;
  }
  scaleOne = wheelSize === mediumWheelSize ? 0.95 : 0.9;
  scaleTwo = wheelSize === mediumWheelSize ? 0.95 : 0.85;
  scaleThree = wheelSize === mediumWheelSize ? 0.95 : 0.9;

  const onCallToolTipLayout = useCallback((e) => {
  // console.log('onCallToolTipLayout -------', e);

      onToolTipLayout?.(e);
      if (typeof e?.nativeEvent?.layout?.height === 'number') {
        setToolTipHeight(e.nativeEvent.layout.height);
      }
      if (typeof e?.nativeEvent?.layout?.width === 'number') {
        setToolTipWidth(e.nativeEvent.layout.width);
      }
    },
    [onToolTipLayout],
  );

  useEffect(() => {
    Animated.timing(circleOne.current, {
      toValue: scale,
      duration: 0.3 * 1000,
      useNativeDriver: false,
      Easing: Easing,
    }).start(({finished}) => {
      console.log('finished: ', finished);
      if (finished) {
        forceUpdate();
      }
    });
  }, [wheelSize]);

  if (
    emotionText === initialEmotionTextData.name &&
    scrollerStyle?.left === 0
  ) {
    return null;
  }

  // let marginLeft = 0;
  // if (wheelSize === largeWheelSize) {
  //   marginLeft = -getFontSize(15);
  // } else if (wheelSize === mediumWheelSize) {
  //   marginLeft = -getFontSize(17);
  // }

  const t = toolTipData?.name?.toLowerCase?.() ?? '';
  let toolTipLeft = (wheelSize - toolTipWidth)/2;
  if (wheelSize !== regularWheelSize) {
    toolTipLeft = (regularWheelSize - toolTipWidth)/2;
  }
  return (
    <>
      {isAllMoodsDataAvailable && (
        <Animated.View
          ref={toolTipRef}
          pointerEvents="none"
          onLayout={onCallToolTipLayout}
          style={[
            styles.container,
            styles.toolTipView,
            toolTipStyle,
            toolTipStyle?.top?._value ?
              {
                top: toolTipStyle?.top._value - (wheelSize !== regularWheelSize ? (marginTop + toolTipHeight) : isTablet ? regularWheelSize : (regularWheelSize / 2)) - 10,
              } : {},
            toolTipStyle?.left?._value ?
              {
                left: toolTipStyle?.left._value + toolTipLeft,
              } : {},
          ]}>
          <View style={styles.toolTipTextView}>
            <Text style={styles.toolTipText}>{emotionText}</Text>
            {emotionText !== 'Slide finger' && (
              <CustomFastSVG
                width={getFontSize(20)}
                height={getFontSize(20)}
                // viewBox="0 0 24 24"
                fill={t === 'content' ? '#000000' : undefined}
                stroke="#000000"
                source={{
                  uri: `https://super.moodflo.com/${toolTipData?.icon
                      ? toolTipData.icon
                      : 'mood_icons/161616176321272238406054abe3bb450.svg'
                    }`,
                }}
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
              d="M8.5 2.4H28c-.384 0-.75.16-1.011.441l-7.066 7.624a2 2 0 01-2.892.044l-7.604-7.72a1.302 1.302 0 00-.927-.39z"
            />
          </Svg>
        </Animated.View>
      )}
      <Animated.View
        ref={scrollerContainerRef}
        onLayout={onLayoutScrollerContainer}
        pointerEvents="none"
        style={[
          styles.container,
          scrollerStyle,
          scrollerStyle?.top?._value
            ? {
                top: scrollerStyle.top._value + (wheelSize === regularWheelSize ? marginTop : 0),
                // left: scrollerStyle.left._value - wheelSize !== regularWheelSize ? (regularWheelSize / 2) : 0
              }
            : {},
          // { transform: [{ scale: circleOne.current }] }
        ]}
        // {...(isAllMoodsDataAvailable && wheelSize === regularWheelSize) ? scrollerPanResponder.panHandlers : {}}
        pointerEvents="none">
        <View style={[styles.circleView, 
          {alignSelf: wheelSize === regularWheelSize ? 'center' : 'center'},
          ]}>
          <Animated.View
            style={[
              styles.circle1,
              {
                height: wheelSizeArray[3] * scaleFour,
                width: wheelSizeArray[3] * scaleFour,
                borderRadius: (wheelSizeArray[3] * scaleFour) / 2,
                transform: [{scale: circleOne.current}],
              },
            ]}
            ref={scrollerRef}>
            <Animated.View
              style={{
                ...styles.circle2,
                height: wheelSizeArray[2] * scaleThree,
                width: wheelSizeArray[2] * scaleThree,
                borderRadius: (wheelSizeArray[2] * scaleThree) / 2,
                // transform: [{ scale: (scale * scaleThree) }]
              }}>
              <Animated.View
                style={{
                  ...styles.circle3,
                  height: wheelSizeArray[1] * scaleTwo,
                  width: wheelSizeArray[1] * scaleTwo,
                  borderRadius: (wheelSizeArray[1] * scaleTwo) / 2,
                  // transform: [{ scale: (scale * scaleTwo) }]
                }}>
                <Animated.View
                  style={{
                    ...styles.circle4,
                    height: wheelSizeArray[0] * scaleOne,
                    width: wheelSizeArray[0] * scaleOne,
                    borderRadius: (wheelSizeArray[0] * scaleOne) / 2,
                    // transform: [{ scale: (scale * scaleOne) }]
                  }}
                />
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </View>
      </Animated.View>
    </>
  );
}

const fontSize = getFontSize(14);
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: height / 2,
    left: width / 2,
    // alignItems: 'center',
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
    zIndex: 5,
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
    alignSelf: 'center',
    // width: '100%',
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
    width: getFontSize(20),
  },
});
