import React from 'react';
import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import AnonymousHeader from '../../Components/AnonymousHeader/AnonymousHeader';
import Constants from '../../Constants';

const VerifyEmail = () => {
  const [value, onChangeText] = React.useState('');
  return (
    <View style={{flex: 1}}>
      <AnonymousHeader backGround />
      <View style={{flex: 1, alignItems: 'center', marginTop: 100}}>
        <Text style={{fontWeight: '500', fontSize: 24}}>Verify your email</Text>
        <Text
          numberOfLines={2}
          style={{
            fontWeight: '300',
            letterSpacing: 0.6,
            fontSize: 14,
            marginTop: 12,
            marginLeft: 62,
            marginRight: 62,
            textAlign: 'center',
            width: '60%',
            lineHeight: 25,
          }}>
          We’ve sent a 4-digit code to
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontWeight: '400',
            letterSpacing: 0.6,
            fontSize: 14,
            marginTop: 12,
            marginLeft: 62,
            marginRight: 62,
            textAlign: 'center',
            width: '60%',
            lineHeight: 25,
          }}>
          example@company.com
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            paddingHorizontal: 8,
            borderRadius: 10,
            paddingLeft: 15,
            marginTop: 40,
          }}>
          <Image
            style={{height: 20, width: 20}}
            source={Constants.Images.mail}
          />
          <TextInput
            placeholder={'example@work-mail.com'}
            style={{
              height: 50,
              width: 250,
              backgroundColor: 'white',
              borderColor: 'transparent',
              borderWidth: 1,
              borderRadius: 10,
              paddingLeft: 15,
            }}
            onChangeText={(text) => onChangeText(text)}
            value={value}
          />
        </View>
        <TouchableOpacity disabled={true} onPress={() => onLink()}>
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
              Verify
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyEmail;
