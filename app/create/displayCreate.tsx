"use client";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Movie, Puzzle } from "../firebase/types";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { unstable_noStore as noStore } from "next/cache";
import {
  determineValid,
  FormSubmission,
  formToPuzzle,
  updateCategoryAtI,
  updateMoviesAtI,
} from "./lib";
import sampleData from "../../data/sample2";
import { useRouter } from "next/navigation";

const Poster = (props: { movie: Movie }) => {
  const [loading, setLoading]: [boolean, any] = useState(true);
  return (
    <div className=" w-full h-auto">
      {loading && <span className="loading loading-dots loading-xs"></span>}
      <Image
        className="rounded-lg h-auto"
        draggable={false}
        src={props.movie.poster}
        alt={props.movie.title}
        width={100}
        height={100}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

const CategoryField = (props: { row: number; func: Function }) => {
  const [userSearch, setUserSearch]: [string, any] = useState("");
  return (
    <input
      type="text"
      placeholder={`Enter category #${props.row}`}
      className="input input-bordered w-full"
      value={userSearch}
      onChange={(e) => {
        setUserSearch(e.target.value);
        props.func(e.target.value);
      }}
    />
  );
};

const MovieField = (props: { func: Function }) => {
  const [userSearch, setUserSearch]: [string, any] = useState("");
  const [data, setData]: [Movie[], any] = useState([]);
  useEffect(() => {
    const getData = async () => {
      if (userSearch.length === 0) {
        setData([]);
        return;
      }
      noStore();
      const movieData = await fetch(`/api/tmdb?query=${userSearch}`);
      const movies = await movieData.json();
      setData(movies);
    };
    getData();
  }, [userSearch]);

  const onSelection = (m: Movie) => {
    setUserSearch("");
    setData([]);
    props.func(m, true);
  };

  return (
    <div className="dropdown dropdown-open w-full">
      <input
        type="text"
        placeholder={"Search movie titles..."}
        className="input input-bordered w-full"
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
      />
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full"
      >
        {data.length > 0 &&
          data.map((m, i) => (
            <li key={i}>
              <button onClick={() => onSelection(m)}>
                <Image
                  className="rounded-lg h-auto"
                  src={m.poster}
                  alt={m.title}
                  width={50}
                  height={50}
                />
                {m.title} {m.year ? "(" + m.year + ")" : ""}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

const MoviesBox = (props: {
  row: number;
  setCat: Function;
  setMovies: Function;
  allSelections: Movie[][];
}) => {
  const colours = [
    "border-blue-400",
    "border-green-400",
    "border-yellow-400",
    "border-red-400",
  ];

  return (
    <div
      className={`grid-col mx-2 my-4 min-h-64 border-2 rounded-xl ${
        colours[props.row - 1]
      }`}
    >
      <div className="justify-center w-full font-bold">
        <CategoryField row={props.row} func={props.setCat} />
      </div>
      <div className="justify-center w-full">
        <MovieField func={props.setMovies} />
      </div>

      <div className="grid grid-cols-4 grid-flow-row pb-1 relative rounded">
        <div className="relative col-span-4 grid grid-rows-1 grid-flow-col rounded"></div>
        {props.allSelections[props.row - 1].map((m, i) => (
          <button
            key={i}
            className="border-4 border-transparent rounded hover:opacity-20"
            onClick={() => {
              props.setMovies(m, false);
            }}
          >
            <Poster movie={m} />
          </button>
        ))}
      </div>
    </div>
  );
};

const DisplayCreate = () => {
  const router = useRouter();
  const [movieArray, setMovieArray]: [Movie[][], any] = useState(
    new Array(4).fill([])
  );
  const [categoryArray, setCategoryArray]: [string[], any] = useState(
    new Array(4).fill("")
  );
  const [title, setTitle]: [string, any] = useState("");
  const [author, setAuthor]: [string, any] = useState("");
  const [errMessage, setErrMessage]: [string, any] = useState(
    "Error: Title cannot be empty"
  );

  useEffect(() => {
    determineValid(categoryArray, movieArray, title, author, setErrMessage);
    console.log(categoryArray, movieArray, title, author);
    console.log(errMessage);
  }, [categoryArray, movieArray, title, author, errMessage]);

  return (
    <div className="flex flex-col items-center justify-center relative rounded">
      <ToastContainer />

      <div className="grid grid-cols-1 grid-flow-row pb-1 relative rounded w-screen max-w-screen-sm">
        <div className="pl-2">
          <input
            type="text"
            placeholder={`Puzzle Title`}
            className="input input-bordered w-full font-bold text-2xl"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder={`Your name`}
            className="input input-bordered w-full font-bold text-md"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
            }}
          />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <MoviesBox
            key={i}
            row={i}
            setCat={updateCategoryAtI(i - 1, categoryArray, setCategoryArray)}
            setMovies={updateMoviesAtI(i - 1, movieArray, setMovieArray)}
            allSelections={movieArray}
          />
        ))}
      </div>
      <FormSubmission
        title={title}
        author={author}
        categoryArray={categoryArray}
        movieArray={movieArray}
        errMessage={errMessage}
        router={router}
      />
    </div>
  );
};

export default DisplayCreate;
