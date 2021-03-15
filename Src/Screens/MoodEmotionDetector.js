import React, { useEffect, useState } from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  PanResponder,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import AnonymousHeader from '../Components/AnonymousHeader/AnonymousHeader';
import { getUniqueId } from 'react-native-device-info';
import ToolTip from '../../assets/tooltip/ToolTip';
import CloseIcon from '../../assets/commonicons/CloseIcon';
import QuestionMarkIcon from '../../assets/commonicons/QuestionMarkIcon';
import { dynamicSize } from '../Constants/sizeChoose';


const moods = ["Happy", "excited", "party", "Sad", "Funny", "Stocked", "Pumped"]
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const MoodEmotionDetector = ({ navigation }) => {
  const [locationX, setLocationX] = useState(0);
  const [locationY, setLocationY] = useState(0);
  const [ShowDraggable, setShowDraggable] = useState(true);
  const [pan, setPan] = useState(new Animated.ValueXY());
  const [Location, setLocation] = useState([]);
  const [Moving, setMoving] = useState(false);
  const [Anonymous, setAnonymous] = useState(false);

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    console.log('Unique id', getUniqueId())
    renderLine(locationX, locationY);
  });
  console.log('Location', Location);
  //panResponder initialization
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event, gestureState) => true,
    onStartShouldSetPanResponderCapture: (event, gestureState) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => {
      console.log('Capture X', event.nativeEvent.locationX);
      console.log('Capture Y', event.nativeEvent.locationY);
    },
    onMoveShouldSetPanResponderCapture: (event, gestureState) => {
      console.log('Capture X', event.nativeEvent.locationX);
      console.log('Capture Y', event.nativeEvent.locationY);
    },
    onPanResponderGrant: (event, gestureState) => false,
    onPanResponderMove: (event, gestureState) => {
      Animated.event([
        null,
        {
          dx: pan.x,
          dy: pan.y,
        },
      ]);
      {
        forceUpdate;
      }
      Location.push({
        x: event.nativeEvent.locationX,
        y: event.nativeEvent.locationY,
      });
      console.log('event.nativeEvent.locationX', event.nativeEvent.locationX);
      console.log('event.nativeEvent.locationY', event.nativeEvent.locationY);
      setMoving(true);
    },
    onPanResponderRelease: (event, gestureState) => {
      Animated.spring(pan, { toValue: { x: 0, y: 0 } }).start();
      //After the change in the location
      setLocationX(event.nativeEvent.locationX.toFixed(2));
      setLocationY(event.nativeEvent.locationY.toFixed(2));
      setMoving(false);
    },
  });

  const renderDraggable = () => {
    if (ShowDraggable) {
      return (
        <View style={{ height: '100%', width: '100%' }}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[pan.getLayout(), styles.pointStyle]}>
            <Text style={styles.text}>Drag me!</Text>
          </Animated.View>
        </View>
      );
    }
  };

  const onPressButton = () => {
    navigation.replace('HomeScreen');
  };

  const renderLine = (x, y) => {
    return (
      //   Location &&
      //   Location.length > 0 &&
      //   Location.map((item, index) => {
      //     return (
      <View
        style={[
          styles.pointStyle2,
          {
            backgroundColor: '#F6926C',
            top: Math.round(y),
            left: Math.round(x),
          },
        ]}
      />
      // );
      //   })
    );
  };
  // TOP => x:0 , y:-15 ||  x: 208 y: -15 || x: 411 y: -15
  // Middle =>  x:2, y:383 ||  x: 208 y: 383 || x: 411 y: 383
  // Bottom =>  x:0, y:774 ||  x: 208 y: 778 || x: 411 y: 776

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* <Text style={styles.titleStyle}>
          React Native Get Clicked Location of Touchscreen Using PanResponder
        </Text> */}
        {console.log('Moving', Moving)}
        <View
          style={{
            backgroundColor:
              0 < locationX &&
                locationX < 208 &&
                -15 < locationY &&
                locationY < 383
                ? '#B78391'
                : 208 < locationX &&
                  locationX < 411 &&
                  -15 < locationY &&
                  locationY < 383
                  ? '#0B5003'
                  : 208 < locationX &&
                    locationX < 411 &&
                    383 < locationY &&
                    locationY < 570
                    ? '#949607'
                    : 0 < locationX &&
                      locationX < 208 &&
                      570 < locationY &&
                      locationY < 774
                      ? '#62A2C4'
                      : 0 < locationX &&
                        locationX < 208 &&
                        383 < locationY &&
                        locationY < 570
                        ? '#69C069'
                        : 208 < locationX &&
                          locationX < 411 &&
                          570 < locationY &&
                          locationY < 774
                          ? '#D57F08'
                          : '#B400B9',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
          }}>
          <AnonymousHeader />
        </View>
        <View
          style={[
            styles.childViewStyle,
            {
              backgroundColor:
                0 < locationX &&
                  locationX < 208 &&
                  -15 < locationY &&
                  locationY < 383
                  ? 'pink'
                  : 208 < locationX &&
                    locationX < 411 &&
                    -15 < locationY &&
                    locationY < 383
                    ? 'green'
                    : 208 < locationX &&
                      locationX < 411 &&
                      383 < locationY &&
                      locationY < 570
                      ? 'yellow'
                      : 0 < locationX &&
                        locationX < 208 &&
                        570 < locationY &&
                        locationY < 774
                        ? 'skyblue'
                        : 0 < locationX &&
                          locationX < 208 &&
                          383 < locationY &&
                          locationY < 570
                          ? 'lightgreen'
                          : 208 < locationX &&
                            locationX < 411 &&
                            570 < locationY &&
                            locationY < 774
                            ? 'orange'
                            : 'purple',
            },
          ]}>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'grey',
              height: '100%',
              position: 'absolute',
              alignSelf: 'center',
              zIndex: -99999,
            }}
          />
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: 'grey',
              width: '100%',
              height: '50%',
              position: 'absolute',
              flexDirection: 'row',
              alignSelf: 'center',
              zIndex: -99999,
            }}
          />
          {/* anxious */}
          {/*Text to show the screen location we get*/}
          <Text
            style={[
              {
                top: parseFloat(locationY - 25),
                left: parseFloat(locationX - 60),
              },
            ]}>
            {locationX !== 0 && locationY !== 0 && <ToolTip text={"Mood"} />}
            {/* X: {locationX}, Y: {locationY} */}
          </Text>
          {/*View to show green dot where user touched*/}
          {/* <View
            style={[
              styles.pointStyle,
              {
                top: parseFloat(locationY - 2),
                left: parseFloat(locationX - 11),
              },
            ]}
          /> */}

          {/* {Location &&
            Location.length > 0 &&
            Location.map((item, index) => {
              return renderLine(item.x, item.y);
            })} */}

          {/* Marking touched position */}
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
            }}
            {...panResponder.panHandlers}
          />
        </View>
        {/* {renderDraggable()} */}
      </View>
      <View
        style={{
          backgroundColor:
            0 < locationX &&
              locationX < 208 &&
              -15 < locationY &&
              locationY < 383
              ? '#B78391'
              : 208 < locationX &&
                locationX < 411 &&
                -15 < locationY &&
                locationY < 383
                ? '#0B5003'
                : 208 < locationX &&
                  locationX < 411 &&
                  383 < locationY &&
                  locationY < 570
                  ? '#949607'
                  : 0 < locationX &&
                    locationX < 208 &&
                    570 < locationY &&
                    locationY < 774
                    ? '#62A2C4'
                    : 0 < locationX &&
                      locationX < 208 &&
                      383 < locationY &&
                      locationY < 570
                      ? '#69C069'
                      : 208 < locationX &&
                        locationX < 411 &&
                        570 < locationY &&
                        locationY < 774
                        ? '#D57F08'
                        : '#B400B9',
          // alignItems: 'center',
          // justifyContent: 'center',
          paddingVertical: 15,
        }}>
        <View
          style={{
            height: 80,
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            flexDirection: 'row',
          }}>
          <TouchableOpacity style={{ marginLeft: 12 }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CloseIcon width={dynamicSize(56)} height={dynamicSize(56)} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
            <QuestionMarkIcon width={dynamicSize(56)} height={dynamicSize(56)} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPressButton()}
            style={{
              height: dynamicSize(56),
              width: dynamicSize(197),
              backgroundColor: 'white',
              borderRadius: 17,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View />
            <Text style={{ textAlign: 'center', fontSize: 18 }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default MoodEmotionDetector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleStyle: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  childViewStyle: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#F5FCFF',
    borderStyle: 'solid',
  },
  pointStyle: {
    height: 22,
    width: 22,
    marginTop: 5,
    position: 'absolute',
    borderRadius: 14,
    backgroundColor: '#00FF30',
  },
  pointStyle2: {
    height: 11,
    width: 11,
    marginTop: 5,
    position: 'absolute',
    borderRadius: 14,
    backgroundColor: '#F6926C',
  },
});
