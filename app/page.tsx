import React from "react";
import { getPuzzleHeaders } from "@/app/firebase/lib";
import Link from "next/link";
import { randomInt } from "crypto";
import Browse from "./components/browse";
import { unstable_noStore as noStore } from "next/cache";

const Home = async () => {
  const perPage = 25;
  noStore();
  const puzzleData = await getPuzzleHeaders(perPage);
  return <Browse puzzleData={puzzleData} />;
};

export default Home;
