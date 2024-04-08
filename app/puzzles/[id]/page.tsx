import { getPuzzle, dataToPuzzle } from "@/app/firebase/lib";
import { Puzzle } from "@/app/firebase/types";
import NotFound from "@/app/not-found";

const displayPuzzle = (newPuzzle: Puzzle) => {
  return (
    <div>
      <h1>{newPuzzle.name}</h1>
      <h2>{newPuzzle.author}</h2>
      <h3>{newPuzzle.timestamp.toDate().toString()}</h3>

      {newPuzzle.contents.map((c, j) => (
        <div key={j}>
          <h4 className="text-lg">{c.category}</h4>
          <ul>
            {c.movies.map((m, i) => (
              <li key={i} className="text-sm">
                {m.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default async function Page({ params }: { params: { id: string } }) {
  // get puzzle data from firebase by id
  const puzzleData = await getPuzzle(params.id);
  // if it exists, display puzzle
  if (puzzleData) {
    const newPuzzle = await dataToPuzzle(puzzleData);
    return <div>{displayPuzzle(newPuzzle)}</div>;
  } else {
    return <NotFound />;
  }
}
