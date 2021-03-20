import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AnonymousHeader from '../../Components/AnonymousHeader/AnonymousHeader';
import {Picker} from '@react-native-picker/picker';
import Constants from '../../Constants';
import {useDispatch, useSelector} from 'react-redux';
import {Division, getDivisions, OTP_Verify} from '../../redux/actions/actions';
import {dynamicSize} from '../../Constants/sizeChoose';
import UnlockIcon from '../../../assets/profileicons/UnlockIcon';
import {RubikBlack} from '../../Constants/fonts/Fonts';
import PostRequestApi from '../../apirequest/PostRequestApi';
import {useRoute} from '@react-navigation/native';

const Linktocompany = ({navigation}) => {
  const {OTPVerified, setDivision, getDivision} = useSelector(
    (state) => state.First,
  );

  const [Linked, setLinked] = useState('Link');
  const [selectedDivisionId, setSelectedDivisionId] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [Divisions, setDivisions] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [APIfail, setAPIfail] = useState(false);

  const dispatch = useDispatch();
  const route = useRoute();

  console.log('route', route);
  //

  useEffect(() => {
    fetch('http://admin.moodflo.com/api/getDivision')
      .then((data) => data.json())
      .then(async (res) => {
        await dispatch(getDivisions(res.data));
        setDivisions(res.data);
        console.log('response of division', res.data[0].id);
        setSelectedDivisionId(res.data[0].id);
      });
  }, []);

  const onLink = async (type) => {
    console.log('run');
    await navigation.navigate('EmailConfirmation');
    setLinked(type);
  };

  const onDone = (type) => {
    const {email} = route.params;
    const params = {
      division_id: selectedDivisionId,
      email: email,
    };
    console.log('run');
    setLoading(true);
    setAPIfail(false);
    // setLinked(type);
    PostRequestApi('updateStaffDivision', params)
      .then((resp) => {
        if (resp.status == 200) {
          setLoading(false);
          dispatch(Division(selectedDivisionId));
          console.log('set division status========>>>>>>>>', resp.data);
          setSelectedDivision(resp.data.divisionName);
          // navigation.navigate('VerifyEmail', {
          //   code: resp.data.otp,
          //   mail: value,
          //   deviceID: deviceId,
          // });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log('err', err), setLoading(false), setAPIfail(true);
      });
  };

  const onUnlink = (type) => {
    console.log('run');
    // setLinked(type);
    dispatch(OTP_Verify(false));
    dispatch(Division(null));
  };

  return (
    <View style={{flex: 1}}>
      {/* {console.log('REDUX DATA ==============>', getDivision[0].id)} */}
      <AnonymousHeader backGround />
      {!OTPVerified.success && (
        <View style={{flex: 1, alignItems: 'center', marginTop: 100}}>
          <Text style={{fontWeight: '500', fontSize: 26}}>Link a company</Text>
          <Text
            numberOfLines={4}
            style={{
              lineHeight: 28,
              fontWeight: '300',
              fontSize: 16,
              marginTop: 12,
              marginLeft: 62,
              marginRight: 62,
              textAlign: 'center',
              width: 270,
            }}>
            Your mood is anonymous, why not link it to your company and help
            them better understand the mood pulse of their staff
          </Text>
          <TouchableOpacity onPress={() => onLink('Complete')}>
            <View
              style={{
                marginTop: dynamicSize(48),
                height: dynamicSize(56),
                width: dynamicSize(250),
                backgroundColor: '#7265E3',
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 16,
                  color: '#FFFFFF',
                  fontFamily: RubikBlack,
                }}>
                Link Now
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {OTPVerified.success && setDivision === null && (
        <View style={{flex: 1, alignItems: 'center', marginTop: 40}}>
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
          <Text style={{fontWeight: '500', fontSize: 26}}>
            What division are you in?
          </Text>
          <Text
            numberOfLines={3}
            style={{
              lineHeight: 28,
              fontWeight: '300',
              fontSize: 16,
              marginTop: 12,
              marginLeft: 62,
              marginRight: 62,
              textAlign: 'center',
              width: 270,
            }}>
            This, and which region you are located, are the only things AIA will
            know about you
          </Text>
          <View style={{width: 200}}>
            <Picker
              style={{}}
              selectedValue={selectedDivisionId}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedDivisionId(itemValue);
                {
                  console.log(
                    'selectedLanguage',
                    selectedDivisionId,
                    itemIndex,
                  );
                }
              }}>
              {getDivision &&
                getDivision.length > 0 &&
                getDivision.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.name}
                      value={item.id}
                      key={index}
                    />
                  );
                })}
            </Picker>
          </View>
          {console.log('selectedLanguage', selectedDivisionId)}
          {console.log('selectedLanguage', selectedDivision)}
          <TouchableOpacity
            disabled={selectedDivisionId ? false : true}
            onPress={() => onDone('Done')}>
            <View
              style={{
                marginTop: 20,
                height: 56,
                width: 250,
                backgroundColor: '#7265E3',
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontWeight: '500', fontSize: 16, color: '#FFFFFF'}}>
                Done
              </Text>
            </View>
          </TouchableOpacity>
          <Text
            style={{
              lineHeight: 28,
              fontWeight: '300',
              fontSize: 14,
              marginTop: 12,
              marginLeft: 62,
              marginRight: 62,
              textAlign: 'center',
              width: 270,
            }}>
            E.g. Anonymous in Melbourne is Excited
          </Text>
        </View>
      )}
      {OTPVerified.success && setDivision !== null && (
        <View style={{flex: 1, alignItems: 'center', marginTop: 40}}>
          {/* <Text style={{fontWeight: '500', fontSize: 26}}>
            What division are you in?
          </Text> */}
          <Image source={Constants.Images.CompanyLogo} />
          <Text
            numberOfLines={2}
            style={{
              lineHeight: 28,
              fontWeight: '300',
              fontSize: 16,
              marginTop: 102,
              marginLeft: 62,
              marginRight: 62,
              textAlign: 'center',
              width: 270,
            }}>
            You are anonymously linked to your company under the division
          </Text>
          <Text
            style={{
              lineHeight: 28,
              fontWeight: '500',
              fontSize: 16,
              marginTop: 12,
              marginLeft: 62,
              marginRight: 62,
              textAlign: 'center',
              marginBottom: 42,
              width: 270,
            }}>
            {selectedDivision}
          </Text>
          <TouchableOpacity
            // disabled={selectedLanguage ? false : true}
            onPress={() => onUnlink('Link')}>
            <View
              style={{
                marginTop: 20,
                height: dynamicSize(56),
                width: dynamicSize(250),
                backgroundColor: '#7265E3',
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <UnlockIcon />
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 16,
                  color: '#FFFFFF',
                  marginLeft: dynamicSize(11),
                }}>
                Unlink
              </Text>
            </View>
          </TouchableOpacity>

          {/* <Text
            style={{
              lineHeight: 28,
              fontWeight: '300',
              fontSize: 14,
              marginTop: 12,
              marginLeft: 62,
              marginRight: 62,
              textAlign: 'center',
              width: 270,
            }}>
            E.g. Anonymous in Melbourne is Excited
          </Text> */}
        </View>
      )}
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

//

// <View style={styles.centeredView}>
{
  /* <Modal
animationType="slide"
transparent={true}
visible={modalVisible}
onRequestClose={() => {
  Alert.alert('Modal has been closed.');
  setModalVisible(!modalVisible);
}}>
<View
  style={{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  }}>
  <View
    style={{
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '80%',
      minHeight: 100,
      borderRadius: 15,
      paddingTop: 14,
      paddingBottom: 14,
    }}>
    {Divisions &&
      Divisions.length > 0 &&
      Divisions.map((item, index) => {
        return (
          <TouchableOpacity onPress={()=>{}} key={index}>
            <Text
              style={{
                textAlign: 'center',
                marginVertical: 10,
                fontSize: 18,
                fontFamily: RubikRegular,
              }}>
              Hello World!
            </Text>
            <View
              style={{
                alignSelf: 'center',
                width: '90%',
                borderBottomColor: '#ebebeb',
                borderBottomWidth: 1,
                height: 1,
              }}
            />
          </TouchableOpacity>
        );
      })}
  </View>
</View>
</Modal>
</View> */
}
