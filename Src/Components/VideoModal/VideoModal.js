import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityBase,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import {RubikRegular} from '../../Constants/fonts/Fonts';

function VideoModal({ModalVisible, dismissModalHandler}) {
  const [color, setcolor] = useState('black');
  return (
    <Modal
      onBackButtonPress={dismissModalHandler}
      style={styles.modalView}
      testID={'modal'}
      onSwipeComplete={dismissModalHandler}
      useNativeDriverForBackdrop
      swipeDirection={['down']}
      isVisible={ModalVisible}
      onSwipeMove={() => {
        setcolor('transparent');
      }}
      //   customBackdrop={
      //     <TouchableOpacity onPress={() => dismissModalHandler()}>
      //       <View style={{flex: 1, backgroundColor: 'blue'}} />
      //     </TouchableOpacity>
      //   }
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => dismissModalHandler()}
          style={{
            height: '25%',
            width: '100%',
            backgroundColor: color,
            opacity: 0.2,
          }}></TouchableOpacity>
        <View style={styles.upperContainer}>
          {/* <View style={styles.upperHandel} /> */}
          <TouchableOpacity
            onPress={() => dismissModalHandler()}
            activeOpacity={0.9}
            style={styles.buttonsStyle}>
            <Text style={styles.textStyles}>How it works</Text>
          </TouchableOpacity>
          <View
            style={{height: '100%', width: '100%', justifyContent: 'flex-end'}}>
            <Video
              paused={false}
              playInBackground
              repeat
              resizeMode={'contain'}
              //   controls
              source={require('../../../assets/Video/videoDemo.mp4')} // Callback when video cannot be loaded
              style={{height: '97%', width: '100%', position: 'absolute'}}
            />
          </View>
        </View>
        {/* <TouchableOpacity
        onPress={dismissModalHandler}
        activeOpacity={0.9}
        style={styles.cancelButtonStyle}>
        <Text style={styles.textStyles}>Cancel</Text>
      </TouchableOpacity> */}
      </SafeAreaView>
    </Modal>
  );
}

export default VideoModal;

const styles = StyleSheet.create({
  container: {
    // height: 400,
    flex: 1,
    // height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',

    // padding:20,
  },
  backgroundVideo: {
    height: '100%',
    width: '100%',
    // position: 'absolute',
    // // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  upperContainer: {
    backgroundColor: 'white',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    marginHorizontal: 10,
    minWidth: '100%',
    height: '75%',
    overflow: 'hidden',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  upperHandel: {
    height: 7,
    width: 70,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
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
    // height: 55,
    width: '100%',
    marginTop: 20,
    alignSelf: 'center',

    // justifyContent: 'center',
    // alignItems: 'center',
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
    fontSize: 22,
    color: '#000',
    fontWeight: '500',
    fontFamily: RubikRegular,
    textAlign: 'center',
    alignSelf: 'center',
  },
});
