import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Homescreen from '../HomeScreen/Homescreen';
import AddTodoScreen from '../HomeScreen/AddTodoScreen';
export type RootStackParamList = {
  HomeScreen: undefined;
  AddTodo:{mode:string,user:any}
};
const RootNavigator = () => {
const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
   <Stack.Navigator>
    <Stack.Screen name='HomeScreen' component={Homescreen} />
    <Stack.Screen name="AddTodo" component={AddTodoScreen} options={{ title: 'Add Your Task' }} />
   </Stack.Navigator>
  )
}

export default RootNavigator