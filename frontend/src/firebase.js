// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACJEChLbKsPbbRY0LCH3omW4b9OLrxwMc",
  authDomain: "interview-app-1b0a5.firebaseapp.com",
  projectId: "interview-app-1b0a5",
  storageBucket: "interview-app-1b0a5.firebasestorage.app",
  messagingSenderId: "598799304350",
  appId: "1:598799304350:web:738b656eb09306246bdd8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);