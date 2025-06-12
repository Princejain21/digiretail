import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Login';
type OnboardingStackParamList = {
  LoginScreen: undefined;
};
const Onboarding = () => {
const Stack = createNativeStackNavigator<OnboardingStackParamList>();

  return (
<Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name='LoginScreen' component={Login}/>
</Stack.Navigator>
  )
}

export default Onboarding