import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { dynamicSize } from '../../Constants/sizeChoose';
import Constants from '../../Constants';


const AddButton = () => {
    return (
        <View style={styles.buttonContainer}>
            <Text style={styles.textStyle}>Add</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: dynamicSize(68),
        height: dynamicSize(39),
        backgroundColor: Constants.Colors.MagoliaColor,
        borderRadius: dynamicSize(12),
        justifyContent: 'center',
        alignItems: 'center'
    }, textStyle: {
        fontWeight: '500',
        fontSize: dynamicSize(14),
        color: Constants.Colors.blueTextColor
    }
})


export default AddButton