import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ProfilePlaceholder from '../../../assets/profileicons/ProfilePlaceholder';
import {
  dynamicSize,
  getFontSize,
  horizontalScale,
} from '../../Constants/sizeChoose';
import {RubikLight, RubikMedium} from '../../Constants/fonts/Fonts';
import Constants from '../../Constants';
import {getFloCoins, isNonEmptyString} from '../../services/commonService';
import {FloCoinIcon} from '../../../assets/svg/floCoinIcon';
import Edit from '../../../assets/svg/Edit';
import { getPhotoUrl } from '../../Constants/constants';
import Colors from '../../Constants/Colors/Colors';
import {VitalityIcon} from '../../../assets/svg/VitalityIcon';
import moment from 'moment';

const ProfileHeader = ({navigation}) => {
  const UserData = useSelector((state) => state.First);

  const since = useMemo(() => {
    if (isNonEmptyString(UserData?.UserDetails?.created_at)) {
      return `Since ${moment(UserData.UserDetails.created_at).format(
        "MMMM'YY",
      )}`;
    }
    return null;
  }, [UserData?.UserDetails?.created_at]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProfileTab');
        }}
        activeOpacity={0.8}
        style={{flex: 1, flexDirection: 'row'}}>
        <View style={{marginLeft: 5}}>
          {!UserData?.UserDetails?.profile_image ? (
            <ProfilePlaceholder
              width={dynamicSize(40)}
              height={dynamicSize(40)}
            />
          ) : (
            <Image
              source={{
                uri: `${getPhotoUrl()}${UserData?.UserDetails?.profile_image}`,
              }}
              style={styles.image}
            />
          )}
          <View style={styles.pickupIconStyle}>
            <TouchableOpacity
              onPress={() => setOpenActionSheet(true)}
              disabled={true}>
              <Edit w={32} h={32}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.nameTexts}>
          {isNonEmptyString(since) && <Text style={styles.since}>{since}</Text>}
          <Text style={styles.name}>
            {UserData?.UserDetails?.full_name
              ? UserData?.UserDetails?.full_name
              : 'Anonymous'}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.topCoins}>
        <View style={styles.floIconView}>
          {UserData?.UserDetails?.vitality_member_id ? (
            <VitalityIcon />
          ) : (
            <FloCoinIcon />
          )}
        </View>
        <View>
          <Text style={styles.floCoinsTextOne}>
            {getFloCoins(UserData.floCoins)}
          </Text>
          <Text style={styles.floCoinsTextTwo}>
            {UserData?.UserDetails?.vitality_member_id ? 'Bonus' : 'flx Coins'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    marginHorizontal: 15,
    borderBottomWidth: 0.5,

    borderColor: Constants.Colors.lightGrey,
  },
  image: {
    height: dynamicSize(40),
    width: dynamicSize(40),
    borderRadius: 20,
  },
  pickupIconStyle: {
    position: 'absolute',
    top: dynamicSize(24),
    right: dynamicSize(-5),
  },
  nameTexts: {
    marginLeft: 16,
    marginVertical: 4,
    flex: 1,
    borderRightWidth: 0.5,
    borderColor: Constants.Colors.lightGrey,
  },
  since: {
    fontFamily: RubikLight,
    color: Constants.Colors.greyColorCode,
    // fontSize: Platform.OS === 'ios' ? getFontSize(12) : getFontSize(14),
    fontSize: getFontSize(12),
  },
  name: {
    fontFamily: RubikMedium,
    // fontSize: Platform.OS === 'ios' ? getFontSize(13) : getFontSize(15),
    fontSize: getFontSize(13),
    marginTop: 4,
    color: Colors.blackColorCode
  },
  floIconView: {
    marginLeft: horizontalScale(14),
    marginRight: horizontalScale(10),
    alignItems: 'flex-start',
  },
  floCoinsTextOne: {
    // fontSize: Platform.OS === 'ios' ? getFontSize(14) : getFontSize(16),
    fontSize: getFontSize(14),
    fontWeight: '500',
    color: Colors.blackColorCode,
    // marginBottom: 5,
    fontFamily: RubikMedium,
  },
  floCoinsTextTwo: {
    marginTop: horizontalScale(3),
    // fontSize: Platform.OS === 'ios' ? getFontSize(12) : getFontSize(14),
    fontSize: getFontSize(12),
    fontWeight: '400',
    color: Colors.greyColorCode,
    fontFamily: RubikLight,
  },
  topCoins: {
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight:40,
    // alignSelf: 'flex-start',
    flex: 0.8,
  },
});

export default ProfileHeader;
