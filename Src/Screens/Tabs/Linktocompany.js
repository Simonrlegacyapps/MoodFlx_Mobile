import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const Linktocompany = () => {

    const onLink = () => {
        console.log("run")
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 24 }}>Link a Company</Text>
            <Text style={{ fontWeight: '400', fontSize: 16, marginTop: 12, marginLeft: 62, marginRight: 62, textAlign: 'center' }}>Your mood is anonymous, why not link it to your company and help them better understand the mood pulse of their staff</Text>
            <TouchableOpacity onPress={() => onLink()}>
                <View style={{ marginTop: 48, height: 56, width: 250, backgroundColor: '#7265E3', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontWeight: '500', fontSize: 16, color: '#FFFFFF' }}>Link Now</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default Linktocompany