import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AnonymousHeader from '../../Components/AnonymousHeader/AnonymousHeader';
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';
import Constants from '../../Constants';
import {useDispatch, useSelector} from 'react-redux';
import {Division, getDivisions, OTP_Verify} from '../../redux/actions/actions';
import GetRequestApi from '../../apirequest/GetRequestApi';

const Linktocompany = ({navigation}) => {
  const [Linked, setLinked] = useState('Link');
  const [selectedDivision, setSelectedDivision] = useState('Raunak');
  const [Divisions, setDivisions] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    fetch('http://admin.moodflo.com/api/getDivision')
      .then((data) => data.json())
      .then(async (res) => {
        await dispatch(getDivisions(res.data));
        setDivisions(res.data);
        console.log('response of division', res.data);
      });
  }, []);

  const {OTPVerified, setDivision, getDivision} = useSelector(
    (state) => state.First,
  );

  const onLink = async (type) => {
    console.log('run');
    await navigation.navigate('EmailConfirmation');
    setLinked(type);
  };

  const onDone = (type) => {
    console.log('run');
    dispatch(Division(selectedDivision));
    // setLinked(type);
  };

  const onUnlink = (type) => {
    console.log('run');
    // setLinked(type);
    dispatch(OTP_Verify(false));
    dispatch(Division(null));
  };

  return (
    <View style={{flex: 1}}>
      {console.log('REDUX DATA ==============>', getDivision)}
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
      )}
      {OTPVerified.success && setDivision === null && (
        <View style={{flex: 1, alignItems: 'center', marginTop: 40}}>
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
              selectedValue={selectedDivision}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedDivision(itemValue);
              }}>
              {Divisions &&
                Divisions.length > 0 &&
                Divisions.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.name}
                      value={item.name}
                      key={index}
                    />
                  );
                })}
              {/*               
              <Picker.Item label="JavaScript" value="js" />
              <Picker.Item label="Raunak" value="Raunak" />
              <Picker.Item label="Puneeet" value="Puneeet" />
              <Picker.Item label="ria" value="ria" />
              <Picker.Item label="madhu" value="madhu" />
              <Picker.Item label="zain" value="zain" />
              <Picker.Item label="Dharma" value="Dharma" /> */}
            </Picker>
          </View>
          {console.log('selectedLanguage', selectedDivision)}
          <TouchableOpacity
            disabled={selectedDivision ? false : true}
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
            {setDivision}
          </Text>
          <TouchableOpacity
            // disabled={selectedLanguage ? false : true}
            onPress={() => onUnlink('Link')}>
            <View
              style={{
                marginTop: 20,
                height: 56,
                width: 250,
                backgroundColor: '#7265E3',
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Image
                style={{marginHorizontal: 10}}
                source={Constants.Images.Unlock}
              />
              <Text style={{fontWeight: '500', fontSize: 16, color: '#FFFFFF'}}>
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
