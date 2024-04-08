import { getApps, initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

export const firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const firebase_db = getFirestore(firebase_app);
