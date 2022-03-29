import React, {useState, useRef, useEffect, useCallback} from 'react'
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native'
import { useSelector } from 'react-redux';
import HisotyImage from '../../../assets/svg/historyImage'
import PostRequestApi from '../../apirequest/PostRequestApi';
import { getPhotoUrl } from '../../Constants/constants';
import { RubikLight, RubikMedium, RubikRegular } from '../../Constants/fonts/Fonts'
import Images from '../../Constants/Images/Images';
import { getFontSize, horizontalScale } from '../../Constants/sizeChoose';
import getStore from '../../redux';
import { getMyDeviceId } from '../../services/commonService';
import { useFocusEffect } from '@react-navigation/native';

function getHistory() {
  return [
    {
      id: '1',
      image: Images.HalfDayOffWorkImg,
      description: 'Late Start Monday @ 10am',
      reward_point: 0,
      isDummy: true,
    },
    {
      id: '2',
      image: Images.HalfDayOffWorkImg,
      description: 'Early Finish Friday @ 2pm',
      reward_point: 400,
      isDummy: true,
    },
    {
      id: '3',
      image: Images.HalfDayOffWorkImg,
      description: 'Career Mentoring Session by Jen',
      reward_point: 0,
      isDummy: true,
    },
    {
      id: '4',
      image: Images.HalfDayOffWorkImg,
      description: 'Day Off',
      reward_point: 1000,
      isDummy: true,
    },
  ];
}

function RewardsHistory({setIsLevelsHide, islevelsHide}) {
  const [claimRewardList, setClaimRewardList] = useState(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(null);
  const offset = useRef(0);
  const isHidden = useRef(false);

  const UserData = useSelector((state) => state.First);

  useFocusEffect(
    React.useCallback(() => {
      if (UserData.UserEmail && UserData.UserId) {
        callClaimedRewardListApi();
      } else {
        setClaimRewardList(null);
      }
    }, [UserData.UserEmail, UserData.UserId])
  );

  const callClaimedRewardListApi = () => {
    const userData = getStore?.()?.getState?.()?.First;
    const deviceId = getMyDeviceId();
    if (!(userData?.UserEmail && userData?.UserId)) {
      return;
    }
    setIsHistoryLoading(true);
    let params = {
      "device_id": deviceId,
      "email": userData?.UserEmail ?? null,
      "user_id": userData?.UserId ?? null,
    };
    console.log('params claimRewardList api', params);
    return PostRequestApi('claimRewardList', params)
      .then((res) => {
        console.log(
          '✅ ✅ ✅ ✅ Success claimRewardList Api ✅ ✅ ✅ ✅',
          res?.data,
        );
        if (Array.isArray(res?.data?.rewardData)) {
          setClaimRewardList([...res.data.rewardData]);
        }
        setIsHistoryLoading(false);
      })
      .catch((err) => {
        setIsHistoryLoading(false);
        console.log('❌ ❌ ❌ ❌ Error claimRewardList api ❌ ❌ ❌ ❌', err);
      });
  };

  useEffect(() => {
    if (!islevelsHide) {
      isHidden.current = false;
    }
  }, [islevelsHide]);

  // useEffect(() => {
  //   if ((UserData.UserEmail, UserData.UserId)) {
  //     callClaimedRewardListApi();
  //   } else {
  //     setClaimRewardList(null);
  //   }
  // }, [UserData.UserEmail, UserData.UserId]);

  const onScroll = useCallback((event) => {
    var currentOffset = event.nativeEvent.contentOffset.y;
    var isDown = currentOffset > offset.current;
    offset.current = currentOffset;
    if (!islevelsHide && !isHidden.current && isDown && currentOffset > 0) {
      isHidden.current = true;
      setIsLevelsHide(true);
    } else if (!isDown && currentOffset <= 0 && islevelsHide) {
      isHidden.current = false;
      setIsLevelsHide(false);
    }
  }, [setIsLevelsHide]);

  const renderItem = ({ item, index }) => {
    let img = item.image && !item.isDummy ? {uri: `${getPhotoUrl()}${item.image}`} : item.image;
    return (
      <View
        // key={`${item?.claim_history_id ?? index}`}
        // onPress={() => onPressRewardItem(item)}
        activeOpacity={0.7}
        style={styles.card}>
        <View style={styles.cardSubView}>
          {img && (
            <View>
              {!isNaN(item.reward_point) && Number(item.reward_point) === 0 && (
                <View style={styles.coinsRequiredView}>
                  <Text style={styles.deniedText}>Denied</Text>
                </View>
              )}
              <Image source={img} style={styles.image} />
            </View>
          )}
          <View style={styles.itemBody}>
            {typeof item.description === 'string' && (
              <Text numberOfLines={2} style={styles.itemDetails}>
                {item.description}
              </Text>
            )}
            {!isNaN(item.reward_point) && (
              <Text
                numberOfLines={2}
                style={styles.itemPrice}>{`${item.reward_point} coins`}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      {(!(UserData.UserId && UserData.UserEmail) || (Array.isArray(claimRewardList) && claimRewardList.length > 0)) ? (
        <View style={styles.availableContainer}>
          <FlatList
            scrollEnabled={true}
            data={(UserData.UserId && UserData.UserEmail) ? (claimRewardList ?? []) : getHistory()}
            renderItem={renderItem}
            onScroll={onScroll}
            keyExtractor={(item, index) => (item?.claim_history_id ?? index)}
            showsVerticalScrollIndicator={false}
          />
          <View style={{ padding: 40 }} />
        </View >
      ) : (
        <ScrollView
          style={styles.notAvailableContainer}
          scrollEnabled={true}
          onScroll={onScroll}>
          <View style={styles.subContainerTwo}>
            <View style={styles.historyImgContainer}>
              <HisotyImage />
            </View>
            <Text style={styles.BigText}>You're Getting There! </Text>
            <Text style={styles.SmallText}>You haven't redeemed {`\n`}any rewards yet. Keep bringing {`\n`}in the Flx coins!</Text>
          </View>
          <View style={styles.bottomTwo} />
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  availableContainer: {
    backgroundColor: 'white',
    padding: 14,
    height: '100%',
    width: '100%',
  },
  notAvailableContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  subContainerTwo: {
    alignItems: 'center',
  },
  historyImgContainer: {
    marginTop: 30
  },
  BigText: {
    fontFamily: RubikRegular,
    fontSize: 20,
    fontWeight: '500',
    marginTop: 40,
  },
  SmallText: {
    color: '#9C9EB9',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    lineHeight: 22,
  },
  bottomTwo: {
    marginBottom: 120,
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
  deniedText: {
    color: '#FF0000',
    fontSize: getFontSize(12),
    fontFamily: RubikLight,
  },
  image: {
    height: horizontalScale(64),
    width: horizontalScale(75),
    resizeMode: 'stretch',
    alignSelf: 'center',
    marginRight: horizontalScale(20),
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
    top: 0,
    left: 0,
    backgroundColor: '#F9D5D7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    zIndex: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});
const History = React.memo(RewardsHistory);
export default History;
