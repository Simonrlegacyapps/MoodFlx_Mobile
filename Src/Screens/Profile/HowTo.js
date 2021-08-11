import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import BigRing from '../../../assets/svg/BigRing';
import Rings from '../../../assets/svg/rings';
import {RubikLight, RubikMedium, RubikRegular} from '../../Constants/fonts/Fonts';
import { dynamicSize } from '../../Constants/sizeChoose';

const BoldHeader = ({label}) => {
  return (
    <View style={{marginVertical: 15}}>
      <Text style={{fontFamily: RubikMedium, color:"##2D3142", fontSize:18}}>{label}</Text>
    </View>
  );
};

const SimpleText = ({label, text, mt}) => {
  return (
    <View style={{flexDirection: 'row', marginTop:mt?mt:0}}>
      <Text
        style={{
          flex: 1,
          marginTop: 5,
          fontFamily: RubikRegular,
          color: '#2D3142',
          fontSize:15
        }}>
        {label}
      </Text>
      <Text style={{marginTop: 5, color: '#FB8D09', marginBottom:14}}><Rings w={14} h={14}/>{text}</Text>
    </View>
  );
};

const HowTo = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        height: '100%',
        width: '100%',
        paddingBottom: 100,
        backgroundColor: 'white',
      }}>
      <View style={{alignItems: 'center', marginTop:30}}>
        <BigRing />
      </View>
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'white',
          paddingHorizontal: 10,
          paddingLeft: 20,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: RubikMedium,
            marginVertical: 10,
            fontSize: 21,
          }}>
          Earn Flo Coins!
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: RubikLight,
            marginVertical: 10,
            fontSize: 17,
            paddingHorizontal:10,
            color:"#4C5980"
          }}>
          Advance your Mood Status, unlock more rewards and cash in your Flo Coins!
        </Text>
<View>
        <BoldHeader label={'Mood inputs'} />
        <SimpleText label={'Per Mood'} text={' 3 coins'} />
        <View style={{height:0.6, width:'100%', backgroundColor:'#ebebeb'}}/>
        <SimpleText label={'3+ moods/day'} text={' 1 bonus Coin'} mt={12} />
        <Text style={{fontSize:10, fontFamily:RubikLight, color:'#9C9EB9', }}>Recommended</Text>
        <Text style={{fontFamily:RubikRegular, fontSize:12, color:'#7265E3', marginVertical:10}}>6-HOUR INTERVALS</Text>
        <View style={{flexDirection:'row'}}>
            <View>
            <Text style={styles.hours}>12:00 AM - 6:00 AM</Text>
            <Text style={styles.hours}>6:00 AM - 12:00 PM</Text>
            <Text style={styles.hours}>12:00 PM - 6:00 PM</Text>
            <Text style={styles.hours}>6:00 PM - 12:00 AM</Text>
            </View>
            <View style={{ width:dynamicSize(180), paddingHorizontal:10, marginLeft:dynamicSize(25),  justifyContent:'center', borderLeftWidth:0.4, borderColor:'#F5F5F5'}}>
                <Text style={[styles.text, {marginBottom:10}]}>2 notes per interval</Text>
                <Text style={styles.text}>earn coins if there is a 2 hour gap between each note</Text>
            </View>
        </View>
        </View>
<View>
        <BoldHeader label={'Mood Journaling'} />
        <SimpleText label={'Per Mood'} text={' 3 coins'} />
        <View style={{height:0.6, width:'100%', backgroundColor:'#ebebeb'}}/>
        <SimpleText label={'3+ moods/day'} text={' 1 bonus Coin'} mt={12} />
        <Text style={{fontSize:10, fontFamily:RubikLight, color:'#9C9EB9', }}>Recommended</Text>
        <Text style={{fontFamily:RubikRegular, fontSize:12, color:'#7265E3', marginVertical:10}}>6-HOUR INTERVALS</Text>
        <View style={{flexDirection:'row'}}>
            <View>
            <Text style={styles.hours}>12:00 AM - 6:00 AM</Text>
            <Text style={styles.hours}>6:00 AM - 12:00 PM</Text>
            <Text style={styles.hours}>12:00 PM - 6:00 PM</Text>
            <Text style={styles.hours}>6:00 PM - 12:00 AM</Text>
            </View>
            <View style={{ width:dynamicSize(180), paddingHorizontal:10, paddingLeft:14, marginLeft:dynamicSize(25),  justifyContent:'center', borderLeftWidth:0.4, borderColor:'#F5F5F5'}}>
                <Text style={[styles.text, {marginBottom:10,letterSpacing:0.7}]}>2 notes per interval</Text>
                <Text style={[styles.text, {letterSpacing:0.7}]}>earn coins if there is a 2 hour gap between each note</Text>
            </View>
        </View>
        </View>
      </View>
      <View style={{marginBottom: 120}} />
    </ScrollView>
  );
};

const styles=StyleSheet.create({
    hours:{
        color:"#4C5980",
        fontSize:13,
        margin:8,
        marginLeft:0
    },
    text:{
        fontSize:12,
        color:"#4C5980"
    }
})

export default HowTo;
