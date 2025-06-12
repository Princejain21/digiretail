import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Image, Dimensions, ToastAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import Login_icon from '../assets/svgs/Login_icon.svg'
import { showmessageAlert } from '../utility/utility';
import { useLoginStore } from '../store/store';
import CustomLoader from '../components/CustomLoader';

const {height,width}=Dimensions.get("screen");
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isloading,setisloading]=useState<boolean>(false);
  const [error, setError] = useState('');
  const formOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const errorShake = useSharedValue(0);
  const {islogin,updateIsLogin}=useLoginStore();
  

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: '107390222881-ihkbjdqs6ki6lpuioo361hh4efrclgda.apps.googleusercontent.com',
    });

    // Fade-in animation for the form
    formOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: withTiming(formOpacity.value * -20, { duration: 1000 }) }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const errorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: errorShake.value }],
  }));

  const handleGoogleSignIn = async () => {
    try {
    //   await GoogleSignin.hasPlayServices();
      const userInfo:any = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      await auth().signInWithCredential(googleCredential);
      Alert.alert('Success', 'Logged in with Google!');
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setError('Google Sign-In was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setError('Sign-In is in progress');
      } else {
        setError('Google Sign-In failed');
      }
      triggerErrorAnimation();
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      triggerErrorAnimation();
      return;
    }
    try {
      await auth().signInWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error: any) {
      setError('Invalid email or password');
      triggerErrorAnimation();
    }
  };

  const triggerErrorAnimation = () => {
    errorShake.value = withSequence(
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  };

  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  async function onGoogleButtonPress() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const signInResult:any = await GoogleSignin.signIn();
  let idToken;
  // Try the new style of google-sign in result, from v13+ of that module
  idToken = signInResult.data?.idToken;
  console.log('idToken', idToken)
  if (!idToken) {
    // if you are using older versions of google-signin, try old style result
    idToken = signInResult.idToken;
  }
  if (!idToken) {
    throw new Error('No ID token found');
  }

  // Create a Google credential with the token
  const googleCredential = GoogleAuthProvider.credential(signInResult.data.idToken);

  // Sign-in the user with the credential
  return signInWithCredential(getAuth(), googleCredential);
  }
  //handle the google login 
  const handleGoogleSignIN=()=>{
    setisloading(true);
    onGoogleButtonPress().then(()=>{
      showmessageAlert('Logged in successfully');
      updateIsLogin(true);
      setisloading(false);
    }).catch(err=>{console.log('err', err);setisloading(false)})
  }
return (
    isloading?<CustomLoader/>:
    <SafeAreaView style={styles.container}>
      {/* Illustration */}
       {error ? (
          <Animated.Text style={[styles.errorText, errorAnimatedStyle]}>{error}</Animated.Text>
         ) : null}

      <Login_icon width={width/3} height={height/6}/>

      {/* Heading */}
      <Text style={styles.title}>Hello Folks!</Text>
      <Text style={styles.subtitle}>
        Welcome To Little Drop, where{'\n'}you manage your daily tasks
      </Text>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={()=>showmessageAlert('In Development Mode,Only google login enabled')}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity >

      {/* Sign Up Button */}
      {/* <TouchableOpacity disabled style={styles.signUpButton}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity> */}

      {/* Social Text */}
      {/* <Text style={styles.socialText}>Sign up using</Text> */}

      {/* Social Icons */}
      <View style={styles.socialIcons}>
        <TouchableOpacity style={styles.iconButton} disabled>
          <Icon name="facebook" size={24} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleGoogleSignIN}>
          <AntDesign name="googleplus" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity disabled style={styles.iconButton} onPress={()=>{showmessageAlert('In development Mode')}}>
          <AntDesign name="twitter" size={24} color="#0e76a8" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  illustration: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#4B32C3',
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 30,
    marginBottom: 15,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButton: {
    borderWidth: 1,
    borderColor: '#4B32C3',
    paddingVertical: 14,
    paddingHorizontal: 95,
    borderRadius: 30,
    marginBottom: 30,
  },
  signUpText: {
    color: '#4B32C3',
    fontSize: 16,
    fontWeight: '600',
  },
  socialText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  iconButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    padding: 12,
    marginHorizontal: 5,
  },
  errorText:{
    fontSize:14,
    color:'red'
  }
});


export default Login;