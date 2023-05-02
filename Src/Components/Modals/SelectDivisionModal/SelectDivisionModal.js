import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import {RubikRegular} from '../../../Constants/fonts/Fonts';
import {
  dynamicSize,
  getFontSize,
  horizontalScale,
} from '../../../Constants/sizeChoose';
import Colors from '../../../Constants/Colors/Colors';

function SelectDivisionModal({
  setModalVisible,
  isModalVisible,
  Divisions,
  setDivision,
}) {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={isModalVisible}
        visible={isModalVisible && Divisions?.length > 0}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          style={styles.backgroundButton}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.backgroundButtonTwo}
          />
          <View style={styles.modalBodyCard}>
            <ScrollView>
              {Divisions &&
                Divisions.length > 0 &&
                Divisions.map((item, index) => {
                  // console.log(`item`, item);
                  return (
                    <TouchableOpacity
                      onPress={async () => {
                        setDivision(item);
                        setModalVisible(false);
                      }}
                      key={`${item.id ?? index}`}>
                      <Text style={styles.name}>{item.name}</Text>
                      {index != Divisions.length - 1 && (
                        <View style={styles.endView} />
                      )}
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default SelectDivisionModal;

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
  },
  name: {
    textAlign: 'center',
    marginVertical: horizontalScale(10),
    fontSize: getFontSize(18),
    fontFamily: RubikRegular,
    color: Colors.blackColorCode,
  },
  endView: {
    alignSelf: 'center',
    width: '90%',
    borderBottomColor: '#ebebeb',
    borderBottomWidth: 1,
    height: 1,
  },
});
