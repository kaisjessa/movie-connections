import { TMDB } from "tmdb-ts";
import { Movie } from "../../firebase/types";

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
    console.log(userQuery);
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
      });
    }
    return new Response(JSON.stringify(movies));
  } catch (err) {
    console.log(err);
    return new Response({ error: err });
  }
}
