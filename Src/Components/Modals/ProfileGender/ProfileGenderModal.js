import React, {Component, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import {RubikRegular} from '../../../Constants/fonts/Fonts';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {dynamicSize} from '../../../Constants/sizeChoose';

type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const ProfileGenderModal = ({
  modalVisible,
  dismissModalHandler,
  selectedValue,
  onChangeText,
  value,
  data,
  datePicker,
  date,
  weatherDrop,
}: props) => {
  const [color, setcolor] = useState('black');
  return (
    <Modal
      style={styles.modalView}
      testID={'modal'}
      onSwipeComplete={dismissModalHandler}
      useNativeDriverForBackdrop
      swipeDirection={['down']}
      isVisible={modalVisible}
      onSwipeMove={() => {
        setcolor('transparent');
      }}
      customBackdrop={
        <TouchableWithoutFeedback onPress={dismissModalHandler}>
          <View style={{flex: 1, backgroundColor: '#000000'}} />
        </TouchableWithoutFeedback>
      }>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={dismissModalHandler}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: color,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.2,
            position: 'absolute',
          }}></TouchableOpacity>
        <View style={styles.upperContainer}>
          {/* <View style={styles.upperHandel} /> */}
          {datePicker ? (
            <View>
              <DatePicker
                date={value}
                onDateChange={(res) => {
                  console.log(`res`, res);
                  let okay = moment(res).format('DD MMMM YYYY');
                  onChangeText(res);
                  // date(okay);
                  console.log(`okay`, okay);
                }}
                mode={'date'}
              />
            </View>
          ) : (
            data &&
            data.length > 0 &&
            data.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    weatherDrop ? onChangeText(item.name) : onChangeText(item),
                      dismissModalHandler();
                  }}
                  activeOpacity={0.9}
                  style={[
                    styles.buttonsStyle,
                    {
                      borderBottomWidth: data.length != index + 1 && 1,
                      minWidth: dynamicSize(190),
                      borderBottomColor: '#D8D8D8',
                    },
                  ]}>
                  <Text style={styles.textStyles}>{item.name}</Text>
                  <View
                    style={{
                      width: '90%',
                      height: 1,
                      backgroundColor: 'black',
                    }}
                  />
                  {/* <Text>Hi</Text> */}
                </TouchableOpacity>
              );
            })
          )}
        </View>
        {/* <TouchableOpacity
          onPress={dismissModalHandler}
          activeOpacity={0.9}
          style={styles.cancelButtonStyle}>
          <Text style={styles.textStyles}>Cancel</Text>
        </TouchableOpacity> */}
      </View>
    </Modal>
  );
};

export default ProfileGenderModal;

const styles = StyleSheet.create({
  container: {
    // height: 400,
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,
    // padding:20,
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  upperContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 10,
    paddingVertical: 15,
    minWidth: '75%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upperHandel: {
    height: 7,
    width: 70,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#ebebeb',
    marginTop: 10,
  },
  upperDetailStyle: {
    height: 60,
    width: '95%',
    alignSelf: 'center',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsStyle: {
    height: 45,
    width: '100%',
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // borderTopColor: '#ebebeb',
    // borderTopWidth: 1,
  },
  cancelButtonStyle: {
    height: 45,
    width: '95%',
    backgroundColor: 'red',
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyles: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
    fontFamily: RubikRegular,
  },
});
