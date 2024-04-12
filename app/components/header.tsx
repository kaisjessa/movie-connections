import React from "react";
import { firebase_db } from "../firebase/config";
import { getPuzzles } from "../firebase/lib";

const getRandomPuzzle = async () => {
  const puzzles = await getPuzzles(0);
  const puzzleIds = puzzles.map((puzzle) => puzzle.id);
  const randomIndex = Math.floor(Math.random() * puzzleIds.length);
  const randomPuzzle = puzzleIds[randomIndex];
  return "/puzzles/" + randomPuzzle;
};

const Header = async () => {
  return (
    <div className="navbar bg-base-100">
      <a className="header-btn" href={await getRandomPuzzle()}>
        Random
      </a>
      <a className="header-btn" href="/browse">
        Browse
      </a>
      <a className="header-btn" href="/create">
        Create
      </a>
    </div>
  );
};

export default Header;
