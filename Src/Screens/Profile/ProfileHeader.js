import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ProfilePlaceholder from '../../../assets/profileicons/ProfilePlaceholder'
import { dynamicSize, getFontSize, horizontalScale } from '../../Constants/sizeChoose'
import DeviceInfo from 'react-native-device-info';
import { GetStaffUserData } from '../../apirequest/PostRequestApi'
import { UserDetail } from '../../redux/actions/actions'
import PickImageIcon from '../../../assets/profileicons/PickImageIcon'
import { RubikBlack, RubikLight, RubikMedium } from '../../Constants/fonts/Fonts'
import Constants from '../../Constants'
import EditProfile from '../../../assets/svg/editProfile'
import { getFloCoins } from '../../services/commonService'
import { FloCoinIcon } from '../../../assets/svg/floCoinIcon'

const ProfileHeader = ({ navigation }) => {
    const UserData = useSelector((state) => state.First);

    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { navigation.navigate("ProfileTab") }} activeOpacity={0.8} style={{flex:1, flexDirection:'row'}}>
            <View style={{ marginLeft: 5, }}>
                {!UserData?.UserDetails?.profile_image ? <ProfilePlaceholder
                    width={dynamicSize(40)}
                    height={dynamicSize(40)}
                /> :
                    <Image source={{ uri: `https://admin.moodflo.com/${UserData?.UserDetails?.profile_image}` }} style={styles.image} />}
                <View style={styles.pickupIconStyle}>
                    <TouchableOpacity onPress={() => setOpenActionSheet(true)} disabled={true}>
                        <PickImageIcon w={18} h={18} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.nameTexts} >
                <Text style={styles.since}>Since March 3rd</Text>
                <Text style={styles.name}>{UserData?.UserDetails?.full_name ? UserData?.UserDetails?.full_name : "Anonymous"}</Text>
            </View>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => { navigation.navigate("ProfileTab") }} style={styles.edit}>
                <EditProfile />
            </TouchableOpacity> */}
            <View style={styles.topCoins}>
            <View style={[styles.floIconView, {alignItems:'flex-start'}]}>
          <FloCoinIcon />
        </View>
        <View>
          <Text style={styles.floCoinsTextOne}>{getFloCoins(UserData.floCoins)}</Text>
          <Text style={styles.floCoinsTextTwo}>Flo Coins</Text>
        </View>
        </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 16,
        marginHorizontal: 15,
        borderBottomWidth: 0.5,
        
        borderColor: Constants.Colors.lightGrey
    },
    image: {
        height: dynamicSize(40),
        width: dynamicSize(40),
        borderRadius: 20
    },
    pickupIconStyle: {
        position: 'absolute',
        top: dynamicSize(24),
        right: dynamicSize(-5),
    },
    nameTexts: { marginLeft:16, marginVertical: 4, flex: 1 ,  borderRightWidth:0.5,borderColor: Constants.Colors.lightGrey},
    since: { fontFamily: RubikLight, color: Constants.Colors.greyColorCode, fontSize: 12, },
    name: { fontFamily: RubikMedium, fontSize: 13, marginTop: 4 },
    edit: { justifyContent: 'flex-end', marginRight: 5 },
    floIconView: {
        marginLeft: horizontalScale(14),
        marginRight: horizontalScale(10),
        
      },
      floCoinsTextOne: {
        fontSize: Platform.OS === 'ios' ? getFontSize(14) : getFontSize(16),
        fontWeight: '500',
        // marginBottom: 5,
        fontFamily: RubikMedium,
      },
      floCoinsTextTwo: {
        marginTop: horizontalScale(3),
        fontSize: Platform.OS === 'ios' ? getFontSize(12) : getFontSize(14),
        fontWeight: '400',
        color: 'grey',
        fontFamily: RubikLight,
      },
      topCoins:{ marginVertical: 4, flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start', alignSelf:'flex-start', flex:1}
})

export default ProfileHeader
