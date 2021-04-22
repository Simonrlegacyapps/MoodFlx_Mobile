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
   ProgressViewIOSComponent,
 } from 'react-native';
 import { Switch } from 'react-native-switch';
 import imagePath from '../../assets/images';
import { horizontalScale } from '../../Constants/sizeChoose';
 const scrollerWheelSize = 100;
 
 export default function EmotionsHeader({
   scrollerStyle,
   scrollerPanResponder,
   toolTipVisible,
   toolTipData,
   onToolTipClose,
   scrollerRef
 }) {
 
   return (
     <>
       <View style={styles.container}>
         {/* <View style={styles.cognitoImageView}>
           <Image
             source={imagePath.anonymous}
             style={styles.cognitoImage}
           />
         </View> */}
         <View style={styles.centerView}>
           <Text style={styles.textOne}>Anonymous</Text>
           <Text style={styles.textTwo}>Your data is private</Text>
         </View>
         <Switch
           value={props.isSwitchOn}
           onValueChange={(val) => console.log(val)}
           disabled={false}
           activeText={''}
           inActiveText={''}
           circleSize={horizontalScale(26)}
           barHeight={1}
           circleBorderWidth={3}
           backgroundActive={'#7FE3F0'}
           backgroundInactive={'#7FE3F0'}
           circleActiveColor={'#FFFFFF'}
           circleInActiveColor={'#FFFFFF'}
           changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
           innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
           outerCircleStyle={{}} // style for outer animated circle
           renderActiveText={false}
           renderInActiveText={false}
           switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
           switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
           switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
           // switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
         />
       </View>
     </>
   )
 }
 
 const styles = StyleSheet.create({
   container: {
     marginHorizontal: horizontalScale(20),
     paddingVertical: horizontalScale(18),
     paddingHorizontal: horizontalScale(18),
     alignSelf: 'center',
     width: '100%',
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: 'rgb(255,255,255)',
     borderRadius: horizontalScale(16),
   },
   cognitoImageView: {
     height: horizontalScale(40),
     width: horizontalScale(40),
     borderRadius: horizontalScale(40) / 2,
     justifyContent: 'center',
     alignItems: 'center',,
     backgroundColor: '#4C5980',
   },
   cognitoImage: {
     height: horizontalScale(20),
     width: horizontalScale(20),
     resizeMode: 'contain'
   },
   centerView: {
     flex: 1,
     justifyContent: 'center'
   },
   textOne: {
     fontSize: horizontalScale(16),
     fontWeight: 500,
     color: '#2D3142',
     lineHeight: horizontalScale(24)
   },
   textTwo: {
     fontSize: horizontalScale(12),
     color: '#9C9EB9',
   },
 
 })
 