import React from "react";
import { setPuzzle } from "../firebase/lib";
import sampleData from "../../data/sample2";
import { Movie, Puzzle } from "../firebase/types";
import DisplayCreate from "./displayCreate";

const setSamplePuzzle = async () => {
  // open json file
  const id = await setPuzzle(sampleData as Puzzle);
  console.log(id);
  return id;
};

async function Create() {
  return (
    <div>
      <DisplayCreate />
    </div>
  );
}

export default Create;
