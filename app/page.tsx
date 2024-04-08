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
import { setUpFirebase, writeMovie } from "@/app/firebase";
import { getData } from "../data/sample";

type puzzle = {
  id: number;
  name: string;
  author: string;
  timestamp: FieldValue;
  contents: Array<{ category: string; movies: number[] }>;
};

export default async function Home() {
  const db = setUpFirebase();
  const newPuzzleRef = doc(collection(db, "puzzles"));
  const data = getData(db);

  await setDoc(newPuzzleRef, data);
  return <div>Hello</div>;
}
