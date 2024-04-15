"use client";
import React, { useEffect, useState } from "react";
import { Movie } from "../firebase/types";
import Image from "next/image";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const CategoryField = (props: { row: number }) => {
  return (
    <input
      type="text"
      placeholder={`Enter category #${props.row}`}
      className="input input-bordered w-full"
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
      const movieData = await fetch(`/api/tmdb?query=${userSearch}`);
      const movies = await movieData.json();
      setData(movies);
    };
    getData();
  }, [userSearch]);

  const onSelection = (m: Movie) => {
    setUserSearch("");
    setData([]);
    props.func(m);
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

const MoviesBox = (props: { row: number }) => {
  const colours = [
    "border-blue-400",
    "border-green-400",
    "border-yellow-400",
    "border-red-400",
  ];
  const [selections, setSelections]: [Movie[], any] = useState([]);
  const updateSelections = (m: Movie) => {
    if (selections.map((m) => m.id).includes(m.id)) {
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
      return;
    }
    if (selections.length == 4) {
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
    }
    setSelections([...selections, m]);
  };

  return (
    <div
      className={`grid-col mx-2 my-4 min-h-64 border-2 rounded-xl ${
        colours[props.row - 1]
      }`}
    >
      <div className="justify-center w-full font-bold">
        <CategoryField row={props.row} />
      </div>
      <div className="justify-center w-full">
        <MovieField func={updateSelections} />
      </div>

      <div className="grid grid-cols-4 grid-flow-row pb-1 relative rounded">
        <div className="relative col-span-4 grid grid-rows-1 grid-flow-col rounded"></div>
        {selections.map((m, i) => (
          <button
            key={i}
            className="border-4 border-transparent rounded hover:opacity-20"
            onClick={() =>
              setSelections(selections.filter((mm) => m.id !== mm.id))
            }
          >
            <Poster movie={m} />
          </button>
        ))}
      </div>
    </div>
  );
};

const DisplayCreate = () => {
  return (
    <div className="flex flex-col items-center justify-center relative rounded">
      <ToastContainer />

      <div className="grid grid-cols-1 grid-flow-row pb-1 relative rounded w-screen max-w-screen-sm">
        <div className="pl-2">
          <input
            type="text"
            placeholder={`Puzzle Title`}
            className="input input-bordered w-full font-bold text-2xl"
          />
          <input
            type="text"
            placeholder={`Your name`}
            className="input input-bordered w-full font-bold text-md"
          />
        </div>
        <MoviesBox row={1} />
        <MoviesBox row={2} />
        <MoviesBox row={3} />
        <MoviesBox row={4} />
      </div>
      <div>
        <button className="btn btn-secondary justify-center items-center">
          Submit
        </button>
      </div>
    </div>
  );
};

export default DisplayCreate;
