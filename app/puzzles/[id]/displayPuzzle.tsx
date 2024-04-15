"use client";
import React from "react";
import {
  Movie,
  Puzzle,
  PuzzleContents,
  PuzzleHeader,
} from "../../firebase/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

// const shuffle = (array: Movie[]) => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// };

// const arraysEqual = (a: string[], b: string[]) => {
//   return a.every((v) => b.includes(v)) && b.every((v) => a.includes(v));
// };

const updateSelected = (selected: string[], title: string): string[] => {
  if (selected.includes(title)) return selected.filter((i) => i !== title);
  if (selected.length === 4) return selected;
  return [...selected, title];
};

const arrayCount = (a: string[], b: string[]) => {
  return a.filter((i) => b.includes(i)).length;
};

const checkCorrect = (
  selected: string[],
  contents: PuzzleContents
): [number, { category: string; movies: Movie[] }, number[]] => {
  let bestMatch = contents[0];
  let bestCount = 0;
  let categoriesGuessed: number[] = [];
  for (let i = 0; i < contents.length; i++) {
    const c = contents[i];
    const category = c.category;
    const movies = c.movies.map((m) => m.title);
    if (arrayCount(selected, movies) > bestCount) {
      bestCount = arrayCount(selected, movies);
      bestMatch = c;
    }
    for (const s of selected) {
      if (movies.includes(s)) categoriesGuessed.push(i);
    }
  }
  return [bestCount, bestMatch, categoriesGuessed];
};

const FoundComponent = (props: {
  categoriesFound: string[];
  colours: string[];
  puzzleContents: PuzzleContents;
  categories: string[];
}) => {
  return (
    <div
      id="found"
      className="grid grid-cols-4 grid-flow-row pb-1 relative rounded"
    >
      {props.categoriesFound.map((c, i) => (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: 1,
            scale: [0, 1.0],
          }}
          transition={{
            duration: 1.5,
            type: "spring",
            bounce: 0.5,
          }}
          key={i}
          className={`${
            props.colours[props.categories.indexOf(c)]
          } relative col-span-4 grid grid-rows-1 grid-flow-col rounded`}
        >
          {props.puzzleContents
            .filter((cc) => cc.category == c)
            .map((c) => c.movies)
            .flat()
            .map((m, j) => (
              <button
                key={j}
                className="border-4 border-transparent opacity-20 rounded"
              >
                <PuzzlePiece movie={m} solved={false} />
              </button>
            ))}
          <div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-black">
            <h2 className="text-xl font-bold">{c}</h2>
            <div className="text-md">
              {props.puzzleContents
                .filter((cc) => cc.category == c)
                .map((c) => c.movies)
                .flat()
                .map((m) => m.title)
                .join(", ")}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const PuzzleComponent = (props: {
  isLoaded: boolean;
  movieOrder: Movie[];
  selected: string[];
  setSelected: Function;
}) => {
  const variants = {
    clicked: { opacity: 0.5, scale: 1 },
    unclicked: { opacity: 1, scale: 1 },
  };
  return (
    <div id="puzzle" className="grid grid-cols-4 grid-flow-row rounded">
      {props.isLoaded &&
        props.movieOrder.map(function (movie: Movie, id: number) {
          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.2 }}
              animate={
                props.selected.includes(movie.title) ? "clicked" : "unclicked"
              }
              variants={variants}
              transition={{
                duration: 0.7,
                type: "spring",
              }}
              className={"rounded-md border-4 border-transparent"}
              key={movie.title}
              onClick={() =>
                props.setSelected(updateSelected(props.selected, movie.title))
              }
            >
              <PuzzlePiece movie={movie} solved={false} />
            </motion.div>
          );
        })}
      {props.isLoaded || <PuzzleLoading />}
    </div>
  );
};

const ButtonsComponent = (props: {
  isGameOver: boolean;
  onSubmit: any;
  setMovieOrder: Function;
  setSelected: any;
  puzzleContents: PuzzleContents;
  categoriesFound: string[];
  selected: string[];
}) => {
  return (
    <div id="buttons">
      <button
        className={
          props.isGameOver ? "hidden" : "btn btn-accent m-1 btn-outline"
        }
        onClick={() => {
          props.setMovieOrder(
            props.puzzleContents
              .filter((c) => !props.categoriesFound.includes(c.category))
              .map((c) => c.movies)
              .flat()
              .slice()
              .sort(() => Math.random() - 0.5)
          );
        }}
      >
        Shuffle
      </button>
      <button
        className={
          props.isGameOver ? "hidden" : "btn btn-secondary m-1 btn-outline"
        }
        onClick={() => props.setSelected([])}
      >
        Deselect All
      </button>
      <button
        className={
          props.isGameOver
            ? "hidden"
            : props.selected.length === 4
            ? "btn btn-primary m-1 "
            : "btn btn-outline btn-disabled m-1"
        }
        onClick={props.onSubmit}
      >
        Submit
      </button>
      <button
        className={
          props.isGameOver ? "btn btn-outline btn-primary m-1 " : "hidden"
        }
        onClick={() => {
          openModal();
        }}
      >
        View results
      </button>
    </div>
  );
};

