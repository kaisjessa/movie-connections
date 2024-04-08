import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import {
  Movie,
  Puzzle,
  PuzzleHeader,
  PuzzleContents,
} from "@/app/firebase/types";
import { firebase_db } from "@/app/firebase/config";

// gets all puzzle header data from firebase
export const getPuzzles = async (): Promise<PuzzleHeader[]> => {
  const querySnapshot = await getDocs(collection(firebase_db, "puzzles"));
  const puzzleHeaders = querySnapshot.docs.map((p) => {
    return {
      id: p.id,
      name: p.data().name,
      author: p.data().author,
      timestamp: p.data().timestamp,
    };
  });
  return puzzleHeaders;
};

export const setMovie = async (movie: Movie): Promise<void> => {
  await setDoc(doc(firebase_db, "movies", movie.id.toString()), {
    title: movie.title,
    backdrop: movie.backdrop,
    poster: movie.poster,
  });
};

export const getMovie = async (id: string) => {
  const docRef = doc(firebase_db, "movies", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const tempMovie: Movie = {
      id: docSnap.data().id,
      title: docSnap.data().title,
      backdrop: docSnap.data().backdrop,
      poster: docSnap.data().poster,
    };
    return tempMovie;
  } else {
    return null;
  }
};

// TODO: setPuzzle for /create

export const getPuzzle = async (id: string) => {
  const docRef = doc(firebase_db, "puzzles", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

/*
  Converts data from firebase to Puzzle
  Converts inner data from firebase to Movie using getMovie()
*/
export const dataToPuzzle = async (puzzleData: DocumentData) => {
  const pHeader: PuzzleHeader = {
    id: puzzleData.id,
    name: puzzleData.name,
    author: puzzleData.author,
    timestamp: puzzleData.timestamp,
  };

  let pContents: PuzzleContents = [];
  for (const c of puzzleData.contents) {
    let temp: { category: string; movies: Movie[] } = {
      category: c.category,
      movies: [],
    };
    for (const m of c.movies) {
      const tempMovie = await getMovie(m.id.toString());
      if (tempMovie) temp.movies.push(tempMovie);
    }
    pContents.push(temp);
  }

  const newPuzzle: Puzzle = {
    header: pHeader,
    contents: pContents,
  };

  return newPuzzle;
};
