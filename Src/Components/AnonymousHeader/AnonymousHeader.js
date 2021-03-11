import React, {useState} from 'react';
import {View, Text, Image} from 'react-native';
import Constants from '../../Constants';
import ToggleSwitch from 'toggle-switch-react-native';

const AnonymousHeader = ({backGround}) => {
  const [Anonymous, setAnonymous] = useState(false);
  return backGround ? (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
      }}>
      <View
        style={{
          height: 80,
          width: '90%',
          borderRadius: 20,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            marginHorizontal: 16,
          }}>
          <View
            style={{
              height: 40,
              width: 40,
              backgroundColor: '#4C5980',
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              height={120}
              width={120}
              source={Constants.Images.Anonymous}
              // source={Constants.Images.Anonymous}
            />
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 16, fontWeight: '500', marginBottom: 5}}>
            Anonymous
          </Text>
          <Text style={{fontSize: 13, fontWeight: '400', color: 'grey'}}>
            Your data is private
          </Text>
        </View>
        <View style={{marginHorizontal: 16}}>
          <ToggleSwitch
            isOn={Anonymous}
            onColor="#7FE3F0"
            labelStyle={{color: 'black', fontWeight: '900'}}
            size="large"
            onToggle={(isOn) => {
              console.log('changed to : ', isOn), setAnonymous(isOn);
            }}
          />
        </View>
      </View>
    </View>
  ) : (
    <View
      style={{
        height: 80,
        width: '90%',
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
      <View
        style={{
          marginHorizontal: 16,
        }}>
        <View
          style={{
            height: 40,
            width: 40,
            backgroundColor: '#4C5980',
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            height={120}
            width={120}
            source={Constants.Images.Anonymous}
            // source={Constants.Images.Anonymous}
          />
        </View>
      </View>
      <View style={{flex: 1}}>
        <Text style={{fontSize: 16, fontWeight: '500', marginBottom: 5}}>
          Anonymous
        </Text>
        <Text style={{fontSize: 13, fontWeight: '400', color: 'grey'}}>
          Your data is private
        </Text>
      </View>
      <View style={{marginHorizontal: 16}}>
        <ToggleSwitch
          isOn={Anonymous}
          onColor="#7FE3F0"
          labelStyle={{color: 'black', fontWeight: '900'}}
          size="large"
          onToggle={(isOn) => {
            console.log('changed to : ', isOn), setAnonymous(isOn);
          }}
        />
      </View>
    </View>
  );
};

export default AnonymousHeader;
