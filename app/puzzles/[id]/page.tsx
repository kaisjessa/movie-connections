import DisplayPuzzle from "@/app/components/displayPuzzle";
import { getPuzzleData } from "@/app/firebase/lib";
import { Puzzle } from "@/app/firebase/types";
import NotFound from "@/app/not-found";

export default async function Page({ params }: { params: { id: string } }) {
  // get puzzle data from firebase by id
  const puzzleData = await getPuzzleData(params.id);
  if (puzzleData) {
    const data = JSON.parse(JSON.stringify(puzzleData));
    return <DisplayPuzzle data={data} />;
  } else {
    return <NotFound />;
  }
}
