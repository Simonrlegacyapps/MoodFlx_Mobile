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
import {useDispatch, useSelector} from 'react-redux';
import Constants from '../../../Constants';
import {PHOTO_URL} from '../../../Constants/constants';
import {
  RubikBlack,
  RubikBold,
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import {dynamicSize} from '../../../Constants/sizeChoose';
import ProfileGenderModal from '../ProfileGender/ProfileGenderModal';

type props = {
  modalVisible: Boolean,
  dismissModalHandler: Object,
  selectedValue: Object,
};

const {width} = Dimensions.get('window');
const EditManualWeatherModal = ({
  modalVisible,
  dismissModalHandler,
  selectedValue,
  verifyDone,
  image,
  dataType,
  onChangeText,
  value,
  Weather,
  hours,
  Temp,
  EditTemp,
  Hour,
  EditHour,
  Pollen,
  EditPollen,
  WeatherType,
  EditWeatherType,
}: props) => {
  const [color, setcolor] = useState('black');
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  const [OpenPollen, setOpenPollen] = useState(false);
  const [OpenWeatherType, setOpenWeatherType] = useState(false);
  // const [value, onChangeText] = React.useState('');
  //   console.log(
  //     `modalView, dismissModalHandler, selectedValue`,
  //     modalVisible,
  //     dismissModalHandler,
  //     selectedValue,
  //   );

  // console.log(`value`, value);

  let data = [{label: 'Low'}, {label: 'Medium'}, {label: 'High'}];
  let Weatherdata = [
    {label: 'Rainy'},
    {label: 'Sunny'},
    {label: 'Cloudy'},
    {label: 'Stormy'},
    {label: 'Snowy'},
  ];

  let myname = UserData?.UserDetails?.full_name
    ? UserData?.UserDetails?.full_name
    : 'InnoApps';
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
          <Text
            style={{
              fontWeight: '500',
              fontSize: 16,
              color: '#9C9EB9',
              textAlign: 'center',
              marginTop: 20,
            }}>
            Edit Weather
          </Text>
          <View style={styles.WeatherCard}>
            <View>
              <View
                style={{
                  width: dynamicSize(250),
                  backgroundColor: 'white',
                  margin: dynamicSize(10),
                  borderRadius: 15,
                  marginHorizontal: dynamicSize(20),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 15,
                    overflow: 'hidden',
                  }}>
                  <Image
                    resizeMode={'contain'}
                    source={Constants.Images.Rain}
                    style={{margin: 10, marginHorizontal: 14}}
                  />
                  <View>
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => setOpenWeatherType(true)}>
                      <Text style={[styles.Card1Text, {marginLeft: -10}]}>
                        {WeatherType
                          ? WeatherType
                          : Weather
                          ? Weather.weather[0].description.substring(0, 13)
                          : 'Low'}
                      </Text>
                      <Image
                        resizeMode={'contain'}
                        style={{
                          height: 12,
                          width: 12,
                          marginHorizontal: 5,
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}
                        source={Constants.Images.dropDownTwo}
                      />
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row'}}>
                      <TextInput
                        placeholder={Temp}
                        onChangeText={(text) => {
                          EditTemp(text);
                        }}
                        keyboardType={'decimal-pad'}
                        style={[
                          {
                            fontFamily: RubikMedium,
                            fontSize: dynamicSize(34),
                            borderBottomWidth: 1,
                          },
                        ]}>
                        {Math.round(Weather ? Weather.main.temp : '0')}
                      </TextInput>
                      <Text
                        style={[
                          {
                            fontFamily: RubikMedium,
                            fontSize: dynamicSize(34),
                            borderBottomWidth: 1,
                          },
                        ]}>
                        ºC
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.CardsView}>
                <View style={styles.card2View}>
                  <View style={{flexDirection: 'row', padding: 15}}>
                    <Image
                      resizeMode={'contain'}
                      source={Constants.Images.Rain}
                      style={styles.SmallCardImage}
                    />
                    <View>
                      <TouchableOpacity
                        onPress={() => setOpenWeatherType(true)}>
                        <Text style={[styles.Card1Text]}>
                          {WeatherType
                            ? WeatherType
                            : Weather
                            ? Weather.weather[0].description
                            : 'Low'}
                        </Text>
                      </TouchableOpacity>
                      <View style={{flexDirection: 'row'}}>
                        <TextInput
                          placeholder={Hour}
                          onChangeText={(text) => {
                            EditHour(text);
                          }}
                          keyboardType={'decimal-pad'}
                          style={[
                            ,
                            {
                              fontFamily: RubikMedium,
                              fontSize: 18,
                              borderBottomWidth: 1,
                            },
                          ]}>
                          {hours ? hours : 1}
                        </TextInput>
                        <Text
                          style={[, {fontFamily: RubikMedium, fontSize: 18}]}>
                          {' '}
                          hr
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setOpenPollen(true);
                  }}
                  style={{
                    width: dynamicSize(120),
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingRight: 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 15,
                    }}>
                    <Image
                      resizeMode={'contain'}
                      source={Constants.Images.Rain}
                      style={styles.SmallCardImage}
                    />
                    <View>
                      <Text style={[, styles.smallCardText]}>Pollen</Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={[
                            ,
                            {
                              fontFamily: RubikMedium,
                              fontSize: 18,
                            },
                          ]}>
                          {Pollen ? Pollen : 'Low'}
                        </Text>
                        <Image
                          resizeMode={'contain'}
                          style={{
                            height: 12,
                            width: 12,
                            marginHorizontal: 5,
                            justifyContent: 'center',
                            alignSelf: 'center',
                          }}
                          source={Constants.Images.dropDownTwo}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity
              onPress={() => {
                verifyDone('Yes');
              }}
              style={{alignItems: 'center'}}>
              <View
                style={{
                  marginTop: dynamicSize(24),
                  height: dynamicSize(53),
                  width: dynamicSize(230),
                  backgroundColor: '#E4DFFF',
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
                }}>
                <Text
                  style={{fontWeight: '500', fontSize: 16, color: '#7265E3'}}>
                  Save
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ProfileGenderModal
          //   datePicker={datePicker}
          data={Weatherdata}
          modalVisible={OpenWeatherType}
          onChangeText={EditWeatherType}
          value={WeatherType}
          dismissModalHandler={() => setOpenWeatherType(false)}
        />
        <ProfileGenderModal
          //   datePicker={datePicker}
          data={data}
          modalVisible={OpenPollen}
          onChangeText={EditPollen}
          value={Pollen}
          dismissModalHandler={() => setOpenPollen(false)}
        />
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
export default EditManualWeatherModal;
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
    backgroundColor: '#F1F4F9',
    borderRadius: 30,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    width: '90%',
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
  scrollView: {
    // backgroundColor: '#FFF',
    height: '100%',
    paddingBottom: 400,
  },

  WeatherCardMain: {
    flexDirection: 'row',
    width: 320,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: '#F1F4F9',
    borderRadius: 18,
    paddingVertical: 20,
    minHeight: 250,
  },
  WeatherCard: {
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingBottom: 8,
  },
  city: {
    paddingVertical: 0,
    color: '#3B456D',
    fontSize: 18,
    fontFamily: RubikRegular,
  },
  CardsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  card2View: {
    width: dynamicSize(115),
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 15,
  },
  SmallCardImage: {
    margin: 5,
    marginLeft: 0,
    height: 20,
    width: 20,
    marginLeft: -5,
  },
  smallCardText: {
    fontFamily: RubikLight,
    fontWeight: '300',
    color: '#8A8BAB',
    fontSize: 16,
    marginBottom: 5,
  },
  Card1Text: {
    fontFamily: RubikLight,
    fontWeight: '300',
    color: '#8A8BAB',
    fontSize: 16,
    marginTop: 0,
    minWidth: dynamicSize(20),
  },
  SmallThinText: {
    paddingVertical: 12,
    fontFamily: RubikLight,
    color: '#747690',
  },
});
