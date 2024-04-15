"use client";
import React, { useEffect, useState } from "react";
import { Movie } from "tmdb-ts";
import { GET } from "../api/tmdb/route";

const CategoryField = (props: { row: number }) => {
  return (
    <input
      type="text"
      placeholder={"Category " + props.row.toString()}
      className="input input-bordered w-full"
    />
  );
};

const MovieField = (props: { row: number; col: number; f: any }) => {
  return (
    <input
      type="text"
      placeholder={"Movie " + props.col.toString()}
      className="input input-bordered w-full"
      onChange={(e) => props.f(e.target.value)}
    />
  );
};

const DisplayCreate = () => {
  const [userSearch, setUserSearch]: [string, any] = useState("");
  const [data, setData]: [Movie[], any] = useState([]);

  useEffect(() => {
    console.log("userSearch: ", userSearch);
    const getData = async () => {
      if (userSearch.length === 0) {
        setData([]);
        return;
      }
      const movieData = await fetch(`/api/tmdb?query=${userSearch}`);
      const movies = await movieData.json();
      setData(movies);
      console.log(movies);
    };
    getData();
  }, [userSearch]);
  return (
    <div className="grid grid-cols-1">
      <MovieField row={1} col={1} f={setUserSearch} />
      {data.map((m, i) => (
        <p key={i}>{m.title}</p>
      ))}
    </div>
  );
};

export default DisplayCreate;
