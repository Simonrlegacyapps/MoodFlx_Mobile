import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import Colors from '../../Constants/Colors/Colors';

export default function Loader({isLoading}) {
  return (
    isLoading && (
      <View style={styles.loader}>
        <ActivityIndicator color={Colors.loaderColor} size="large" />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
