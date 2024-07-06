import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJde2AirREXf8oCftdbcsftZa-El6aybc",
  authDomain: "sale-buddy-fbaf7.firebaseapp.com",
  projectId: "sale-buddy-fbaf7",
  storageBucket: "sale-buddy-fbaf7.appspot.com",
  messagingSenderId: "720829636966",
  appId: "1:720829636966:web:20840163029553c6c828a7",
  measurementId: "G-EMQ8GE5V8H"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
