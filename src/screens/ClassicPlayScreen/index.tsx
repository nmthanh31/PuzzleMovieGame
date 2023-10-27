import {Text} from '@rneui/themed';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Vibration
} from 'react-native';
import {Base_URL_GET_IMAGE} from '../../configs/env';
import HomeSVG from '../../assets/media/Home.svg';
import LightSVG from '../../assets/media/Light.svg';
import ShuffleSVG from '../../assets/media/Shuffle.svg';
import {splitImg} from '../../utils/splitImg';
import ImagePiece from '../../components/ImagePiece';
import Challenge from '../../components/Challenge';
import {handleShuffle} from '../../utils/shuffle';
import Animated, {runOnJS, useDerivedValue, useSharedValue} from 'react-native-reanimated';
import Loading from '../../components/Loading';
import RenderPlay from './RenderPlay';
import {positionProps, suggessProps} from '../../types';
import Overlay from '../../components/Overlay';
import Success from '../../components/Success';
import ViewShot from 'react-native-view-shot';
import ChooseImage from './ChooseImage';

const widthScreen = Dimensions.get('screen').width;
const ClassicPlayScreen = ({route, navigation}: any) => {
  const [size, setSize] = useState(3);
  const {image_path, media_type, id, isRinging} = route.params;
  const [suggess, setSuggess] = useState<suggessProps[]>([]);
  const [suggessStatus, setSuggessStatus] = useState<boolean>(false);
  const [suggessItem, setSuggessItem] = useState<string>('');
  const [listImages, setListImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [positions, setPositions] = useState<positionProps[]>([]);
  const [imagePath, setImagePath] = useState(image_path);
  const [screenShot, setSreenShot] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<null | boolean>(null);
  const [count, setCount] = useState<number>(0);

  const imageList = useSharedValue<string[]>([]);
  const suggessList = useSharedValue<suggessProps[]>([]);

  useEffect(() => {
    setImagePath(image_path);
  }, [image_path]);
  useEffect(() => {
    if(imagePath){
      imageList.value = [];
      suggessList.value = [];
      splitImg(`${Base_URL_GET_IMAGE}${imagePath}`, size).then(res => {
        let tmp: string[] = [];
        setSuggess([]);
        res.map(arr => arr.map((val: string) => tmp.push(val)));
        const RenderPlay: suggessProps[] = tmp.map((value: string) => {
          const chooseValue = '';
          return {value, chooseValue};
        });
        setPositions([]);

        suggessList.value = RenderPlay;
        setSuggess(RenderPlay);

        // setLoading(true);

        setListImages(tmp.sort(() => Math.random() - 0.5));
        imageList.value = tmp.sort(() => Math.random() - 0.5);
        setSreenShot('');
        setIsSuccess(null);
        setLoading(false);
        size === 3 ? setCount(1) : setCount(2);
        
      });
      return () => setListImages([]);
    }
  }, [imagePath, size]);

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
  useDerivedValue(()=>{
    runOnJS(setListImages)(imageList.value);

    runOnJS(handleRing)();
    return imageList.value;
  },[imageList.value])

  useDerivedValue(()=>{
    runOnJS(setSuggess)(suggessList.value);
    let cnt = 0;
    suggessList.value.filter((val: suggessProps) => {
      if (val.chooseValue === val.value) {
        cnt++;
      }
    });

    if (cnt === size * size) runOnJS(setIsSuccess)(true);
  },[suggessList.value])
  const viewShotRef = createRef();
  const captureScreen = async () => {
    try {
      console.log('Line82');
      const uri = await viewShotRef.current?.capture();
      console.log(uri);

      setSreenShot(uri);
    } catch (error) {
      console.error('Lỗi khi chụp màn hình:', error);
    }
  };
  useEffect(() => {
    if (isSuccess === true) setTimeout(() => captureScreen(), 700);
  }, [isSuccess]);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      {suggessStatus && <Overlay />}
      <Success
        isSuccess={isSuccess}
        imagePath={imagePath}
        time={null}
        screenShot={screenShot}
        isRinging={isRinging}
      />
      <ViewShot
        ref={viewShotRef}
        style={{backgroundColor: '#FFF', flex: 1}}
        // onLayout={() => {
        //   console.log({isSuccess});
        //   if (isSuccess === true) setTimeout(() => captureScreen(), 500);
        // }}
      >
        {/* Nav  */}
        <View style={[style.top]}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <HomeSVG></HomeSVG>
          </TouchableOpacity>
          <Challenge size={size} setSize={setSize}></Challenge>
        </View>

        {/* Cells  */}

        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 3,
          }}>
          <View style={style.containerPlay}>
            {suggess.map((value, index) => {
              return (
                <RenderPlay
                  key={index}
                  size={size}
                  imageList={imageList}
                  suggessStatus={suggessStatus}
                  index={index}
                  value={value}
                  suggessItem={suggessItem}
                  suggess={suggess}
                  suggessList={suggessList}
                  setPositions={setPositions}></RenderPlay>
              );
            })}
          </View>
        </View>

        {/* Action  */}
        <View style={[style.action]}>
          <TouchableOpacity
            style={style.btnSuggess}
            onPress={() => {
              if (count > 0) {
                suggess.map((item: suggessProps) => {
                  if (item.chooseValue == '') {
                    setSuggessStatus(true);
                    setSuggessItem(item.value);
                    setTimeout(() => {
                      setSuggessStatus(false);
                    }, 1000);
                    setCount(count - 1);
                  }
                });
              }
            }}>
            <LightSVG></LightSVG>
            <Text
              style={{
                color: '#FFF',
                fontSize: 14,
                fontWeight: '700',
                fontFamily: 'Quicksand-Bold',
                marginLeft: 5,
              }}>
              Suggess
            </Text>
          </TouchableOpacity>
          <Image
            style={{
              width: 69,
              height: 69,
              borderRadius: 8,
            }}
            source={{uri: `${Base_URL_GET_IMAGE}${imagePath}`}}
            resizeMode="contain"></Image>
          <TouchableOpacity
            style={style.btnShuffle}
            onPress={async () => {
              setImagePath(await handleShuffle(id, media_type));
            }}>
            <ShuffleSVG></ShuffleSVG>
            <Text
              style={{
                color: '#FFF',
                fontSize: 14,
                fontWeight: '700',
                fontFamily: 'Quicksand',
                marginLeft: 8,
              }}>
              Shuffle
            </Text>
          </TouchableOpacity>
        </View>

        {/* Choose Image  */}
        <ChooseImage
          imageList={imageList}
          suggessList={suggessList}
          imgList={listImages}
          setImgList={setListImages}
          suggess={suggess}
          setSuggess={setSuggess}
          positions={positions}
          isRinging={isRinging}></ChooseImage>
      </ViewShot>
      {loading&& <Loading></Loading>}
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  top: {
    flexDirection: 'row',
    padding: 17,
    justifyContent: 'space-between',
    flex: 0.5,
  },
  containerPlay: {
    width: widthScreen - 17 * 2,
    height: widthScreen - 17 * 2,
    // marginTop: 84,
    borderRadius: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  Image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  btnSuggess: {
    flexDirection: 'row',
    backgroundColor: '#FFB910',
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 5,
  },
  btnShuffle: {
    flexDirection: 'row',
    backgroundColor: '#8044B2',
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 5,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 17,
    flex: 0.5,
  },
});
export default ClassicPlayScreen;
