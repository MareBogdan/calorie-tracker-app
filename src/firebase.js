import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDCLhqZcf7pjQCwN46LLL8VJm0cRqcFwjc",
  authDomain: "calorie-tracker-app-9749c.firebaseapp.com",
  projectId: "calorie-tracker-app-9749c",
  storageBucket: "calorie-tracker-app-9749c.firebasestorage.app",
  messagingSenderId: "283896422979",
  appId: "1:283896422979:web:63b47389fc795d66cb2af6",
  measurementId: "G-MS0RT4004D"
};


const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
