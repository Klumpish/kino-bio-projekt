import getDisplayedScreenings from "./fetchAndDisplayScreenings.js";

export async function loadMoviesAndFilter(cmsAdapter) {
  try {
    const movies = await cmsAdapter.loadMovies();
    const filteredMovies = [];

    for (let movie of movies) {
      const movieId = movie.id;

      const displayScreenings = await getDisplayedScreenings(cmsAdapter, movieId);

      if (displayScreenings.length > 0) {
        filteredMovies.push(movie);
      }
    }

    return filteredMovies;

  } catch (err) {
      throw new Error('Error loading and filtered movies:' + err.message);
    }
  }