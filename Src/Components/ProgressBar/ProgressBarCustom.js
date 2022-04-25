import React, {useEffect, useState, useCallback} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TickProgressBar from '../../../assets/svg/tickProgressBar';
import Colors from '../../Constants/Colors/Colors';

const Progress = (props) => {
  const {
    height,
    progress,
    animated,
    indeterminate,
    progressDuration,
    indeterminateDuration,
    onCompletion,
    backgroundColor,
    MoodCount,
    dots,
    dot1,
    dot2,
    dot3,
    dot4,
  } = props;

  const [timer] = useState(new Animated.Value(0));
  const [width] = useState(new Animated.Value(0));

  const indeterminateAnimation = Animated.timing(timer, {
    duration: indeterminateDuration,
    toValue: 1,
    useNativeDriver: true,
    isInteraction: false,
  });

  useEffect(() => {
    if (indeterminate || typeof progress === 'number') {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [indeterminate, progress, startAnimation, stopAnimation]);

  const startAnimation = useCallback(() => {
    if (indeterminate) {
      timer.setValue(0);
      Animated.loop(indeterminateAnimation).start();
    } else {
      Animated.timing(width, {
        duration: animated ? progressDuration : 0,
        toValue: progress,
        useNativeDriver: false,
      }).start(() => {
        onCompletion();
      });
    }
  }, [
    animated,
    indeterminate,
    indeterminateAnimation,
    onCompletion,
    progress,
    progressDuration,
    timer,
    width,
  ]);

  const stopAnimation = useCallback(() => {
    if (indeterminateAnimation) indeterminateAnimation.stop();

    Animated.timing(width, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }, [indeterminateAnimation, width]);

  const styleAnimation = () => {
    return indeterminate
      ? {
          transform: [
            {
              translateX: timer.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [-0.6 * 320, -0.5 * 0.8 * 320, 0.7 * 320],
              }),
            },
            {
              scaleX: timer.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.0001, 0.8, 0.0001],
              }),
            },
          ],
        }
      : {
          width: width.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
        };
  };

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height,
      overflow: 'hidden',
      borderRadius: 4,
    },
    progressBar: {
      flex: 1,
      borderRadius: height / 2,
    },
    linearGradient: {
      flex: 1,
      borderRadius: 5,
    },
    circle: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    circleView: {
      position: 'absolute',
      height: 16,
      width: 16,
      backgroundColor: 'white',
      top: -3,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    Line: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    LineView: {
      position: 'absolute',
      height: 16,
      width: 2,
      backgroundColor: '#F1F4F9',
      top: -3,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    smallCircle: {height: 8, width: 8, borderRadius: 10},
  });

  return (
    <View>
      <Animated.View style={[styles.container, {backgroundColor: '#F1F4F9'}]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor,
              ...styleAnimation(),
            },
          ]}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={[
              backgroundColor? backgroundColor : MoodCount > 3 ? '#A29EF1' : Colors.blueTextColor,
              backgroundColor? backgroundColor : MoodCount > 3 ? '#8EC2F0' : '#58A0E3',
            ]}
            style={styles.linearGradient}></LinearGradient>
        </Animated.View>
      </Animated.View>
      {dots ? null : <>
      {dot1 ? null :
      <View style={[{left: 0}, styles.circleView, styles.circle]}>
        {MoodCount >= 0 && (
          <View style={[{backgroundColor: Colors.blueTextColor}, styles.smallCircle]} />
        )}
      </View>}
      {dot2 ? <View style={[{right: '33.3%'}, styles.LineView, styles.Line]}>
        
      </View> :
      <View style={[{right: '33.3%'}, styles.circleView, styles.circle]}>
        {MoodCount >= 2 && <TickProgressBar />}
      </View>}
      {dot3 ? <View style={[{right: '66.6%'}, styles.LineView, styles.Line]}>
      </View> :
      <View style={[{right: '66.6%'}, styles.circleView, styles.circle]}>
        {MoodCount >= 1 && <TickProgressBar />}
      </View>}
      {dot4 ? null :
      <View
        style={[
          {right: MoodCount > 3 ? 10 : 0},
          styles.circleView,
          styles.circle,
        ]}>
        {MoodCount >= 3 && <TickProgressBar />}
      </View>}
      </>}
      {/* <View style={[{ right: 0, }, styles.circleView, styles.circle]} >{MoodCount >= 3 && <View style={[{ backgroundColor: '#58A0E3', }, styles.smallCircle]} />}</View> */}
    </View>
  );
};

Progress.defaultProps = {
  state: 'black',
  height: 2,
  progress: 0,
  animated: true,
  indeterminate: false,
  indeterminateDuration: 1500,
  progressDuration: 1500,
  onCompletion: () => {},
};

export default Progress;
