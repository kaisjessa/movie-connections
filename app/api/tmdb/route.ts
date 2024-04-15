import { TMDB } from "tmdb-ts";
import { Movie, Puzzle } from "../../firebase/types";
import { redirect } from "next/navigation";
import { setPuzzle } from "@/app/firebase/lib";
import sampleData from "@/data/sample2";
import { Timestamp } from "firebase/firestore";

const apiKey = process.env.TMDB_API_KEY;
const tmdb = new TMDB(apiKey!);

export async function GET(request: Request): Promise<Response> {
  try {
    if (!apiKey) {
      throw Error("Missing TMDB_API_KEY");
    }
    if (!tmdb) {
      throw Error("Invalid TMDB_API_KEY");
    }
    const { searchParams } = new URL(request.url);
    const userQuery = searchParams.get("query");
    if (!userQuery) {
      throw Error("Missing query parameter");
    }
    const baseUrl = "https://image.tmdb.org/t/p/w500";
    const res = await tmdb.search.movies({ query: userQuery });
    const results = res["results"];
    let movies: Movie[] = [];
    for (let i = 0; i < Math.min(3, results.length); i++) {
      const movie = results[i];
      movies.push({
        id: movie.id,
        title: movie.title,
        backdrop: baseUrl + movie.backdrop_path,
        poster: baseUrl + movie.poster_path,
        year: parseInt(movie.release_date.slice(0, 4)),
      });
    }
    return new Response(JSON.stringify(movies));
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify([err]));
  }
}

export async function navigate(data: FormData) {
  redirect(`/puzzles/${data.get("id")}`);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const data = await request.json();
    if (
      !data ||
      !data.header ||
      !data.contents!! ||
      !data.header.name ||
      !data.header.author
    ) {
      throw Error("Missing data");
    }
    data.header.timestamp = Timestamp.now();
    const id = await setPuzzle(data);
    return new Response(JSON.stringify({ id }));
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify([err]), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
