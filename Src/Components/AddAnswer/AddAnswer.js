import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import Constants from '../../Constants';
import { RubikMedium } from '../../Constants/fonts/Fonts';
import {dynamicSize} from '../../Constants/sizeChoose';
import AddButton from '../buttons/AddButton';
import ProfileGenderModal from '../Modals/ProfileGender/ProfileGenderModal';

const AddAnswer = ({
  label,
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
  const [edit, setedit] = useState(false);

  const onChangeModalValue = useCallback(
    (value) => {
      setedit(!edit);
      onChangeText?.(value);
    },
    [edit, onChangeText],
  );

  return (
    <View style={styles.flatlistViewStyle}>
      <View>
        <Text style={styles.nameTextStyle}>{label}</Text>
        {!edit ? (
          <Text style={styles.anonymousTextStyle}>
            {!value ? 'Anonymous' : value}
          </Text>
        ) : popUp ? (
          <TouchableOpacity
            onPress={() => {
              setOpenActionSheet(true);
            }}>
            <Text style={styles.anonymousTextStyle}>
              {!value ? 'Anonymous' : value}
            </Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            autoFocus={true}
            keyboardType={'email-address'}
            returnKeyType={'done'}
            autoCorrect={false}
            onBlur={() => {
              setedit(!edit);
              ProfileApiCallHere({_name: value});
            }}
            autoCapitalize={'words'}
            autoCompleteType={'off'}
            placeholder={'Anonymous'}
            placeholderTextColor={Constants.Colors.greyColorCode}
            style={[
              {
                backgroundColor: 'white',
                borderBottomWidth: 1,
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

      {!edit && (
        <TouchableOpacity
          onPress={() => {
            popUp && setOpenActionSheet(true);
            setedit(!edit);
          }}>
          <AddButton label={checkedit ? 'Edit' : 'Add'} />
        </TouchableOpacity>
      )}
      {popUp && (
        <ProfileGenderModal
          datePicker={datePicker}
          data={data}
          modalVisible={openActionSheet}
          onChangeText={onChangeModalValue}
          value={value}
          dismissModalHandler={() => {
            setedit(!edit);
            setOpenActionSheet(false);
          }}
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
  nameTextStyle: {
    color: Constants.Colors.greyColorCode,
    fontSize: dynamicSize(14),
    fontWeight: '400',
  },
  anonymousTextStyle: {
    color: Constants.Colors.blackColorCode,
    fontSize: dynamicSize(16),
    fontFamily: RubikMedium,
    marginTop: dynamicSize(8),
  },
  flatlistViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: dynamicSize(32),
  },
});

export default AddAnswer;
