import React from 'react';
import {View} from 'react-native';
import {makeStyles} from '@rneui/themed';
import Home from '../../assets/media/extend/Home.svg';
import Challenge from '../../components/Challenge';
import {PADDING} from '../../constants';

type topNavProps = {
  navigation: any;
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
};
const TopNav: React.FC<topNavProps> = ({navigation, size, setSize}) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Home
        onPress={() => {
          navigation.navigate('Home');
        }}
      />
      <Challenge size={size} setSize={setSize} />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: PADDING,
    paddingHorizontal: PADDING,
  },
}));

export default TopNav;
