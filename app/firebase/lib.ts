import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  Movie,
  Puzzle,
  PuzzleContents,
  PuzzleHeader,
} from "@/app/firebase/types";
import { firebase_db } from "@/app/firebase/config";

// gets all puzzle header data from firebase
export const getPuzzleHeaders = async (
  lim: number
): Promise<PuzzleHeader[]> => {
  const puzzleRef = collection(firebase_db, "puzzles");
  const q = query(puzzleRef, orderBy("header.timestamp", "desc"), limit(lim));
  const querySnapshot = await getDocs(q);
  const puzzleHeaders = querySnapshot.docs.map((p) => {
    return {
      id: p.id,
      name: p.data().header.name,
      author: p.data().header.author,
      timestamp: p.data().header.timestamp,
    };
  });
  return puzzleHeaders;
};

export const setPuzzle = async (puzzle: Puzzle): Promise<string> => {
  const docRef = await addDoc(collection(firebase_db, "puzzles"), {
    header: puzzle.header,
    contents: puzzle.contents,
  });
  console.log("success", docRef.id.toString());
  return docRef.id;
};

export const getPuzzleData = async (id: string) => {
  const docRef = doc(firebase_db, "puzzles", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Puzzle;
  } else {
    return null;
  }
};
