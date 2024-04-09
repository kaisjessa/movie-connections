import React from "react";
import { getPuzzles } from "@/app/firebase/lib";
import Link from "next/link";

const Browse = async ({
  searchParams,
}: {
  searchParams: { lastId: string };
}) => {
  let lastId = searchParams.lastId || "";
  const perPage = 1;

  let puzzleData = await getPuzzles(perPage, lastId);
  return (
    <div>
      <div>
        {puzzleData.map((p, i) => {
          return (
            <div className="card w-96 bg-base-100 shadow-xl border-2" key={i}>
              <div className="card-body">
                <h1>{p.name}</h1>
                <h2>{p.author}</h2>
                <h3>
                  {p.timestamp.toDate().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </h3>
                <Link href={`/puzzles/${p.id}`}>View</Link>
              </div>
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
        <Link className="join-item btn btn-outline" href={`?lastId=${lastId}`}>
          Next
        </Link>
      </div>
    </div>
  );
};

export default Browse;
