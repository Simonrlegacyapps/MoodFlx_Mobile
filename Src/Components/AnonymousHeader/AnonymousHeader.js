import React, {useState} from 'react';
import {View, Text, Image} from 'react-native';
import Constants from '../../Constants';
import ToggleSwitch from 'toggle-switch-react-native';
import AnonymousIcon from '../../../assets/commonicons/AnonymousIcon';
import {RubikLight, RubikMedium} from '../../Constants/fonts/Fonts';
import {useDispatch, useSelector} from 'react-redux';
import {IsAnonymous} from '../../redux/actions/actions';
import AsyncStorage from '@react-native-community/async-storage';
import {PHOTO_URL} from '../../Constants/constants';
import AddNameModal from '../Modals/AddNameModal/AddNameModal';

const AnonymousHeader = ({backGround}) => {
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  const [Anonymous, setAnonymous] = useState(false);
  const [ShowAddName, setShowAddName] = useState(false);
  const [name, setname] = useState('');
  console.log(`UserData.Anonymous`, UserData.Anonymous);

  const VerifyDone = async () => {
    await AsyncStorage.setItem('Anonymous', JSON.stringify(false));
    dispatch(IsAnonymous(false));
    setShowAddName(false);
  };

  const cancelled = async () => {
    await AsyncStorage.setItem('Anonymous', JSON.stringify(true));
    setShowAddName(false);
    dispatch(IsAnonymous(true));
  };

  console.log(`name`, UserData.Anonymous);

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
              overflow: 'hidden',
            }}>
            {UserData?.UserDetails?.profile_image && !UserData.Anonymous ? (
              <Image
                style={{height: '100%', width: '100%', resizeMode: 'cover'}}
                source={{
                  uri: `${PHOTO_URL}${UserData?.UserDetails?.profile_image}`,
                }}
              />
            ) : (
              <AnonymousIcon />
            )}
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
            {UserData.Anonymous
              ? 'Your data is private'
              : 'Saving this mood as you'}
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
              if (!isOn && !UserData?.UserDetails?.full_name) {
                setShowAddName(true);
              } else {
                dispatch(IsAnonymous(true));
                await AsyncStorage.setItem('Anonymous', JSON.stringify(true));
              }
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
            overflow: 'hidden',
          }}>
          {UserData?.UserDetails?.profile_image && !UserData.Anonymous ? (
            <Image
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}
              source={{
                uri: `${PHOTO_URL}${UserData?.UserDetails?.profile_image}`,
              }}
            />
          ) : (
            <AnonymousIcon />
          )}
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
          {UserData.Anonymous
            ? 'Your data is private'
            : 'Saving this mood as you'}
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
            if (!isOn && !UserData?.UserDetails?.full_name) {
              setShowAddName(true);
            } else {
              dispatch(IsAnonymous(true));
              await AsyncStorage.setItem('Anonymous', JSON.stringify(true));
            }
          }}
        />
      </View>
      <AddNameModal
        dataType={'weather'}
        modalVisible={ShowAddName}
        dismissModalHandler={() => cancelled()}
        verifyDone={() => VerifyDone()}
        value={name}
        onChangeText={setname}
      />
    </View>
  );
};

export default AnonymousHeader;
