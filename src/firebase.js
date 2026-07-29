// Imported functions from SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2fQ3IrDBXm1091fi8GcFsT5o8J34QHws",
    authDomain: "voltmeter-b3395.firebaseapp.com",
    projectId: "voltmeter-b3395",
    storageBucket: "voltmeter-b3395.firebasestorage.app",
    messagingSenderId: "979743629336",
    appId: "1:979743629336:web:9b8b9a03dc3578d144236d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app); // auth instance
const db = getFirestore(app); // database instance

// Export services
export { auth, db };