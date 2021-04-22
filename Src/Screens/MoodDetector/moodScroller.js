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
 } from 'react-native';
//  import Tooltip from 'react-native-walkthrough-tooltip';
 import imagePath from '../../assets/images';
import { horizontalScale } from '../../Constants/sizeChoose';
 const scrollerWheelSize = horizontalScale(100);
 
 export default function MoodScroller({ 
   scrollerStyle,
   scrollerPanResponder,
   toolTipVisible,
   toolTipData,
   onToolTipClose,
   scrollerRef
 }) {
 
   const toolTip = useMemo(() => {
     return(
       <View style={styles.toolTipView}>
         <Text style={styles.toolTipText}>{toolTipData?.text ?? ''}</Text>
         {/* {toolTipData?.img && (<Image source={imagePath[toolTipData.img]} style={styles.toolTipImg} />)} */}
       </View>
     );
   }, [toolTipData]); 
 
   return (
     <>
       {/* <Tooltip
         isVisible={toolTipVisible}
         content={toolTip}
         placement="top"
         onClose={onToolTipClose}
       > */}
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
       {/* </Tooltip> */}
     </>
   )
 }
 
 const styles = StyleSheet.create({
   circle1: {
     position: 'absolute',
     left: 10,
     bottom: 10,
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
 