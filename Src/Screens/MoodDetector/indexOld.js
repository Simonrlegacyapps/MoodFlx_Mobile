/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {
   Dimensions,
   StyleSheet,
   View,
   Button,
   Platform,
   Image as RNimage,
   Animated,
   PanResponder,
   Text,
 } from 'react-native';
 import imagePath from '../../assets/images';
 import Scroller from './scroller';
 import { getEmotionsTextData, emotionsTextData } from './moodService';
import { pSBC } from './moodUtils';
import { iPhoneXPadding, isIphoneX } from '../../Constants/sizeChoose';
 const window = Dimensions.get('window');
 const scrollerWheelSize = 100;
 const scrollerWheelRadius = scrollerWheelSize / 2;
 const screenWidth = Math.floor(window.width);
 const imageSize = screenWidth;
 
 
 // import imagePath from '../assets/images';
 
 export default class MoodDetector extends Component {
   constructor(props) {
     super(props);
     this.state = {
       color: '#FFFFFF',
       screenSize: window,
       toolTipVisible: true,
       toolTipData: emotionsTextData.exited,
       left: 0,
       top: 0,
       emotionText: '',
       isSwitchOn: false,
     };
     this.state.emotionText = this.state.toolTipData?.text ?? '';
     this.state.color = this.state.toolTipData?.color ?? '#FFFFFF';
     this.canvas = null;
     this.pan = new Animated.ValueXY();
     this.updatePanResponder();
     this.panResponder = this.buildPanResponder();
     this.prevEmotionData = this.state.toolTipData;
     this.scrollerRef = null;
     this.count = 1;
     this.addValue = 1;
   }
 
   buildPanResponder = () => {
     return PanResponder.create({
       onStartShouldSetPanResponder: () => true,
       onMoveShouldSetPanResponder: () => true,
       onPanResponderGrant: (event, gestureState) => {
         this.pan.setOffset({
           x: this.pan.x._value,
           y: this.pan.y._value
         });
       },
       onPanResponderMove: (event, gestureState) => {
         // if (DeviceInfo.getSystemVersion() > 8.1) {
         this.pan.setValue({ x: gestureState.dx, y: gestureState.dy });
         this.scrollerRef.measureInWindow((x, y, width, height) => {
             const top = y + scrollerWheelRadius;
             const left = x + scrollerWheelRadius;
             const emotionData = getEmotionsTextData(top, left, this.prevEmotionData);
             if(this.prevEmotionData.text === this.state.toolTipData.text){
               const color = pSBC(this.count/100, this.state.toolTipData.color)
              this.setState({
                toolTipData: emotionData,
                left,
                top,
                emotionText: emotionData?.text ?? '',
                color
            });
            if(this.count === 60){
              this.addValue = -1;
            }
            if(this.count === 0){
              this.addValue = 1;
            }
            this.count = this.count + this.addValue;
            console.log('count =>', this.count);
            console.log('addValue =>', this.addValue);
            console.log('color =>', color);
          } else {
               this.setState({
                 toolTipData: emotionData,
                 left,
                 top,
                 emotionText: emotionData?.text ?? '',
                 color: emotionData?.color
                });
                this.count = 1;
             }
             this.prevEmotionData = emotionData;

            console.log("++++++ measureInWindow "+width+" "+height+" "+x+" "+y);
            // this.setState({ vheight: height, vwidth: width, vx: x, vy: y });
          }
        );
       },
       onPanResponderRelease: (event, gesture) => {
         this.pan.flattenOffset();
         console.log('onPanResponderRelease screenWidth : ', screenWidth)
       }
     });
   }
 
   updatePanResponder = (forceUpdate, isOrientationChange) => {
     let {
       xMin,
       xMax,
       yMinWithHeader,
       yMinWithoutHeader,
       yMaxWithControls,
       yMaxWithoutControls
     } = getScrollerOffset(this.state.screenSize);
     this.constrainedX = this.pan.x.interpolate({
       inputRange: [xMin, 150, xMax],
       outputRange: [xMin, 150, xMax],
       extrapolate: 'clamp',
     });
     const yMin = false ? yMinWithHeader : yMinWithoutHeader;
     const yMax = false ? yMaxWithControls : yMaxWithoutControls;
     this.constrainedY = this.pan.y.interpolate({
       inputRange: [yMin, isIphoneX ? 200 : 150, yMax],
       outputRange: [yMin, isIphoneX ? 200 : 150, yMax],
       extrapolate: 'clamp',
     });
     forceUpdate && this.forceUpdate();
     (isOrientationChange || !forceUpdate) && this.pan.setValue({ x: getInitialLocalX(this.state.screenSize), y: getInitialLocalY(this.state.screenSize) });
   }

   rgbToHex(r, g, b) {
     if (r > 255 || g > 255 || b > 255)
       throw "Invalid color component";
     return ((r << 16) | (g << 8) | b).toString(16);
   }
 

   onToolTipClose = () => {
       this.setState({toolTipVisible: false})
   }

   onChangeIsSwitchOn = () => {
     this.setState((prevState) => ({isSwitchOn: !prevState.isSwitchOn}));
   }
 
 
   render() {
     return (
       <View style={[styles.container, { backgroundColor: this.state.color }]}>
         
           <Scroller
             scrollerStyle={{ ...this.pan.getLayout(), ...{ left: this.constrainedX, top: this.constrainedY } }}
             scrollerPanResponder={this.panResponder}
             toolTipVisible={this.state.toolTipVisible}
             toolTipData={this.state.toolTipData}
             onToolTipClose={this.onToolTipClose}
             scrollerRef={(ref) => this.scrollerRef = ref}
           />
           {/* <Text>{`left - ${this.state.left} top - ${this.state.top}`}</Text> */}
           <Text style={{color: '#000000', fontSize: 25, fontWeight: 'bold'}}>{`emotion text - ${this.state.emotionText}`}</Text>
         {/* {Object.keys(emotionsTextData).map((e, idx) => {
           
           )}} */}
           {Object.keys(emotionsTextData).map((e, idx) => {
               const {top, left, color, text} = emotionsTextData[e];
               return (
                 <>
                 <Text
                  style={{
                    position: 'absolute',
                    left: left[0],
                    top: top[0] - (top[1] - top[0]) - 4,
                    color: '#000000',
                    fontSize: 14
                  }}
                 >{text}</Text>
                 <View
                     style={{
                       position: 'absolute',
                       left: left[0],
                       top: top[0],
                       height: top[1] - top[0],
                       width: left[1] - left[0],
                       backgroundColor: color,
                     }}
                 />
                 </>
               )
           })}
       </View>
     )
   }
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     width: screenWidth,
     justifyContent: 'center',
     alignItems: 'center',
   },
 })
 