import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "API_KEY_HERE",
  authDomain: "PUT_DOMAIN_HERE",
  projectId: "sale-buddy-fbaf7",
  storageBucket: "sale-buddy-fbaf7.appspot.com",
  messagingSenderId: "720829636966",
  appId: "PUT_ID_HERE",
  measurementId: "G-EMQ8GE5V8H"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
