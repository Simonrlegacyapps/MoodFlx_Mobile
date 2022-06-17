import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../Constants/fonts/Fonts';
import {dynamicSize} from '../../Constants/sizeChoose';
import CustomProgressBar from '../ProgressBar/ProgressBarCustom';
import moment from 'moment';
import GraphBar from '../GraphBar/GraphBar';
import Colors from '../../Constants/Colors/Colors';
import { pollenValues } from '../../Constants/constants';

const BarGraph = ({
  ShowPollen,
  TopLabels,
  RightBar,
  color,
  sideLabels,
  width,
  barsWidth,
  BarsMarginLeft,
  rainPollenData,
  max,
  min,
}) => {
  const [Pollen, setPollen] = useState('Low');

  const interval = (max - min) / 4;

  // console.log(`max > 0 ? max : 20`, max, max > 0);

  const lines = sideLabels
    ? sideLabels
    : [
        {value: max > 0 ? Math.round(max) : 20, hours: 8}, // 35
        {value: max > 0 ? Math.round(interval * 3 + min) : 15, hours: 6}, // 27.5
        {value: max > 0 ? Math.round(interval * 2 + min) : 10, hours: 4}, // 20
        {value: max > 0 ? Math.round(interval * 1 + min) : 5, hours: 2}, //12.5
        {value: max > 0 ? Math.round(min) : 0, hours: 0}, //5
      ];

  const g = moment().subtract(0, 'days').startOf('day').format('dd');
  const f = moment().subtract(1, 'days').startOf('day').format('dd');
  const e = moment().subtract(2, 'days').startOf('day').format('dd');
  const d = moment().subtract(3, 'days').startOf('day').format('dd');
  const c = moment().subtract(4, 'days').startOf('day').format('dd');
  const b = moment().subtract(5, 'days').startOf('day').format('dd');
  const a = moment().subtract(6, 'days').startOf('day').format('dd');
  // console.log(`a`, a);

  const bars = [
    {label: a, value: 8, pollen: 'Low'},
    {label: b, value: 8, pollen: 'Normal'},
    {label: c, value: 6, pollen: 'High'},
    {label: d, value: 8, pollen: 'Normal'},
    {label: e, value: 5, pollen: 'Low'},
    {label: f, value: 6, pollen: 'Low'},
    {label: g, value: 7, pollen: 'High'},
  ];
  
  const totalValue = 8;
  const barHeight = 185;
  const barWidth = 8;

  // console.log(`rainPollenData`, rainPollenData);

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
        {TopLabels && (
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
                ºC
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
        )}
        <View style={{flex: 1}}>
          {lines &&
            lines.length > 0 &&
            lines.map((item, index) => {
              return (
                <View
                  key={String(index)}
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
                        color: Colors.greyColorCode,
                      }}>
                      {item.value}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      backgroundColor: 'green',
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        justifyContent: 'flex-end',
                        alignSelf: 'flex-end',
                        height: 1,
                        // marginRight: !RightBar && -20,
                        width: width
                          ? width
                          : !RightBar
                          ? dynamicSize(290)
                          : dynamicSize(250),
                        backgroundColor: '#B0B5B5',
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      alignSelf: 'center',
                    }}>
                    {RightBar && (
                      <Text
                        style={{
                          marginHorizontal: 6,
                          textAlign: 'center',
                          fontFamily: item.bold ? RubikMedium : RubikLight,
                          color: item.bold ? '#000' : Colors.greyColorCode,
                        }}>
                        {`${index === 0 ? '+' : ''}${item.hours}`}
                      </Text>
                    )}
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
            left: dynamicSize(0),
            width: barsWidth
              ? barsWidth
              : !RightBar
              ? dynamicSize(300)
              : dynamicSize(270),
            alignSelf: 'center',
            height: 260,
            marginTop: 5,
            marginLeft: BarsMarginLeft ? BarsMarginLeft : !RightBar ? 35 : 45,
          }}>
          {Array.isArray(rainPollenData) &&
            rainPollenData.length > 0 &&
            rainPollenData.map((item, index) => {
              return (
                <View
                  key={String(index)}
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <GraphBar
                    value={item.rainfall > 8 ? 8 : item.rainfall}
                    totalValue={totalValue}
                    height={barHeight}
                    width={barWidth}
                    color={color}
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
                        alignSelf: 'center',
                        position: 'absolute',
                        justifyContent: 'flex-end',
                        textAlignVertical: 'bottom',
                        bottom: -120,
                        // right: -8,
                        fontFamily: RubikRegular,
                        color: Colors.greyColorCode,
                      }}>
                      {item.label}
                    </Text>
                    {ShowPollen && (
                      <View
                        style={{
                          flex: 1,
                          alignSelf: 'center',
                          position: 'absolute',
                          // justifyContent: 'flex-end',
                          // textAlignVertical: 'bottom',
                          bottom: -140,
                          // right: -4,
                          height: 10,
                          borderWidth: item.pollen_type ? 1 : undefined,
                          borderRadius: 10,
                          borderColor: item.pollen_type ? '#0DDE7A' : undefined,
                          width: 10,
                          backgroundColor:
                          item.pollen_type ?
                            item.pollen_type === pollenValues[3].name
                              ? '#0DDE7A'
                              : item.pollen_type === pollenValues[1].name
                              ? '#fff'
                              : '#CDF8E3'
                              : 'transparent',
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
