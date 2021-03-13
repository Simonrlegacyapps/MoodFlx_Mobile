import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import PostRequestApi from '../../apirequest/PostRequestApi';
import AnonymousHeader from '../../Components/AnonymousHeader/AnonymousHeader';
import Constants from '../../Constants';
import DeviceInfo from 'react-native-device-info';

const EmailConfirmation = ({navigation}) => {
  const [value, onChangeText] = React.useState('');
  const [Loading, setLoading] = useState(false);

  const onLink = () => {
    const deviceId = DeviceInfo.getUniqueId();
    const params = {
      email: 'test.chapter247@gmail.com',
      device_id: deviceId,
    };
    setLoading(true);
    PostRequestApi('linkToCompany', params).then((resp) => {
      if (resp.status == 200) {
        setLoading(false);
        console.log('otp', resp.data);
        navigation.navigate('VerifyEmail');
      }
    });
  };

  return (
    <View style={{flex: 1}}>
      <AnonymousHeader backGround />

      <View style={{flex: 1, alignItems: 'center', marginTop: 100}}>
        <Text style={{fontWeight: '500', fontSize: 24}}>Work email</Text>
        <Text
          numberOfLines={2}
          style={{
            fontWeight: '300',
            letterSpacing: 1,
            fontSize: 16,
            marginTop: 12,
            marginLeft: 62,
            marginRight: 62,
            textAlign: 'center',
            width: '60%',
          }}>
          Just to confirm you actually work there
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
              Verify
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {Loading && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

export default EmailConfirmation;
