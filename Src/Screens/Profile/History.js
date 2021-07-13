import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import HisotyImage from '../../../assets/svg/historyImage'
import { RubikMedium, RubikRegular } from '../../Constants/fonts/Fonts'

const History = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', }}>
            <View style={{ marginTop: 100 }}>
                <HisotyImage />
            </View>
            <Text style={styles.BigText}>You're Getting There! </Text>
            <Text style={styles.SmallText}>You haven't redeemed {`\n`}any rewards yet. Keeo bringing {`\n`}in the Flo coins!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    BigText: { fontFamily: RubikRegular, fontSize: 20, fontWeight: '500', marginTop: 40 },
    SmallText: { color: "#9C9EB9", textAlign: 'center', marginTop: 20, fontSize: 16, lineHeight: 22 }
})

export default History
