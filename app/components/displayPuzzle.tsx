"use client";
import React from "react";
import { Movie, Puzzle } from "../firebase/types";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

const shuffle = (array: Movie[]): Movie[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const updateSelected = (selected: string[], title: string): string[] => {
  if (selected.includes(title)) {
    return selected.filter((i) => i !== title);
  } else if (selected.length === 4) {
    return selected;
  } else {
    return [...selected, title];
  }
};

const PuzzlePiece = (props: { movie: Movie }) => {
  return (
    <figure className="w-full h-auto">
      <Image
        src={props.movie.poster}
        alt={props.movie.title}
        width={100}
        height={100}
      />
    </figure>
  );
};

const DisplayPuzzle = (props: { data: Puzzle }) => {
  const puzzleHeader = props.data.header;
  const puzzleContents = props.data.contents;
  const puzzleTime = new Date(puzzleHeader.timestamp.seconds * 1000);
  const movies = shuffle(puzzleContents.map((c) => c.movies).flat());
  const [movieList, setMovies] = useState(movies);
  const [selected, setSelected]: [string[], any] = useState([]);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  return (
    <div>
      <div className="grid grid-cols-4 grid-flow-row gap-4 m-2">
        {movieList.map(function (movie: Movie, id: number) {
          return (
            <button
              className={
                selected.includes(movie.title) ? "opacity-50" : "opacity-100"
              }
              key={id}
              onClick={() => setSelected(updateSelected(selected, movie.title))}
            >
              <PuzzlePiece movie={movie} />
            </button>
          );
        })}
      </div>
      <div className="pt-4">
        <button
          className="btn btn-primary m-1"
          onClick={() => {
            setSelected([]);
            setMovies(shuffle(movies));
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
