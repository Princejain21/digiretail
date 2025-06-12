import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useUserDetails } from '../../store/store';
import AddTask from '../../assets/svgs/Addtask.svg';
import CustomButton from '../../components/CustomButton';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from '@react-native-firebase/firestore';
import { showmessageAlert } from '../../utility/utility';

const AddTodoScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isedit,setisEdit]=useState<boolean>(false);
  const navigation = useNavigation();
  const route=useRoute<any>();
  const { user } = useUserDetails();
  const db = getFirestore();
const handleSubmit = async () => {
  if (!title.trim() || !description.trim()) {
    Alert.alert('Missing Fields', 'Title and Description are required');
    return;
  }

  setIsLoading(true);
  try {
    if (isedit && route.params?.user?.id) {
      // Update existing document
      const docRef = doc(db, 'todos', route.params?.user?.id);
      await updateDoc(docRef, {
        title: title.trim(),
        description: description.trim(),
        reason: reason.trim() || null,
        updatedAt: serverTimestamp(),
      }).then(res=>console.log('res', res)).catch(err=>console.log('err', err));
      console.log('✅ Todo updated:', route.params?.user?.id);
      showmessageAlert('Updated Successfully')
    } else {
      // Add new document
      const todosCollection = collection(db, 'todos');
      const newDocRef = doc(todosCollection);
      await setDoc(newDocRef, {
        userId: user?.id,
        title: title.trim(),
        description: description.trim(),
        reason: reason.trim() || null,
        createdAt: serverTimestamp(),
      }).then(res=>console.log('res', res)).catch(err=>console.log('err', err));;
      console.log('✅ Todo added with ID:', newDocRef.id);
      showmessageAlert('Created Successfully')
    }

    setIsLoading(false); // Clear loader before navigating
    navigation.goBack(); // Navigate after operation completes
  } catch (err) {
    setIsLoading(false); // Ensure loader is cleared even on error
    Alert.alert('Error', 'Failed to save todo');
  }
};
 useLayoutEffect(() => {
    navigation.setOptions({
      title:`${route.params?.mode==='update'?"Update":"Add"} Your Task`
    });
  }, [navigation]);
useEffect(()=>{
  setisEdit(route.params?.mode==='update');
  setDescription(route.params?.user?.description);
  setTitle(route.params?.user?.title);
  setReason(route.params?.user?.reason);
  console.log(route.params)
},[])
  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <AddTask width={wp('50%')} height={hp('20%')} />
      </View>

      <Text style={styles.label}>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: hp('15%') ,textAlignVertical: 'top'}]}
        multiline
      />

      <Text style={styles.label}>Reason (Optional)</Text>
      <TextInput value={reason} onChangeText={setReason} style={styles.input} />

      <CustomButton
        onPress={handleSubmit}
        label={isedit?'Update':'Add'}
        btn_container={{ paddingVertical: hp('2%'), marginTop: hp('2%') }}
        isLoading={isLoading}
        loader_color="#fff"
      />
    </View>
  );
};

export default AddTodoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: hp('2%') },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginTop: hp('1%'),
    borderColor: '#ccc',
  },
});