const PuzzlePiece = (props: { movie: Movie; solved: boolean }) => {
  const [loading, setLoading]: [boolean, any] = useState(true);
  return (
    <div className=" w-full h-auto ">
      {loading && <span className="loading loading-dots loading-xs"></span>}
      <Image
        className="rounded-lg h-auto"
        draggable={false}
        src={props.movie.poster}
        alt={props.movie.title}
        width={props.solved ? 90 : 100}
        height={props.solved ? 90 : 100}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

const ModalComponent = (props: {
  emojiStrings: string[];
  puzzleHeader: PuzzleHeader;
  dateOptions: { [key: string]: any };
}) => {
  return (
    <dialog id="user_results" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h2 className="font-bold text-3xl pb-4">Share your results!</h2>
        <div id="modal-content" className="pl-2 text-center">
          <span className="text-lg font-bold">{props.puzzleHeader.name} </span>
          <span className="text-sm font-bold">
            by {props.puzzleHeader.author}
          </span>
          <div className="text-xs">
            Played{" "}
            {new Date().toLocaleString("en-US", props.dateOptions as any)}
          </div>
          {props.emojiStrings.map((c, i) => (
            <div key={i} className="text-3xl">
              {c}
            </div>
          ))}
        </div>

        <div className="modal-action justify-center">
          <button
            className="btn btn-outline btn-wide"
            onClick={() => {
              copyModal();
            }}
          >
            Copy results
          </button>
        </div>
      </div>
    </dialog>
  );
};

const PuzzleLoading = () => {
  // return <p>Loading...</p>;
  return (
    <>
      <p>Loading...</p>
    </>
  );
};

const openModal = () => {
  const userResults = document.getElementById(
    "user_results"
  ) as HTMLDialogElement;
  if (userResults) userResults.showModal();
};

const copyModal = () => {
  const copyContents = document.getElementById("modal-content");
  if (copyContents) {
    navigator.clipboard.writeText(
      window.location.href + "\n" + copyContents.innerText
    );
    toast.success("Copied to clipboard!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: 0,
      theme: "colored",
      transition: Bounce,
    });
  }
};

const DisplayPuzzle = (props: { data: Puzzle }) => {
  const puzzleHeader = props.data.header;
  const puzzleContents = props.data.contents;
  const puzzleTime = new Date(puzzleHeader.timestamp.seconds * 1000);
  const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const categories = puzzleContents.map((c) => c.category);
  const [isLoaded, setIsLoaded]: [boolean, any] = useState(false);
  const [isGameOver, setIsGameOver]: [boolean, any] = useState(false);
  const [movieOrder, setMovieOrder]: [Movie[], any] = useState([]);
  const [selected, setSelected]: [string[], any] = useState([]);
  const [categoriesFound, setCategoriesFound]: [string[], any] = useState([]);
  const [moviesFound, setMoviesFound]: [Movie[], any] = useState([]);
  const [emojiStrings, setEmojiStrings]: [string[], any] = useState([]);

  const colours = [
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-red-400",
  ];
  const emojis = ["🟦", "🟩", "🟨", "🟥"];

  const onSubmit = () => {
    setSelected([]);
    const [count, bestMatch, categoriesGuessed] = checkCorrect(
      selected,
      puzzleContents
    );
    const guessString: string = categoriesGuessed
      .map((i) => emojis[i])
      .join("");
    setEmojiStrings((emojiStrings: string[]) => [...emojiStrings, guessString]);
    if (count === 4) {
      setCategoriesFound([...categoriesFound, bestMatch.category]);
      setMoviesFound([...moviesFound, ...bestMatch.movies]);
    } else if (count === 3) {
      toast.warning("One away!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: 0,
        theme: "colored",
        transition: Bounce,
      });
    } else {
      toast.error("Incorrect!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: 0,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  // load movies once they are ready
  useEffect(() => {
    setIsLoaded(true);
  }, [isLoaded]);

  // load movies once they are ready
  useEffect(() => {
    if (isLoaded && movieOrder.length === 0) {
      setIsGameOver(true);
    }
  }, [isLoaded, movieOrder]);

  // load movies once they are ready
  useEffect(() => {
    if (isGameOver) {
      openModal();
    }
  }, [isGameOver]);

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
      <ToastContainer />
      <FoundComponent
        categoriesFound={categoriesFound}
        colours={colours}
        puzzleContents={puzzleContents}
        categories={categories}
      />
      <PuzzleComponent
        isLoaded={isLoaded}
        movieOrder={movieOrder}
        selected={selected}
        setSelected={setSelected}
      />
      <ButtonsComponent
        isGameOver={isGameOver}
        onSubmit={onSubmit}
        setMovieOrder={setMovieOrder}
        setSelected={setSelected}
        puzzleContents={puzzleContents}
        categoriesFound={categoriesFound}
        selected={selected}
      />
      <div id="title" className="pl-2">
        <h1 className="text-3xl font-bold">{puzzleHeader.name}</h1>
        <h2 className="text-lg">Author: {puzzleHeader.author}</h2>
        <h3 className="text-md">
          Created: {puzzleTime.toLocaleString("en-US", dateOptions as any)}
        </h3>
      </div>
      <ModalComponent
        emojiStrings={emojiStrings}
        puzzleHeader={puzzleHeader}
        dateOptions={dateOptions}
      />
    </div>
  );
};

export default DisplayPuzzle;
