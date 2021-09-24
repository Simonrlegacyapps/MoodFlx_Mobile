import React, {useEffect, useState, useRef} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Crown from '../../../assets/svg/Crown';
import { RubikRegular } from '../../Constants/fonts/Fonts';
import { dynamicSize, getFontSize, horizontalScale } from '../../Constants/sizeChoose';
import { getFloCoins } from '../../services/commonService';
import AnimatedNumber from '../AnimatedNumber/AnimatedNumber';

const CrownBox = ({floCoins}) => {
  const [rewardPts, setRewardPts] = useState(floCoins);
  const prevRewardPoints = useRef(floCoins);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let pts = rewardPts;
      setRewardPts((e) => {
        pts = e;
        return e;
      });
      if (prevRewardPoints.current !== floCoins) {
        setRewardPts(floCoins);
        prevRewardPoints.current = floCoins;
      }
      clearTimeout(timeoutId);
    }, 250);
  }, [floCoins]);

    return (
        // <View>
            <View style={{ alignItems: 'center'}}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#7265E3', '#58A0E3']}
            style={styles.linearGradient}>
            <View style={{ marginHorizontal: dynamicSize(15), flexDirection: 'row', alignItems: 'center', marginVertical: 9, }}>
              <Crown />
              <View style={styles.coinsView}>
                <AnimatedNumber
                  includeComma
                  animateToNumber={rewardPts}
                  fontStyle={styles.text}
                />
              </View>
              {/* <Text allowFontScaling={false} style={styles.text}>
                {getFloCoins(floCoins)}
              </Text> */}
            </View>
          </LinearGradient>
        </View>
        // </View>
    )
}

const styles = StyleSheet.create({
      
linearGradient: {
    // height: dynamicSize(38),

    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7265E3',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: RubikRegular,
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  coinsView: {
    marginLeft: horizontalScale(10),
    overflow: 'hidden',
  },
})

export default CrownBox
