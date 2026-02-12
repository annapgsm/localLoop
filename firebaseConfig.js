// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Auth for React Native with persistence
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBUmR36RHE5j8omSgvRNPh09oBZxYReanw",
  authDomain: "chatapp-21df0.firebaseapp.com",
  projectId: "chatapp-21df0",
  storageBucket: "chatapp-21df0.firebasestorage.app",
  messagingSenderId: "67453660794",
  appId: "1:67453660794:web:224ccbc72e537f5f30d5c3",
};

// Initialize once, export the SAME app everywhere
export const app = initializeApp(firebaseConfig);

// Initialize db once, export it too
export const db = getFirestore(app);

export const storage = getStorage(app);

// This replaces getAuth()
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});