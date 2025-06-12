import { View, Text, TouchableOpacity,StyleSheet, ActivityIndicator } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React from 'react'
type buttonProps={
label:string,
onPress:()=>void;
btn_container?:any;
isLoading?:boolean;
loader_color?:string
}
const CustomButton:React.FC<buttonProps> = ({label,onPress,btn_container,isLoading,loader_color}) => {
  return (
    <TouchableOpacity style={[styles.btn_container,btn_container]} onPress={onPress}>
        {isLoading?<ActivityIndicator size="small" color={loader_color||'#43425D'} />:
        <Text style={{color:"white"}}>{label}</Text>
        }
    </TouchableOpacity>
  )
}

export default CustomButton
const styles=StyleSheet.create({
container:{flex:1,justifyContent:'center',alignItems:'center'},
text_container:{color:"#fff",fontSize:hp('2%')},
btn_container:{backgroundColor:"#005a88",borderRadius:12,paddingHorizontal:wp('2%'),paddingVertical:wp('2%'),justifyContent:"center",alignItems:"center"}
})