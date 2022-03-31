import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import PostRequestApi, {
  getRewardsListApi,
  getUpdateRewardPoint,
} from '../../apirequest/PostRequestApi';
import AddNameModal from '../../Components/Modals/AddNameModal/AddNameModal';
import CustomModal from '../../Components/Modals/CustomModal/CustomModal';
import RewardsModal from '../../Components/Modals/RewardsModal/RewardsModal';
import ProfileCoinModal from '../../Components/PopUp/profileCoinModal';
import Constants from '../../Constants';
import {getPhotoUrl} from '../../Constants/constants';
import {RubikLight, RubikRegular} from '../../Constants/fonts/Fonts';
import Images from '../../Constants/Images/Images';
import {getFontSize, horizontalScale} from '../../Constants/sizeChoose';
import getStore from '../../redux';
import {SetAvailableRewards} from '../../redux/actions/actions';
import {getMyDeviceId} from '../../services/commonService';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../Components/Loader/Loader';

function getModalText(pointsToUnlock) {
  if (typeof pointsToUnlock === 'number') {
    return `Please earn ${pointsToUnlock} more points to unlock this reward`;
  }
  return "Are you sure you'd like to redeem this reward?";
}

function getPointsToUnlock(currentPts, value) {
  return (currentPts - value) >= 0 ? undefined : (value - currentPts);
}

function getRewards(userId, currentPts) {
  // if (!userId) {
  //   userId = getStore?.()?.getState?.()?.First?.UserId ?? "";
  // }
  // if (currentPts === undefined) {
  //   currentPts = getStore?.()?.getState?.()?.First?.floCoins ?? 0;
  //   if (!isNaN(currentPts)) {
  //     currentPts = Number(currentPts);
  //   }
  // }
  // if (!isNaN(userId) && Number(userId) === 85) {
  //   return [
  //     {
  //       id: '1',
  //       image: Images.HalfDayOffWorkImg,
  //       description: 'Late Start Monday @ 10am',
  //       value: 300,
  //       coinsToUnlock: getPointsToUnlock(currentPts, 300),
  //     },
  //     {
  //       id: '2',
  //       image: Images.HalfDayOffWorkImg,
  //       description: 'Early Finish Friday @ 2pm',
  //       value: 400,
  //       coinsToUnlock: getPointsToUnlock(currentPts, 400),
  //     },
  //     {
  //       id: '3',
  //       image: Images.HalfDayOffWorkImg,
  //       description: 'Career Mentoring Session by Jen',
  //       value: 700,
  //       coinsToUnlock: getPointsToUnlock(currentPts, 700),
  //     },
  //     {
  //       id: '4',
  //       image: Images.HalfDayOffWorkImg,
  //       description: 'Day Off',
  //       value: 1000,
  //       coinsToUnlock: getPointsToUnlock(currentPts, 1000),
  //     },
  //   ];
  // }
  return [
    {
      id: '1',
      image: Images.MusicFestivalImg,
      description: 'Early Acccess to Music Festival Tickets',
      value: 500,
      coinsToUnlock: 50,
      isDummy: true,
    },
    {
      id: '2',
      image: Images.MyerImg,
      description: 'Myer Member Benefits',
      value: 500,
      isDummy: true,
    },
    {
      id: '3',
      image: Images.AppleWatchImg,
      description: 'Get 15% off the latest Apple Watch',
      value: 500,
      isDummy: true,
    },
    {
      id: '4',
      image: Images.ColesImg,
      description: 'Coles Member Benefits',
      value: 500,
      isDummy: true,
    },
    {
      id: '5',
      image: Images.ReeceImg,
      description: 'Reece Member Benefits',
      value: 500,
      isDummy: true,
    },
    {
      id: '6',
      image: Images.AdidasImg,
      description: 'Adidas Member Benefits',
      value: 500,
      isDummy: true,
    },
    {
      id: '7',
      image: Images.FitBitImg,
      description: 'Get 25% off the latest Fitbit',
      value: 500,
      isDummy: true,
    },
    {
      id: '8',
      image: Images.HalfDayOffWorkImg,
      description: 'Get half a day off work',
      value: 500,
      isDummy: true,
    },
    {
      id: '9',
      image: Images.LeaveWithoutPayImg,
      description: 'Buy another leave without pay day',
      value: 500,
      isDummy: true,
    },
    {
      id: '10',
      image: Images.EBGamesImg,
      description: 'EB Games Member Benefits',
      value: 500,
      isDummy: true,
    },
    {
      id: '11',
      image: Images.BeaconLightingImg,
      description: 'Beacon Lighting Member Benefits',
      value: 500,
      isDummy: true,
    },
    {
      id: '12',
      image: Images.WhoopImg,
      description: 'Get 25% Off the latest Whoop',
      value: 500,
      isDummy: true,
    },
    {
      id: '13',
      image: Images.LuxuryEscapesImg,
      description: 'Luxury Escapes Member Benefits',
      value: 500,
      isDummy: true,
    },
    {
      id: '14',
      image: Images.AccorImg,
      description: 'Accor Member Benefits',
      value: 500,
      isDummy: true,
    },
    {
      id: '15',
      image: Images.SleepingDuckImg,
      description: 'Sleeping Duck Member Benefits',
      value: 500,
      isDummy: true,
    },
    {
      id: '16',
      image: Images.NorthFaceImg,
      description: 'North Face Member Benefits',
      value: 500,
      isDummy: true,
    },
    {
      id: '17',
      image: Images.KathmanduImg,
      description: 'Kathmandu Member Benefits',
      value: 500,
      isDummy: true,
    },
    {
      id: '18',
      image: Images.AnacondaImg,
      description: 'Anaconda Member Benefits',
      value: 500,
      isDummy: true,
    },
  ];
}

