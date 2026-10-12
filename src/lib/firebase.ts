import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3lyNfm09vCSdkqtuS0BDRliYFE2EOoW4",
  authDomain: "pagosulivo.firebaseapp.com",
  projectId: "pagosulivo",
  storageBucket: "pagosulivo.firebasestorage.app",
  messagingSenderId: "160876975549",
  appId: "1:160876975549:web:12de1c5afcfd7ab3652ed4",
  measurementId: "G-5457E83VVY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
