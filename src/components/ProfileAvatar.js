import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import avatarImages from '../constants/avatarImages';
import Colors from '../constants/Colors';

export default function ProfileAvatar() {
  const [initials, setInitials] = useState('');
  const [avatar, setAvatar] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const data = snap.data();
        const name = data.displayName || 'User';
        const parts = name.trim().split(' ');
        const init = parts.map(p => p[0]).join('').toUpperCase();
        setInitials(init);
        if (data.avatar) setAvatar(data.avatar);
      }
    };
    fetchUserData();
  }, []);

  const handlePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      {avatar && avatarImages[avatar] ? (
        <Image source={avatarImages[avatar]} style={styles.image} />
      ) : (
        <View style={styles.circle}>
          <Text style={styles.text}>{initials}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 0,
    zIndex: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#ffffffcc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.greenDark,
  },
});
