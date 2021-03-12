import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AnonymousHeader from '../../Components/AnonymousHeader/AnonymousHeader';
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';
import Constants from '../../Constants';

const Linktocompany = ({navigation}) => {
  const [Linked, setLinked] = useState('Link');
  const [selectedLanguage, setSelectedLanguage] = useState();
  const onLink = async (type) => {
    console.log('run');
    await navigation.navigate('EmailConfirmation');
    setLinked(type);
  };
  const onDone = (type) => {
    console.log('run');
    setLinked(type);
  };

  const onUnlink = (type) => {
    console.log('run');
    setLinked(type);
  };
  return (
    <View style={{flex: 1}}>
      <AnonymousHeader backGround />
      {Linked == 'Link' && (
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
      {Linked == 'Complete' && (
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
              selectedValue={selectedLanguage}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedLanguage(itemValue)
              }>
              <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="js" />
              <Picker.Item label="Raunak" value="Raunak" />
              <Picker.Item label="Puneeet" value="Puneeet" />
              <Picker.Item label="ria" value="ria" />
              <Picker.Item label="madhu" value="madhu" />
              <Picker.Item label="zain" value="zain" />
              <Picker.Item label="Dharma" value="Dharma" />
            </Picker>
          </View>
          {console.log('selectedLanguage', selectedLanguage)}
          <TouchableOpacity
            disabled={selectedLanguage ? false : true}
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
      {Linked == 'Done' && (
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
            Accounting
          </Text>
          <TouchableOpacity
            disabled={selectedLanguage ? false : true}
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
