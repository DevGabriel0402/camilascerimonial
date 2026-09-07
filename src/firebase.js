import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCrg2eEKwptWcutm8k9nKufjN6HBex3_I",
  authDomain: "cerimonial-camilas.firebaseapp.com",
  projectId: "cerimonial-camilas",
  storageBucket: "cerimonial-camilas.firebasestorage.app",
  messagingSenderId: "674632643737",
  appId: "1:674632643737:web:02d04ab6e87fd4e163b408",
  measurementId: "G-W0MD8H43S7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;
