import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HappyIcon from '../emotionsicons/HappyIcon';
import Colors from '../../Src/Constants/Colors/Colors';

const ToolTip = ({ text }) => {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}><Text style={styles.textStyle}>{text}</Text>
                <View style={{ marginLeft: 6 }}>
                    <HappyIcon />
                </View>
            </View>
            <View style={styles.tooltipStyle}>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 35,
        width: 100,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        borderRadius: 8
    }, tooltipStyle: {
        position: 'absolute',
        top: "100%",
        left: "45%",
        marginLeft: -5,
        borderWidth: 10,
        borderStyle: 'solid',
        borderTopColor: 'white',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent'
    }, textStyle: {
        fontWeight: '500',
        fontSize: 14,
        marginTop: 2,
        color: Colors.blackColorCode
    }
})

export default ToolTip