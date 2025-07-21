import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import { RubikMedium, RubikRegular } from '../../../Constants/fonts/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  dynamicSize,
  getFontSize,
  horizontalScale,
} from '../../../Constants/sizeChoose';
import { getIsDevServer, setIsDevServer } from '../../../Constants/constants';
import Colors from '../../../Constants/Colors/Colors';
import { SetShowIsDevServerModal } from '../../../redux/actions/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { unlinkFromCompany } from '../../../apirequest/PostRequestApi';
import getStore from '../../../redux';
import RNRestart from 'react-native-restart';

function DevServerCheckBox({isSelected}) {
  return isSelected ? (
    <Icon
      name="checkbox-marked"
      size={horizontalScale(20)}
      style={styles.checkImage}
      color={Colors.GreenColor}
    />
  ) : (
    <Icon
      name="checkbox-blank-outline"
      size={horizontalScale(20)}
      style={styles.checkImage}
      color={Colors.GreenColor}
    />
  );
}

function SetIsDevServerFlagModal({isModalVisible, dispatch}) {
  const [isDev, setIsDev] = React.useState(getIsDevServer());

  React.useEffect(() => {
    console.log('isDev ---> ', isDev);
    console.log('getIsDevServer() ---> ', getIsDevServer());
    setIsDev(getIsDevServer());
  }, [isModalVisible]);

  const closeModal = () => {
    dispatch(SetShowIsDevServerModal(false));
  };

  const onSubmit = async () => {
    const userData = getStore?.()?.getState?.()?.First;
    const onFinish = async () => {
      try {
        await AsyncStorage.clear();
        console.log('AsyncStorage.clear() called successfully');
      } catch (e) {
        console.log('error in clearing all AsyncStorage data');
      }
      const timeoutId = setTimeout(async () => {
        try {
          await AsyncStorage.setItem('isDevServerFlag', String(isDev));
          console.log("AsyncStorage.setItem('isDevServerFlag', String(isDev)) called successfully");
        } catch (error) {
          console.log('error setting isDevServerFlag in AsyncStorage: ', error);
        }
        setIsDevServer(isDev);
        closeModal();
        RNRestart?.Restart?.();
        clearTimeout(timeoutId);
      }, 1000);
    };
    if (userData.UserEmail && userData.UserId) {
      const message = "from SetIsDevServerFlagModal,inside onSubmit() method ==>";
      unlinkFromCompany(message,
        {email: userData.UserEmail, user_id: userData.UserId},
        dispatch,
        onFinish,
      );
    } else {
      onFinish();
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={isModalVisible}
        visible={isModalVisible}
        onRequestClose={closeModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeModal}
          style={styles.backgroundButton}>
          <TouchableOpacity
            onPress={closeModal}
            style={styles.backgroundButtonTwo}
          />
          <View style={styles.modalBodyCard}>
            <Text style={styles.name}>Server Enviroment</Text>
            <View>
              <TouchableOpacity
                style={styles.rowItem}
                onPress={() => setIsDev(true)}>
                <DevServerCheckBox isSelected={isDev} />
                <Text style={styles.serverText}>Staging Server</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rowItem}
                onPress={() => setIsDev(false)}>
                <DevServerCheckBox isSelected={!isDev} />
                <Text style={styles.serverText}>Live Server</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default SetIsDevServerFlagModal;

const styles = StyleSheet.create({
  backgroundButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  backgroundButtonTwo: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.4,
  },
  modalBodyCard: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    minHeight: 100,
    maxHeight: dynamicSize(400),
    borderRadius: horizontalScale(15),
    paddingTop: horizontalScale(14),
    paddingBottom: horizontalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    textAlign: 'center',
    marginBottom: horizontalScale(10),
    fontSize: getFontSize(18),
    color: Colors.blackColorCode,
    fontFamily: RubikRegular,
  },
  selectContainer: {
    //
  },
  serverText: {
    fontSize: getFontSize(16),
    fontFamily: RubikRegular,
    color: Colors.blackColorCode,
  },
  rowItem: {
    flexDirection: 'row',
    marginTop: horizontalScale(15),
    alignItems: 'center',
    marginLeft: horizontalScale(20),
  },
  checkImage: {
    marginRight: horizontalScale(8),
  },
  submitButton: {
    width: '80%',
    marginTop: horizontalScale(35),
    padding: dynamicSize(10),
    backgroundColor: Colors.blueTextColor,
    borderRadius: horizontalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: horizontalScale(15),
  },
  submitText: {
    fontFamily: RubikMedium,
    fontSize: getFontSize(16),
    color: '#FFFFFF',
  },
});
