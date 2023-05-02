import React, {memo} from 'react';
import {View, Text} from 'react-native';
import ProgressBar from '../../Components/ProgressBar/ProgressBarCustom';
import Colors from '../../Constants/Colors/Colors';

function ProgressDay({label, color, label2}) {
    return(
      <View
          style={{
            width: '50%',
            justifyContent: 'center',
            alignSelf: 'center',
            marginVertical: 5,
            height: 40,
          }}>
          <Text style={{fontSize: 16, color: Colors.blackColorCode, position: 'absolute', left: -30}}>{label}</Text>
          <ProgressBar
            dot1={true}
            dot2={true}
            dot3={true}
            dot4={true}
            progress={((label2 > 3 ? 3 : label2)/3)*100}
            MoodCount={2}
            height={8}
            backgroundColor={color}
          />
          <Text style={{fontSize: 16, color: Colors.blackColorCode, position: 'absolute', right: -40}}>
            {label2}/3
          </Text>
        </View>
    )
}

export default memo(ProgressDay);
