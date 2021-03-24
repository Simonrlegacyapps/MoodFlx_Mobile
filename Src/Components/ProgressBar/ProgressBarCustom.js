import React, {useEffect, useState} from 'react';
import {View, Text, Animated} from 'react-native';

const Progress = ({step, steps, height, width, color}) => {
  const [Width, setWidth] = useState(0);
  const animatedValue = React.useRef(new Animated.Value(-1000)).current;
  const reactive = React.useRef(new Animated.Value(-1000)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    reactive.setValue(-Width + (Width * step) / steps);
  }, [step, Width]);

  return (
    <View
      onLayout={(e) => {
        const newWidth = e.nativeEvent.layout.width;
        setWidth(newWidth);
      }}
      style={{
        height,
        width,
        // backgroundColor: '#ebebeb',
        borderRadius: height,
        overflow: 'hidden',
        // margin: 80,
        transform: [{rotate: '270deg'}],
      }}>
      <Animated.View
        style={{
          height,
          width: width,
          borderRadius: height,
          backgroundColor: color,
          // position: 'absolute',
          // left: 0,
          // top: 0,
          transform: [{translateX: animatedValue}],
        }}
      />
    </View>
  );
};

const CustomProgressBar = ({value, totalValue, height, width, color}) => {
  return (
    <View style={{}}>
      <Progress
        step={value}
        steps={totalValue}
        height={width}
        width={height}
        color={color}
      />
    </View>
  );
};

export default CustomProgressBar;
