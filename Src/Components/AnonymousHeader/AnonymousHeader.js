import React, {useState} from 'react';
import {View, Text, Image} from 'react-native';
import Constants from '../../Constants';
import ToggleSwitch from 'toggle-switch-react-native';
import AnonymousIcon from '../../../assets/commonicons/AnonymousIcon';
import {RubikLight, RubikMedium} from '../../Constants/fonts/Fonts';
import {useDispatch, useSelector} from 'react-redux';
import {IsAnonymous} from '../../redux/actions/actions';
import AsyncStorage from '@react-native-community/async-storage';

const AnonymousHeader = ({backGround}) => {
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  const [Anonymous, setAnonymous] = useState(false);
  // console.log(`UserData.Anonymous`, UserData.Anonymous);
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
            <AnonymousIcon />
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 5,
              fontFamily: RubikMedium,
            }}>
            {UserData.Anonymous
              ? 'Anonymous'
              : UserData?.UserDetails?.full_name
              ? UserData?.UserDetails?.full_name
              : 'Anonymous'}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '400',
              color: 'grey',
              fontFamily: RubikLight,
            }}>
            Your data is private
          </Text>
        </View>
        <View style={{marginHorizontal: 16}}>
          <ToggleSwitch
            isOn={UserData.Anonymous}
            onColor="#7FE3F0"
            labelStyle={{color: 'black', fontWeight: '900'}}
            size="large"
            onToggle={async (isOn) => {
              console.log('changed to : ', isOn), setAnonymous(isOn);
              dispatch(IsAnonymous(isOn));
              await AsyncStorage.setItem('Anonymous', JSON.stringify(isOn));
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
          <AnonymousIcon />
        </View>
      </View>
      <View style={{flex: 1}}>
        <Text style={{fontSize: 16, fontWeight: '500', marginBottom: 5}}>
          {UserData.Anonymous
            ? 'Anonymous'
            : UserData?.UserDetails?.full_name
            ? UserData?.UserDetails?.full_name
            : 'Anonymous'}
        </Text>
        <Text style={{fontSize: 13, fontWeight: '400', color: 'grey'}}>
          Your data is private
        </Text>
      </View>
      <View style={{marginHorizontal: 16}}>
        <ToggleSwitch
          isOn={UserData.Anonymous}
          onColor="#7FE3F0"
          labelStyle={{color: 'black', fontWeight: '900'}}
          size="large"
          onToggle={async (isOn) => {
            console.log('changed to : ', isOn), setAnonymous(isOn);
            dispatch(IsAnonymous(isOn));
            await AsyncStorage.setItem('Anonymous', JSON.stringify(isOn));
          }}
        />
      </View>
    </View>
  );
};

export default AnonymousHeader;
