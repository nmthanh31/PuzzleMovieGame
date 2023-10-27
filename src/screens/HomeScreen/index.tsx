import {View, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import {makeStyles} from '@rneui/themed';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '../../assets/media/home/Logo.svg';
import LogoText from '../../assets/media/home/LogoText.svg';
import Ring from '../../assets/media/home/Ring.svg';
import Volume from '../../assets/media/home/Volume.svg';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import TrackPlayer, {
  Event,
  RepeatMode,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import CustomSwitch from './CustomSwitch';
import {useIsFocused} from '@react-navigation/native';

const HomeScreen = ({navigation}: any) => {
  const styles = useStyles();

  const isFocused = useIsFocused();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isRinging, setIsRinging] = useState(false);

  const handlePlaying = async () => {
    if (isPlaying) await TrackPlayer.pause();
    else await TrackPlayer.play();

    setIsPlaying(prev => !prev);
  };

  const handleRinging = () => {
    setIsRinging(prev => !prev);
  };

  const start = async () => {
    try {
      await TrackPlayer.getCurrentTrack();
    } catch (err) {
      await TrackPlayer.setupPlayer();
    }

    await TrackPlayer.reset();

    await TrackPlayer.add([
      {
        url: require('../../assets/audio/sohappy.mp3'),
      },
    ]);
    await TrackPlayer.setRepeatMode(RepeatMode.Track);
  };

  useTrackPlayerEvents(
    [Event.PlaybackTrackChanged, Event.PlaybackQueueEnded],
    async event => {
      if (
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack != null
      ) {
        await TrackPlayer.play();
      }
      if (event.type === Event.PlaybackQueueEnded) {
        console.log('End queue');
      }
    },
  );
  const clearup = () => {
    try {
      TrackPlayer.pause();
      TrackPlayer.reset();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isFocused) start();
    return () => clearup();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#CFEFFF', '#FFF']} style={styles.linearStyle}>
        <Logo />
        <LogoText style={{marginTop: 12.45}} />

        <View style={styles.btnsContainer}>
          <TouchableOpacity
            style={styles.btnWrap}
            onPress={() => {
              navigation.navigate('Search', {
                level: 0, // Classic
                isRinging: isRinging,
              });
            }}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Classic</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnWrap, {backgroundColor: '#007B7E'}]}
            onPress={() => {
              navigation.navigate('Search', {
                level: 1, // Classic
                isRinging: isRinging,
              });
            }}>
            <View style={[styles.btn, {backgroundColor: '#00BABE'}]}>
              <Text style={styles.btnText}>Extend</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.grid}>
            <View style={styles.row}>
              <View style={styles.col1}>
                <Volume />
                <Text style={styles.title}>Sound</Text>
              </View>

              <CustomSwitch state={isPlaying} handleState={handlePlaying} />
            </View>

            <View style={styles.row}>
              <View style={styles.col1}>
                <Ring />
                <Text style={styles.title}>Vibration</Text>
              </View>

              <CustomSwitch state={isRinging} handleState={handleRinging} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
  },
  linearStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnsContainer: {
    marginTop: 68.55,
    gap: 22,
    marginBottom: 37,
  },
  btnWrap: {
    backgroundColor: theme.colors.blue,
    paddingBottom: 5,
    borderRadius: 15,
  },
  btn: {
    backgroundColor: theme.colors.lightBlue,
    paddingVertical: 12,
    paddingHorizontal: 93,
    borderRadius: 15,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
  },
  grid: {
    backgroundColor: '#DEE5F4',
    borderRadius: 10,
    paddingHorizontal: 17,
    paddingVertical: 29,
    gap: 29,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  col1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    color: theme.colors.darkBlue,
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
  },
}));
export default HomeScreen;
