// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1k3d1gNZ4HlMxhULHT39q2yNWVnelrvY",
  authDomain: "hotornot-61573.firebaseapp.com",
  projectId: "hotornot-61573",
  storageBucket: "hotornot-61573.appspot.com",
  messagingSenderId: "609098831319",
  appId: "1:609098831319:web:0de2cfede1cae10ae06792",
  measurementId: "G-0W1PZD9RSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;