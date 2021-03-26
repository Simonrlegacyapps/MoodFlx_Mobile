import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  monotoneCubicInterpolation,
} from '@rainbow-me/animated-charts';
import React from 'react';
import {View, Text} from 'react-native';
import {dynamicSize} from '../../Constants/sizeChoose';

const BezierGraphAuto = ({data, color}) => {
  const points = monotoneCubicInterpolation({data, range: 30});

  return (
    <View>
      <ChartPathProvider
        data={{
          points,
          smoothingStrategy: 'bezier',
        }}>
        <ChartPath height={80} stroke={color} width={dynamicSize(250)} />
        <ChartDot
          style={{
            backgroundColor: color,
          }}
        />
      </ChartPathProvider>
    </View>
  );
};

export default BezierGraphAuto;
