"use client";
import React, { useEffect, useState } from "react";
import { Movie } from "../firebase/types";
import Image from "next/image";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { unstable_noStore as noStore } from "next/cache";

const Poster = (props: { movie: Movie }) => {
  const [loading, setLoading]: [boolean, any] = useState(true);
  return (
    <div className=" w-full h-auto">
      {loading && <span className="loading loading-dots loading-xs"></span>}
      <Image
        className="rounded-lg"
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
                <Image src={m.poster} alt={m.title} width={50} height={50} />
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
  console.log(props.allSelections[props.row - 1]);
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
    if (title.length === 0) {
      setErrMessage("Error: Title cannot be empty");
    } else if (author.length === 0) {
      setErrMessage("Error: Your name cannot be empty");
    } else if (
      categoryArray.length < 4 ||
      categoryArray.includes("") ||
      new Set(categoryArray).size != categoryArray.length
    )
      setErrMessage("Error: Categories cannot be empty or repeat");
    else if (
      movieArray.flat().map((m) => m?.id).length < 16 ||
      movieArray
        .flat()
        .map((m) => m?.id)
        .some((el) => !el || el == undefined || el == null) ||
      new Set(movieArray.flat().map((m) => m?.id)).size !=
        movieArray.flat().length
    )
      setErrMessage("Error: Movies cannot be empty or repeat");
    else setErrMessage("");
    console.log(errMessage);
  }, [categoryArray, movieArray, title, author, errMessage]);

  const updateCategoryAtI = (i: number) => {
    const updateCategories = (c: string) => {
      setCategoryArray(categoryArray.map((cc, ii) => (ii == i ? c : cc)));
    };
    return updateCategories;
  };
  const updateMoviesAtI = (i: number) => {
    const selections = movieArray[i];
    const updateMovies = (m: Movie, add: boolean) => {
      if (!add) {
        setMovieArray(
          movieArray.map((row, j) => row.filter((mm) => mm.id != m.id))
        );
      } else {
        if (
          movieArray
            .flat()
            .map((mm) => mm.id)
            .includes(m.id)
        ) {
          toast.error("Movie already added!", {
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
        } else if (selections.length == 4) {
          toast.error("Category is full!", {
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
          return;
        } else {
          setMovieArray(
            movieArray.map((row, j) => (j == i ? [...row, m] : row))
          );
        }
      }
    };

    return updateMovies;
  };
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
            setCat={updateCategoryAtI(i - 1)}
            setMovies={updateMoviesAtI(i - 1)}
            allSelections={movieArray}
          />
        ))}
      </div>
      <div>
        <button
          className={
            errMessage.length === 0
              ? "btn btn-secondary justify-center items-center"
              : "btn btn-disabled justify-center items-center"
          }
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default DisplayCreate;
