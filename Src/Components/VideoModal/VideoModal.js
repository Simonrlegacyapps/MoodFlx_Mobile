import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import {RubikRegular} from '../../Constants/fonts/Fonts';
import {getFontSize, horizontalScale} from '../../Constants/sizeChoose';

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
          <TouchableOpacity
            onPress={() => dismissModalHandler()}
            activeOpacity={0.9}
            style={styles.buttonsStyle}>
            <Text style={styles.textStyles}>How it works</Text>
          </TouchableOpacity>
          <View style={styles.videoView}>
            <Video
              paused={false}
              playInBackground
              repeat
              resizeMode="stretch"
              //   controls
              source={require('../../../assets/Video/videoDemo.mp4')} // Callback when video cannot be loaded
              style={styles.video}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default VideoModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  upperContainer: {
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: horizontalScale(40),
    borderTopLeftRadius: horizontalScale(40),
    width: '100%',
    height: '75%',
    overflow: 'hidden',
  },
  buttonsStyle: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: horizontalScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyles: {
    fontSize: getFontSize(22),
    color: '#000',
    fontWeight: '500',
    fontFamily: RubikRegular,
    textAlign: 'center',
  },
  videoView: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  video: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});
