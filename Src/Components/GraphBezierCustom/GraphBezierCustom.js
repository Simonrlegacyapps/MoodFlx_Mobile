import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  TextInput,
} from 'react-native';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';
// import * as path from 'svg-path-properties';
import * as shape from 'd3-shape';

import {scaleTime, scaleLinear, scaleQuantile} from 'd3-scale';
import {dynamicSize} from '../../Constants/sizeChoose';

// const {Path, Defs, LinearGradient, Stop} = Svg;

const d3 = {
  shape,
};

const {width} = Dimensions.get('window');
// const height = size / 3.7;
// const width = size - 114;
const verticalPadding = 5;
const cursorRadius = 10;
const labelWidth = 100;

// const data = [
//   {x: 1, y: 10},
//   {x: 2, y: 0},
//   {x: 3, y: 10},
//   {x: 4, y: 0},
//   {x: 5, y: 10},
//   {x: 6, y: 0},
//   {x: 7, y: 10},
// ];

const GraphBezierCustom = ({
  stroke,
  data,
  max,
  heightProp,
  widthProp,
  abs,
  H,
  numberOfXAxis,
  check,
  fitness,
  Duration,
  sleep,
}) => {
  // console.log(`numberOfXAxis`, check.length);
  console.log('GraphBezierCustom: ', data)
  const scaleX = scaleTime()
    .domain([1, check && fitness && Duration === 'Daily' ? check.length : 7])
    .range([0, widthProp]);
  const scaleY = scaleLinear()
    .domain([0, max + 0.1])
    .range([heightProp - verticalPadding, verticalPadding]);
  // const scaleLabel = scaleQuantile().domain([0, 20]).range([0, 20]);
  const line = d3.shape
    .line()
    .x((d) => scaleX(d.x))
    .y((d) => scaleY(d.y))
    .curve(d3.shape.curveCardinal)(data);
  //   const properties = path.svgPathProperties(line);
  //   const lineLength = properties.getTotalLength();
  //   const [x, setx] = useState(new Animated.Value(0));
  //   let cursor = React.createRef();
  //   let label = React.createRef();

  //   const moveCursor = (value) => {
  //     const {x, y} = properties.getPointAtLength(lineLength - value);
  //     cursor.current.setNativeProps({
  //       top: y - cursorRadius,
  //       left: x - cursorRadius,
  //     });
  //     const labeld = scaleLabel(scaleY.invert(y));
  //     // label.current.setNativeProps({text: `${labeld} CHF`});
  //   };

  //   const translateX = x.interpolate({
  //     inputRange: [0, lineLength],
  //     outputRange: [width - labelWidth, 0],
  //     extrapolate: 'clamp',
  //   });

  //   useEffect(() => {
  //     x.addListener(({value}) => moveCursor(value));
  //     moveCursor(0);
  //   }, []);

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      position: abs && 'absolute',
      marginLeft: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      // marginTop: 60,
      height: heightProp + dynamicSize(6),
      // width,
    },
    cursor: {
      width: cursorRadius * 2,
      height: cursorRadius * 2,
      borderRadius: cursorRadius,
      borderColor: '#367be2',
      borderWidth: 3,
      backgroundColor: 'white',
    },
    label: {
      position: 'absolute',
      top: -45,
      left: 0,
      backgroundColor: 'lightgray',
      width: labelWidth,
    },
  });

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Svg {...{width, height: heightProp + H}}>
          <Defs>
            <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient">
              <Stop stopColor="#CDE3F8" offset="0%" />
              <Stop stopColor="#eef6fd" offset="80%" />
              <Stop stopColor="#FEFFFF" offset="100%" />
            </LinearGradient>
          </Defs>
          <Path d={line} fill="transparent" stroke={stroke} strokeWidth={3.5} />
          {/* <Path
          // opacity={0.3}
          // d={`${line} L ${widthProp} ${heightProp} L 0 ${heightProp}`}
          // fill="url(#gradient)"
          /> */}
          {/* <View ref={cursor} /> */}
        </Svg>
        {/* <Animated.View style={[{transform: [{translateX}]}]}>
          <TextInput ref={label} />
        </Animated.View> */}
        {/* <Animated.ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerStyle={{width: lineLength * 2}}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={false}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {x},
                },
              },
            ],
            {useNativeDriver: true},
          )}
          horizontal
        /> */}
      </View>
      {/* <Text>Hi</Text> */}
    </SafeAreaView>
  );
};

export default GraphBezierCustom;
