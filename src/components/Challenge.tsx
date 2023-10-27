import React, {useEffect, useState} from 'react';
import {Overlay, makeStyles, useTheme} from '@rneui/themed';
import {View, Text, TouchableOpacity} from 'react-native';
import Goal from '../assets/media/extend/Goal.svg';
import Close from '../assets/media/common/Close.svg';

import {windowWidth} from '../utils/dimension';

type OverlayComponentProps = {
  size: any;
  setSize: any;
};

const Challenge: React.FunctionComponent<OverlayComponentProps> = ({
  size,
  setSize,
}) => {
  const styles = useStyles();

  const [visible, setVisible] = useState(false);
  const [option, setOption] = useState(3); // 3: 3x3, 4: 4x4

  useEffect(() => {
    setOption(size);
  }, []);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleClose = () => {
    setOption(size);
    toggleOverlay();
  };

  const handleConfirm = () => {
    setSize(option);
    toggleOverlay();
  };

  return (
    <View>
      <Goal onPress={toggleOverlay} />

      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        backdropStyle={styles.backdrop}
        overlayStyle={styles.overlay}>
        <View style={styles.close}>
          <Close onPress={handleClose} />
        </View>

        <View style={styles.control}>
          <Text style={styles.header}>Choose Challenge</Text>
          <View style={styles.choiceWrap}>
            {/* 3x3  */}
            <TouchableOpacity
              style={[styles.choice, option !== 3 && styles.choiceDisable]}
              onPress={() => setOption(3)}>
              <Text
                style={[
                  styles.choiceText,
                  option !== 3 && styles.choiceTextDisable,
                ]}>
                3x3
              </Text>
            </TouchableOpacity>

            {/* 4x4 */}
            <TouchableOpacity
              style={[styles.choice, option === 3 && styles.choiceDisable]}
              onPress={() => setOption(4)}>
              <Text
                style={[
                  styles.choiceText,
                  option === 3 && styles.choiceTextDisable,
                ]}>
                4x4
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnWrap} onPress={handleConfirm}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>OK</Text>
            </View>
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
    paddingBottom: 31,
    gap: 31,
  },
  header: {color: '#000', fontSize: 20, fontFamily: 'Quicksand-Bold'},
  choiceWrap: {flexDirection: 'row', justifyContent: 'space-between', gap: 23},
  choice: {
    backgroundColor: theme.colors.shadeBlue,
    paddingVertical: 48,
    paddingHorizontal: 28,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: theme.colors.lightBlue,
  },
  choiceDisable: {
    borderColor: 'transparent',
  },
  choiceText: {
    color: theme.colors.lightBlue,
    fontSize: 50,
    fontFamily: 'Quicksand-Bold',
  },
  choiceTextDisable: {color: '#5D6F9B'},
  btnWrap: {
    backgroundColor: theme.colors.blue,
    width: 108,
    paddingBottom: 5,
    borderRadius: 15,
  },
  btn: {
    backgroundColor: theme.colors.lightBlue,
    paddingVertical: 10,
    borderRadius: 15,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
  },
}));
export default Challenge;
