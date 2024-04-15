import { Movie, Puzzle, PuzzleContents, PuzzleHeader } from "../firebase/types";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setPuzzle } from "../firebase/lib";
import sampleData from "@/data/sample2";
import { SyntheticEvent } from "react";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";

export const determineValid = (
  categoryArray: string[],
  movieArray: Movie[][],
  title: string,
  author: string,
  setErrMessage: Function
) => {
  if (title.length === 0) {
    setErrMessage("Error: Title cannot be empty");
  } else if (author.length === 0) {
    setErrMessage("Error: Your name cannot be empty");
  } else if (
    categoryArray.length < 4 ||
    categoryArray.includes("") ||
    new Set(categoryArray).size != categoryArray.length
  )
    setErrMessage("Error: Categories cannot be empty or repeat");
  else if (
    movieArray.flat().map((m) => m?.id).length < 16 ||
    movieArray
      .flat()
      .map((m) => m?.id)
      .some((el) => !el || el == undefined || el == null) ||
    new Set(movieArray.flat().map((m) => m?.id)).size !=
      movieArray.flat().length
  )
    setErrMessage("Error: Movies cannot be empty or repeat");
  else setErrMessage("");
};

export const updateCategoryAtI = (
  i: number,
  categoryArray: string[],
  setCategoryArray: Function
) => {
  const updateCategories = (c: string) => {
    setCategoryArray(categoryArray.map((cc, ii) => (ii == i ? c : cc)));
  };
  return updateCategories;
};

export const updateMoviesAtI = (
  i: number,
  movieArray: Movie[][],
  setMovieArray: Function
) => {
  const selections = movieArray[i];
  const updateMovies = (m: Movie, add: boolean) => {
    if (!add) {
      setMovieArray(
        movieArray.map((row, j) => row.filter((mm) => mm.id != m.id))
      );
    } else {
      if (
        movieArray
          .flat()
          .map((mm) => mm.id)
          .includes(m.id)
      ) {
        toast.error("Movie already added!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: 0,
          theme: "colored",
          transition: Bounce,
        });
      } else if (selections.length == 4) {
        toast.error("Category is full!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: 0,
          theme: "colored",
          transition: Bounce,
        });
        return;
      } else {
        setMovieArray(movieArray.map((row, j) => (j == i ? [...row, m] : row)));
      }
    }
  };

  return updateMovies;
};

export const formToPuzzle = (
  name: string,
  author: string,
  categories: string[],
  movies: Movie[][]
): Puzzle => {
  const header: PuzzleHeader = {
    id: "",
    name: name,
    author: author,
    timestamp: serverTimestamp() as Timestamp,
  };

  const contents: PuzzleContents = categories.map((c, i) => {
    return {
      category: c,
      movies: movies[i],
    };
  });
  return { header, contents };
};

export const FormSubmission = (props: {
  title: string;
  author: string;
  categoryArray: string[];
  movieArray: Movie[][];
  errMessage: string;
  router: any;
}) => {
  const handleSubmit =
    (name: string, author: string, categories: string[], movies: Movie[][]) =>
    async (e: SyntheticEvent) => {
      e.preventDefault();
      toast.info("Saving puzzle...", {
        position: "top-center",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: 0,
        theme: "colored",
        transition: Bounce,
      });
      const submitData = formToPuzzle(name, author, categories, movies);
      // const submitData = sampleData as Puzzle;
      try {
        const res = await fetch("http://localhost:3000/api/tmdb", {
          method: "POST",
          body: JSON.stringify(submitData),
          headers: {
            "content-type": "application/json",
          },
        });
        if (res.ok) {
          const json = await res.json();
          await new Promise((resolve) => setTimeout(resolve, 3000));
          if (!json.id) {
            throw new Error("Puzzle could not be created");
          }
          props.router.push(`/puzzles/${json.id}`);
        } else {
          toast.error("An error occured :(", {
            position: "top-center",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: 0,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (error) {
        toast.error((error as any).toString(), {
          position: "top-center",
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: 0,
          theme: "colored",
          transition: Bounce,
        });
        console.log(error);
      }
    };

  return (
    <form
      onSubmit={handleSubmit(
        props.title,
        props.author,
        props.categoryArray,
        props.movieArray
      )}
    >
      <div
        className={
          props.errMessage.length === 0
            ? ""
            : "tooltip focus:tooltip-open tooltip-error"
        }
        data-tip={props.errMessage}
      >
        <button
          className={
            props.errMessage.length === 0
              ? "btn btn-primary justify-center items-center"
              : "btn btn-disabled justify-center items-center"
          }
        >
          Submit
        </button>
      </div>
    </form>
  );
};
