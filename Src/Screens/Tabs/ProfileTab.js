import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
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
import {useDispatch, useSelector} from 'react-redux';
import AddAnswer from '../../Components/AddAnswer/AddAnswer';
import DeviceInfo from 'react-native-device-info';
import {UserDetail} from '../../redux/actions/actions';

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
  // const [value, onChangeText] = React.useState('');
  const UserData = useSelector((state) => state.First);

  const [name, setname] = useState(
    UserData?.UserDetails?.full_name ? UserData?.UserDetails?.full_name : '',
  );
  const [gender, setgender] = useState('');
  const [Birthday, setBirthday] = useState('');
  const [Pronoun, setPronoun] = useState('');
  const [date, setdate] = useState('');
  const [edit, setedit] = useState(false);
  // const [userData, setUserData] = useState(null);

  const dispatch = useDispatch();

  const addAnswer = (item, index) => {
    setedit(!edit);
  };

  // const renderList = ({item, index}) => {
  //   return (
  //     <View style={styles.flatlistViewStyle}>
  //       <View>
  //         <Text style={styles.nameTextStyle}>{item.name}</Text>
  //         {!edit ? (
  //           <Text style={styles.anonymousTextStyle}>{item.value}</Text>
  //         ) : (
  //           <TextInput
  //             keyboardType={'email-address'}
  //             returnKeyType={'done'}
  //             autoCorrect={false}
  //             autoCapitalize={false}
  //             autoCompleteType={false}
  //             placeholder={item.value}
  //             placeholderTextColor={'black'}
  //             style={[
  //               {
  //                 // height: dynamicSize(50),
  //                 // width: dynamicSize(250),
  //                 backgroundColor: 'white',
  //                 // borderRadius: 10,
  //                 borderBottomWidth: 1,
  //                 // paddingLeft: 15,
  //               },
  //               styles.anonymousTextStyle,
  //             ]}
  //             onChangeText={(text) => {
  //               onChangeText(text);
  //             }}
  //             value={value}
  //           />
  //         )}
  //       </View>
  //       <TouchableOpacity
  //         onPress={() => {
  //           UserData.UserEmail
  //             ? addAnswer(item, index)
  //             : addAnswer(item, index); //navigation.navigate('LinkCompanyStackNavigation');
  //         }}>
  //         <AddButton />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  const getProfileUserData = () => {
    console.log(`called called called called called called`);
    const deviceId = DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      device_id: deviceId,
      email: UserData.UserEmail,
      user_id: UserData.UserId,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://admin.moodflo.com/api/getStaffUserData', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('UserDetail', result.userData);
        dispatch(UserDetail(result.userData));
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    getProfileUserData();
  }, []);

  const imagePostFunction = (imageData) => {
    const deviceId = DeviceInfo.getUniqueId();
    const imageResponse = {
      ...imageData,
    };
    console.log(`imageResponse`, imageResponse);
    let formData = new FormData();
    formData.append('user_id', UserData.UserId);
    formData.append('email', UserData.UserEmail);
    formData.append('device_id', deviceId);
    formData.append('image', {
      name:
        Platform.OS === 'android'
          ? imageResponse.uri
          : imageResponse.uri.replace('file://', ''),
      type: imageResponse.type,
      uri:
        Platform.OS === 'android'
          ? imageResponse.uri
          : imageResponse.uri.replace('file://', ''),
    });
    console.warn('this data', JSON.stringify(formData));
    fetch('https://admin.moodflo.com/api/updateStaffProfileImage', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(async (res) => {
        console.log(`res`, res);
        getProfileUserData();
        // setCommentText('');
        // console.log("add live well success", JSON.stringify(data, undefined, 2));
      })
      .catch((error) => {
        console.log('error come', error);
      });
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
      // console.log('source', source);
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

  const ProfileApiCallHere = () => {
    const deviceId = DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      device_id: deviceId,
      email: UserData.UserEmail,
      user_id: UserData.UserId,
      full_name: UserData?.UserDetails?.full_name
        ? UserData?.UserDetails?.full_name
        : name,
      pronouns: Pronoun,
      gender: gender == 'Male' ? 1 : gender == 'Female' ? 2 : 3,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    console.log(`raw`, raw);

    fetch('https://admin.moodflo.com/api/updateStaffProfile', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log('profile updated', result), getProfileUserData();
      })
      .catch((error) => console.log('error', error));
  };

  const genderData = [{label: 'Male'}, {label: 'Female'}, {label: 'trans'}];
  const PronounData = [{label: 'He/him'}, {label: 'She/her'}, {label: 'trans'}];

  return (
    <ScrollView style={{flex: 1, backgroundColor: Constants.Colors.WhiteColor}}>
      <View style={styles.container}>
        <View style={styles.profileImageStyle}>
          <View style={styles.imageViewStyle}>
            {UserData?.UserDetails?.profile_image ? (
              <Image
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'stretch',
                  borderRadius: dynamicSize(160),
                }}
                source={{
                  uri: `https://admin.moodflo.com/${UserData?.UserDetails?.profile_image}`,
                }}
              />
            ) : (
              <ProfilePlaceholder
                width={dynamicSize(160)}
                height={dynamicSize(160)}
              />
            )}
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
          {/* <FlatList data={listData} renderItem={renderList} /> */}

          <AddAnswer
            checkedit={UserData?.UserDetails?.full_name ? true : false}
            ProfileApiCallHere={ProfileApiCallHere}
            label={'Name'}
            navigation={navigation}
            value={
              UserData?.UserDetails?.full_name
                ? UserData?.UserDetails?.full_name
                : name
            }
            onChangeText={setname}
          />
          <AddAnswer
            checkedit={UserData?.UserDetails?.gender ? true : false}
            ProfileApiCallHere={ProfileApiCallHere}
            data={genderData}
            label={'Gender'}
            navigation={navigation}
            value={
              UserData?.UserDetails?.gender
                ? UserData?.UserDetails?.gender == 2
                  ? 'Female'
                  : UserData?.UserDetails?.gender == 1
                  ? 'Male'
                  : UserData?.UserDetails?.gender == 3
                  ? 'Trans'
                  : gender
                : gender
            }
            onChangeText={setgender}
            popUp
          />
          {/* <AddAnswer
            label={'Birthday'}
            value={Birthday}
            navigation={navigation}
            onChangeText={setBirthday}
            date={setdate}
            datePicker
            popUp
          /> */}
          <AddAnswer
            ProfileApiCallHere={ProfileApiCallHere}
            navigation={navigation}
            data={PronounData}
            label={'Pronoun'}
            value={Pronoun}
            gender={gender}
            onChangeText={setPronoun}
            popUp
          />
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
