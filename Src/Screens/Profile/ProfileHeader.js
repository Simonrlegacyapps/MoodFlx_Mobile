import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ProfilePlaceholder from '../../../assets/profileicons/ProfilePlaceholder'
import { dynamicSize } from '../../Constants/sizeChoose'
import DeviceInfo from 'react-native-device-info';
import { GetStaffUserData } from '../../apirequest/PostRequestApi'
import { UserDetail } from '../../redux/actions/actions'
import PickImageIcon from '../../../assets/profileicons/PickImageIcon'
import { RubikBlack, RubikLight, RubikMedium } from '../../Constants/fonts/Fonts'
import Constants from '../../Constants'
import EditProfile from '../../../assets/svg/editProfile'

const ProfileHeader = ({ navigation }) => {
    const UserData = useSelector((state) => state.First);

    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
            <View style={{ marginLeft: 5 }}>
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
                <Text style={styles.name}>{UserData?.UserDetails?.full_name ? UserData?.UserDetails?.full_name : "Please Add your name"}</Text>
            </View>
            <TouchableOpacity onPress={() => { navigation.navigate("ProfileTab") }} style={styles.edit}>
                <EditProfile />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 10,
        marginHorizontal: 15,
        borderBottomWidth: 0.5,
        borderColor: Constants.Colors.GrayColor
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
    nameTexts: { marginHorizontal: 15, marginVertical: 4, flex: 1 },
    since: { fontFamily: RubikLight, color: Constants.Colors.greyColorCode, fontSize: 12, },
    name: { fontFamily: RubikMedium, fontSize: 13, marginTop: 4 },
    edit: { justifyContent: 'flex-end', marginRight: 5 }
})

export default ProfileHeader
