import {
  View,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {Image, useTheme} from '@rneui/themed';
import SearchIcon from '../../assets/media/Search.svg';
import {findMovieAndTvShow} from '../../Api/findMovieAndTvShowByName';
import lodash from 'lodash';
import {Base_URL_GET_IMAGE} from '../../configs/env';
const SearchScreen = ({navigation, route}: any) => {
  const {theme} = useTheme();
  const [name, setName] = useState('');
  const {level, isRinging} = route.params;
  const [movies, setMovies] = useState(null);
  const [tvs, setTvs] = useState(null);
  const [Data, setData] = useState(null);

  const handleFindMovieAndTvShow = async (name: string) => {
    try {
      const response = (await findMovieAndTvShow(name)).data;
      const data = response.results;
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const debouncedSearch = useMemo(() => {
    return lodash.debounce((name: string) => {
      handleFindMovieAndTvShow(name);
    }, 300);
  }, []);
  const handleChangeNameSearch = (text: string) => {
    setName(text);
    debouncedSearch(text);
  };

  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        flex: 1,
      }}>
      <View
        style={{
          alignItems: 'center',
          width: '100%',
          marginTop: 16,
          marginBottom: 22,
        }}>
        <View style={style.search}>
          <SearchIcon></SearchIcon>
          <TextInput
            placeholder="Search Movie,TV Show"
            placeholderTextColor={'#000000'}
            style={style.searchInput}
            value={name}
            onChangeText={e => handleChangeNameSearch(e)}></TextInput>
        </View>
      </View>
      <ScrollView
        style={{
          width: 344,
        }}>
        <View style={style.containerImage}>
          {name === '' ? null : Data == null ? (
            <View style={style.loading}>
              <ActivityIndicator size="large" color={theme.colors.darkBlue} />
            </View>
          ) : (
            Data.map(item => {
              if (item.poster_path != null) {
                return (
                  <TouchableOpacity
                    style={{
                      borderRadius: 5,
                      marginBottom: 10,
                      marginLeft: 10,
                    }}
                    key={item.id}
                    onPress={() => {
                      if (level == 0) {
                        navigation.navigate('PlayClassic', {
                          image_path: item.poster_path,
                          media_type: item.media_type,
                          id: item.id,
                          isRinging: isRinging,
                        });
                      } else {
                        navigation.navigate('PlayExtend', {
                          image_path: item.poster_path,
                          media_type: item.media_type,
                          id: item.id,
                          isRinging: isRinging,
                        });
                      }
                    }}>
                    <Image
                      source={{uri: `${Base_URL_GET_IMAGE}${item.poster_path}`}}
                      style={{
                        width: 101,
                        height: 152,
                        borderRadius: 5,
                      }}
                    />
                  </TouchableOpacity>
                );
              }
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: 344,
    height: 50,
    backgroundColor: '#E5E7ED',
    borderRadius: 10,
  },
  searchInput: {
    width: '80%',
    color: '#000',
    fontFamily: 'Quicksand',
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
  },
  loading: {
    width: '100%',
    height: 210,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerImage: {
    flexWrap: 'wrap',
    width: 344,
    flexDirection: 'row',
    flex: 1,
  },
});
export default SearchScreen;
