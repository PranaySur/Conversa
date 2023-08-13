import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCdlCvv4gXfR1g2iTgLlCcma_rJaVUKRNk",
    authDomain: "reactconversa.firebaseapp.com",
    projectId: "reactconversa",
    storageBucket: "reactconversa.appspot.com",
    messagingSenderId: "854595969266",
    appId: "1:854595969266:web:739d259bcee49b451b306b"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);