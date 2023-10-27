import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {makeStyles} from '@rneui/themed';
import TopNav from './TopNav';
import ControlCenter from './ControlCenter';
import {ScrollView, Vibration, View} from 'react-native';
import {splitImg} from '../../utils/splitImg';
import {Base_URL_GET_IMAGE} from '../../configs/env';
import {shuffle} from '../../utils/shuffle';
import ImgChoices from './ImgChoices';
import Loading from '../../components/Loading';
import Timing from './Timing';
import {imgProps, positionProps, suggessItemProps} from '../../types';
import Overlay from '../../components/Overlay';
import Success from '../../components/Success';
import ViewShot from 'react-native-view-shot';
import {PADDING} from '../../constants';
import Cell from './Cell';
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

const PlayExtendScreen = ({route, navigation}: any) => {
  const {image_path, media_type, id, isRinging} = route.params;

  const styles = useStyles();

  const [size, setSize] = useState<number>(3);
  const [imgList, setImgList] = useState<imgProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imgPath, setImgPath] = useState<string>('');
  const [suggess, setSuggess] = useState<suggessItemProps[]>([]);
  const [suggessStatus, setSuggessStatus] = useState<boolean>(false);
  const [suggessItem, setSuggessItem] = useState<string>('');
  const [positions, setPositions] = useState<positionProps[]>([]);
  const [isSuccess, setIsSuccess] = useState<null | boolean>(null);
  const [screenShot, setSreenShot] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [count, setCount] = useState<number>(1); // times suggest
  const [replay, setReplay] = useState(false);

  const imageList = useSharedValue<imgProps[]>([]);
  const pieceList = useSharedValue<suggessItemProps[]>([]);

  useEffect(() => {
    setImgPath(image_path);
  }, [image_path]);

  useEffect(() => {
    if (imgPath) {
      imageList.value = [];
      pieceList.value = [];
      setImgList([]);
      setIsLoading(true);
      setSuggess([]);
      setPositions([]);
      setIsSuccess(null);
      size === 3 ? setCount(1) : setCount(2);

      splitImg(`${Base_URL_GET_IMAGE}${imgPath}`, size).then(res => {
        let tmp: imgProps[] = [];
        res.map((arr: []) => arr.map((val: string) => tmp.push({uri: val})));

        const RenderPlay: suggessItemProps[] = tmp.map((value: imgProps) => {
          const chooseValue = '';
          return {correctValue: value, chooseValue};
        });

        pieceList.value = RenderPlay;
        setSuggess(RenderPlay);

        const list = shuffle(tmp);
        imageList.value = list;
        setImgList([...list]);

        setIsLoading(false);
      });
      return () => setImgList([]);
    }
  }, [imgPath, size, replay]);

  useEffect(() => {
    if (positions.length === size * size) {
      positions.sort((a: positionProps, b: positionProps) => a.index - b.index);
    }
  }, [positions]);

  const handleRing = () => {
    if (isRinging) {
      // notify('impactHeavy');
      Vibration.vibrate();
    }
  };

  useDerivedValue(() => {
    runOnJS(setImgList)(imageList.value);

    runOnJS(handleRing)();

    return imageList.value;
  }, [imageList.value]);

  useDerivedValue(() => {
    runOnJS(setSuggess)(pieceList.value);

    let cnt = 0;
    pieceList.value.filter((val: suggessItemProps) => {
      if (val.chooseValue === val.correctValue.uri) {
        cnt++;
      }
    });

    if (cnt === size * size) runOnJS(setIsSuccess)(true);
  }, [pieceList.value]);

  const viewShotRef = useRef();
  const captureScreen = async () => {
    try {
      const uri = await viewShotRef.current?.capture();
      setSreenShot(uri);
    } catch (error) {
      console.error('Lỗi khi chụp màn hình:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {suggessStatus && <Overlay />}

        <Success
          isSuccess={isSuccess}
          imagePath={imgPath}
          time={progress}
          screenShot={screenShot}
          isRinging={isRinging}
          setReplay={setReplay}
        />

        <ViewShot
          ref={viewShotRef}
          style={{backgroundColor: '#FFF'}}
          onLayout={() => {
            if (isSuccess == true) setTimeout(() => captureScreen(), 500);
          }}>
          <TopNav navigation={navigation} size={size} setSize={setSize} />
          <Timing
            imgPath={imgPath}
            size={size}
            isLoading={isLoading}
            isSuccess={isSuccess}
            setIsSuccess={setIsSuccess}
            progress={progress}
            setProgress={setProgress}
            replay={replay}
          />

          {/* Merge Images here  */}
          {
            <View style={styles.grid}>
              <View style={styles.row}>
                {suggess.map((value: suggessItemProps, index: number) => {
                  return (
                    <Cell
                      pieceList={pieceList}
                      imageList={imageList}
                      key={index}
                      index={index}
                      value={value}
                      size={size}
                      suggessStatus={suggessStatus}
                      suggessItem={suggessItem}
                      suggess={suggess}
                      setPositions={setPositions}
                    />
                  );
                })}
              </View>
            </View>
          }

          <ControlCenter
            imgPath={imgPath}
            setImgPath={setImgPath}
            media_type={media_type}
            id={id}
            suggess={suggess}
            count={count}
            setCount={setCount}
            setSuggessStatus={setSuggessStatus}
            setSuggessItem={setSuggessItem}
          />

          <ImgChoices
            pieceList={pieceList}
            imageList={imageList}
            imgList={imgList}
            positions={positions}
            isRinging={isRinging}
          />
        </ViewShot>

        {isLoading && <Loading />}
      </ScrollView>
    </SafeAreaView>
  );
};
const useStyles = makeStyles(theme => ({
  container: {flex: 1, backgroundColor: '#fff'},
  grid: {paddingHorizontal: PADDING},
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
}));
export default PlayExtendScreen;
