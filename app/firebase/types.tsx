import { DocumentReference, Timestamp } from "firebase/firestore";

export type Movie = {
  id: number;
  title: string;
  backdrop: string;
  poster: string;
};

export type Puzzle = {
  id: number;
  name: string;
  author: string;
  timestamp: Timestamp;
  contents: Array<{ category: string; movies: Movie[] }>;
};
