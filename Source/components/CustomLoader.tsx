import { View, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'

const CustomLoader:React.FC<any> = () => {
  return (
     <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={'#43425D'} />
      </View>
  )
}

export default CustomLoader

const styles=StyleSheet.create({
    loadingContainer:{
        flex:1,
        justifyContent:"center",
        alignItems:'center',
        backgroundColor:"#fff"
    }
})