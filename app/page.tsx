import Image from "next/image";
import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  doc,
  setDoc,
  addDoc,
  Firestore,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import { firebase_db } from "@/app/firebase/config";
import { getData } from "../data/sample";

type puzzle = {
  id: number;
  name: string;
  author: string;
  timestamp: FieldValue;
  contents: Array<{ category: string; movies: number[] }>;
};

export default async function Home() {
  // for (let i = 0; i < 10; i++) {
  //   const newPuzzleRef = doc(collection(firebase_db, "puzzles"));
  //   const data = getData(firebase_db, i.toString());
  //   await setDoc(newPuzzleRef, data);
  // }

  return <div>Hello</div>;
}
