"use client";
import React from "react";
import { Movie, Puzzle } from "../firebase/types";
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

const PuzzlePiece = (props: { movie: Movie }) => {
  const [loading, setLoading]: [boolean, any] = useState(true);
  return (
    <figure className="w-full h-auto">
      {loading && <span className="loading loading-dots loading-xs"></span>}
      <Image
        src={props.movie.poster}
        alt={props.movie.title}
        width={100}
        height={100}
        onLoad={() => setLoading(false)}
      />
    </figure>
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
  const [movieList, setMovies]: [Movie[], any] = useState([]);
  const [selected, setSelected]: [string[], any] = useState([]);
  const [loaded, isLoaded]: [boolean, any] = useState(false);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  useEffect(() => {
    setMovies(
      puzzleContents
        .map((c) => c.movies)
        .flat()
        .slice()
        .sort(() => Math.random() - 0.5)
    );
  }, [puzzleContents]);

  useEffect(() => {
    isLoaded(true);
  }, [movieList]);

  return (
    <div>
      <div className="grid grid-cols-4 grid-flow-row gap-4 m-2">
        {loaded &&
          movieList.map(function (movie: Movie, id: number) {
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
      <div className="pt-4">
        <button
          className="btn btn-primary m-1"
          onClick={() => {
            selected.length > 0 ? setSelected([]) : null;
            setMovies(
              puzzleContents
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
        <button className="btn btn-primary m-1">Submit</button>
      </div>
      <div>
        <h1>{puzzleHeader.name}</h1>
        <h2>{puzzleHeader.author}</h2>
        <h3>{puzzleTime.toDateString()}</h3>
      </div>
    </div>
  );
};

export default DisplayPuzzle;
