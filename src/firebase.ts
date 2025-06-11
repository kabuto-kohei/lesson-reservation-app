// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA94HVUX02W33BC9gJD7kG2uxHKFM7vNWA",
  authDomain: "rlresetvationapp.firebaseapp.com",
  projectId: "rlresetvationapp",
  storageBucket: "rlresetvationapp.firebasestorage.app",
  messagingSenderId: "756513289634",
  appId: "1:756513289634:web:308261a676cc51e0e72efb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
