import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Keyboard,
  Dimensions,
} from 'react-native';
import PostRequestApi from '../../apirequest/PostRequestApi';
import AnonymousHeader from '../../Components/AnonymousHeader/AnonymousHeader';
import Constants from '../../Constants';
import DeviceInfo from 'react-native-device-info';
import {dynamicSize} from '../../Constants/sizeChoose';

const {width: width} = Dimensions.get('window');

const EmailConfirmation = ({navigation}) => {
  const [value, onChangeText] = React.useState('');
  const [Loading, setLoading] = useState(false);
  const [email, setemail] = useState(null);
  const [ShowWarning, setShowWarning] = useState(false);
  const [APIfail, setAPIfail] = useState(false);
  const [CompanyFail, setCompanyFail] = useState(false);

  const onLink = () => {
    Keyboard.dismiss;
    const deviceId = DeviceInfo.getUniqueId();
    const params = {
      email: value,
      device_id: deviceId,
    };
    setLoading(true);
    setAPIfail(false);
    PostRequestApi('linkToCompany', params)
      .then((resp) => {
        if (resp.status == 200 && resp.data.success == true) {
          setLoading(false);
          console.log('otp', resp.data);
          navigation.navigate('VerifyEmail', {
            code: resp.data.otp,
            mail: value,
            deviceID: deviceId,
          });
        } else {
          setCompanyFail(true);
          setLoading(false);
          setShowWarning(false);
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

  const submit = () => {
    email ? onLink() : setShowWarning(true);

    console.log(`submitted`, email);
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
            color: 'red',
          }}>
          Sever Error: Please try again
        </Text>
      )}
      {CompanyFail && (
        <Text
          style={{
            fontWeight: '300',
            letterSpacing: 0.2,
            fontSize: width / 29,
            marginTop: 12,
            marginLeft: 62,
            marginRight: 62,
            textAlign: 'center',
            color: 'red',
          }}>
          Sorry, your company hasn't joined MoodFlo yet
        </Text>
      )}
      <View style={{flex: 1, alignItems: 'center', marginTop: dynamicSize(40)}}>
        <Text style={{fontWeight: '500', fontSize: dynamicSize(22)}}>
          Work email
        </Text>
        <Text
          numberOfLines={3}
          style={{
            fontWeight: '300',
            // letterSpacing: 1,
            fontSize: dynamicSize(14),
            marginTop: dynamicSize(12),
            // marginLeft: 62,
            // marginRight: 62,
            lineHeight: dynamicSize(25),
            textAlign: 'center',
            width: dynamicSize(250),
          }}>
          This is just to make sure we connect you with the right company
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            paddingHorizontal: 8,
            borderRadius: 10,
            paddingLeft: 15,
            marginTop: dynamicSize(35),
          }}>
          <Image
            style={{height: 20, width: 20}}
            source={Constants.Images.mail}
          />
          <TextInput
            keyboardType={'email-address'}
            returnKeyType={'done'}
            autoCorrect={false}
            autoCapitalize={'none'}
            autoCompleteType={false}
            placeholder={'example@work-mail.com'}
            placeholderTextColor={'#8A8BAB'}
            onSubmitEditing={() => submit()}
            style={{
              height: dynamicSize(50),
              width: dynamicSize(250),
              backgroundColor: 'white',
              // color: 'blue',
              // borderColor: 'transparent',
              // fontWeight: '700',

              // borderWidth: 1,
              borderRadius: 10,
              paddingLeft: 15,
            }}
            onChangeText={(text) => {
              onChangeText(text), validate(text);
            }}
            value={value}
          />
        </View>
        <Text
          numberOfLines={3}
          style={{
            fontWeight: '300',
            // letterSpacing: 1,
            fontSize: dynamicSize(14),
            marginTop: dynamicSize(12),
            // marginLeft: 62,
            // marginRight: 62,
            lineHeight: dynamicSize(25),
            textAlign: 'center',
            width: dynamicSize(250),
          }}>
          NB: Your email will never be shared with your company, we pinky
          promise! You are completely anonymous
        </Text>
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
            That doesn’t look like an email address.
          </Text>
        )}
        <TouchableOpacity
          style={{marginTop: dynamicSize(46)}}
          onPress={
            email
              ? () => onLink()
              : () => {
                  setShowWarning(true);
                }
          }>
          <View
            style={{
              height: 56,
              width: dynamicSize(240),
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
