import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Dimensions } from 'react-native'
import { useSelector } from 'react-redux';
import Constants from '../../Constants';
import { RubikLight, RubikRegular } from '../../Constants/fonts/Fonts';
import { dynamicSize, getFontSize } from '../../Constants/sizeChoose';
import CrownBox from '../crownBox/crownBox';
import DeviceInfo from 'react-native-device-info';


const {height} = Dimensions.get("screen")

const HomeSyncHeader = ({
  setOpenActionSheet,
  setAnonymousClick,
  label,
  isPermissionGiven,
  syncText,
}) => {
  const UserData = useSelector((state) => state.First);
  let headerSyncText = isPermissionGiven ? 'Syncing your' : 'Sync your';
  if (isPermissionGiven && typeof syncText === 'string' && syncText) {
    headerSyncText = syncText;
  }
  if (syncText) {
    headerSyncText = syncText;
  }

    return (
        <View style={styles.HeaderView}>
          <TouchableOpacity
            onPress={async () => {
              setOpenActionSheet(true);
            }}
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.syncButtonView}>
              <Image
                style={{ height: 20, width: 20 }}
                source={Constants.Images.Sync}
              />
            </View>
            <View style={{ alignContent: 'center', paddingHorizontal: 15 }}>
              <Text allowFontScaling={false} style={styles.lightText}>
                {headerSyncText}
              </Text>
              <Text allowFontScaling={false} style={styles.normalText}>{label}</Text>
            </View>
          </TouchableOpacity>
          <CrownBox floCoins={UserData.floCoins}/>
          <TouchableOpacity
            onPress={() => setAnonymousClick(true)}
            style={styles.ColoredView}>
            <Text allowFontScaling={false} style={styles.ColoredText}>Anon</Text>
          </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    HeaderView: {
        height: 80,
        // paddingTop: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems:'center',
        // backgroundColor:'red'
        
      },
      syncButtonView: {
        height: 40,
        width: 40,
        backgroundColor: '#DED6FE',
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
      },
      ColoredView: {
        // height: dynamicSize(40),
        marginHorizontal: dynamicSize(10),
        paddingHorizontal: dynamicSize(20),
        backgroundColor: '#DED6FE',
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
      },
      ColoredText: {
        fontSize: dynamicSize(16),
        color: '#5947D0',
        marginVertical:8
      },
      lightText: {
        fontSize: dynamicSize(14),
        color: '#8A8BAB',
        fontFamily: RubikLight,
        // lineHeight: 12,
        // marginVertical: 5,
      },
      normalText: {
        fontSize: dynamicSize(16),
        marginTop: dynamicSize(4),
        // lineHeight: 16,
        fontFamily: RubikRegular,
      }
})

export default HomeSyncHeader
