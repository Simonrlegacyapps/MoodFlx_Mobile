import React, {Component, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import Constants from '../../../Constants';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import {dynamicSize} from '../../../Constants/sizeChoose';

type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const {width} = Dimensions.get('window');
const AddNameModal = ({
  modalVisible,
  dismissModalHandler,
  selectedValue,
  verifyDone,
  image,
  dataType,
  onChangeText,
  value,
}: props) => {
  const [color, setcolor] = useState('black');
  // const [value, onChangeText] = React.useState('');
  //   console.log(
  //     `modalView, dismissModalHandler, selectedValue`,
  //     modalVisible,
  //     dismissModalHandler,
  //     selectedValue,
  //   );
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
            // alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.2,
            position: 'absolute',
          }}></TouchableOpacity>
        <View style={styles.upperContainer}>
          <TouchableOpacity onPress={dismissModalHandler}>
            <Image
              source={Constants.Images.PlusBlack}
              style={{
                height: dynamicSize(30),
                width: dynamicSize(30),
                marginTop: 15,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontWeight: '500',
              fontSize: dynamicSize(26),
              textAlign: 'center',
              marginTop: 50,
              fontFamily: RubikRegular,
            }}>
            Your name
          </Text>
          <Text
            numberOfLines={3}
            style={{
              fontWeight: '300',
              letterSpacing: 1,
              fontSize: dynamicSize(14),
              marginTop: 12,
              marginLeft: 62,
              marginRight: 62,
              textAlign: 'center',
              width: '60%',
              lineHeight: dynamicSize(26),
            }}>
            If you’d like to share your mood as yourself, then add your name
          </Text>
          <View
            style={{
              width: '80%',
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              //   paddingHorizontal: 8,
              borderRadius: 17,
              paddingLeft: 15,
              marginTop: 40,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}>
            <TextInput
              keyboardType={'email-address'}
              returnKeyType={'done'}
              autoCorrect={false}
              autoCapitalize={'words'}
              autoCompleteType={'off'}
              placeholder={'Eg. John Doe'}
              placeholderTextColor={'#8A8BAB'}
              style={{
                fontFamily: RubikRegular,
                height: dynamicSize(50),
                width: dynamicSize(220),
                backgroundColor: 'white',
                fontSize: 18,
                // color: 'blue',
                // borderColor: 'transparent',
                // fontWeight: '700',

                // borderWidth: 1,
                borderRadius: 10,
                paddingLeft: 15,
              }}
              onChangeText={(text) => {
                onChangeText(text);
              }}
              value={value}
            />
          </View>
          <TouchableOpacity
            disabled={!value}
            onPress={verifyDone}
            style={{alignItems: 'center'}}>
            <View
              style={{
                marginTop: 48,
                height: dynamicSize(53),
                width: dynamicSize(220),
                backgroundColor: '#7265E3',
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 40,
              }}>
              <Text style={{fontWeight: '500', fontSize: 16, color: '#FFFFFF'}}>
                Verify
              </Text>
            </View>
          </TouchableOpacity>
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
export default AddNameModal;
const styles = StyleSheet.create({
  container: {
    // height: 400,
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 30,
    // padding:20,
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  upperContainer: {
    backgroundColor: 'white',
    borderRadius: 30,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    // alignItems: 'center',
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
    height: 55,
    width: '100%',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderTopColor: '#ebebeb',
    // borderTopWidth: 1,
  },
  cancelButtonStyle: {
    height: 55,
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
  smallText: {
    fontFamily: RubikLight,
    paddingHorizontal: 12,
    paddingBottom: 10,
    //   paddingVertical:10
  },
  bigText: {
    fontFamily: RubikMedium,
    fontSize: width / 20,
    paddingHorizontal: 12,
    marginRight: 12,
    // width:'80%'
  },
});
