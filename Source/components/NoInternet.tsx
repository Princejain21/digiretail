import { View, Text,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Nointernetsvg from '../assets/svgs/Nointernet.svg'
import CustomButton from './CustomButton';
import { isInternetAvailable, showmessageAlert } from '../utility/utility';
import { useNavigation } from '@react-navigation/native';

const NoInternet = () => {
    const navigation =useNavigation();
  return (
    <View style={styles.container}>
       <View style={{marginVertical:hp('4%')}}>
        <Nointernetsvg width={wp("80%")} height={hp('20%')}/>
       </View>
      <Text style={styles.text_container}>No Internet Found</Text>
      <CustomButton
        label='Retry'
        onPress={()=>{
        isInternetAvailable().then((res: any) => {
        if (res?.isConnected === true) {
         if(navigation){
            navigation.goBack();
         }
        } else {
            showmessageAlert("Turn on your internet")
        }
      }).catch(err => { console.log(err); })
        }}
      />
    </View>
  )
}

export default NoInternet

const styles=StyleSheet.create({
container:{flex:1,justifyContent:'center',alignItems:'center'},
text_container:{color:"#000",fontSize:hp('2%')}
})