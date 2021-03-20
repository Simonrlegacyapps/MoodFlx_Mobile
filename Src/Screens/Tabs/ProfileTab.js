import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ProfilePlaceholder from '../../../assets/profileicons/ProfilePlaceholder';
import AddButton from '../../Components/buttons/AddButton';
import Constants from '../../Constants';
import {dynamicSize} from '../../Constants/sizeChoose';
import PrivacyIcon from '../../../assets/profileicons/PrivacyIcon';
import PickImageIcon from '../../../assets/profileicons/PickImageIcon';
import FaqIcon from '../../../assets/profileicons/FaqIcon';
import TermsIcon from '../../../assets/profileicons/TermsIcon';
import ImagePicker from 'react-native-image-crop-picker';

const listData = [
  {name: 'Name', value: 'Annonymous'},
  {name: 'Gender', value: 'Annonymous'},
  {name: 'Birthday', value: 'Annonymous'},
  {name: 'Pronoun', value: 'Annonymous'},
];

const bottomList = [
  {name: 'FAQ', icon: <FaqIcon />},
  {name: 'Terms & Conditions', icon: <TermsIcon />},
  {name: 'Privacy Policy', icon: <PrivacyIcon />},
];

const ProfileTab = () => {
  const renderList = ({item}) => {
    return (
      <View style={styles.flatlistViewStyle}>
        <View>
          <Text style={styles.nameTextStyle}>{item.name}</Text>
          <Text style={styles.anonymousTextStyle}>{item.value}</Text>
        </View>
        <TouchableOpacity>
          <AddButton />
        </TouchableOpacity>
      </View>
    );
  };

  const renderBottomList = ({item}) => {
    return (
      <TouchableOpacity>
        <View style={styles.bottomFlatlistContainer}>
          <View style={{marginTop: dynamicSize(5)}}>{item.icon}</View>
          <Text
            style={[styles.anonymousTextStyle, {marginLeft: dynamicSize(16)}]}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const updateProfileImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      // includeBase64: true,
    }).then((i) => {
      let source = {
        uri: i.path,
        type: i.mime,
        name: Platform.OS === 'android' ? i.path : i.path,
      };
      UploadImageToServer(source);
    });
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: Constants.Colors.WhiteColor}}>
      <View style={styles.container}>
        <View style={styles.profileImageStyle}>
          <View style={styles.imageViewStyle}>
            <ProfilePlaceholder
              width={dynamicSize(176)}
              height={dynamicSize(176)}
            />
            <View style={styles.pickupIconStyle}>
              <TouchableOpacity onPress={() => updateProfileImage()}>
                <PickImageIcon />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerContainerStyle}>
            <View
              style={[
                styles.borderStyle,
                {marginRight: dynamicSize(17)},
              ]}></View>
            <Text>PERSONAL DETAILS</Text>
            <View
              style={[
                styles.borderStyle,
                {marginLeft: dynamicSize(11)},
              ]}></View>
          </View>
        </View>
        <View style={styles.flatlistContainer}>
          <FlatList data={listData} renderItem={renderList} />
        </View>
        <View style={{flex: 1}}>
          <View style={styles.headerContainerStyle}>
            <View
              style={[
                styles.borderStyle,
                {marginRight: dynamicSize(17), width: dynamicSize(134)},
              ]}></View>
            <Text>MORE</Text>
            <View
              style={[
                styles.borderStyle,
                {marginLeft: dynamicSize(11), width: dynamicSize(134)},
              ]}></View>
          </View>
        </View>
        <View
          style={[styles.flatlistContainer, {marginBottom: dynamicSize(56)}]}>
          <FlatList data={bottomList} renderItem={renderBottomList} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileImageStyle: {
    marginTop: dynamicSize(46),
    alignSelf: 'center',
  },
  borderStyle: {
    height: 1,
    width: 77,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
  },
  imageViewStyle: {
    backgroundColor: '#F4F6FA',
    width: dynamicSize(176),
    height: dynamicSize(176),
    borderRadius: dynamicSize(176),
    alignSelf: 'center',
  },
  nameTextStyle: {
    color: Constants.Colors.greyColorCode,
    fontSize: dynamicSize(14),
    fontWeight: '400',
  },
  anonymousTextStyle: {
    color: Constants.Colors.blackColorCode,
    fontSize: dynamicSize(16),
    fontWeight: '500',
    marginTop: dynamicSize(8),
  },
  flatlistViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: dynamicSize(32),
  },
  flatlistContainer: {
    flex: 1,
    marginTop: dynamicSize(16),
    marginLeft: dynamicSize(20),
    marginRight: dynamicSize(20),
  },
  headerContainerStyle: {
    marginTop: dynamicSize(40),
    alignSelf: 'center',
    flexDirection: 'row',
  },
  pickupIconStyle: {
    position: 'absolute',
    top: dynamicSize(116),
    right: dynamicSize(0),
  },
  bottomFlatlistContainer: {
    flexDirection: 'row',
    marginTop: dynamicSize(10),
    marginBottom: dynamicSize(20),
  },
});

export default ProfileTab;
