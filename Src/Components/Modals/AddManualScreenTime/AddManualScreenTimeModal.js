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
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import Constants from '../../../Constants';
import Colors from '../../../Constants/Colors/Colors';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import {dynamicSize, getFontSize, horizontalScale} from '../../../Constants/sizeChoose';
import getStore from '../../../redux';

type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const {width} = Dimensions.get('window');
const AddManualScreenTimeModal = ({
  modalVisible,
  dismissModalHandler,
  verifyDone,
  onChangeText,
  value,
  isLoading,
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
      onSwipeComplete={isLoading ? undefined : dismissModalHandler}
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
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : null} style={styles.container}>
        <TouchableOpacity
          onPress={isLoading ? undefined : dismissModalHandler}
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
          <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress={dismissModalHandler}>
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
              fontWeight: Platform.OS === 'android' ? '700' : '500',
              fontSize: dynamicSize(26),
              textAlign: 'center',
              marginTop: 30,
              fontFamily: RubikRegular,
            }}>
            Today's ScreenTime
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
              keyboardType="numeric"
              returnKeyType={'done'}
              autoCorrect={false}
              autoCompleteType={'off'}
              placeholder={'Input ScreenTime'}
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
              onChangeText={onChangeText}
              value={value}
            />
          </View>
          <TouchableOpacity
            disabled={!value || isLoading}
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
                marginBottom: 50,
                flexDirection: 'row',
              }}>
              <Text style={{fontWeight: '500', fontSize: 14, color: '#FFFFFF'}}>
                Submit
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

AddManualScreenTimeModal.defaultProps = {
  buttonText: 'Save',
  title: 'Your name',
  description: "If you'd like to share your mood as yourself, then add your name",
};

export default AddManualScreenTimeModal;
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
  }
});
