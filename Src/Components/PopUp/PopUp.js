import React, {Component, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import Constants from '../../Constants';
import {RubikLight, RubikMedium, RubikRegular, RubikSemiBold} from '../../Constants/fonts/Fonts';
type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const PopUp = ({
  modalVisible,
  dismissModalHandler,
  selectedValue,
}: props) => {
  const [color, setcolor] = useState('black');
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
          <Image source={Constants.Images.FitnessPopUp} style={{height:80, width:80, margin:15, resizeMode:'contain' }}/>
          <Text style={styles.smallText}> Let’s sync your fitness data</Text>
          <Text style={styles.bigText}>Remember that all 
your data is anonymous</Text>
<TouchableOpacity style={{alignSelf:'center'}} onPress={dismissModalHandler}
          
          >
          <View
            style={{
                marginTop: 24,
                height: 56,
                width: 250,
                backgroundColor: '#7265E3',
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Text style={{fontWeight: '500', fontSize: 16, color: '#FFFFFF'}}>
              Verify
            </Text>
          </View>
        </TouchableOpacity>
                <Text style={[styles.smallText, {fontSize:12, textAlign:'center', paddingVertical:10}]}> Terms & Conditions • Privacy Policy</Text>
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

export default PopUp;

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
    width: '75%',
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
  smallText:{
      fontFamily:RubikLight,
      paddingHorizontal:12,
      paddingBottom:10 
    //   paddingVertical:10
  },
  bigText:{
fontFamily:RubikMedium,
fontSize:21,
paddingHorizontal:12, 
marginRight:12
// width:'80%'
  }
});
