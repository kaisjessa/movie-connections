import { doc, DocumentData, getDoc, setDoc } from "firebase/firestore";
import { Movie, Puzzle } from "@/app/firebase/types";
import { firebase_db } from "@/app/firebase/config";

export const setMovie = async (movie: Movie) => {
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
    return docSnap.data();
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
  Converts inner data from firebase to Movie
*/
export const dataToPuzzle = async (puzzleData: DocumentData) => {
  let contents: Array<{ category: string; movies: Movie[] }> = [];
  for (const c of puzzleData.contents) {
    let temp: { category: string; movies: Movie[] } = {
      category: c.category,
      movies: [],
    };
    for (const m of c.movies) {
      const movieData = await getMovie(m.id.toString());
      if (movieData) {
        const tempMovie: Movie = {
          id: movieData.id,
          title: movieData.title,
          backdrop: movieData.backdrop,
          poster: movieData.poster,
        };
        temp.movies.push(tempMovie);
      }
    }
    contents.push(temp);
  }
  const newPuzzle: Puzzle = {
    id: puzzleData.id,
    name: puzzleData.name,
    author: puzzleData.author,
    timestamp: puzzleData.timestamp,
    contents: contents,
  };

  return newPuzzle;
};
