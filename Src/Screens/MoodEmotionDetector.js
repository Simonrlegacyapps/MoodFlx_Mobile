import React, {useEffect, useState} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  PanResponder,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AnonymousHeader from '../Components/AnonymousHeader/AnonymousHeader';
import {getUniqueId} from 'react-native-device-info';
import ToolTip from '../../assets/tooltip/ToolTip';
import Svg, {Path} from 'react-native-svg';
import HappyIcon from '../../assets/emotionsicons/HappyIcon';
import CloseIcon from '../../assets/commonicons/CloseIcon';
import QuestionMarkIcon from '../../assets/commonicons/QuestionMarkIcon';
import {dynamicSize} from '../Constants/sizeChoose';

const moods = [
  'Happy',
  'excited',
  'party',
  'Sad',
  'Funny',
  'Stocked',
  'Pumped',
];
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const {width, height} = Dimensions.get('window');

const MoodEmotionDetector = ({navigation}) => {
  const [locationX, setLocationX] = useState(0);
  const [locationY, setLocationY] = useState(0);
  const [ShowDraggable, setShowDraggable] = useState(true);
  const [Location, setLocation] = useState([]);
  const [Moving, setMoving] = useState(false);
  const [Anonymous, setAnonymous] = useState(false);
  const [Label, setLabel] = useState('Mood');

  const forceUpdate = useForceUpdate();

  const getDirectionAndColor = ({moveY, moveX, dx, dy, y0, x0}) => {
    console.log('moveX, moveY, dx, dy, ', moveY, moveX, dx, dy, y0, x0);
    // console.log('dx', dx)
    // console.log('dy', dy)
    let word = '';

    const locationX = moveX;
    const locationY = moveY;

    setLocationX(moveX.toFixed(2));
    setLocationY(moveY.toFixed(2));

    0 < locationX && locationX < 208 && -15 < locationY && locationY < 383
      ? (word = word + 'Sad')
      : 208 < locationX && locationX < 411 && -15 < locationY && locationY < 383
      ? (word = word + 'Very Sad')
      : 208 < locationX && locationX < 411 && 383 < locationY && locationY < 570
      ? (word = word + 'Excited')
      : 0 < locationX && locationX < 208 && 570 < locationY && locationY < 774
      ? (word = word + 'Happy')
      : 0 < locationX && locationX < 208 && 383 < locationY && locationY < 570
      ? (word = word + 'Very Happy')
      : 208 < locationX && locationX < 411 && 570 < locationY && locationY < 774
      ? (word = word + 'Anxious')
      : (word = word + 'Delight');

    // console.log('label', Label)

    return word;
  };
  const getDirectionAndColorOnClick = ({moveY, moveX, dx, dy, y0, x0}) => {
    console.log('moveX, moveY, dx, dy, ', moveY, moveX, dx, dy, y0, x0);
    // console.log('dx', dx)
    // console.log('dy', dy)
    let word = '';

    const locationX = x0;
    const locationY = y0;

    setLocationX(x0.toFixed(2));
    setLocationY(y0.toFixed(2));

    0 < locationX && locationX < 208 && -15 < locationY && locationY < 383
      ? (word = word + 'Sad')
      : 208 < locationX && locationX < 411 && -15 < locationY && locationY < 383
      ? (word = word + 'Very Sad')
      : 208 < locationX && locationX < 411 && 383 < locationY && locationY < 570
      ? (word = word + 'Excited')
      : 0 < locationX && locationX < 208 && 570 < locationY && locationY < 774
      ? (word = word + 'Happy')
      : 0 < locationX && locationX < 208 && 383 < locationY && locationY < 570
      ? (word = word + 'Very Happy')
      : 208 < locationX && locationX < 411 && 570 < locationY && locationY < 774
      ? (word = word + 'Anxious')
      : (word = word + 'Delight');

    // console.log('label', Label)

    return word;
  };

  useEffect(() => {
    // console.log('Unique id', getUniqueId())
    renderLine(locationX, locationY);
  });
  // console.log('Location', Location);
  //panResponder initialization
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event, gestureState) => true,
    onStartShouldSetPanResponderCapture: (event, gestureState) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => {
      !!getDirectionAndColor(gestureState);
    },
    onPanResponderStart: (evt, gestureState) => {
      console.log(
        'check check check ================>>>>>>>>>>>>.',
        evt,
        gestureState.y0,
        gestureState.x0,
      );
      // setLocationX(gestureState.x0)
      // setLocationY(gestureState.y0)
      !!getDirectionAndColorOnClick(gestureState);
    },
    onMoveShouldSetPanResponderCapture: (event, gestureState) => {
      true;
    },
    onPanResponderGrant: (event, gestureState) => true,
    onPanResponderMove: (event, gestureState) => {
      const drag = getDirectionAndColor(gestureState);
      setLabel(drag);
    },
    onPanResponderRelease: (event, gestureState) => {},
  });

  const ColorFunctionB1 = () => {
    var colorCode = '';
    0 < locationX && locationX < 208 && -15 < locationY && locationY < 383
      ? (colorCode = '#BE8796')
      : 208 < locationX && locationX < 411 && -15 < locationY && locationY < 383
      ? (colorCode = '#1F8802')
      : 208 < locationX && locationX < 411 && 383 < locationY && locationY < 570
      ? (colorCode = 'yellow')
      : 0 < locationX && locationX < 208 && 570 < locationY && locationY < 774
      ? (colorCode = '#63A3C5')
      : 0 < locationX && locationX < 208 && 383 < locationY && locationY < 570
      ? (colorCode = 'lightgreen')
      : 208 < locationX && locationX < 411 && 570 < locationY && locationY < 774
      ? (colorCode = '#814E04')
      : (colorCode = 'purple'); //purple

    return colorCode;
  };
  const ColorFunctionB2 = () => {
    var colorCode = '';
    0 < locationX && locationX < 208 && -15 < locationY && locationY < 383
      ? (colorCode = 'pink')
      : 208 < locationX && locationX < 411 && -15 < locationY && locationY < 383
      ? (colorCode = 'green')
      : 208 < locationX && locationX < 411 && 383 < locationY && locationY < 570
      ? (colorCode = '#D6D80A')
      : 0 < locationX && locationX < 208 && 570 < locationY && locationY < 774
      ? (colorCode = '#457087') //skyblue
      : 0 < locationX && locationX < 208 && 383 < locationY && locationY < 570
      ? (colorCode = '#73D373')
      : 208 < locationX && locationX < 411 && 570 < locationY && locationY < 774
      ? (colorCode = 'orange')
      : (colorCode = '#9E00A2');

    return colorCode;
  };
  const ColorFunctionB3 = () => {
    var colorCode = '';
    0 < locationX && locationX < 208 && -15 < locationY && locationY < 383
      ? (colorCode = '#966B77')
      : 208 < locationX && locationX < 411 && -15 < locationY && locationY < 383
      ? (colorCode = '#134C01')
      : 208 < locationX && locationX < 411 && 383 < locationY && locationY < 570
      ? (colorCode = '#A8A908')
      : 0 < locationX && locationX < 208 && 570 < locationY && locationY < 774
      ? (colorCode = 'skyblue')
      : 0 < locationX && locationX < 208 && 383 < locationY && locationY < 570
      ? (colorCode = '#165701')
      : 208 < locationX && locationX < 411 && 570 < locationY && locationY < 774
      ? (colorCode = '#D17D08')
      : (colorCode = '#E200E8');

    return colorCode;
  };
  const ColorFunctionB4 = () => {
    var colorCode = '';
    0 < locationX && locationX < 208 && -15 < locationY && locationY < 383
      ? (colorCode = '#B4808E')
      : 208 < locationX && locationX < 411 && -15 < locationY && locationY < 383
      ? (colorCode = '#249F03')
      : 208 < locationX && locationX < 411 && 383 < locationY && locationY < 570
      ? (colorCode = '#838506')
      : 0 < locationX && locationX < 208 && 570 < locationY && locationY < 774
      ? (colorCode = '#568EAB')
      : 0 < locationX && locationX < 208 && 383 < locationY && locationY < 570
      ? (colorCode = '#5CA65C')
      : 208 < locationX && locationX < 411 && 570 < locationY && locationY < 774
      ? (colorCode = '#A16106')
      : (colorCode = '#AE00B2');

    return colorCode;
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
    <View style={{flex: 1}}>
      <View style={styles.container}>
        {/* <Text style={styles.titleStyle}>
          React Native Get Clicked Location of Touchscreen Using PanResponder
        </Text> */}
        {/* {console.log('Moving', Moving)} */}
        {/* Header Bar */}
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
        {/* Header Bar till here*/}

        <View
          style={[
            styles.childViewStyle,
            {
              backgroundColor: 'green',
              flexDirection: 'row',
              flexWrap: 'wrap',
              zIndex: -99999,
              flex: 1,
            },
          ]}
          {...panResponder.panHandlers}>
          <View
            style={{
              height: '50%',
              width: '50%',
              backgroundColor: ColorFunctionB1(),
            }}
          />
          <View
            style={{
              height: '50%',
              width: '50%',
              backgroundColor: ColorFunctionB2(),
            }}
          />
          <View
            style={{
              height: '50%',
              width: '50%',
              backgroundColor: ColorFunctionB3(),
            }}
          />
          <View
            style={{
              height: '50%',
              width: '50%',
              backgroundColor: ColorFunctionB4(),
            }}
          />
          {/* anxious */}
          {/*Text to show the screen location we get*/}
          <View
            style={[
              {
                alignItems: 'center',
                position: 'absolute',
                top: parseFloat(locationY - 210),
                left: parseFloat(locationX - 25),
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 5,
                backgroundColor: 'white',
                borderRadius: 8,
                overflow: 'hidden',
              }}>
              <Text style={{paddingHorizontal: 7}}>
                {locationX !== 0 && locationY !== 0 && <Text>{Label}</Text>}
                {/* X: {locationX}, Y: {locationY} */}
              </Text>
              <HappyIcon />
            </View>
            <Svg
              style={{}}
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <Path
                d="M13 8L25.1244 0.5H0.875645L13 8Z"
                fill="white"
                stroke="white"
                strokeWidth={0.5}
              />
            </Svg>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
            }}
            {...panResponder.panHandlers}
          />
        </View>
      </View>

      {/* Bottom Bar */}
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
          <TouchableOpacity
            style={{marginLeft: 12}}
            onPress={() => navigation.navigate('HomeScreen')}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CloseIcon width={dynamicSize(52)} height={dynamicSize(52)} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
            <QuestionMarkIcon
              width={dynamicSize(52)}
              height={dynamicSize(52)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPressButton()}
            style={{
              height: dynamicSize(52),
              width: dynamicSize(197),
              backgroundColor: 'white',
              borderRadius: 17,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View />
            <Text style={{textAlign: 'center', fontSize: 18}}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default MoodEmotionDetector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
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
