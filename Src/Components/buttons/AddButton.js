import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {dynamicSize} from '../../Constants/sizeChoose';
import Constants from '../../Constants';
import {RubikMedium, RubikRegular} from '../../Constants/fonts/Fonts';

const AddButton = ({label, containerStyle}) => {
  return (
    <View style={containerStyle ? containerStyle : styles.buttonContainer}>
      <Text style={styles.textStyle}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: dynamicSize(68),
    height: dynamicSize(39),
    backgroundColor: Constants.Colors.MagoliaColor,
    borderRadius: dynamicSize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: RubikRegular,
    fontSize: dynamicSize(14),
    color: Constants.Colors.blueTextColor,
  },
});

export default AddButton;
