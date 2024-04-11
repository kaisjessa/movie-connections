import DisplayPuzzle from "@/app/components/displayPuzzle";
import { getPuzzle, dataToPuzzle } from "@/app/firebase/lib";
import { Puzzle } from "@/app/firebase/types";
import NotFound from "@/app/not-found";

export default async function Page({ params }: { params: { id: string } }) {
  // get puzzle data from firebase by id
  const puzzleData = await getPuzzle(params.id);
  if (puzzleData) {
    const newPuzzle = await dataToPuzzle(puzzleData);
    const data = JSON.parse(JSON.stringify(newPuzzle));
    return <DisplayPuzzle data={data} />;
  } else {
    return <NotFound />;
  }
}
