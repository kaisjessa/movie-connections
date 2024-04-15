import React from "react";
import { setPuzzle } from "../firebase/lib";
import sampleData from "../../data/sample2";
import { Movie, Puzzle } from "../firebase/types";
import { getData } from "../tmdb/config";
import DisplayCreate from "./displayCreate";

const setSamplePuzzle = async () => {
  // open json file
  const id = await setPuzzle(sampleData as Puzzle);
  console.log(id);
  return id;
};

const MovieField = async (props: { row: number; col: number }) => {
  return (
    <input
      type="text"
      placeholder={props.row.toString() + "-" + props.col.toString()}
      className="input input-bordered input-xs w-full max-w-xs"
    />
  );
};

async function Create() {
  return (
    <div>
      <DisplayCreate />
    </div>
  );
}

export default Create;
