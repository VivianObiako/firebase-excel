// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 

const firebaseConfig = {
    apiKey: "AIzaSyD5PXIFw_Y931uc0jKvdY9sWpxaXr-3Xp8",
    authDomain: "tour-guiding-62a80.firebaseapp.com",
    projectId: "tour-guiding-62a80",
    storageBucket: "tour-guiding-62a80.firebasestorage.app",
    messagingSenderId: "806910076801",
    appId: "1:806910076801:web:77cbe9e24178fd4fa82a80",
    measurementId: "G-JJWWKBL6C2",
  };

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { database };