import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {windowWidth} from '../../utils/dimension';
import React from 'react';
import {Image} from 'react-native';
import {imgProps, positionProps, suggessItemProps} from '../../types';

type aniImageProps = {
  pieceList: SharedValue<suggessItemProps[]>;
  imageList: SharedValue<imgProps[]>;
  scrollOffset: SharedValue<number>;
  value: imgProps;
  index: number;
  positions: positionProps[];
  isRinging: boolean;
};
const AniImage: React.FC<aniImageProps> = ({
  pieceList,
  imageList,
  scrollOffset,
  value,
  index,
  positions,
}) => {
  const pos = index;
  const len = (windowWidth - 17 * 2 - 3 * 3) / 4;

  const start = useSharedValue({x: 0, y: 0});
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({x: 0, y: 0});

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x - scrollOffset.value},
        {translateY: offset.value.y},
        {scale: withSpring(isPressed.value ? 1 : 1)},
      ],
    };
  });

  const gesture = Gesture.Pan()
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
      for (let i = 0; i < positions.length; i++) {
        if (
          e.absoluteY > positions[i].pageY &&
          e.absoluteY < positions[i].pageY + positions[i].h
        ) {
          if (
            e.absoluteX > positions[i].pageX &&
            e.absoluteX < positions[i].pageX + positions[i].w
          ) {
            offset.value = {
              x: positions[i].pageX,
              y: positions[i].pageY,
            };

            const tmp = imageList.value.filter((_, idx) => idx !== pos);
            if (pieceList.value[i].chooseValue !== '') {
              tmp.push({uri: pieceList.value[i].chooseValue});
            }
            imageList.value = tmp;

            const spot = pieceList.value.map(
              (val: suggessItemProps, idx: number) => {
                return idx === i
                  ? {correctValue: val.correctValue, chooseValue: value.uri}
                  : val;
              },
            );

            pieceList.value = spot;
          }
        }
      }
    })
    .onFinalize(() => {
      isPressed.value = false;
      offset.value = {
        x: 0,
        y: 0,
      };

      start.value = {
        x: 0,
        y: 0,
      };
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            marginRight: 10,
            width: len,
            height: len,
          },
          animatedStyles,
        ]}>
        <Image
          source={{uri: value.uri}}
          style={[
            {
              width: '100%',
              height: '100%',
            },
          ]}
          resizeMode="stretch"
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default AniImage;
