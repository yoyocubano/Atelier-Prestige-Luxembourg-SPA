import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "weddings-events-96440339-a53e7",
  appId: "1:400810663534:web:ef2a6446833f30b58e107f",
  storageBucket: "weddings-events-96440339-a53e7.firebasestorage.app",
  apiKey: "AIzaSyDegwCL8ED0JCtJPR_SIcRro-KSD7B70VY",
  authDomain: "weddings-events-96440339-a53e7.firebaseapp.com",
  messagingSenderId: "400810663534",
  projectNumber: "400810663534"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
