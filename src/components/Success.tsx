import React, {useEffect, useState} from 'react';
import {Image, Overlay, makeStyles, useTheme} from '@rneui/themed';
import {View, Text, TouchableOpacity, Vibration} from 'react-native';
import Share from 'react-native-share';
import Close from '../assets/media/common/Close.svg';
import Done from '../assets/media/Done.svg';
import HomeIcon from '../assets/media/HomeIcon.svg';
import ShareIcon from '../assets/media/ShareIcon.svg';
import RNFS from 'react-native-fs';
import {windowWidth} from '../utils/dimension';
import {Base_URL_GET_IMAGE} from '../configs/env';
import {useNavigation} from '@react-navigation/native';
import {formatTime} from '../utils/format';

type OverlayComponentProps = {
  isSuccess: null | boolean;
  imagePath: string;
  time: null | number;
  screenShot: string;
  isRinging: boolean;
  setReplay: React.Dispatch<React.SetStateAction<boolean>>;
};

const Success: React.FunctionComponent<OverlayComponentProps> = ({
  isSuccess,
  imagePath,
  time,
  screenShot,
  isRinging,
  setReplay,
}) => {
  const styles = useStyles();

  const navigation = useNavigation();

  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess !== null) {
      setVisible(true);
      if (isRinging) {
        Vibration.vibrate(1000);
      }
      console.log('Vibration: ', isRinging);
    }
  }, [isSuccess, isRinging]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleClose = () => {
    toggleOverlay();
    navigation.navigate('Home');
  };

  const handleReplay = () => {
    toggleOverlay();
    setReplay(prev => !prev);
  };

  const handleShare = () => {
    RNFS.readFile(screenShot, 'base64').then(base64String => {
      var imageUrl = 'data:image/png;base64,' + base64String;
      let shareImage = {
        message: 'game hay ne',
        url: imageUrl,
      };
      Share.open(shareImage)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    });
  };

  return (
    <View>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        backdropStyle={styles.backdrop}
        overlayStyle={styles.overlay}>
        <View style={styles.close}>
          <Close onPress={handleClose} />
        </View>

        <View style={styles.control}>
          <Image
            style={{
              height: 145,
              width: 145,
              borderRadius: 20,
            }}
            source={{uri: `${Base_URL_GET_IMAGE}${imagePath}`}}
            resizeMode="contain"></Image>
          {isSuccess ? (
            <Done
              style={{
                marginTop: -25,
              }}></Done>
          ) : (
            <View
              style={{
                width: 34,
                height: 34,
                backgroundColor: '#fff',
                marginTop: -17,
                borderRadius: 50,
                justifyContent: 'center',
                alignContent: 'center',
                borderWidth: 3,
                borderColor: 'red',
              }}>
              <Text
                style={{
                  color: 'red',
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '700',
                }}>
                X
              </Text>
            </View>
          )}

          <Text
            style={{
              color: isSuccess ? '#000' : 'red',
              fontFamily: 'Quicksand-Bold',
              fontSize: 20,
            }}>
            {isSuccess === false
              ? 'You failed!!!'
              : isSuccess === true
              ? 'Completed!!!'
              : ''}
          </Text>

          <Text
            style={{
              color: '#3470F2',
              fontFamily: 'Quicksand-Bold',
              fontSize: 20,
            }}>
            {time ? formatTime(time) : time}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 28,
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              backgroundColor: '#3470F2',
              width: 120,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
              shadowColor: '#0B338A',
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,
              elevation: 10,
            }}
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <HomeIcon />
            <Text
              style={{
                color: '#FFF',
                fontSize: 18,
                fontWeight: '700',
                fontFamily: 'Quicksand-Bold',
                marginLeft: 5,
              }}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              backgroundColor: '#1BCA87',
              width: 120,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
              shadowColor: '#0B925E',
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,
              elevation: 10,
            }}
            onPress={() => {
              isSuccess ? handleShare() : handleReplay();
            }}>
            {isSuccess && <ShareIcon></ShareIcon>}
            <Text
              style={{
                color: '#FFF',
                fontSize: 18,
                fontWeight: '700',
                fontFamily: 'Quicksand-Bold',
                marginLeft: 5,
              }}>
              {isSuccess ? 'Share' : 'Replay'}
            </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  overlay: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: windowWidth - 19 * 2,
    padding: 0,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 19,
  },
  close: {alignItems: 'flex-end', paddingRight: 15, paddingVertical: 13},
  control: {
    alignItems: 'center',
    paddingBottom: 6,
  },
}));
export default Success;
