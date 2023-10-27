import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {makeStyles} from '@rneui/themed';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Alarm from '../../assets/media/extend/Alarm.svg';
import {formatTime} from '../../utils/format';

import {PADDING} from '../../constants';
import {windowWidth} from '../../utils/dimension';

type countdownProps = {
  imgPath: string;
  size: number;
  isLoading: boolean;
  isSuccess: null | boolean;
  setIsSuccess: React.Dispatch<React.SetStateAction<null | boolean>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  replay:boolean;
};
const Timing: React.FC<countdownProps> = ({
  imgPath,
  size,
  isLoading,
  isSuccess,
  setIsSuccess,
  progress,
  setProgress,
  replay,
}) => {
  const styles = useStyles();

  const timeLimit = 90; //seconds
  const trackLength = windowWidth - PADDING * 2;
  const step = trackLength / timeLimit;
  const offSetX = useSharedValue(0);

  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(handleIncrease, 1000);
      if (isSuccess === true) {
        console.log('Game mode: Successful');
        clearInterval(interval);
      } else if (isSuccess === false) {
        console.log('Game mode: Failure');
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }
  }, [isLoading, isSuccess]);

  useEffect(() => {
    offSetX.value = 0;
    setProgress(0);
  }, [imgPath, size,replay]);

  useEffect(() => {
    if (progress === timeLimit) setIsSuccess(false);
  }, [progress]);

  const handleIncrease = () => {
    if (progress <= timeLimit) {
      offSetX.value += step;
      setProgress(prev => (prev += 1));
    }
  };

  const styleAnimated = useAnimatedStyle(() => {
    return {
      width: offSetX.value,
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Alarm />
        <Text style={[styles.text, isSuccess === false && {color: 'red'}]}>
          {formatTime(timeLimit - progress)}
        </Text>
      </View>
      <View style={styles.maxtrack}>
        <Animated.View style={[styles.mintrack, styleAnimated]}></Animated.View>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    paddingHorizontal: PADDING,
    gap: 17,
    paddingBottom: 31,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 13.15,
  },
  text: {
    color: theme.colors.darkBlue,
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
  },
  maxtrack: {
    height: 8,
    backgroundColor: '#B8BDC8',
  },
  mintrack: {
    backgroundColor: '#0AAE43',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
  },
}));
export default Timing;