const Rewards = ({setIsLevelsHide, islevelsHide}) => {
  const [openActionSheet, setopenActionSheet] = useState(false);
  const [ptsToUnlock, setPtsToUnlock] = useState(false);
  const [showInputNameModal, setShowInputNameModal] = useState(false);
  const [showPostRewardsClaimModal, setShowPostRewardsClaimModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [isRewardsLoading, setIsRewardsLoading] = useState(false);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [contactEmails, setContactEmails] = useState(null);
  const rewardId = useRef();

  const offset = useRef(0);
  const isHidden = useRef(false);
  const data = useRef(getRewards());

  const userId = useSelector((state) => state.First?.UserId);
  const userEmail = useSelector((state) => state.First?.UserEmail);
  const floCoins = useSelector((state) => state.First?.floCoins);
  const rewardsList = useSelector((state) => state.First?.availableRewards);
  const dispatch = useDispatch();

  const callGetRewardsApi = () => {
    const userData = getStore?.()?.getState?.()?.First;
    const deviceId = getMyDeviceId();
    if (!(userData?.UserEmail && userData?.UserId)) {
      return;
    }
    let params = {
      "device_id": deviceId,
      "email": userData?.UserEmail ?? null,
      "user_id": userData?.UserId ?? null,
    };
    console.log(`params of availableRewardList api`, params);
    setIsRewardsLoading(true);
    function onError() {
      setIsRewardsLoading(false);
    }
    getRewardsListApi(params, onError)
      .then((res) => {
        console.log('availableRewardList api res----', res);
        setIsRewardsLoading(false);
        if (Array.isArray(res)) {
          dispatch(SetAvailableRewards(res));
        }
      })
      .catch((err) => {
        setIsRewardsLoading(false);
        console.log('availableRewardList api error ', err);
      });
  };

  const callClaimRewardApi = (name) => {
    const userData = getStore?.()?.getState?.()?.First;
    const deviceId = getMyDeviceId();
    if (!(userData?.UserEmail && userData?.UserId) && name && rewardId.current) {
      setUserName('');
      updateShowInputNameModal(false)();
      return;
    }
    let params = {
      "device_id": deviceId,
      "email": userData?.UserEmail ?? null,
      "user_id": userData?.UserId ?? null,
      "reward_item_id": rewardId.current,
      "user_name": name,
      "section_index": 6,
    };
    console.log('params claimReward api', params);
    setIsClaimingReward(true);
    return PostRequestApi('claimReward', params)
      .then((res) => {
        console.log(
          '✅ ✅ ✅ ✅ Success claimReward Api ✅ ✅ ✅ ✅',
          res?.data,
        );
        Array.isArray(res?.data?.sub_admin_emails) && setContactEmails([...res.data.sub_admin_emails]);
        setUserName('');
        updateShowInputNameModal(false)();
        const timeoutId = setTimeout(() => {
          updateShowPostRewardsClaimModal(true)();
          clearTimeout(timeoutId);
        }, 800);
        getUpdateRewardPoint(
          {
            "device_id": deviceId,
            "email": userData?.UserEmail ?? null,
            "user_id": userData?.UserId ?? null
          },
          dispatch,
        );
        setIsClaimingReward(false);
      })
      .catch((err) => {
        setUserName('');
        setIsClaimingReward(false);
        updateShowInputNameModal(false)();
        console.log('❌ ❌ ❌ ❌ Error claimReward api ❌ ❌ ❌ ❌', err);
      });
  };

  useEffect(() => {
    if (!islevelsHide) {
      isHidden.current = false;
    }
  }, [islevelsHide]);

  useFocusEffect(
    React.useCallback(() => {
      if ((userEmail && userId && (!Array.isArray(rewardsList) || rewardsList.length === 0))) {
        callGetRewardsApi();
      } else {
        dispatch(SetAvailableRewards(null));
      }
    }, [userId, userEmail])
  );

  // useEffect(() => {
  //   console.log('Rewards useEffect');
  //   if (userId && userEmail) {
  //     callGetRewardsApi();
  //   } else {
  //     dispatch(SetAvailableRewards(null));
  //   }
  // }, []);

  const VerifyDone = () => {
    setopenActionSheet(false);
  };

  const updateShowInputNameModal = (f) => () => setShowInputNameModal(f);
  const updateShowPostRewardsClaimModal = (f) => () => setShowPostRewardsClaimModal(f);

  const onSubmitNameInput = useCallback(() => {
    Keyboard.dismiss();
    callClaimRewardApi(userName);
  }, [userName]);

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

  const onPressRewardItem = (item, coinsToUnlock) => {
    if (item.isDummy) {
      setopenActionSheet(true);
    } else if (coinsToUnlock && !isNaN(coinsToUnlock) && coinsToUnlock > 0) {
      setPtsToUnlock(Number(coinsToUnlock));
      setopenActionSheet(true);
    } else {
      rewardId.current = item.id;
      setPtsToUnlock(null);
      updateShowInputNameModal(true)();
    }
  };

  const renderItem = ({item, index}) => {
    const pointsToUnlock = getPointsToUnlock(floCoins, item.value);
    let img = item.image && !item.isDummy ? {uri: `${getPhotoUrl()}${item.image}`} : item.image;
    return (
      <TouchableOpacity
        key={`${item?.id ?? index}`}
        onPress={() => onPressRewardItem(item, pointsToUnlock)}
        activeOpacity={0.7}
        style={styles.card}>
        <View style={styles.cardSubView}>
          {item?.image && <Image source={img} style={styles.image} />}
          <View style={styles.itemBody}>
            {typeof item.description === 'string' && (
              <Text numberOfLines={2} style={styles.itemDetails}>
                {item.description}
              </Text>
            )}
            {!isNaN(item.value) && (
              <Text
                numberOfLines={2}
                style={styles.itemPrice}>{`${item.value} coins`}</Text>
            )}
          </View>
          <Image
            source={require('../../../assets/newImage/arrow/arrow.png')}
            style={styles.imageArrow}
          />
          {pointsToUnlock > 0 && (
            <View style={styles.coinsRequiredView}>
              <Text
                style={
                  styles.coinsRequiredText
                }>{`only ${pointsToUnlock} more!`}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  let claimRewardsDescription = 'To claim your reward, contact Telstra rewards activations on';
  if (Array.isArray(contactEmails) && contactEmails.length > 0) {
    if (contactEmails.length === 1) {
      claimRewardsDescription = `${claimRewardsDescription} ${contactEmails[0]}`;
    } else {
      contactEmails.forEach((e, idx) => {
        if (idx === (contactEmails.length - 1)) {
          claimRewardsDescription = `${claimRewardsDescription} or ${e}`;
        } else {
          claimRewardsDescription = `${claimRewardsDescription}, ${e}`;
        }
      });
    }
  } else {
    claimRewardsDescription = `${claimRewardsDescription} xxx@telstrahealth.com or ${'\n'} 02 9481 1111`;
  }

  return (
    <>
      <View
        style={{
          backgroundColor: 'white',
          padding: 14,
          height: '100%',
          width: '100%',
        }}>
        <FlatList
          scrollEnabled={true}
          data={(userId && userEmail) ? (rewardsList ?? []) : data.current}
          renderItem={renderItem}
          onScroll={onScroll}
          showsVerticalScrollIndicator={false}
        />
        <View style={{ padding: 40 }} />
        {Array.isArray(rewardsList) && rewardsList.length > 0 ? (
          <CustomModal
            modalVisible={openActionSheet}
            dismissModalHandler={() => setopenActionSheet(false)}
            modalText={getModalText(ptsToUnlock)}
            onClickButtonOne={VerifyDone}
            modalTextStyle={styles.modalText}
            buttonOneText={typeof ptsToUnlock === 'number' ? "Okay" : "Yes"}
            onClickButtonTwo={typeof ptsToUnlock === 'number' ? undefined : VerifyDone}
            buttonTwoText={typeof ptsToUnlock === 'number' ? undefined : "No"}
          />
        ) : (
          <ProfileCoinModal
            permission={"Hang in there you'll be able to cash in your Flx soon!"}
            // image={Constants.Images.FitnessPopUp}
            dataType={'fitness'}
            modalVisible={openActionSheet}
            dismissModalHandler={() => setopenActionSheet(false)}
            verifyDone={() => VerifyDone()}
          />
        )}
        {/* <ProfileCoinModal
          permission={"Hang in there you'll be able to cash in your Flx soon!"}
          // image={Constants.Images.FitnessPopUp}
          dataType={'fitness'}
          modalVisible={openActionSheet}
          dismissModalHandler={() => setopenActionSheet(false)}
          verifyDone={() => VerifyDone()}
        /> */}
      </View>
      <AddNameModal
        modalVisible={showInputNameModal}
        isLoading={isClaimingReward}
        dismissModalHandler={updateShowInputNameModal(false)}
        verifyDone={onSubmitNameInput}
        buttonText="Redeem Now!"
        value={userName}
        onChangeText={setUserName}
        title="Your name"
        description="To redeem your reward, only your name will be sent to the rewards activations team."
      />
      <RewardsModal
        modalVisible={showPostRewardsClaimModal}
        description={claimRewardsDescription}
        dismissModalHandler={updateShowPostRewardsClaimModal(false)}
      />
      <Loader isLoading={isRewardsLoading} />
    </>
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
  modalText: {
    marginTop: horizontalScale(30),
    fontFamily: RubikRegular,
    fontSize: getFontSize(18),
    textAlign: 'center',
  },
});

export default Rewards;
