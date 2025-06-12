
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Onboarding from './Source/screens/OnboardingStack/Onboarding';
import { useLoginStore, useUserDetails } from './Source/store/store';
import RootNavigator from './Source/screens/Rootnavigator/RootNavigator';
import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import CustomLoader from './Source/components/CustomLoader';

function App(): React.JSX.Element {
  const { islogin, updateIsLogin } = useLoginStore();
  const { user, updateUser } = useUserDetails();
  const [isloading,setisLoading]= useState<boolean>(true);

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged((user: FirebaseAuthTypes.User | null) => {
      if (user) {
        updateIsLogin(true);
        updateUser({ email: user.email, name: user.displayName, photoUrl: user.photoURL, id: user.uid });
      } else {
        console.log('❌ Not logged in');
        updateIsLogin(false);
      }
      setisLoading(false);
    });;
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <NavigationContainer>
      {isloading ? <CustomLoader /> : islogin ? <RootNavigator /> : <Onboarding />}
    </NavigationContainer>
  );
}

export default App;
