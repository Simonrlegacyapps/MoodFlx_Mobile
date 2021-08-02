import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Crown from '../../../assets/svg/Crown'
import { RubikRegular } from '../../Constants/fonts/Fonts'
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
            <View style={{ marginHorizontal: 15, flexDirection: 'row', alignItems: 'center' }}>
              <Crown />
              <Text style={{ color: 'white', fontFamily: RubikRegular, marginLeft: 10 }}>
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
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default CrownBox
