import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const Linktocompany = ({navigation}) => {
  const onLink = () => {
    console.log('run');
    navigation.navigate('EmailConfirmation');
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontWeight: '500', fontSize: 24}}>Link a Company</Text>
      <Text
        style={{
          fontWeight: '400',
          fontSize: 16,
          marginTop: 12,
          marginLeft: 62,
          marginRight: 62,
          textAlign: 'center',
        }}>
        Your mood is anonymous, why not link it to your company and help them
        better understand the mood pulse of their staff
      </Text>
      <TouchableOpacity onPress={() => onLink()}>
        <View
          style={{
            marginTop: 48,
            height: 56,
            width: 250,
            backgroundColor: '#7265E3',
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontWeight: '500', fontSize: 16, color: '#FFFFFF'}}>
            Link Now
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkaCompanyText: {
    fontWeight: '500',
    fontSize: 24,
  },
  moodTextStyle: {
    fontWeight: '400',
    fontSize: 16,
    marginTop: 12,
    marginLeft: 62,
    marginRight: 62,
    textAlign: 'center',
  },
  buttonStyle: {
    marginTop: 48,
    height: 56,
    width: 250,
    backgroundColor: '#7265E3',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkNowText: {
    fontWeight: '500',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default Linktocompany;
