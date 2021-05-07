import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {RubikLight, RubikRegular} from '../../Constants/fonts/Fonts';
import {dynamicSize} from '../../Constants/sizeChoose';
import CustomProgressBar from '../ProgressBar/ProgressBarCustom';
import moment from 'moment';

const BarGraph = ({ShowPollen}) => {
  const [Pollen, setPollen] = useState('Low');

  const lines = [
    {value: 15, hours: 8},
    {value: 10, hours: 6},
    {value: 5, hours: 4},
    {value: 0, hours: 2},
    {value: -5, hours: 0},
  ];

  const a = moment().subtract(0, 'days').startOf('day').format('dddd');
  const b = moment().subtract(1, 'days').startOf('day').format('dddd');
  const c = moment().subtract(2, 'days').startOf('day').format('dddd');
  const d = moment().subtract(3, 'days').startOf('day').format('dddd');
  const e = moment().subtract(4, 'days').startOf('day').format('dddd');
  const f = moment().subtract(5, 'days').startOf('day').format('dddd');
  const g = moment().subtract(6, 'days').startOf('day').format('dddd');
  // console.log(`a`, a);

  const bars = [
    {label: a.substr(0, 2), value: 6, pollen: 'Low'},
    {label: b.substr(0, 2), value: 8, pollen: 'Normal'},
    {label: c.substr(0, 2), value: 7, pollen: 'High'},
    {label: d.substr(0, 2), value: 12, pollen: 'Normal'},
    {label: e.substr(0, 2), value: 5, pollen: 'Low'},
    {label: f.substr(0, 2), value: 6, pollen: 'Low'},
    {label: g.substr(0, 2), value: 7, pollen: 'High'},
  ];

  const totalValue = 12;
  const barHeight = 180;
  const barWidth = 8;

  return (
    <View
      style={{
        height: 300,
        width: dynamicSize(350),
        alignSelf: 'center',
      }}>
      {/* <Text>Look Bar</Text> */}
      {/* Left bar */}
      <View style={{flexDirection: 'column', height: 250}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: dynamicSize(15),
          }}>
          <View
            style={{
              flexDirection: 'column',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                marginHorizontal: 6,
                textAlign: 'center',
                fontFamily: RubikRegular,
                fontSize: 16,
              }}>
              Cº
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              //   flex: 1,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                marginHorizontal: 6,
                textAlign: 'center',
                fontFamily: RubikRegular,
              }}>
              Hrs
            </Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          {lines &&
            lines.length > 0 &&
            lines.map((item, index) => {
              return (
                <View
                  key={`${index}`}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        marginHorizontal: 6,
                        textAlign: 'center',
                        fontFamily: RubikLight,
                        color: '#9C9EB9',
                      }}>
                      {item.value}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      //   flex: 1,
                      backgroundColor: 'green',
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        justifyContent: 'flex-end',
                        alignSelf: 'flex-end',
                        height: 1,
                        width: dynamicSize(250),
                        backgroundColor: '#B0B5B5',
                        // marginTop: 10,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        marginHorizontal: 6,
                        textAlign: 'center',
                        fontFamily: RubikLight,
                        color: '#9C9EB9',
                      }}>
                      {item.hours}
                    </Text>
                  </View>
                </View>
              );
            })}
          {/* <View
            style={{
              flex: 1,
              paddingBottom: 100,
              justifyContent: 'flex-end',
              position: 'absolute',
              height: '100%',
              //   width: '100%',
              //   backgroundColor: 'green',
            }}>
                <View>
            <CustomProgressBar
              value={10}
              totalValue={20}
              height={180}
              width={6}
            />
            <Text style={{position: 'absolute'}}>Hi</Text>
          </View> */}
        </View>
        {/* Graph */}
        {/* RightBar */}
        <View
          style={{
            position: 'absolute',
            // backgroundColor: 'green',
            flexDirection: 'row',
            width: dynamicSize(270),
            alignSelf: 'center',
            height: 260,
            marginTop: 20,
          }}>
          {bars &&
            bars.length > 0 &&
            bars.map((item, index) => {
              return (
                <View
                  key={`${index}`}
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <CustomProgressBar
                    value={item.value}
                    totalValue={totalValue}
                    height={barHeight}
                    width={barWidth}
                    color={'#5E4ADC'}
                  />
                  <View
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'flex-end',
                      // flex: 1,
                      position: 'relative',
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        alignSelf: 'flex-end',
                        position: 'absolute',
                        justifyContent: 'flex-end',
                        textAlignVertical: 'bottom',
                        bottom: -40,
                        right: -8,
                        fontFamily: RubikRegular,
                        color: '#9C9EB9',
                      }}>
                      {item.label}
                    </Text>
                    {ShowPollen && (
                      <View
                        style={{
                          flex: 1,
                          // alignSelf: 'flex-end',
                          position: 'absolute',
                          // justifyContent: 'flex-end',
                          // textAlignVertical: 'bottom',
                          bottom: -60,
                          right: -4,
                          height: 10,
                          borderWidth: 1,
                          borderRadius: 10,
                          borderColor: '#0DDE7A',
                          width: 10,
                          backgroundColor:
                            item.pollen === 'Normal'
                              ? '#0DDE7A'
                              : item.pollen === 'Low'
                              ? '#fff'
                              : '#CDF8E3',
                        }}
                      />
                    )}
                  </View>
                </View>
              );
            })}
          {/* <Text>Hello</Text>
          <Text>Hello</Text> */}
        </View>
      </View>
    </View>
  );
};

export default BarGraph;
