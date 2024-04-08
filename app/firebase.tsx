import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  Firestore,
  addDoc,
  collection,
} from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

export const setUpFirebase = () => {
  const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  return db;
};

type Movie = {
  id: number;
  title: string;
  backdrop: string;
  poster: string;
};

export const writeMovie = async (db: Firestore, movie: Movie) => {
  await setDoc(doc(db, "movies", movie.id.toString()), {
    title: movie.title,
    backdrop: movie.backdrop,
    poster: movie.poster,
  });
};
