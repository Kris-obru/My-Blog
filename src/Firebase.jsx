// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUCqQd4MLmrPJ_ZuU3h0PTuowsiIhlCN0",
  authAIzaSyCUCqQd4MLmrPJ_ZuU3h0PTuowsiIhlCN0Domain: "my-blog-c0626.firebaseapp.com",
  projectId: "my-blog-c0626",
  storageBucket: "my-blog-c0626.appspot.com",
  messagingSenderId: "60495498433",
  appId: "1:60495498433:web:ef2c3813718ea246c29840",
  measurementId: "G-HC0E3VFX91"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);