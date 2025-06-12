import { ToastAndroid } from "react-native"
import NetInfo from '@react-native-community/netinfo';

export const showmessageAlert=(str:string)=>{
    return ToastAndroid.show(str,ToastAndroid.SHORT);
}

export const isInternetAvailable = async () => {
  return new Promise(function (resolve, reject) {
    NetInfo.fetch()
      .then(state => {
        resolve(state);
      })
      .catch(error => {
        reject(error);
      });
  });
};