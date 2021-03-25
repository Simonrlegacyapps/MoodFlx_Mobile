import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import AnonymousHeader from '../../Components/AnonymousHeader/AnonymousHeader';
import Constants from '../../Constants';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import PostRequestApi from '../../apirequest/PostRequestApi';
import {useDispatch} from 'react-redux';
import {OTP_Verify, UserEmail} from '../../redux/actions/actions';
import {useRoute} from '@react-navigation/native';
import {dynamicSize} from '../../Constants/sizeChoose';
import AsyncStorage from '@react-native-community/async-storage';

const VerifyEmail = ({navigation}) => {
  const [value, onChangeText] = React.useState('');
  const [Code, setCode] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [ShowWarning, setShowWarning] = useState(false);

  const dispatch = useDispatch();
  const route = useRoute();

  const {code, mail, deviceID} = route.params;
  // console.log('code ye hai ', code);
  const onLink = () => {
    const params = {
      email: mail,
      otp: Code,
      device_id: deviceID,
    };
    setLoading(true);
    {
      Code == code
        ? PostRequestApi('verifyOTP', params)
            .then(async (resp) => {
              if (resp.status == 200) {
                setLoading(false);
                console.log(
                  ' ✅ ✅ ✅ ✅ Sucess for verify✅ ✅ ✅ ✅',
                  resp.data,
                );
                dispatch(OTP_Verify(resp.data));
                navigation.navigate('Linktocompany', {email: mail});
                await AsyncStorage.setItem('Email', JSON.stringify(mail));
                dispatch(UserEmail(mail));
              } else {
                console.log(`Api Failed`, params);
              }
            })
            .catch((err) =>
              console.log(
                `❌ ❌ ❌ ❌err for verify Email❌ ❌ ❌ ❌`,
                err,
                params,
              ),
            )
        : (setShowWarning(true), setLoading(false));
    }
  };

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
          Temporary for now, Code : {code}
        </Text>
        <OTPInputView
          style={{width: '67%', height: 100}}
          pinCount={4}
          // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
          // onCodeChanged = {code => { this.setState({code})}}
          autoFocusOnLoad
          codeInputFieldStyle={{
            backgroundColor: 'white',
            borderRadius: dynamicSize(12),
            color: 'black',
            height: dynamicSize(56),
            width: dynamicSize(56),
            fontSize: dynamicSize(18),
          }}
          codeInputHighlightStyle={{color: 'black'}}
          // onCodeFilled={(code) => {
          //   setCode(code);
          //   console.log(`Code is ${code}, you are good to go!`);
          // }}
          onCodeChanged={(code) => {
            setCode(code);
            console.log('code changed', code);
          }}
        />
        {/* <View
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
        </View> */}
        {console.log('Code string', Code.toString().length)}
        <TouchableOpacity
          disabled={
            Code != null && Code?.toString().length === 4 ? false : true
          }
          onPress={Code ? () => onLink() : () => console.log('no OTP entered')}>
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
              Continue
            </Text>
          </View>
        </TouchableOpacity>
        {ShowWarning && (
          <Text
            numberOfLines={2}
            style={{
              fontWeight: '400',
              letterSpacing: 0.6,
              fontSize: 12,
              marginTop: 12,
              marginLeft: 62,
              marginRight: 62,
              textAlign: 'center',
              width: '70%',
              lineHeight: 25,
              color: 'red',
            }}>
            NOTE: You have entered wrong code
          </Text>
        )}
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

export default VerifyEmail;
