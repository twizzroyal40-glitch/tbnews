import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6Xla3vEyrmT907qvm3dAUjoQxHqJJwVI",
  authDomain: "tbnews-ea51f.firebaseapp.com",
  projectId: "tbnews-ea51f",
  storageBucket: "tbnews-ea51f.firebasestorage.app",
  messagingSenderId: "164899373320",
  appId: "1:164899373320:web:6441e0990dfbc2abafecbd",
  measurementId: "G-3DVGNKZF1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);