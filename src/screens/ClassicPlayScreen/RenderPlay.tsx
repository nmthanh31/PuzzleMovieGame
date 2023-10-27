import {useTheme} from '@rneui/themed';
import React, {SetStateAction, useEffect, useRef, useState} from 'react';
import {Dimensions, findNodeHandle, NativeModules} from 'react-native';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {positionProps, suggessProps} from '../../types';
const widthScreen = Dimensions.get('screen').width;
const RenderPlay = ({
  size,
  imageList,
  suggessStatus,
  index,
  value,
  suggessItem,
  suggess,
  suggessList,
  setPositions,
}: {
  size: number;
  imageList: SharedValue<string[]>;
  suggessStatus: boolean;
  index: number;
  value: suggessProps;
  suggessItem: any;
  suggess: suggessProps[];
  suggessList: SharedValue<suggessProps[]>;
  setPositions: any;
}) => {
  const {theme} = useTheme();
  const len = (widthScreen - 17 * 2 - 3 * (size - 1)) / size;
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: suggessStatus
            ? withSequence(
                withTiming(1, {
                  duration: 300,
                }),
                withTiming(1, {
                  duration: 500,
                }),
                withTiming(0),
              )
            : 0,
        },
      ],
    };
  });

  const aref = useRef(null);
  const doubleTapRef = React.createRef();
  const handleLayout = () => {
    if (aref.current) {
      aref.current.measure(
        (
          x: number,
          y: number,
          w: number,
          h: number,
          pageX: number,
          pageY: number,
        ) => {
          const truePath = value.value;
          // console.log(index, {w, h, pageX, pageY});

          setPositions((prevPositions: positionProps[]) => [
            ...prevPositions,
            {w, h, pageX, pageY, index, truePath},
          ]);
        },
      );
    }
  };
  const handleDoubleTap = () => {
    if (suggessList.value[index].chooseValue != '') {
      const newListImage = imageList.value;
      newListImage.push(suggessList.value[index].chooseValue);
      imageList.value = newListImage;
      const newArray = suggessList.value.map((item: suggessProps, idx: number) => {
        if (index != idx) return item;
        else return {chooseValue: '', value: item.value};
      });
      suggessList.value = newArray;
    }
  }

  return (
    <TapGestureHandler
      ref={doubleTapRef}
      numberOfTaps={2}
      onActivated={handleDoubleTap}>
      <Animated.View
        onLayout={e => {
          handleLayout();
        }}
        ref={aref}
        style={{
          width: len,
          height: len,
          backgroundColor: '#E7EEFF',
          borderTopStartRadius: index == 0 ? 20 : 0,
          borderTopEndRadius:
            size == 3 ? (index == 2 ? 20 : 0) : index == 3 ? 20 : 0,
          borderBottomStartRadius:
            size == 3 ? (index == 6 ? 20 : 0) : index == 12 ? 20 : 0,
          borderBottomEndRadius:
            size == 3 ? (index == 8 ? 20 : 0) : index == 15 ? 20 : 0,
          borderColor: theme.colors.lightBlue,
          overflow: 'hidden',
        }}>
        {suggessStatus == true && suggessItem == value.value ? (
          <Animated.Image
            source={{uri: suggessItem}}
            style={[
              animatedStyles,
              {
                width: len,
                height: len,
                backgroundColor: '#E7EEFF',
                borderTopLeftRadius: index == 0 ? 20 : 0,
                borderTopRightRadius:
                  size == 3 ? (index == 2 ? 20 : 0) : index == 3 ? 20 : 0,
                borderBottomLeftRadius:
                  size == 3 ? (index == 6 ? 20 : 0) : index == 12 ? 20 : 0,
                borderBottomRightRadius:
                  size == 3 ? (index == 8 ? 20 : 0) : index == 15 ? 20 : 0,
                borderColor: theme.colors.lightBlue,
                opacity: 0.2,
                transform: [{scale: 0}],
              },
            ]}
            resizeMode="stretch"></Animated.Image>
        ) : null}
        {suggess[index].chooseValue != '' ? (
          <Animated.Image
            source={{uri: suggess[index].chooseValue}}
            style={{width: '100%', height: '100%'}}
            resizeMode="stretch"></Animated.Image>
        ) : null}
      </Animated.View>
    </TapGestureHandler>
  );
};
export default RenderPlay;
