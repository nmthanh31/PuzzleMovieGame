import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {makeStyles} from '@rneui/themed';
import Suggess from '../../assets/media/extend/Suggess.svg';
import Shuffle from '../../assets/media/extend/Shuffle.svg';
import {Base_URL_GET_IMAGE} from '../../configs/env';
import {PADDING} from '../../constants';
import {handleShuffle} from '../../utils/shuffle';
import {suggessItemProps} from '../../types';

type controlCenterProps = {
  imgPath: string;
  setImgPath: React.Dispatch<React.SetStateAction<string>>;
  media_type: string;
  id: string;
  suggess: suggessItemProps[];
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  setSuggessStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setSuggessItem: React.Dispatch<React.SetStateAction<string>>;
};
const ControlCenter: React.FC<controlCenterProps> = ({
  imgPath,
  setImgPath,
  media_type,
  id,
  suggess,
  count,
  setCount,
  setSuggessStatus,
  setSuggessItem,
}) => {
  const styles = useStyles();

  const handleSuggest = () => {
    if (count > 0) {
      suggess.map((item: suggessItemProps) => {
        if (item.chooseValue == '') {
          setSuggessStatus(true);
          setSuggessItem(item.correctValue.uri);
          setTimeout(() => {
            setSuggessStatus(false);
          }, 1000);
          setCount(count - 1);
        }
      });
    }
  };

  const handleBtnShuffle = async () => {
    const res = await handleShuffle(id, media_type);
    setImgPath(res);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btnWrapper, {backgroundColor: '#9B720E'}]}
        onPress={handleSuggest}
        disabled={count === 0}>
        <View
          style={[
            styles.btn,
            styles.btn1,
            count === 0 && {backgroundColor: '#9B720E'},
          ]}>
          <Suggess onTouchStart={() => {}} />
          <Text style={styles.btnText}>Suggess ({count})</Text>
        </View>
      </TouchableOpacity>

      <Image
        style={styles.imgCtrl}
        source={{uri: `${Base_URL_GET_IMAGE}${imgPath}`}}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={[styles.btnWrapper, {backgroundColor: '#441B66'}]}
        onPress={() => {
          handleBtnShuffle();
        }}>
        <View style={[styles.btn, styles.btn2]}>
          <Shuffle />
          <Text style={styles.btnText}>Shuffle</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 32,
    paddingHorizontal: PADDING,
  },
  btnWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 3,
    borderRadius: 8,
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 8,
    width: 120,
    height: 40,
  },
  btn1: {
    backgroundColor: theme.colors.yellow,
  },
  btn2: {backgroundColor: theme.colors.purple},
  btnText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  imgCtrl: {
    width: 69,
    height: 69,
    borderRadius: 8,
  },
}));

export default ControlCenter;
