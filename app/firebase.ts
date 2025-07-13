import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnwW3yCRoeUazicgJIv_sdTUdVG6M3x3M",
  authDomain: "kstar-3ff0a.firebaseapp.com",
  projectId: "kstar-3ff0a",
  storageBucket: "kstar-3ff0a.appspot.com",
  messagingSenderId: "573128879945",
  appId: "1:573128879945:web:0c1624560b48f5ac167498",
  measurementId: "G-SEDN779RMS"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 