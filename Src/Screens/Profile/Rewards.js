import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import ProfileCoinModal from '../../Components/PopUp/profileCoinModal';
import Constants from '../../Constants';
import { RubikLight } from '../../Constants/fonts/Fonts';
import Images from '../../Constants/Images/Images';
import { getFontSize, horizontalScale } from '../../Constants/sizeChoose';
import { setScrolling } from '../../redux/actions/actions';

const Rewards = () => {
  const [openActionSheet, setopenActionSheet] = useState(false)
  const data = [
    {
      id: '1',
      image: Images.MusicFestivalImg,
      details: 'Early Acccess to Music Festival Tickets',
      price: 500,
      coinsToUnlock: 50,
    },
    {
      id: '2',
      image: Images.MyerImg,
      details: 'Myer Member Benefits',
      price: 500,
    },
    {
      id: '3',
      image: Images.AppleWatchImg,
      details: 'Get 15% off the latest Apple Watch',
      price: 500,
    },
    {
      id: '4',
      image: Images.ColesImg,
      details: 'Coles Member Benefits',
      price: 500,
    },
    {
      id: '5',
      image: Images.ReeceImg,
      details: 'Reece Member Benefits',
      price: 500,
    },
    {
      id: '6',
      image: Images.AdidasImg,
      details: 'Adidas Member Benefits',
      price: 500,
    },
    {
      id: '7',
      image: Images.FitBitImg,
      details: 'Get 25% off the latest Fitbit',
      price: 500,
    },
    {
      id: '8',
      image: Images.HalfDayOffWorkImg,
      details: 'Get half a day off work',
      price: 500,
    },
    {
      id: '9',
      image: Images.LeaveWithoutPayImg,
      details: 'Buy another leave without pay day',
      price: 500,
    },
    {
      id: '10',
      image: Images.EBGamesImg,
      details: 'EB Games Member Benefits',
      price: 500,
    },
    {
      id: '11',
      image: Images.BeaconLightingImg,
      details: 'Beacon Lighting Member Benefits',
      price: 500,
    },
    {
      id: '12',
      image: Images.WhoopImg,
      details: 'Get 25% Off the latest Whoop',
      price: 500,
    },
    {
      id: '13',
      image: Images.LuxuryEscapesImg,
      details: 'Luxury Escapes Member Benefits',
      price: 500,
    },
    {
      id: '14',
      image: Images.AccorImg,
      details: 'Accor Member Benefits',
      price: 500,
    },
    {
      id: '15',
      image: Images.SleepingDuckImg,
      details: 'Sleeping Duck Member Benefits',
      price: 500,
    },
    {
      id: '16',
      image: Images.NorthFaceImg,
      details: 'North Face Member Benefits',
      price: 500,
    },
    {
      id: '17',
      image: Images.KathmanduImg,
      details: 'Kathmandu Member Benefits',
      price: 500,
    },
    {
      id: '18',
      image: Images.AnacondaImg,
      details: 'Anaconda Member Benefits',
      price: 500,
    },
  ];


  const dispatch = useDispatch()

  const VerifyDone = () => {
    setopenActionSheet(false)
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={`${item?.id ?? index}`}
        onPress={() => setopenActionSheet(true)}
        activeOpacity={0.7}
        style={styles.card}>
        <View style={styles.cardSubView}>
          {item?.image && <Image source={item.image} style={styles.image} />}
          <View style={styles.itemBody}>
            {typeof item.details === 'string' && (
              <Text numberOfLines={2} style={styles.itemDetails}>
                {item.details}
              </Text>
            )}
            {!isNaN(item.price) && (
              <Text
                numberOfLines={2}
                style={styles.itemPrice}>{`${item.price} coins`}</Text>
            )}
          </View>
          <Image
            source={require('../../../assets/newImage/arrow/arrow.png')}
            style={styles.imageArrow}
          />
          {!isNaN(item.coinsToUnlock) && (
            <View style={styles.coinsRequiredView}>
              <Text
                style={
                  styles.coinsRequiredText
                }>{`only ${item.coinsToUnlock} more!`}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 14,
        height: '100%',
        width: '100%',
      }}>
      <FlatList onScroll={() => { dispatch(setScrolling(true)), console.log(`top`) }} onScrollToTop={() => { dispatch(setScrolling(false)), console.log(`bobttom`) }} scrollEnabled={true} data={data} renderItem={renderItem} showsVerticalScrollIndicator={false} />
      <View style={{ padding: 40 }} />
      <ProfileCoinModal
        permission={"Hang in there you'll be able to cash in your Flo soon!"}
        // image={Constants.Images.FitnessPopUp}
        dataType={'fitness'}
        modalVisible={openActionSheet}
        dismissModalHandler={() => setopenActionSheet(false)}
        verifyDone={() => VerifyDone()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: horizontalScale(64),
    width: horizontalScale(75),
    resizeMode: 'stretch',
    alignSelf: 'center',
    marginRight: horizontalScale(20),
  },
  card: {
    // height: 100,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    marginHorizontal: 2,
    elevation: 2,
    marginVertical: horizontalScale(8),
    paddingVertical: horizontalScale(15),
    paddingLeft: horizontalScale(17),
    borderRadius: horizontalScale(10),
    // flexDirection: 'row',
  },
  cardSubView: {
    flexDirection: 'row',
  },
  itemBody: {
    flex: 1,
  },
  itemDetails: {
    width: '80%',
    fontFamily: RubikLight,
    color: '#4C5980',
    fontSize: getFontSize(12),
    flex: 1,
  },
  itemPrice: {
    color: '#D1D1D1',
    fontSize: getFontSize(12),
    fontFamily: RubikLight,
  },
  imageArrow: {
    height: horizontalScale(14.5),
    width: horizontalScale(8.5),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginLeft: horizontalScale(20),
    tintColor: '#D7D7D7',
    marginRight: horizontalScale(17),
  },
  coinsRequiredView: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#E4DFFF',
    borderTopLeftRadius: horizontalScale(20),
    borderBottomLeftRadius: horizontalScale(20),
  },
  coinsRequiredText: {
    fontSize: getFontSize(8),
    fontFamily: RubikLight,
    color: '#7265E3',
    marginVertical: horizontalScale(3),
    marginLeft: horizontalScale(8),
  },
});

export default Rewards;
