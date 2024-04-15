"use client";
import React, { useEffect, useState } from "react";
import { Movie } from "../firebase/types";
import Image from "next/image";

const CategoryField = (props: { row: number }) => {
  return (
    <input
      type="text"
      placeholder={"Category " + props.row.toString()}
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
    <div className="dropdown dropdown-open">
      <input
        type="text"
        placeholder={"Movie "}
        className="input input-bordered"
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
      />
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
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

const DisplayCreate = () => {
  const [selections, setSelections]: [Movie[], any] = useState([]);
  const updateSelections = (m: Movie) => {
    setSelections([...selections, m]);
  };
  return (
    <div className="grid grid-cols-1">
      <MovieField func={updateSelections} />
      {selections.map((m, i) => (
        <Image key={i} src={m.poster} alt={m.title} width={100} height={100} />
      ))}
    </div>
  );
};

export default DisplayCreate;
