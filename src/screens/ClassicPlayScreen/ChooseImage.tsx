import {View, Image} from 'react-native';
import React, {useEffect} from 'react';
import {makeStyles} from '@rneui/themed';
import {windowWidth} from '../../utils/dimension';
import {PADDING} from '../../constants';
import Animated, {
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import {positionProps, suggessProps} from '../../types';
import ImagePiece from '../../components/ImagePiece';

const len = (windowWidth - 17 * 2 - 3 * 3) / 4;

type ChooseImageProps = {
  imageList: SharedValue<string[]>;
  suggessList: SharedValue<suggessProps[]>;
  imgList: string[];
  setImgList: React.Dispatch<React.SetStateAction<string[]>>;
  suggess: suggessProps[];
  setSuggess: React.Dispatch<React.SetStateAction<suggessProps[]>>;
  positions: positionProps[];
  isRinging: boolean;
};
const ChooseImage: React.FC<ChooseImageProps> = ({
  imageList,
  suggessList,
  imgList,
  setImgList,
  suggess,
  setSuggess,
  positions,
  isRinging,
}) => {
  const styles = useStyles();

  const ref = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      // console.log(event.contentOffset.x);
      scrollOffset.value = event.contentOffset.x;
    },
  });


  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={ref}
        onScroll={scrollHandler}
        horizontal
        style={styles.scrollViewStyle}>
        {imgList.map((val: string, idx) => (
          <View key={idx} style={styles.imgWrapper}>
            <Image
              source={{uri: val}}
              resizeMode="stretch"
              style={{width: '100%', height: '100%'}}
            />
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.shadowList}>
        {/* {imgList.map((value: string, index: number) => ( */}
        {imgList.map((value: string, index: number) => (
          <ImagePiece
            imageList={imageList}
            suggessList={suggessList}
            key={index}
            path={value}
            index={index}
            suggess={suggess}
            listImages={imgList}
            setListImages={setImgList}
            setSuggess={setSuggess}
            positions={positions}
            scrollOffset={scrollOffset}
            isRinging={isRinging}></ImagePiece>
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
    transform: [
      {
        scale: 0,
      },
    ],
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

export default ChooseImage;
