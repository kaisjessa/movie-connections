import React from "react";
import { getPuzzles } from "@/app/firebase/lib";

const Browse = () => {
  console.log(getPuzzles());
  return <div>Browse</div>;
};

export default Browse;
