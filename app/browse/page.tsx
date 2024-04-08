import React from "react";
import { getPuzzles } from "@/app/firebase/lib";
import Link from "next/link";

const Browse = async () => {
  const puzzleHeaders = await getPuzzles();
  return (
    <div>
      {puzzleHeaders.map((p, i) => {
        return (
          <div key={i}>
            <h1>{p.name}</h1>
            <h2>{p.author}</h2>
            <h3>{p.timestamp.toDate().toString()}</h3>
            <Link href={`/puzzles/${p.id}`}>View</Link>
          </div>
        );
      })}
    </div>
  );
};

export default Browse;
