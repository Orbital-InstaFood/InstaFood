// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDDq1uxsca3kc3KVSO41I6MxaERqe9F2YM",
  authDomain: "orbital-386a9.firebaseapp.com",
  projectId: "orbital-386a9",
  storageBucket: "orbital-386a9.appspot.com",
  messagingSenderId: "970918918366",
  appId: "1:970918918366:web:3fa7c701c44893cf406a4f",
  measurementId: "G-NNHB2PVBZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { storage, db, auth };