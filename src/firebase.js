import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBtus22uz3a2uT4ej5Y4e5Oz6YppYmxqGs",
    authDomain: "kids-math-f9f5b.firebaseapp.com",
    projectId: "kids-math-f9f5b",
    storageBucket: "kids-math-f9f5b.appspot.com",
    messagingSenderId: "510794983240",
    appId: "1:510794983240:web:0976bd19793c17e73bb57d",
    measurementId: "G-KNC21P5H6B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, doc, storage, collection, addDoc, deleteDoc, getDocs, ref, uploadBytes, getDownloadURL, updateDoc };