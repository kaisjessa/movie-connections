import { doc, collection, serverTimestamp } from "firebase/firestore";

export const getData = (db) => {
  return {
    id: 1,
    name: "My first puzzle",
    author: "Kais",
    timestamp: serverTimestamp(),
    contents: [
      {
        category: "Two actors play the same role",
        movies: [71880, 9540, 853, 453405].map((id) =>
          doc(db, "movies", id.toString())
        ),
      },
      {
        category: "Movies in black-and-white and colour",
        movies: [872585, 630, 424, 77].map((id) =>
          doc(db, "movies", id.toString())
        ),
      },
      {
        category: "Sight and Sound top 4",
        movies: [44012, 426, 15, 18148].map((id) =>
          doc(db, "movies", id.toString())
        ),
      },
      {
        category: "Directorial debuts by women",
        movies: [391713, 666277, 93934, 1443].map((id) =>
          doc(db, "movies", id.toString())
        ),
      },
    ],
  };
};
