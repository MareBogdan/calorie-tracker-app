import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Colors from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function SignupScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    setEmail(value);
    setEmailError(
      !value.includes("@") || !value.includes(".") ? "Invalid email format" : ""
    );
  };

  const validatePassword = (value) => {
    setPassword(value);
    setPasswordError(
      value.length < 6 ? "Password must be at least 6 characters" : ""
    );
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmEmail || !confirmPassword || !firstName || !lastName) return;
    if (email !== confirmEmail) return alert("Emails do not match");
    if (password !== confirmPassword) return alert("Passwords do not match");
    if (emailError || passwordError) return;

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      const displayName = `${firstName.trim()} ${lastName.trim()}`;

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        displayName,
        firstTime: true,
        createdAt: new Date().toISOString(),
      });

      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={Colors.gradientGreenBlue}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
              placeholder="First Name"
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />

            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={validateEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Confirm Email"
              style={styles.input}
              value={confirmEmail}
              onChangeText={setConfirmEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

            <TextInput
              placeholder="Password"
              style={styles.input}
              value={password}
              onChangeText={validatePassword}
              secureTextEntry
            />
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

            <TouchableOpacity
              onPress={handleSignup}
              style={[
                styles.button,
                (!email || !password || !confirmEmail || !confirmPassword || !firstName || !lastName || emailError || passwordError) && {
                  backgroundColor: "#aaa",
                },
              ]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.link}>Already have an account? Log in</Text>
            </TouchableOpacity>
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.9)", // transparent alb pentru gradient
    borderWidth: 1,
    borderColor: Colors.greenMid,
    borderRadius: 10,
    width: "100%",
    padding: 14,
    fontSize: 16,
    marginBottom: 10,
    color: Colors.textDark,
  },
  error: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 10,
    fontSize: 13,
  },
  button: {
    backgroundColor: Colors.greenMid,
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#fff",
    fontSize: 14,
    marginTop: 10,
  },
});
