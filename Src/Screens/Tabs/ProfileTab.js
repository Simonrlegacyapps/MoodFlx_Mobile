import React, {useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import ActionSheet from '../../Components/ImageSelection/ActionSheet';
import { useSelector } from 'react-redux';

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

const ProfileTab = ({navigation}) => {
  const [openActionSheet, setOpenActionSheet] = useState(false);
  const [value, onChangeText] = React.useState('');
  const [edit, setedit] = useState(false)
  // const [userData, setUserData] = useState(null);
  const UserData  = useSelector(state => state.First)

  const renderList = ({item}) => {
    return (
      <View style={styles.flatlistViewStyle}>
        <View>
          <Text style={styles.nameTextStyle}>{item.name}</Text>
          {edit ? <Text style={styles.anonymousTextStyle}>{item.value}</Text> :

          <TextInput
            keyboardType={'email-address'}
            returnKeyType={'done'}
            autoCorrect={false}
            autoCapitalize={false}
            autoCompleteType={false}
            placeholder={item.value}
            placeholderTextColor={'black'}
            style={[{
              // height: dynamicSize(50),
              // width: dynamicSize(250),
              backgroundColor: 'white',
              // borderRadius: 10,
              borderBottomWidth:1
              // paddingLeft: 15,
            }, styles.anonymousTextStyle]}
            onChangeText={(text) => {
              onChangeText(text)
            }}
            value={value}
          />}
        </View>
        <TouchableOpacity onPress={()=>{ UserData.UserEmail ? setedit(!edit): navigation.navigate("Linktocompany") }}>
          <AddButton />
        </TouchableOpacity>
      </View>
    );
  };

  const imagePostFunction = (imageData) => {
    const imageResponse = {
      ...imageData,
    };
    console.log(`imageResponse`, imageResponse);
    // let formData = new FormData();
    // formData.append('user_id', userData.id);
    // formData.append('catch_id', catch_id);
    // formData.append('comment', 'Image');
    // formData.append('image', {
    //   name:
    //     Platform.OS === 'android'
    //       ? imageResponse.uri
    //       : imageResponse.uri.replace('file://', ''),
    //   type: imageResponse.type,
    //   uri:
    //     Platform.OS === 'android'
    //       ? imageResponse.uri
    //       : imageResponse.uri.replace('file://', ''),
    // });
    // console.warn('this data', JSON.stringify(formData, undefined, 2));
    // fetch("https://api.reelcash.com/api/addCommentCatch", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "multipart/form-data",
    //   },
    //   body: formData,
    // })
    //   .then(processResponse)
    //   .then(async (res) => {
    //     const { statusCode, data } = res;
    //     console.log(statusCode);
    //     setCommentText('');
    //     apiCallingFunction();
    //     // setCommentText('');
    //     // console.log("add live well success", JSON.stringify(data, undefined, 2));
    //   })
    //   .catch((error) => {
    //     console.log("error come", error);
    //   });
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

  const imageSelectType = (select_type) => {
    if (select_type === 1) {
      openCameraFunction();
    } else if (select_type === 2) {
      openLibraryFunction();
    }
  };

  const openCameraFunction = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      // compressImageQuality:0.6
    }).then((i) => {
      console.log(`i`, i);
      let source = {
        uri: i.path,
        type: i.mime,
        name: Platform.OS === 'android' ? i.path : i.path,
      };
      imagePostFunction(source);
      setOpenActionSheet(false);
      // console.log(image);
    });
  };

  const openLibraryFunction = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      // compressImageQuality:0.6
    }).then((i) => {
      let source = {
        uri: i.path,
        type: i.mime,
        name: Platform.OS === 'android' ? i.path : i.path,
      };
      const images = [source];

      // imagePostFunction(source)
      setOpenActionSheet(false);
      console.log(`images`, images);
    });
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: Constants.Colors.WhiteColor}}>
      <View style={styles.container}>
        <View style={styles.profileImageStyle}>
          <View style={styles.imageViewStyle}>
            <ProfilePlaceholder
              width={dynamicSize(160)}
              height={dynamicSize(160)}
            />
            <View style={styles.pickupIconStyle}>
              <TouchableOpacity onPress={() => setOpenActionSheet(true)}>
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
      <ActionSheet
        modalVisible={openActionSheet}
        dismissModalHandler={() => setOpenActionSheet(false)}
        selectedValue={(i) => imageSelectType(i)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileImageStyle: {
    marginTop: dynamicSize(40),
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
    width: dynamicSize(160),
    height: dynamicSize(160),
    borderRadius: dynamicSize(160),
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
    marginTop: dynamicSize(10),
    marginLeft: dynamicSize(20),
    marginRight: dynamicSize(20),
  },
  headerContainerStyle: {
    marginTop: dynamicSize(30),
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
