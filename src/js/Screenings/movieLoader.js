// loads the movies fetched from the API.

export async function loadMoviesAndFilter(cmsAdapter) {
  try {
    const movies = await cmsAdapter.loadMovies();
    const allMovies = [];

    for (let movie of movies) {
      allMovies.push(movie);
    }

    return allMovies;
  } catch (err) {
    throw new Error('Error loading and filtering movies: ' + err.message);
  }
}

export default loadMoviesAndFilter;
