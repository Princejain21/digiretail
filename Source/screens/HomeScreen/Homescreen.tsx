import React, { useLayoutEffect, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useUserDetails } from '../../store/store';
import auth from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from '@react-native-firebase/firestore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Rootnavigator/RootNavigator';
import Todo from '../../assets/svgs/ToDo.svg';
import { Mycolor } from '../../utility/Mycolors';

const Homescreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, updateUser } = useUserDetails();
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const db = getFirestore();

  // Logout
  const handleLogout = async () => {
    try {
      await auth().signOut();
      updateUser(null);
      console.log('Logged out');
    } catch (err) {
      console.error('Logout Error:', err);
    }
  };

  const toggleProfile = () => setShowProfileInfo(!showProfileInfo);

  useLayoutEffect(() => {
    navigation.setOptions({
      title:'',
      headerLeft: () => (
        <TouchableOpacity
          onPress={toggleProfile}
          style={{ marginLeft: wp('7%'), flexDirection: 'column', alignItems: 'center' }}
        >
          <Image
            source={{ uri: user?.photoUrl || 'https://via.placeholder.com/40' }}
            style={{ width: 35, height: 35, borderRadius: 20 }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: wp('3%') }}>
          <Icon name="logout" size={24} color={Mycolor.baseColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, user, showProfileInfo]);

  // Fetch todos from Firestore
  useEffect(() => {
    if (!user?.id) return;

    const todosRef = collection(db, 'todos');
    const q = query(
      todosRef,
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(list);
    });

    return () => unsubscribe();
  }, [user?.id]);

  // Delete a todo
  const deleteTodo = (id: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this todo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'todos', id));
          } catch (err) {
            console.error('Error deleting todo:', err);
          }
        },
      },
    ]);
  };

  // Filter todos based on search query
  const filteredTodos = todos.filter(todo =>
    todo?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18 }}>Welcome, {user?.name}</Text>

      {showProfileInfo && (
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: user?.photoUrl || 'https://via.placeholder.com/80' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
      )}

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Todo width={wp('50%')} height={hp('20%')} />
      </View>

      {<TextInput
        placeholder="Search by title or description..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        placeholderTextColor={'gray'}
      />}
      {filteredTodos.length === 0 ? (
        <View style={{ flex: 2 }}>
          <Text style={styles.noDataText}>No Data Found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTodos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.todoItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.todoTitle}>{item?.title}</Text>
                <Text style={styles.todoDesc}>{item?.description}</Text>
                <Text style={styles.todoReason}>Reason: {item?.reason}</Text>
              </View>
             <View  style={{flexDirection:'row',alignItems:'center',gap:wp('2%')}}>
               <TouchableOpacity onPress={() =>navigation.navigate('AddTodo',{mode:'update',user:item})}>
                <AntDesign name="edit" size={24} color="red" />
              </TouchableOpacity>
               <TouchableOpacity onPress={() => deleteTodo(item?.id)}>
                <Icon name="delete" size={24} color="red" />
              </TouchableOpacity>
             </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTodo',{mode:'add',user:null})}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  profileContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  profileName: { fontSize: 16, marginTop: 10 },
  profileEmail: { fontSize: 14, color: 'gray' },
  todoItem: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    gap: 10,
  },
  todoTitle: { fontSize: 16, fontWeight: 'bold' },
  todoDesc: { fontSize: 14, color: '#333' },
  todoReason: { fontSize: 12, color: 'gray' },
  noDataText: {
    textAlign: 'center',
    fontSize: hp('2%'),
    color: '#000',
    marginTop: hp('4%'),
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor:Mycolor.baseColor,
    borderRadius: 30,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
