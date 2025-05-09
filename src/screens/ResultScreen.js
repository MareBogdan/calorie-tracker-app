import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Colors from "../constants/Colors";
import ProfileAvatar from "../components/ProfileAvatar";

export default function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  if (!route.params) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data found for results.</Text>
        <TouchableOpacity
          onPress={() => navigation.replace("Home")}
          style={styles.noDataButton}
        >
          <Text style={styles.noDataButtonText}>Go back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const {
    totalCalories,
    proteins,
    carbs,
    fats,
    sex,
    age,
    height,
    weight,
    activityLevel,
    goal,
  } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Logout failed", error.message);
    }
  };

  return (
    <LinearGradient
      colors={Colors.gradientGreenBlue}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ProfileAvatar />

      <View style={styles.circleWrapper}>
        <View style={styles.resultCircle}>
          <Text style={styles.title}>🎯 Your Results</Text>
          <Text style={styles.subtitle}>Daily Caloric Needs:</Text>
          <View style={styles.caloriesBadge}>
            <Text style={styles.caloriesText}>
              {totalCalories.toFixed(0)} kcal
            </Text>
          </View>

          <View style={styles.macros}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProteinsScreen")}
              style={styles.macroButton}
            >
              <Text style={styles.macroText}>
                🍗 Proteins: {proteins.toFixed(0)} g
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("CarbsScreen")}
              style={styles.macroButton}
            >
              <Text style={styles.macroText}>
                🍞 Carbs: {carbs.toFixed(0)} g
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("FatsScreen")}
              style={styles.macroButton}
            >
              <Text style={styles.macroText}>🥑 Fats: {fats.toFixed(0)} g</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttonRowBelowCircle}>
        <TouchableOpacity
          style={[styles.mediumButton, styles.orangeBorder]}
          onPress={() =>
            navigation.replace("Home", {
              sex,
              age,
              height,
              weight,
              activityLevel,
              goal,
            })
          }
        >
          <Text style={styles.buttonText}>🔁 Recalculate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mediumButton, styles.orangeBorder]}
          onPress={() => navigation.navigate("Aliments")}
        >
          <Text style={styles.buttonText}>🍽️ View Aliments</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.greenDark,
  },
  noDataText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  noDataButton: {
    backgroundColor: Colors.greenMid,
    padding: 12,
    borderRadius: 8,
  },
  noDataButtonText: {
    color: "#fff",
  },
  logoutButton: {
    marginRight: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
  circleWrapper: {
    marginTop: 13,
    alignItems: "center",
  },
  resultCircle: {
    width: 370, // +10px
    height: 370, // +10px
    borderRadius: 185,
    borderWidth: 4,
    borderColor: Colors.greenDark,
    backgroundColor: Colors.accentNeutral,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 25,
    paddingHorizontal: 24, // 👈 nou: padding orizontal intern
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: Colors.textDark,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.greenMid,
    textAlign: "center",
    marginTop: 4,
  },
  caloriesBadge: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius:30,
    borderWidth: 2,
    borderColor: "#FFA500", // portocaliu
    backgroundColor: "#fff6e5", // opțional: un portocaliu foarte deschis
    alignSelf: "center",
  },

  caloriesText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E67300",
    textAlign: "center",
  },
  macros: {
    width: "100%",
    marginTop: 6,
    marginBottom: 15,

  },
  macroButton: {
    width: 200,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: "#ffffffcc",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFA500",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  macroText: {
    fontSize: 14,
    textAlign: "center",
    color: Colors.textDark,
    fontWeight: "500",
  },
  buttonRowBelowCircle: {
    marginTop: 30,
    width: "100%",
    paddingHorizontal: 40,
    gap: 12,
  },
  mediumButton: {
    backgroundColor: "#ffffffcc",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  orangeBorder: {
    borderWidth: 2,
    borderColor: "#FFA500",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.greenDark,
    textAlign: "center",
  },
});
