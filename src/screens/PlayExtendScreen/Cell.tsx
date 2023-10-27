import React, {useRef} from 'react';
import {Image} from 'react-native';
import {makeStyles} from '@rneui/themed';
import {windowWidth} from '../../utils/dimension';
import {imgProps, positionProps, suggessItemProps} from '../../types';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type cellProps = {
  pieceList: SharedValue<suggessItemProps[]>;
  imageList: SharedValue<imgProps[]>;
  index: number;
  value: suggessItemProps;
  size: number;
  suggessStatus: boolean;
  suggessItem: string;
  suggess: suggessItemProps[];
  setPositions: React.Dispatch<React.SetStateAction<positionProps[]>>;
};
const Cell: React.FC<cellProps> = ({
  pieceList,
  imageList,
  index,
  value,
  size,
  suggessStatus,
  suggessItem,
  suggess,
  setPositions,
}) => {
  const styles = useStyles();

  const len = (windowWidth - 17 * 2 - 3 * (size - 1)) / size;

  const aref = useRef<Animated.View>(null);
  const doubleTapRef = React.createRef();

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
          const truePath = value.correctValue.uri;

          setPositions((prevPositions: positionProps[]) => [
            ...prevPositions,
            {w, h, pageX, pageY, index, truePath},
          ]);
        },
      );
    }
  };

  const handleDoubleTap = () => {
    if (pieceList.value[index].chooseValue != '') {
      const tmp = imageList.value;
      tmp.push({uri: pieceList.value[index].chooseValue});
      imageList.value = tmp;

      const spot = pieceList.value.map((val: suggessItemProps, idx: number) => {
        return idx === index
          ? {correctValue: val.correctValue, chooseValue: ''}
          : val;
      });

      pieceList.value = spot;
    }
  };

  return (
    <TapGestureHandler
      ref={doubleTapRef}
      numberOfTaps={2}
      onActivated={handleDoubleTap}>
      <Animated.View
        ref={aref}
        onLayout={e => {
          handleLayout();
        }}
        style={[
          styles.col,
          {height: len, width: len},
          index === 0 && {borderTopLeftRadius: 20},
          index === size - 1 && {borderTopRightRadius: 20},
          index === suggess.length - 1 && {borderBottomRightRadius: 20},
          index === suggess.length - size && {
            borderBottomLeftRadius: 20,
          },
        ]}>
        {suggessStatus && suggessItem === value.correctValue.uri && (
          <Animated.Image
            source={{uri: suggessItem}}
            style={[
              animatedStyles,
              {width: '100%', height: '100%', opacity: 0.5},
            ]}
            resizeMode="stretch"></Animated.Image>
        )}
        {suggess[index].chooseValue != '' && (
          <Image
            source={{uri: suggess[index].chooseValue}}
            resizeMode="stretch"
            style={{width: '100%', height: '100%'}}
          />
        )}
      </Animated.View>
    </TapGestureHandler>
  );
};

const useStyles = makeStyles(theme => ({
  col: {
    backgroundColor: theme.colors.shadeBlue,
    overflow: 'hidden',
  },
}));

export default Cell;
