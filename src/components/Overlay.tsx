import React from 'react';
import {View} from 'react-native';

const Overlay = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        // backgroundColor: 'red',
        // opacity: 0.5,
        backgroundColor: 'transparent',
        zIndex: 100,
      }}></View>
  );
};
export default Overlay;
