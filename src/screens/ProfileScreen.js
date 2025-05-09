import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
} from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Colors from '../constants/Colors';
import avatarImages from '../constants/avatarImages';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setSelectedAvatar(data.avatar || 'avatar1'); // 🔁 folosim `avatar` în loc de photoURL
      }
    };
    fetchData();
  }, []);

  const handleAvatarChange = (key) => {
    setSelectedAvatar(key);
    setModalVisible(false);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !selectedAvatar) return;
    const ref = doc(db, 'users', user.uid);

    // 🔁 AICI este modificarea importantă:
    await updateDoc(ref, { avatar: selectedAvatar });

    navigation.navigate('Welcome');
  };

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
  colors={Colors.gradientGreenBlue}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.container}
>
      <View style={styles.cardBox}>
        <Image source={avatarImages[selectedAvatar]} style={styles.avatar} />
        <Text style={styles.name}>{userData.displayName}</Text>
        <Text style={styles.email}>{auth.currentUser.email}</Text>
        {userData.totalCalories && (
          <Text style={styles.calories}>Recommended: {userData.totalCalories.toFixed(0)} kcal/day</Text>
        )}

        <TouchableOpacity style={styles.changeBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.changeBtnText}>Change Avatar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose Your Avatar</Text>
            <FlatList
              data={Object.keys(avatarImages)}
              numColumns={3}
              keyExtractor={(item) => item}
              contentContainerStyle={{ paddingVertical: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleAvatarChange(item)}>
                  <Image source={avatarImages[item]} style={styles.avatarOption} />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

// 🎨 Styles — neatinse
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBox: {
    backgroundColor: '#ffffffcc',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginBottom: 30,
    width: '85%',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 20,
    borderColor: Colors.greenMid,
    borderWidth: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.textDark,
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.textDark,
  },
  calories: {
    fontSize: 16,
    marginBottom: 20,
    color: Colors.greenMid,
  },
  changeBtn: {
    backgroundColor: Colors.greenMid,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  changeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#ffffffcc',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.greenDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: Colors.bgLight,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.greenDark,
    marginBottom: 10,
  },
  avatarOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
    borderWidth: 2,
    borderColor: Colors.greenSoft,
  },
  closeBtn: {
    marginTop: 15,
    backgroundColor: Colors.greenMid,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

