import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDfrYX3qqRivv4HwbXAvv6pTdfnxvERB5A",
    authDomain: "conversa-ps.firebaseapp.com",
    projectId: "conversa-ps",
    storageBucket: "conversa-ps.appspot.com",
    messagingSenderId: "1032471060387",
    appId: "1:1032471060387:web:df4ead11541b7b63c40416"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);