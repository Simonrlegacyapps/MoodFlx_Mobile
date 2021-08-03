import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Crown from '../../../assets/svg/Crown'
import { RubikRegular } from '../../Constants/fonts/Fonts'
import { dynamicSize } from '../../Constants/sizeChoose'
import { getFloCoins } from '../../services/commonService'

const CrownBox = ({floCoins}) => {
    return (
        <View>
            <View style={{ alignItems: 'center'}}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#7265E3', '#58A0E3']}
            style={styles.linearGradient}>
            <View style={{ marginHorizontal: dynamicSize(15), flexDirection: 'row', alignItems: 'center' }}>
              <Crown />
              <Text allowFontScaling={false} style={styles.text}>
                {getFloCoins(floCoins)}
              </Text>
            </View>
          </LinearGradient>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
      
linearGradient: {
    // height: dynamicSize(38),

    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{ color: 'white', fontFamily: RubikRegular, marginLeft: dynamicSize(10), fontSize:dynamicSize(14), marginVertical:9 }
})

export default CrownBox
