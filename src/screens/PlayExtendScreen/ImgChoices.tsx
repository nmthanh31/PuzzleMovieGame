import {View, Image} from 'react-native';
import React from 'react';
import {makeStyles} from '@rneui/themed';
import {windowWidth} from '../../utils/dimension';
import {PADDING} from '../../constants';
import Animated, {
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import AniImage from './AniImage';
import {imgProps, positionProps, suggessItemProps} from '../../types';

const len = (windowWidth - 17 * 2 - 3 * 3) / 4;

type imgChoicesProps = {
  pieceList: SharedValue<suggessItemProps[]>;
  imageList: SharedValue<imgProps[]>;
  imgList: imgProps[];
  positions: positionProps[];
  isRinging: boolean;
};
const ImgChoices: React.FC<imgChoicesProps> = ({
  pieceList,
  imageList,
  imgList,
  positions,
  isRinging,
}) => {
  const styles = useStyles();

  const ref = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollOffset.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={ref}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        horizontal
        style={styles.scrollViewStyle}>
        {imgList.map((val: imgProps, idx) => (
          <View key={idx} style={styles.imgWrapper}>
            {/* <Image
              source={{uri: val.uri}}
              resizeMode="stretch"
              style={{width: '100%', height: '100%'}}
            /> */}
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.shadowList}>
        {imgList.map((value: imgProps, index: number) => (
          <AniImage
            pieceList={pieceList}
            imageList={imageList}
            key={index}
            scrollOffset={scrollOffset}
            value={value}
            index={index}
            positions={positions}
            isRinging={isRinging}
          />
        ))}
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    marginLeft: PADDING,
  },
  scrollViewStyle: {
    paddingTop: 31,
  },
  imgWrapper: {
    width: len,
    height: len,
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgDisable: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'black',
    opacity: 0.7,
  },
  shadowList: {
    position: 'absolute',
    left: 0,
    top: 0,
    flexDirection: 'row',
    marginTop: 31,
  },
}));

export default ImgChoices;
