import { DocumentReference, Timestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

export type Movie = {
  id: number;
  title: string;
  backdrop: string;
  poster: string;
};

export type PuzzleHeader = {
  id: string;
  name: string;
  author: string;
  timestamp: Timestamp;
};

export type PuzzleContents = Array<{ category: string; movies: Movie[] }>;

export type Puzzle = {
  header: PuzzleHeader;
  contents: PuzzleContents;
};
