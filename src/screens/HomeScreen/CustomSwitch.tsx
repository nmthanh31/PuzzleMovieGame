import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';

const CustomSwitch = ({state, handleState}: any) => {
  const animatedValue = useState(new Animated.Value(state ? 1 : 0))[0];

  const handleToggleSwitch = () => {
    const toValue = state ? 0 : 1;
    Animated.timing(animatedValue, {
      toValue: toValue,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();

    handleState();
  };

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fff', '#fff'],
  });

  const transformTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 21],
  });

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleToggleSwitch}>
      <View
        style={[
          styles.track,
          {backgroundColor: state ? '#1C36B1' : '#8C8F9E'},
        ]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: backgroundColor,
              transform: [{translateX: transformTranslateX}],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 40,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#1C36B1',
    justifyContent: 'center',
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 2.5,
  },
});

export default CustomSwitch;
