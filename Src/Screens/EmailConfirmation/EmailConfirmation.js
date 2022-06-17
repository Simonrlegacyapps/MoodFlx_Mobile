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
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import PostRequestApi from '../../apirequest/PostRequestApi';
import AnonymousHeader from '../../Components/AnonymousHeader/AnonymousHeader';
import Constants from '../../Constants';
import {dynamicSize, getFontSize, horizontalScale} from '../../Constants/sizeChoose';
import CustomModal from '../../Components/Modals/CustomModal/CustomModal';
import { getMyDeviceId } from '../../services/commonService';
import Colors from '../../Constants/Colors/Colors';
import { RubikLight, RubikMedium, RubikRegular } from '../../Constants/fonts/Fonts';

const {width: width} = Dimensions.get('window');

const EmailConfirmation = ({navigation}) => {
  const [value, onChangeText] = React.useState('');
  const [Loading, setLoading] = useState(false);
  const [email, setemail] = useState(null);
  const [ShowWarning, setShowWarning] = useState(false);
  const [APIfail, setAPIfail] = useState(false);
  const [CompanyFail, setCompanyFail] = useState(false);
  const [showLinkingComingSoonModal, setShowLinkingComingSoonModal] = useState(false);

  const onLink = () => {
    Keyboard.dismiss;
    const deviceId = getMyDeviceId();
    const params = {
      email: value,
      device_id: deviceId,
    };
    setLoading(true);
    setAPIfail(false);
    console.log(`params of email confirmation`, params);
    PostRequestApi('linkToCompany', params)
      .then((resp) => {
        if (resp.status == 200 && resp.data.success == true) {
          setLoading(false);
          console.log('otp on email confirmation', resp.data);
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

  const openCloseLinkingComingSoonModal = (flag) => () => {
    setShowLinkingComingSoonModal(flag);
  };

  return (
    <View style={{flex: 1}}>
      <AnonymousHeader backGround />
      {APIfail && (
        <Text
          style={{
            fontWeight: '300',
            fontFamily: RubikLight,
            letterSpacing: 0.2,
            fontSize: getFontSize(12),
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
            fontFamily: RubikLight,
            letterSpacing: 0.2,
            fontSize: getFontSize(13),
            marginTop: 12,
            marginLeft: 62,
            marginRight: 62,
            textAlign: 'center',
            color: 'red',
          }}>
          Sorry, your company hasn't joined moodflx yet
        </Text>
      )}
      <View style={{flex: 1, alignItems: 'center', marginTop: dynamicSize(40)}}>
        <Text style={{fontWeight: '500', fontFamily: RubikRegular, color: Colors.blackColorCode, fontSize: getFontSize(22)}}>
          Work email
        </Text>
        <Text
          numberOfLines={3}
          style={{
            fontWeight: '300',
            // letterSpacing: 1,
            fontFamily: RubikLight,
            fontSize: getFontSize(14),
            marginTop: dynamicSize(12),
            color: Colors.greyTwo,
            lineHeight: dynamicSize(25),
            textAlign: 'center',
            width: '70%',
          }}>
          This is just to make sure we connect you with the right company
        </Text>
        <TouchableWithoutFeedback
          pointerEvents="auto"
          onPress={openCloseLinkingComingSoonModal(true)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              paddingHorizontal: 8,
              borderRadius: 10,
              paddingLeft: 15,
              marginVertical: horizontalScale(28),
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.05,
              shadowRadius: 2.22,
              elevation: 3,
            }}>
            <Image
              style={{ height: 20, width: 20 }}
              source={Constants.Images.mail}
            />
            <TextInput
              pointerEvents='none'
              keyboardType={'email-address'}
              returnKeyType={'done'}
              autoCorrect={false}
              autoCapitalize={'none'}
              autoCompleteType={'off'}
              editable={false}
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
        </TouchableWithoutFeedback>
        <Text
          numberOfLines={3}
          style={{
            fontWeight: '300',
            fontFamily: RubikLight,
            color: Colors.greyTwo,
            fontSize: getFontSize(14),
            lineHeight: dynamicSize(25),
            textAlign: 'center',
            width: '70%',
          }}>
          NB: Your email will never be shared with your company, we pinky
          promise! You are completely anonymous
        </Text>
        {ShowWarning && (
          <Text
            style={{
              fontWeight: '300',
              letterSpacing: 0.2,
              fontSize: getFontSize(12),
              marginTop: 12,
              marginLeft: 62,
              marginRight: 62,
              textAlign: 'center',
              width: '60%',
              color: 'red',
            }}>
            That doesn't look like an email address.
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
              backgroundColor: Colors.blueTextColor,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontWeight: '500', fontFamily: RubikMedium, fontSize: getFontSize(16), color: '#FFFFFF'}}>
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
            backgroundColor: 'rgba(0,0,0,0.2)',
            // opacity: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color='#9889F9' size="large" />
        </View>
      )}
      <CustomModal
        modalVisible={!Loading && showLinkingComingSoonModal}
        dismissModalHandler={openCloseLinkingComingSoonModal(false)}
        modalText="Email linking coming soon! In the meantime, click on the link sent by your managers to join the team"
        onClickButtonOne={openCloseLinkingComingSoonModal(false)}
        buttonOneText="On it!"
        buttonOneStyle={styles.modalButtonOneStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalButtonOneStyle: {
    flex: 0.8,
  },
});

export default EmailConfirmation;
