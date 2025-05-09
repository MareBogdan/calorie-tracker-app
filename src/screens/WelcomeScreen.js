import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Colors from "../constants/Colors";
import avatarImages from "../constants/avatarImages";

export default function WelcomeScreen() {
  const [displayName, setDisplayName] = useState("");
  const [initials, setInitials] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [totalCalories, setTotalCalories] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        const name = data.displayName || "User";
        setDisplayName(name);

        const parts = name.trim().split(" ");
        const init = parts.map((p) => p[0]).join("").toUpperCase();
        setInitials(init);

        if (data.avatar) setAvatar(data.avatar);
        if (data.totalCalories) setTotalCalories(data.totalCalories);
      }
    };
    fetchUserData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: "#fff", fontSize: 16, marginRight: 10 }}>
            Logout
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      Alert.alert("Logout failed", error.message);
    }
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  const handleStart = () => {
    if (totalCalories) {
      navigation.navigate("Aliments");
    } else {
      navigation.navigate("Home");
    }
  };

  return (
    <LinearGradient
      colors={Colors.gradientGreenBlue}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.welcomeText}>Welcome back</Text>
      </View>

      <TouchableOpacity style={styles.avatarWrapper} onPress={handleProfilePress}>
        {avatar && avatarImages[avatar] ? (
          <Image source={avatarImages[avatar]} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.displayName}>{displayName}</Text>
      </View>

      {totalCalories && (
        <Text style={styles.caloriesText}>
          Your daily goal: {Math.round(totalCalories)} kcal
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>🍽️ Let’s get started!</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  card: {
    backgroundColor: "#ffffffcc",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 18,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "500",
    color: Colors.greenDark,
  },
  avatarWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#ffffffcc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#FFA500",
    marginBottom: 18,
    padding: 2,
  },
  avatarCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#ffffffcc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.greenDark,
  },
  avatarImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  displayName: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.greenDark,
  },
  caloriesText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#ffffffcc",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 30,
    borderWidth: 2,
    borderColor: "#FFA500",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.greenDark,
  },
});
