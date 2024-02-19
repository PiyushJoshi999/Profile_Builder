import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';
import {getDatabase} from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyAtFrwPnB3BxGUgRBNPbbxKrb_y_Qwe2_8",
  authDomain: "user-data-a6fea.firebaseapp.com",
  projectId: "user-data-a6fea",
  storageBucket: "user-data-a6fea.appspot.com",
  messagingSenderId: "937971444739",
  appId: "1:937971444739:web:7344f3ec45c029c474b236"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const imgDB = getStorage(app);
const textDB = getFirestore(app);
export const db = getDatabase(app);

export {imgDB, textDB};