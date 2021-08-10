import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Anonimity from '../../../assets/svg/Anonimity';
import Rewards from '../../../assets/svg/rewards';
import Science from '../../../assets/svg/science';
import {RubikRegular} from '../../Constants/fonts/Fonts';
import {dynamicSize} from '../../Constants/sizeChoose';

const ProgressScreens = () => {
  const [number, setnumber] = useState(0);
  return (
    <View>
      <ImageBackground
        source={require('../../../assets/newImage/WalkThrough/Onboarding.png')}
        style={{height: '100%', width: '100%'}}>
        <SafeAreaView>
          <View style={styles.Container}>
            <View
              style={{
                height: dynamicSize(160),
                backgroundColor: 'white',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: RubikRegular,
                  color:
                    number <= 2
                      ? '#7265E3'
                      : number === 3
                      ? '#3FD7C8'
                      : '#EE64DB',
                }}>
                Anonymity
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 22,
                  marginTop:35,
                  justifyContent: 'space-around',
                  width: '100%',
                }}>
                <Anonimity color={number <= 2 ? '#7265E3' : '#9C9EB9'} />
                <Science color={number === 3 ? '#3FD7C8' : '#9C9EB9'} />
                <Rewards color={number === 4 ? '#EE64DB' : '#9C9EB9'} />
              </View>
            </View>
            <View
              style={styles.bottomButtons}>
              <TouchableOpacity style={{flex: 1}}>
                <Text
                  style={styles.skip}>
                  Skip >>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{number <= 3 ? setnumber(number+1): navigation.navigate("ProgressScreens")}}
                style={{backgroundColor: '#7265E3', borderRadius: 7}}>
                <Text
                  style={styles.next}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {alignItems: 'center', height: '100%', width: '100%'},
  next:{
    color: 'white',
    fontFamily: RubikRegular,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 17,
  },
  skip:{
    color: 'white',
    fontFamily: RubikRegular,
    fontSize: 16,
  },
  bottomButtons:{
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});

export default ProgressScreens;
