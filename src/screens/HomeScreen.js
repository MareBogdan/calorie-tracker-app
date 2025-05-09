import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ProfileAvatar from "../components/ProfileAvatar";

import CalculateButton from "../components/CalculateButton";
import { calculateCalories } from "../utils/calculator";
import { useNavigation, useRoute } from "@react-navigation/native";
import Colors from "../constants/Colors";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function HomeScreen() {
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchName = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setDisplayName(snap.data().displayName || "User");
      }
    };
    fetchName();
  }, []);

  const navigation = useNavigation();
  const route = useRoute();

  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [goal, setGoal] = useState("maintenance");
  const [modalVisible, setModalVisible] = useState(null);

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

  useEffect(() => {
    const fetchSavedInput = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid, "profileData", "userInput");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.sex) setSex(data.sex);
          if (data.age) setAge(String(data.age));
          if (data.height) setHeight(String(data.height));
          if (data.weight) setWeight(String(data.weight));
          if (data.activityLevel) setActivityLevel(data.activityLevel);
          if (data.goal) setGoal(data.goal);
        }
      } catch (err) {
        console.error("❌ Failed to fetch user input:", err.message);
      }
    };

    fetchSavedInput();
  }, []);

  useEffect(() => {
    if (route.params) {
      const { sex, age, height, weight, activityLevel, goal } = route.params;
      if (sex) setSex(sex);
      if (age) setAge(String(age));
      if (height) setHeight(String(height));
      if (weight) setWeight(String(weight));
      if (activityLevel) setActivityLevel(activityLevel);
      if (goal) setGoal(goal);
    }
  }, [route.params]);

  const saveUserInput = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await setDoc(doc(db, "users", user.uid, "profileData", "userInput"), {
        sex,
        age,
        height,
        weight,
        activityLevel,
        goal,
        updatedAt: new Date().toISOString(),
      });
      console.log("✅ User input saved!");
    } catch (err) {
      console.error("❌ Error saving user input:", err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      Alert.alert("Logout failed", error.message);
    }
  };

  const getActivityLabel = (value) => {
    switch (value) {
      case 1.2:
        return "Sedentary";
      case 1.375:
        return "Lightly active";
      case 1.55:
        return "Moderately active";
      case 1.725:
        return "Very active";
      case 1.9:
        return "Extremely active";
      default:
        return "";
    }
  };

  const handleCalculate = async () => {
    if (!sex || !age || !height || !weight || !activityLevel) {
      alert("Please fill out all fields!");
      return;
    }

    let totalCalories = calculateCalories(
      sex,
      Number(age),
      Number(height),
      Number(weight),
      activityLevel
    );

    if (goal === "lose_recommended") {
      totalCalories -= 250;
    } else if (goal === "lose_aggressive") {
      totalCalories -= 500;
    } else if (goal === "gain_muscle") {
      totalCalories += 250;
    }

    const proteinGrams = Number(weight) * 2;
    const proteinCalories = proteinGrams * 4;
    const fatCalories = totalCalories * 0.3;
    const fatGrams = fatCalories / 9;
    const remainingCalories = totalCalories - (proteinCalories + fatCalories);
    const carbGrams = remainingCalories / 4;

    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid, "profileData", "macros"), {
          tdee: totalCalories,
          proteins: proteinGrams,
          carbs: carbGrams,
          fats: fatGrams,
          updatedAt: new Date().toISOString(),
        });

        await saveUserInput();
      } catch (error) {
        console.log("Firestore save error:", error.message);
      }
    }

    navigation.replace("Result", {
      totalCalories,
      proteins: proteinGrams,
      carbs: carbGrams,
      fats: fatGrams,
      sex,
      age,
      height,
      weight,
      activityLevel,
      goal,
    });
  };

  const closeModal = () => setModalVisible(null);

  return (
    <LinearGradient
      colors={Colors.gradientGreenBlue}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.avatarWrapper}>
        <ProfileAvatar size={48} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
           

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sex:</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setModalVisible("sex")}
              >
                <Text style={styles.selectorText}>
                  {sex
                    ? sex === "male"
                      ? "Male"
                      : "Female"
                    : "Select your sex"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                textAlign="center"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                textAlign="center"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                textAlign="center"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Activity Level:</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setModalVisible("activity")}
              >
                <Text style={styles.selectorText}>
                  {activityLevel
                    ? getActivityLabel(activityLevel)
                    : "Select activity level"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Goal:</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setModalVisible("goal")}
              >
                <Text style={styles.selectorText}>
                  {goal === "maintenance"
                    ? "Maintenance"
                    : goal === "lose_recommended"
                    ? "Recommended fat loss"
                    : goal === "lose_aggressive"
                    ? "Aggressive fat loss"
                    : "Muscle gain"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={handleCalculate}
              >
                <Text style={styles.calcButtonText}>Calculate</Text>
              </TouchableOpacity>
            </View>

            <Modal
              visible={modalVisible !== null}
              transparent={true}
              animationType="fade"
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  {modalVisible === "sex" && (
                    <>
                      <Text style={styles.modalTitle}>Select your sex</Text>
                      <TouchableOpacity
                        style={styles.modalOptionButton}
                        onPress={() => {
                          setSex("male");
                          closeModal();
                        }}
                      >
                        <Text style={styles.modalOption}>Male</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalOptionButton}
                        onPress={() => {
                          setSex("female");
                          closeModal();
                        }}
                      >
                        <Text style={styles.modalOption}>Female</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {modalVisible === "activity" && (
                    <>
                      <Text style={styles.modalTitle}>
                        Select activity level
                      </Text>
                      <TouchableOpacity
                        style={styles.modalOptionButton}
                        onPress={() => {
                          setActivityLevel(1.2);
                          closeModal();
                        }}
                      >
                        <Text style={styles.modalOption}>Sedentary</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalOptionButton}
                        onPress={() => {
                          setActivityLevel(1.375);
                          closeModal();
                        }}
                      >
                        <Text style={styles.modalOption}>Lightly active</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalOptionButton}
                        onPress={() => {
                          setActivityLevel(1.55);
                          closeModal();
                        }}
                      >
                        <Text style={styles.modalOption}>
                          Moderately active
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalOptionButton}
                        onPress={() => {
                          setActivityLevel(1.725);
                          closeModal();
                        }}
                      >
                        <Text style={styles.modalOption}>Very active</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalOptionButton}
                        onPress={() => {
                          setActivityLevel(1.9);
                          closeModal();
                        }}
                      >
                        <Text style={styles.modalOption}>Extremely active</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {modalVisible === "goal" && (
                    <>
                      <Text style={styles.modalTitle}>Select your goal</Text>
                      <TouchableOpacity
                        style={styles.modalOptionButton}
                        onPress={() => {
                          setGoal("maintenance");
                          closeModal();
                        }}
                      >
                        <Text style={styles.modalOption}>Maintenance</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalOptionButton}
                        onPress={() => {
                          setGoal("lose_recommended");
                          closeModal();
                        }}
                      >
                        <Text style={styles.modalOption}>
                          Recommended fat loss
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalOptionButton}
                        onPress={() => {
                          setGoal("lose_aggressive");
                          closeModal();
                        }}
                      >
                        <Text style={styles.modalOption}>
                          Aggressive fat loss
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalOptionButton}
                        onPress={() => {
                          setGoal("gain_muscle");
                          closeModal();
                        }}
                      >
                        <Text style={styles.modalOption}>Muscle gain</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
},
 inner: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 90,
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#fff",
  },
  inputContainer: {
    width: "90%",
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#fff",
  },
  input: {
    backgroundColor: Colors.accentNeutral,
    padding: 12,
    borderRadius: 8,
    width: "100%",
    textAlign: "center",
    color: Colors.textDark,
    borderWidth: 1,
    borderColor: Colors.greenMid,
  },
  selectorButton: {
    backgroundColor: Colors.accentNeutral,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.greenMid,
  },
  selectorText: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.textDark,
  },
  buttonContainer: {
    width: "90%",
    marginTop: 20,
    alignItems: "center",
  },
  calcButton: {
    backgroundColor: "#ffffffcc",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#FFA500",
  },
  calcButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.greenMid,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 128, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOptionButton: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.greenDark,
    marginBottom: 10,
    alignItems: "center",
  },
  modalOption: {
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: Colors.greenMid,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
    avatarWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    transform: [{ scale: 1.15 }],
  },
});
