"use client";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
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
import { AnimatePresence, motion } from "framer-motion";

const Poster = (props: { movie: Movie }) => {
  const [loading, setLoading]: [boolean, any] = useState(true);
  return (
    <div className="flex items-center justify-center w-full h-auto">
      {loading && <span className="loading loading-dots loading-xs"></span>}
      <Image
        className="rounded-lg h-auto border-2 border-zinc-400 mt-3"
        draggable={false}
        src={props.movie.poster || "/placeholder.jpg"}
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
        setUserSearch(e.target.value.substring(0, 256));
        props.func(e.target.value.substring(0, 256));
      }}
    />
  );
};

const MovieField = (props: { func: Function }) => {
  const [userSearch, setUserSearch]: [string, any] = useState("");
  const [data, setData]: [Movie[], any] = useState([]);
  useEffect(() => {
    const getData = async () => {
      // setData([]);
      // await new Promise((r) => setTimeout(r, 2000));
      if (userSearch.length === 0) {
        setData([]);
        return;
      }
      noStore();
      const movieData = await fetch(`/api/tmdb?query=${userSearch}`);
      const movies: Movie[] = await movieData.json();
      setData(movies.slice(0, 3));
    };
    getData();
  }, [userSearch]);

  const onSelection = (m: Movie) => {
    setUserSearch("");
    setData([]);
    props.func(m, true);
  };
  return (
    <div className="dropdown w-full">
      <input
        type="text"
        placeholder={"Search movie titles..."}
        className="input input-bordered w-full"
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
      />
      <motion.ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full"
      >
        {data.length > 0 && userSearch.length > 0 && (
          <>
            {data.map((m, i) => (
              <motion.li
                layout
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2, duration: 0.7, type: "linear" }}
                whileFocus={{ scale: 1.1 }}
                key={m.id.toString() + "__" + i.toString()}
                exit={{ opacity: 0, x: -100 }}
                className="bg-neutral border border-base-100"
              >
                <button onClick={() => onSelection(m)}>
                  <Image
                    className="rounded-lg h-auto border-2 border-zinc-400"
                    src={m.poster || "/placeholder.jpg"}
                    alt={m.title}
                    width={50}
                    height={50}
                  />
                  {m.title} {m.year ? "(" + m.year + ")" : ""}
                </button>
              </motion.li>
            ))}
          </>
        )}
        {data.length === 0 && userSearch.length > 0 && (
          <li className={"text-center"}>No results found</li>
        )}
      </motion.ul>
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

      <motion.div className="grid grid-cols-4 grid-flow-row pb-1 relative rounded justify-end items-end">
        <AnimatePresence>
          {props.allSelections[props.row - 1].map((m, i) => (
            <motion.button
              layout
              initial={{ scale: 1, opacity: 0, x: 200 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: 0,
                transition: { duration: 0.6, delay: 0.1, type: "easeIn" },
              }}
              exit={{
                scale: 0,
                opacity: 0,
                rotate: -60,
                x: -200,
                transition: { duration: 0.5, type: "linear" },
              }}
              key={m.id}
              className="border-2 border-transparent hover:opacity-20"
              onClick={() => {
                props.setMovies(m, false);
              }}
            >
              <Poster movie={m} />
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
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
              setTitle(e.target.value.substring(0, 256));
            }}
          />
          <input
            type="text"
            placeholder={`Your name`}
            className="input input-bordered w-full font-bold text-md"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value.substring(0, 256));
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
