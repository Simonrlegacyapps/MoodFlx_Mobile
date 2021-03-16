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
import {dynamicSize} from '../../Constants/sizeChoose';

const EmailConfirmation = ({navigation}) => {
  const [value, onChangeText] = React.useState('');
  const [Loading, setLoading] = useState(false);
  const [email, setemail] = useState(null);
  const [ShowWarning, setShowWarning] = useState(false);
  const [APIfail, setAPIfail] = useState(false);

  const onLink = () => {
    const deviceId = DeviceInfo.getUniqueId();
    const params = {
      email: 'test1.chapter247@gmail.com',
      device_id: deviceId,
    };
    setLoading(true);
    setAPIfail(false);
    PostRequestApi('linkToCompany', params)
      .then((resp) => {
        if (resp.status == 200) {
          setLoading(false);
          console.log('otp', resp.data);
          navigation.navigate('VerifyEmail', {code: resp.data.otp});
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log('err', err), setLoading(false), setAPIfail(true);
      });
  };

  const validate = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      console.log('Email is Not Correct');
      setemail(false);
      return false;
    } else {
      setemail(true);
      console.log('Email is Correct');
    }
  };

  return (
    <View style={{flex: 1}}>
      <AnonymousHeader backGround />
      {APIfail && (
        <Text
          style={{
            fontWeight: '300',
            letterSpacing: 0.2,
            fontSize: 12,
            marginTop: 12,
            marginLeft: 62,
            marginRight: 62,
            textAlign: 'center',
            // width: '60%',
            color: 'red',
          }}>
          Sever Error: Please try again
        </Text>
      )}
      <View
        style={{flex: 1, alignItems: 'center', marginTop: dynamicSize(100)}}>
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
            autoCorrect={false}
            autoCapitalize={false}
            autoCompleteType={false}
            placeholder={'example@work-mail.com'}
            style={{
              height: dynamicSize(50),
              width: dynamicSize(250),
              backgroundColor: 'white',
              borderColor: 'transparent',
              borderWidth: 1,
              borderRadius: 10,
              paddingLeft: 15,
            }}
            onChangeText={(text) => {
              onChangeText(text), validate(text);
            }}
            value={value}
          />
        </View>
        {ShowWarning && (
          <Text
            style={{
              fontWeight: '300',
              letterSpacing: 0.2,
              fontSize: 12,
              marginTop: 12,
              marginLeft: 62,
              marginRight: 62,
              textAlign: 'center',
              width: '60%',
              color: 'red',
            }}>
            Please enter valid email
          </Text>
        )}
        <TouchableOpacity
          onPress={
            email
              ? () => onLink()
              : () => {
                  setShowWarning(true);
                }
          }>
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
