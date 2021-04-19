import React, {useEffect, useState} from 'react';
import {View, Text, Image, Animated, ImageBackground} from 'react-native';
import Constants from '../../Constants';
import {RubikMedium, RubikRegular} from '../../Constants/fonts/Fonts';
import {dynamicSize} from '../../Constants/sizeChoose';

const StarProgress = () => {
  const [Width, setWidth] = useState(0);
  const animatedValue = React.useRef(new Animated.Value(-1000)).current;
  const reactive = React.useRef(new Animated.Value(-1000)).current;
  const [step, setstep] = useState(6);
  const wid = dynamicSize(300);
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    reactive.setValue(-Width + (Width * step) / 10);
  }, [step, Width]);
  return (
    <View
      style={{
        width: wid,
        alignSelf: 'center',
        justifyContent: 'space-evenly',
        overflow: 'hidden',
        marginTop: dynamicSize(18),
      }}
      onLayout={(e) => {
        const newWidth = e.nativeEvent.layout.width - 10;

        setWidth(newWidth);
      }}>
      <Animated.View
        style={{
          left: Width,
          transform: [{translateX: animatedValue}],
        }}>
        <ImageBackground
          resizeMode={'contain'}
          source={Constants.Images.Pointer}
          style={{
            resizeMode: 'contain',
            height: 60,
            width: 60,
            marginBottom: 15,
          }}>
          <View
            style={{
              alignItems: 'center',
              marginTop: 15,
              justifyContent: 'center',
              flex: 1,
            }}>
            <Text
              style={{
                color: '#fff',
                flex: 1,
                justifyContent: 'center',
                fontSize: 18,
                fontFamily: RubikRegular,
              }}>
              {step - 2}Hrs
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '100%',
        }}>
        {
          <Image
            source={
              step + 2 >= 2
                ? Constants.Images.ColoredStar
                : Constants.Images.Star
            }
            style={{height: 32, width: 32}}
          />
        }
        {
          <Image
            source={
              step + 2 >= 4
                ? Constants.Images.ColoredStar
                : Constants.Images.Star
            }
            style={{height: 32, width: 32}}
          />
        }
        {
          <Image
            source={
              step + 2 >= 6
                ? Constants.Images.ColoredStar
                : Constants.Images.Star
            }
            style={{height: 32, width: 32}}
          />
        }
        {
          <Image
            source={
              step + 2 >= 8
                ? Constants.Images.ColoredStar
                : Constants.Images.Star
            }
            style={{height: 32, width: 32}}
          />
        }
        {
          <Image
            source={
              step + 2 >= 10
                ? Constants.Images.ColoredStar
                : Constants.Images.Star
            }
            style={{height: 32, width: 32}}
          />
        }
      </View>
    </View>
  );
};

export default StarProgress;
