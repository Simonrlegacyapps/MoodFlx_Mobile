import React, { Component } from "react";
import {
  StatusBar,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const getDirectionAndColor = ( { moveX, moveY, dx, dy, y0, x0 }) => {

  console.log('moveX, moveY, dx, dy, ',moveY, moveX, dx, dy, y0, x0 )
  const draggedDown = dy > 30;
  const draggedUp = dy < -30;
  const draggedLeft = dx < -30;
  const draggedRight = dx > 30;
  const isRed = moveY < 90 && moveY > 40 && moveX > 0 && moveX < width;
  const isBlue = moveY > height - 50 && moveX > 0 && moveX < width;
  let dragDirection = "";

  if (draggedDown || draggedUp) {
    if (draggedDown) dragDirection += "dragged down ";
    if (draggedUp) dragDirection += "dragged up ";
  }

  if (draggedLeft || draggedRight) {
    if (draggedLeft) dragDirection += "dragged left ";
    if (draggedRight) dragDirection += "dragged right ";
  }

  if (isRed) return `red ${dragDirection}`;
  if (isBlue) return `blue ${dragDirection}`;
  if (dragDirection) return dragDirection;
};

export default class MoodEmotionDetectorTouch extends Component {
  state = {
    zone: "Still Touchable",
  };
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
    onStartShouldSetPanResponderCapture: (event, gestureState) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => {
      console.log('compare compare compare ===========>>>>>>>>>> ', gestureState);
      !!getDirectionAndColor(gestureState)
    },
    onPanResponderStart: (evt, gestureState) => {
      console.log('check check check ================>>>>>>>>>>>>.',evt, gestureState.y0, gestureState.x0)
    },
    onMoveShouldSetPanResponderCapture: (event, gestureState) => true,
    onPanResponderGrant: (event, gestureState) => true,
    onPanResponderMove: (event, gestureState) => {
      const drag = getDirectionAndColor(gestureState);
      // setLabel(drag)
      // Animated.event([
      //   null,
      //   {
      //     dx: pan.x,
      //     dy: pan.y,
      //   },
      // ]);
      // {
      //   forceUpdate;
      // }
      // Location.push({
      //   x: event.nativeEvent.locationX,
      //   y: event.nativeEvent.locationY,
      // });
      // console.log('event.nativeEvent.locationX', event.nativeEvent.locationX);
      // console.log('event.nativeEvent.locationY', event.nativeEvent.locationY);
      // setMoving(true);
    },
    onPanResponderRelease: (event, gestureState) => true,
    });
  }



  onPress = () => {
    this.setState({
      zone: "I got touched with a parent pan responder",
    });
  };

  render() {
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <StatusBar hidden />
        <View style={styles.zone1} />
        <View style={styles.center}>
          <TouchableOpacity onPress={this.onPress}>
            <Text>{this.state.zone}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.zone2} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  zone1: {
    top: 40,
    left: 0,
    right: 0,
    height: 50,
    position: "absolute",
    backgroundColor: "red",
  },
  zone2: {
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    position: "absolute",
    backgroundColor: "blue",
  },
});