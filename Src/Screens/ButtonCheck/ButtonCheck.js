import React from 'react';
import {View, Text, Button} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const ButtonCheck = () => {
  return (
    <View>
      <Button
        onPress={() =>
          ReactNativeHapticFeedback.trigger('notificationSuccess', options)
        }
        title={'Notification success'}
      />
      <Button
        onPress={() => ReactNativeHapticFeedback.trigger('selection', options)}
        title={'selection'}
      />
      <Button
        onPress={() =>
          ReactNativeHapticFeedback.trigger('impactLight', options)
        }
        title={'impactLight'}
      />
      <Button
        onPress={() =>
          ReactNativeHapticFeedback.trigger('impactHeavy', options)
        }
        title={'impactHeavy'}
      />
      <Button
        onPress={() =>
          ReactNativeHapticFeedback.trigger('notificationWarning', options)
        }
        title={'notificationWarning'}
      />
      <Button
        onPress={() =>
          ReactNativeHapticFeedback.trigger('notificationError', options)
        }
        title={'notificationError'}
      />
      <Button
        onPress={() => ReactNativeHapticFeedback.trigger('clockTick', options)}
        title={'clockTick'}
      />
    </View>
  );
};

export default ButtonCheck;
