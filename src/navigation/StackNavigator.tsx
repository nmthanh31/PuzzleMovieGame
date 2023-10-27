import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ClassicPlayScreen from '../screens/ClassicPlayScreen';
import PlayExtendScreen from '../screens/PlayExtendScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="PlayClassic" component={ClassicPlayScreen} />
      <Stack.Screen name="PlayExtend" component={PlayExtendScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
