"use client";
import React from "react";
import { Movie, Puzzle, PuzzleContents } from "../firebase/types";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

// const shuffle = (array: Movie[]) => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// };

const updateSelected = (selected: string[], title: string): string[] => {
  if (selected.includes(title)) return selected.filter((i) => i !== title);
  if (selected.length === 4) return selected;
  return [...selected, title];
};

const arraysEqual = (a: string[], b: string[]) => {
  return a.every((v) => b.includes(v)) && b.every((v) => a.includes(v));
};

const checkCorrect = (selected: string[], contents: PuzzleContents) => {
  console.log(selected);
  for (const c of contents) {
    const category = c.category;
    const movies = c.movies.map((m) => m.title);
    console.log(movies);
    if (arraysEqual(selected, movies)) return [category, movies];
  }
  return [];
};

const PuzzlePiece = (props: { movie: Movie }) => {
  const [loading, setLoading]: [boolean, any] = useState(true);
  return (
    <div className="w-full h-auto">
      {loading && <span className="loading loading-dots loading-xs"></span>}
      <Image
        src={props.movie.poster}
        alt={props.movie.title}
        width={100}
        height={100}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

const PuzzleLoading = () => {
  return (
    <>
      <p>Loading...</p>
    </>
  );
};

const DisplayPuzzle = (props: { data: Puzzle }) => {
  const puzzleHeader = props.data.header;
  const puzzleContents = props.data.contents;
  const puzzleTime = new Date(puzzleHeader.timestamp.seconds * 1000);
  const [movieOrder, setMovieOrder]: [Movie[], any] = useState([]);
  const [selected, setSelected]: [string[], any] = useState([]);
  const [loaded, isLoaded]: [boolean, any] = useState(false);
  const [categoriesFound, setCategoriesFound]: [string[], any] = useState([]);

  const onSubmit = () => {
    setSelected([]);
    const result = checkCorrect(selected, puzzleContents);
    if (result.length > 0) {
      setCategoriesFound([...categoriesFound, result[0]]);
    } else {
      console.log("Incorrect. Try again.");
    }
  };

  // load movies once they are ready
  useEffect(() => {
    isLoaded(true);
  }, [movieOrder]);

  // update selectable movie list once category has been found
  useEffect(() => {
    setMovieOrder(
      puzzleContents
        .filter((c) => !categoriesFound.includes(c.category))
        .map((c) => c.movies)
        .flat()
        .slice()
        .sort(() => Math.random() - 0.5)
    );
  }, [categoriesFound, puzzleContents]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div id="puzzle" className="grid grid-cols-4 grid-flow-row gap-2">
        {loaded &&
          movieOrder.map(function (movie: Movie, id: number) {
            return (
              <button
                className={
                  selected.includes(movie.title) ? "opacity-50" : "opacity-100"
                }
                key={id}
                onClick={() =>
                  setSelected(updateSelected(selected, movie.title))
                }
              >
                <PuzzlePiece movie={movie} />
              </button>
            );
          })}
        {loaded || <PuzzleLoading />}
      </div>
      <div id="buttons">
        <button
          className="btn btn-primary m-1"
          onClick={() => {
            setSelected([]);
            setMovieOrder(
              puzzleContents
                .filter((c) => !categoriesFound.includes(c.category))
                .map((c) => c.movies)
                .flat()
                .slice()
                .sort(() => Math.random() - 0.5)
            );
          }}
        >
          Shuffle
        </button>
        <button className="btn btn-primary m-1" onClick={() => setSelected([])}>
          Deselect All
        </button>
        <button className="btn btn-primary m-1" onClick={onSubmit}>
          Submit
        </button>
      </div>
      <div id="title" className="pl-2">
        <h1 className="text-3xl font-bold">{puzzleHeader.name}</h1>
        <h2 className="text-lg">Author: {puzzleHeader.author}</h2>
        <h3 className="text-md">Created: {puzzleTime.toDateString()}</h3>
      </div>
    </div>
  );
};

export default DisplayPuzzle;
