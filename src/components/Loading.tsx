import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {useTheme} from '@rneui/themed';

const Loading = () => {
  const {theme} = useTheme();
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator color={theme.colors.lightBlue} size={50}/>
    </View>
  );
};

export default Loading;
