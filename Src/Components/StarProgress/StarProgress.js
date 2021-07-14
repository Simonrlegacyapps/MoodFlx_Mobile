import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  ImageBackground,
  Dimensions,
  StyleSheet
} from 'react-native';
import Constants from '../../Constants';
import { RubikMedium, RubikRegular } from '../../Constants/fonts/Fonts';
import { dynamicSize, getFontSize, horizontalScale } from '../../Constants/sizeChoose';
import { convertMinutesToTime } from '../../Screens/Home/SleepData/sleepDataService';
const { width } = Dimensions.get('window');
const wid = horizontalScale(300);

const StarProgress = ({ sleepMinutes }) => {
  const [Width, setWidth] = useState(0);
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  // const reactive = useRef(new Animated.Value(-1000));
  const progressRef = useRef(null);
  const progressSize = useRef(null);
  const [toolTipPosition, setToolTipPosition] = useState(0); //ToolTip position from left
  const [step, setStep] = useState(-1); // change here for moving the hours bar
  const [initialPosition, setInitialPosition] = useState(0); // change here for moving the hours bar
  const [currentFont, setCurrentFont] = useState(17);
  const starSize = 32;
  const toolTipSize = 70;
  const toolTipText = convertMinutesToTime(sleepMinutes);

  // useEffect(() => {
  //   if(toolTipPosition <= 0) {
  //     return;
  //   }
  //   Animated.timing(animatedValue, {
  //     toValue: toolTipPosition,
  //     duration: 1000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [toolTipPosition]);
  // console.log('sleepMinutes: ', sleepMinutes);

  useEffect(() => {
    const hours = Number.parseInt(String(sleepMinutes / 60));
    let s = sleepMinutes > 600 ? 600 : sleepMinutes;
    s = Math.round((s * 5) / 600);
    // console.log('calculated step: ', s);
    setStep(s);
    const timeoutId = setTimeout(() => {
      calculateToolTipPosition(s);
      clearTimeout(timeoutId);
    }, 500);
  }, [sleepMinutes]);

  useEffect(() => {
    calculateToolTipPosition();
  }, [step]);

  // console.log('toolTipPosition: ', toolTipPosition);
  useEffect(() => {
    // setToolTipPosition(-Width + (Width * step) / 10);
    // console.log('StarProgress animation: ', toolTipPosition);
    if (!(toolTipPosition <= 0)) {
      Animated.timing(animatedValue, {
        toValue: toolTipPosition,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [toolTipPosition]);

  const calculateToolTipPosition = useCallback((_step) => {
    let stepss = _step !== undefined ? _step : step;
    if (progressSize.current && (_step >= 0 || step >= 0)) {
      console.log('calculateToolTipPosition stepss: ', stepss);
      console.log('calculateToolTipPosition _step: ', _step);
      const { left, top, width, height } = progressSize.current;
      const space = (width - 40 - (starSize * 5)) / 4;
      const position = 0 + 20 + ((stepss > 0 ? stepss : 1) * starSize) + ((stepss > 0 ? (stepss - 1) : 0) * space) - (starSize / 2) - (toolTipSize / 2) + 1;
      // console.log('calculateToolTipPosition position: ', position);
      setToolTipPosition(position);
    }
  }, [step])

  const onProgressLayout = useCallback((e) => {
    progressRef?.current?.measureInWindow((x, y, width, height) => {
      progressSize.current = { left: x, top: y, width, height };
      // console.log('StarProgress onProgressLayout: ', progressSize.current);
      calculateToolTipPosition();
    })
  }, [calculateToolTipPosition])

  const onTextLayout = useCallback((e) => {
    const { lines } = e.nativeEvent;
    // if(lines.length > 1) {
    //   setCurrentFont(currentFont - 1);
    // }
    // return;
    if (toolTipText.length < 8 && currentFont !== 17) {
      setCurrentFont(17)
    } else if (toolTipText.length === 8 && currentFont !== 15) {
      setCurrentFont(15)
    } else if (lines.length > 1) {
      setCurrentFont(currentFont - 1);
    }
  }, [currentFont, setCurrentFont, sleepMinutes])

  return (
    <View
      style={{
        width: wid,
        alignSelf: 'center',
        justifyContent: 'space-evenly',
        overflow: 'visible',
        marginTop: dynamicSize(18),
      }}
      onLayout={(e) => {
        const newWidth = e.nativeEvent.layout.width - 10;
        setWidth(newWidth);
      }}>
      <Animated.View
        style={{
          left: initialPosition,
          transform: [{ translateX: animatedValue }],
        }}>
        <ImageBackground
          resizeMode={'contain'}
          source={Constants.Images.Pointer}
          style={{
            resizeMode: 'contain',
            height: toolTipSize,
            width: toolTipSize,
            marginBottom: 15,
            paddingHorizontal: 3,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }}
          imageStyle={styles.innerContainer}>
          <View
            style={{
              alignItems: 'center',
              // marginTop: 15,
              marginBottom: 5,
              justifyContent: 'center',
              // flex: 1,
            }}>
            <Text
              onTextLayout={onTextLayout}
              style={{
                color: '#fff',
                // flex: 1,
                justifyContent: 'center',
                fontSize: currentFont,
                fontFamily: RubikRegular,
              }}>
              {toolTipText}
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>
      <View
        ref={progressRef}
        onLayout={onProgressLayout}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          paddingHorizontal: 20
        }}>
        {
          <Image
            source={
              step >= 1
                ? Constants.Images.ColoredStar
                : Constants.Images.Star
            }
            style={{ height: starSize, width: starSize, resizeMode: 'stretch' }}
          />
        }
        {
          <Image
            source={
              step >= 2
                ? Constants.Images.ColoredStar
                : Constants.Images.Star
            }
            style={{ height: starSize, width: starSize, resizeMode: 'stretch' }}
          />
        }
        {
          <Image
            source={
              step >= 3
                ? Constants.Images.ColoredStar
                : Constants.Images.Star
            }
            style={{ height: starSize, width: starSize, resizeMode: 'stretch' }}
          />
        }
        {
          <Image
            source={
              step >= 4
                ? Constants.Images.ColoredStar
                : Constants.Images.Star
            }
            style={{ height: starSize, width: starSize, resizeMode: 'stretch' }}
          />
        }
        {
          <Image
            source={
              step >= 5
                ? Constants.Images.ColoredStar
                : Constants.Images.Star
            }
            style={{ height: starSize, width: starSize, resizeMode: 'stretch' }}
          />
        }
      </View>
      <View style={{ alignItems: 'center', marginTop: 20, overflow: 'visible' }}>
        <Image
          resizeMode={'contain'}
          source={Constants.Images.Scale}
          style={{ height: 20, width: wid - horizontalScale(20) }}
        />
        <View style={styles.qualitiesView}>
          <View style={styles.qualityViewOne}>
            <Text style={styles.qualitiesText}>That's rough</Text>
          </View>
          <View style={styles.qualityViewTwo}>
            <Text style={styles.qualitiesText}>Almost</Text>
          </View>
          <View style={styles.qualityViewThree}>
            <Text style={[styles.qualitiesText, { color: '#000000' }]}>Perfect!</Text>
          </View>
          <View style={styles.qualityViewFour}>
            <Text style={styles.qualitiesText}>Bit too much</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  qualitiesView: {
    width: wid,
    paddingHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: horizontalScale(10),
    overflow: 'visible',
  },
  qualitiesText: {
    color: '#4C5980',
    flex: 1,
    fontSize: getFontSize(12),
    fontFamily: RubikRegular,
  },
  qualityViewOne: {
    left: horizontalScale(35),
    top: 0,
  },
  qualityViewTwo: {
    left: horizontalScale(50),
    top: 0,
  },
  qualityViewThree: {
    left: horizontalScale(40),
    top: 0,
  },
  qualityViewFour: {
    left: horizontalScale(20),
    top: 0,
    overflow: 'visible',
  },
  innerContainer: {
    tintColor: '#7965F6',
  },
});

export default StarProgress;
