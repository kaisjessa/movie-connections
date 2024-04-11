"use client";
import React from "react";
import { Movie, Puzzle } from "../firebase/types";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

const shuffle = (array: Movie[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const PuzzlePiece = (props: { movie: Movie }) => {
  return (
    <div>
      <figure>
        <Image
          src={props.movie.poster}
          alt={props.movie.title}
          width={100}
          height={100}
        />
      </figure>
      {/* <p className="text-center">{props.movie.title}</p> */}
    </div>
  );
};

const DisplayPuzzle = (props: { data: Puzzle }) => {
  const puzzleHeader = props.data.header;
  const puzzleContents = props.data.contents;
  let movieList = puzzleContents.map((c) => c.movies).flat();
  movieList = shuffle(movieList);
  const puzzleTime = new Date(puzzleHeader.timestamp.seconds * 1000);
  return (
    <div>
      <h1>{puzzleHeader.name}</h1>
      <h2>{puzzleHeader.author}</h2>
      <h3>{puzzleTime.toString()}</h3>

      <div className="grid grid-rows-4 grid-flow-col gap-4">
        {movieList.map(function (movie: Movie, id: number) {
          return <PuzzlePiece key={id} movie={movie} />;
        })}
      </div>
      <div className="pt-8">
        <button className="btn btn-primary">Shuffle</button>
        <button className="btn btn-primary">Deselect All</button>
        <button className="btn btn-primary">Submit</button>
      </div>
    </div>
  );
};

export default DisplayPuzzle;
