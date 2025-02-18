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

// const firebaseConfig = {
//   apiKey: "AIzaSyAn5aMoN0c1X_6zUA5Hhhri-SOseLaYtkU",
//   authDomain: "hula-map.firebaseapp.com",
//   databaseURL: "https://hula-map-default-rtdb.firebaseio.com",
//   projectId: "hula-map",
//   storageBucket: "hula-map.firebasestorage.app",
//   messagingSenderId: "749577821058",
//   appId: "1:749577821058:web:bd789b79cecb5d992f4d9b",
//   measurementId: "G-BZ42GE0K6T"
// };

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { database };