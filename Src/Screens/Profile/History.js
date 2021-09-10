import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import HisotyImage from '../../../assets/svg/historyImage'
import { RubikMedium, RubikRegular } from '../../Constants/fonts/Fonts'

const History = () => {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white',  }} scrollEnabled={false} >
            <View style={{alignItems: 'center',}}>
            <View style={{ marginTop: 30 }}>
                <HisotyImage />
            </View>
            <Text style={styles.BigText}>You're Getting There! </Text>
            <Text style={styles.SmallText}>You haven't redeemed {`\n`}any rewards yet. Keep bringing {`\n`}in the Flo coins!</Text>
            </View>
            <View style={{marginBottom: 120}} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    BigText: { fontFamily: RubikRegular, fontSize: 20, fontWeight: '500', marginTop: 40 },
    SmallText: { color: "#9C9EB9", textAlign: 'center', marginTop: 20, fontSize: 16, lineHeight: 22 }
})

export default History
