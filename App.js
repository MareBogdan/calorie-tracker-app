import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator, View } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./src/firebase";

import AlimentsScreen from './src/screens/AlimentsScreen';
import HomeScreen from "./src/screens/HomeScreen";
import ResultScreen from "./src/screens/ResultScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ProfileScreen from './src/screens/ProfileScreen';
import ProteinsScreen from './src/screens/ProteinsScreen';
import CarbsScreen from './src/screens/CarbsScreen';
import FatsScreen from './src/screens/FatsScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initialScreen, setInitialScreen] = useState("Login");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);

        const ref = doc(db, "users", authenticatedUser.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          // Dacă nu există documentul userului în Firestore, îl creăm
          await setDoc(ref, {
            firstTime: true,
            createdAt: new Date().toISOString(),
          });
        }

        setInitialScreen("Welcome"); // ✅ redirecționare directă
      } else {
        setUser(null);
        setInitialScreen("Login");
      }

      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007540" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialScreen}
          screenOptions={{
            headerStyle: { backgroundColor: "#007540" },
            headerTintColor: "white",
            contentStyle: { backgroundColor: "#3f2f25" },
            animation: "slide_from_right",
          }}
        >
          {!user ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Result" component={ResultScreen} />
              <Stack.Screen name="Aliments" component={AlimentsScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="ProteinsScreen" component={ProteinsScreen} />
              <Stack.Screen name="CarbsScreen" component={CarbsScreen} />
              <Stack.Screen name="FatsScreen" component={FatsScreen} />

              

            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
