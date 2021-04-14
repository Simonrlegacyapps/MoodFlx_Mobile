import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import Constants from '../../Constants';
import {dynamicSize} from '../../Constants/sizeChoose';
import AddButton from '../buttons/AddButton';
import ProfileGenderModal from '../Modals/ProfileGender/ProfileGenderModal';

const AddAnswer = ({
  label,
  navigation,
  onChangeText,
  value,
  popUp,
  data,
  datePicker,
  date,
  ProfileApiCallHere,
  checkedit,
}) => {
  const [openActionSheet, setOpenActionSheet] = useState(false);
  //   const [value, onChangeText] = React.useState('');
  const [edit, setedit] = useState(false);
  // const [userData, setUserData] = useState(null);

  const apicall = () => {
    setedit(!edit);
    ProfileApiCallHere();
  };
  const UserData = useSelector((state) => state.First);
  return (
    <View style={styles.flatlistViewStyle}>
      <View>
        <Text style={styles.nameTextStyle}>{label}</Text>
        {!edit ? (
          <Text style={styles.anonymousTextStyle}>
            {!value ? 'Annonymous' : value}
          </Text>
        ) : popUp ? (
          <TouchableOpacity
            onPress={() => {
              setOpenActionSheet(true);
            }}>
            <Text style={styles.anonymousTextStyle}>
              {!value ? 'Annonymous' : value}
            </Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            autoFocus={true}
            keyboardType={'email-address'}
            returnKeyType={'done'}
            autoCorrect={false}
            autoCapitalize={'words'}
            autoCompleteType={'off'}
            placeholder={'Annonymous'}
            placeholderTextColor={'black'}
            style={[
              {
                // height: dynamicSize(50),
                // width: dynamicSize(250),
                backgroundColor: 'white',
                // borderRadius: 10,
                borderBottomWidth: 1,
                // paddingLeft: 15,
              },
              styles.anonymousTextStyle,
            ]}
            onChangeText={(text) => {
              onChangeText(text);
            }}
            value={value}
          />
        )}
      </View>
      {!edit ? (
        <TouchableOpacity
          onPress={() => {
            // UserData.UserEmail
            //   ?
            popUp && setOpenActionSheet(true);
            setedit(!edit);
            // : navigation.navigate('LinkCompanyStackNavigation'); //navigation.navigate('LinkCompanyStackNavigation');
          }}>
          <AddButton label={checkedit ? 'Edit' : 'Add'} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            // UserData.UserEmail
            //   ?
            apicall();
            // : navigation.navigate('LinkCompanyStackNavigation'); //navigation.navigate('LinkCompanyStackNavigation');
          }}>
          <AddButton label={'Done'} />
        </TouchableOpacity>
      )}
      {popUp && (
        <ProfileGenderModal
          datePicker={datePicker}
          data={data}
          modalVisible={openActionSheet}
          onChangeText={onChangeText}
          value={value}
          dismissModalHandler={() => setOpenActionSheet(false)}
          date={date}
        />
      )}
    </View>
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

export default AddAnswer;
