import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  StyleSheet,
} from 'react-native';
import { RubikRegular } from '../../Constants/fonts/Fonts';

const indicatorHelperStyles = StyleSheet.create({
  indicatorHelper: {
    height: 18,
    width: 18,
    borderRadius: 5,
  },
  indicatorHelperView: {
    flexDirection: 'row',
    marginHorizontal: 3,
    marginTop: 10,
  },
  indicatorText: {
    marginHorizontal: 10,
    color: '#4C5980',
    fontFamily: RubikRegular,
  },
});
export function IndicatorHelper({color, text}) {
  return (
    <View style={indicatorHelperStyles.indicatorHelperView}>
      <View
        style={[
          indicatorHelperStyles.indicatorHelper,
          {backgroundColor: color},
        ]}
      />
      <Text style={indicatorHelperStyles.indicatorText}>{text}</Text>
    </View>
  );
}
