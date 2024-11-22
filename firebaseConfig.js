import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
    apiKey: "AIzaSyDxI6mYUEuJCUZDsw6PGi41AWqMOF5MQZ0",
    authDomain: "groupup-7a764s.firebaseapp.com",
    projectId: "groupup-7a764",
    storageBucket: "groupup-7a764.appspot.com",
    messagingSenderId: "898477628360",
    appId: "1:898477628360:web:5c1af070901081f2033efd",
    measurementId: "G-2JB1PPWK5R"
  };

const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});


export const db = getFirestore(app);
