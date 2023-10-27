import {Image} from '@rneui/themed';
import React, {useState, useRef} from 'react';
import {PanResponder, Dimensions, Vibration} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {positionProps, suggessProps} from '../types';

const ImagePiece = ({
  imageList,
  suggessList,
  index,
  path,
  suggess,
  setSuggess,
  listImages,
  setListImages,
  positions,
  scrollOffset,
  isRinging
}: {
  imageList: SharedValue<string[]>;
  suggessList: SharedValue<suggessProps[]>;
  index: number;
  path: string;
  suggess: suggessProps[];
  setSuggess: any;
  listImages: string[];
  setListImages: any;
  positions: positionProps[];
  scrollOffset: SharedValue<number>;
  isRinging: boolean;
}) => {
  const pos = index;
  const widthScreen = Dimensions.get('screen').width;
  const len = (widthScreen - 17 * 2 - 3 * 3) / 4;
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({x: 0, y: 0});
  const id = useSharedValue<number>(-1);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x - scrollOffset.value},
        {translateY: offset.value.y},
        {scale: withSpring(isPressed.value ? 0.8 : 1)},
      ],
    };
  });
  const start = useSharedValue({x: 0, y: 0});
  const gesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onBegin(e => {
      isPressed.value = true;
    })
    .onUpdate(e => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(e => {
      let check = false;

      for (let index = 0; index < positions.length; index++) {
        if (
          e.absoluteY > positions[index].pageY &&
          e.absoluteY < positions[index].pageY + positions[index].h
        ) {
          if (
            e.absoluteX > positions[index].pageX &&
            e.absoluteX < positions[index].pageX + positions[index].w
          ) {
            offset.value = {
              x: positions[index].pageX,
              y: positions[index].pageY,
            };

            const tmp = imageList.value.filter((_, idx) => idx !== pos);
            if(suggessList.value[index].chooseValue != ""){
              tmp.push(suggessList.value[index].chooseValue)
            }
            imageList.value = tmp;
            console.log(suggessList.value);
            
            
            const tempt = suggessList.value.map((val: suggessProps, idx: number) =>{
              if(idx === index){
                console.log("92");
                
                return {value: val.value, chooseValue: path};
              }
              return val;
            });
            suggessList.value = tempt;
          }
        }
      }
      if (check == false) {
        offset.value = {
          x: 0,
          y: 0,
        };
      }

      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    })
    .onFinalize(e => {
      isPressed.value = false;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            // position: 'absolute',
            // top: 0,
            // left: (len + 10) * index,
            marginRight: 10,
            width: len,
            height: len,
            // backgroundColor: 'red',
            // opacity: 0.5,
          },
          animatedStyles,
        ]}>
        <Image
          source={{uri: path}}
          style={[
            {
              width: '100%',
              height: '100%',
            },
          ]}
          resizeMode="stretch"
        />
        {/* <Text style={{color: '#fff', fontSize: 20}}>{index}</Text> */}
      </Animated.View>
    </GestureDetector>
  );
};
export default ImagePiece;
