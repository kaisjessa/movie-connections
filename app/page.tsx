import React from "react";
import { getPuzzleHeaders } from "@/app/firebase/lib";
import Link from "next/link";
import { randomInt } from "crypto";

const Home = async () => {
  const perPage = 25;
  const puzzleData = await getPuzzleHeaders(perPage);
  const colours = [
    "text-blue-400",
    "text-green-400",
    "text-yellow-400",
    "text-red-400",
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold m-4">List of Puzzles:</h1>
      <div>
        {puzzleData.map((p, i) => {
          return (
            <div
              key={i}
              className={"mx-4 mt-2 hover:" + colours[randomInt(0, 4)]}
            >
              <Link href={`/puzzles/${p.id}`}>
                <span className={"text-lg font-bold"}>{p.name} </span>
                <span className="text-sm">by </span>
                <span className="text-lg font-bold">{p.author} </span>
                <span className="text-xs">
                  {p.timestamp.toDate().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="join grid grid-cols-2 w-1/2">
        {/* <Link
          className={
            page > 1
              ? "join-item btn btn-outline"
              : "join-item btn-outline btn btn-disabled"
          }
          href={`?lastId=${page - 1}`}
        >
          Previous
        </Link> */}
        {/* <Link className="join-item btn btn-outline" href={`?lastId=${lastId}`}>
          Next
        </Link> */}
      </div>
    </div>
  );
};

export default Home;
