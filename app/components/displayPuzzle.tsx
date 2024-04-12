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

const checkCorrect = (
  selected: string[],
  contents: PuzzleContents
): [string, Movie[]] | null => {
  console.log(selected);
  for (const c of contents) {
    const category = c.category;
    const movies = c.movies.map((m) => m.title);
    console.log(movies);
    if (arraysEqual(selected, movies)) return [category, c.movies];
  }
  return null;
};

const PuzzlePiece = (props: { movie: Movie }) => {
  const [loading, setLoading]: [boolean, any] = useState(true);
  return (
    <div className="w-full h-auto">
      {loading && <span className="loading loading-dots loading-xs"></span>}
      <Image
        className="rounded-lg"
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
  const [moviesFound, setMoviesFound]: [Movie[], any] = useState([]);
  const categories = puzzleContents.map((c) => c.category);
  const colours = [
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-red-400",
  ];

  const onSubmit = () => {
    setSelected([]);
    const result = checkCorrect(selected, puzzleContents);
    if (result) {
      setCategoriesFound([...categoriesFound, result[0]]);
      setMoviesFound([...moviesFound, ...result[1]]);
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
    <div className="flex flex-col items-center justify-center relative rounded">
      <div
        id="found"
        className="grid grid-cols-4 grid-flow-row pb-1 relative rounded"
      >
        {categoriesFound.map((c, i) => (
          <div
            key={i}
            className={`${
              colours[categories.indexOf(c)]
            } relative col-span-4 grid grid-rows-1 grid-flow-col rounded`}
          >
            {puzzleContents
              .filter((cc) => cc.category == c)
              .map((c) => c.movies)
              .flat()
              .map((m, j) => (
                <button
                  key={j}
                  className="border-4 border-transparent opacity-20 rounded"
                >
                  <PuzzlePiece movie={m} />
                </button>
              ))}
            <h2 className="absolute inset-0 top-1/2 mt-3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-black text-xl font-bold">
              {c}
            </h2>
          </div>
        ))}
      </div>
      <div id="puzzle" className="grid grid-cols-4 grid-flow-row rounded">
        {loaded &&
          movieOrder.map(function (movie: Movie, id: number) {
            return (
              <button
                className={
                  selected.includes(movie.title)
                    ? "rounded-md border-4 border-rose-500"
                    : "rounded-md border-4 border-transparent"
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
