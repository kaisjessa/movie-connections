import React from "react";
import { setPuzzle } from "../firebase/lib";
import sampleData from "../../data/sample2";
import { Puzzle } from "../firebase/types";

const setSamplePuzzle = async () => {
  // open json file
  const id = await setPuzzle(sampleData as Puzzle);
  console.log(id);
  return id;
};

const Create = () => {
  const id = setSamplePuzzle();
  return <div>id</div>;
};

export default Create;
