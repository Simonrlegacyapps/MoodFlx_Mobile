import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Constants from '../../Constants';
import {RubikLight, RubikRegular} from '../../Constants/fonts/Fonts';

const HomeHeader = ({click, value}) => {
  return (
    <View style={styles.HeaderView}>
      <TouchableOpacity
        disabled={true}
        onPress={async () => {
          //   CheckForWeather();
        }}
        style={{
          flexDirection: 'row',
        }}>
        {/* <View style={styles.syncButtonView}>
                  <Image
                    style={{height: 20, width: 20}}
                    source={Constants.Images.Sync}
                  />
                </View> */}
        <View style={{alignContent: 'center', paddingHorizontal: 15}}>
          {/* <Text style={styles.lightText}>Sync your</Text> */}
          <Text style={styles.normalText}>History</Text>
        </View>
      </TouchableOpacity>
      {
        click && (
          <TouchableOpacity onPress={click}
            style={[
              styles.ColoredView,
              { flexDirection: 'row', alignItems: 'center' },
            ]}>
            <Text style={styles.ColoredText}>{value}</Text>
            <Image
              resizeMode={'contain'}
              style={{ height: 12, width: 12, marginHorizontal: 5 }}
              source={Constants.Images.dropDownTwo}
            />
          </TouchableOpacity>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  ColoredView: {
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    backgroundColor: '#DED6FE',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  HeaderView: {
    height: 80,
    paddingTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  syncButtonView: {
    height: 40,
    width: 40,
    backgroundColor: '#DED6FE',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightText: {
    fontSize: 13,
    color: '#8A8BAB',
    fontFamily: RubikLight,
    lineHeight: 12,
    marginVertical: 5,
  },
  normalText: {
    fontSize: 20,
    // lineHeight: 16,
    textAlignVertical: 'center',
    justifyContent: 'center',
    marginTop: 5,
    fontFamily: RubikRegular,
  },
  ColoredText: {
    fontSize: 16,
    color: '#5947D0',
  },
});

export default HomeHeader;
