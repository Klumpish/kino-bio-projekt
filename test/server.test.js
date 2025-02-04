import request from 'supertest';
import { loadMovie, loadMovies } from '../lib/movies';
import { initApp } from '../src/js/app';
import { test, expect } from '@jest/globals';

describe('404 Error handling', () => {
  it('returns a 404 page when visiting a non-existent movie page', async () => {
    const app = initApp({
      loadMovie: async () => null,
      loadMovies: async () => [],
    });

    const response = await request(app).get('/movie/nonexistent-movie-id');

    // checks status code 404
    expect(response.status).toBe(404);

    // checks if 404-page is rendered correctly
    expect(response.text).toContain('Oops! Page not found.');
    expect(response.text).toContain('The page you are looking for does not exist.');
  });
});

describe('Movie title from API', () => {
  it('displays the correct movie title from ID', async () => {
    const movieId = '2'; //change later for a correct movie id

    const app = initApp({
      loadMovie,
      loadMovies,
    });

    // makes request tot the server
    const response = await request(app).get(`/movie/${movieId}`);

    // fetch the title from the API response
    const movie = await loadMovie(movieId);

    // get the title from the API response
    const movieTitle = movie.attributes.title;

    // check if statuscode is 200 (ok)
    expect(response.status).toBe(200);

    // checks if the title of the movie is the same as the one on the page.
    expect(response.text).toContain(`<h1 class=\"movie__single__header\">${movieTitle}</h1>`);
  });
  it('displays all movies from API on /movies page', async () => {
    const app = initApp({
      loadMovies,
    });

    const response = await request(app).get('/movies');

    expect(response.status).toBe(200);
    const moviesFromAPI = await loadMovies();

    moviesFromAPI.forEach((movie) => {
      expect(response.text).toContain(movie.attributes.title);
    });
  });
});

describe('Movie Page shows correct movie title(mock)', () => {
  test('display correct movie title(mock)', async () => {
    const app = initApp({
      loadMovie: async () => ({
        id: '1',
        attributes: {
          title: 'Encanto',
        },
      }),
      loadMovies: async () => [],
    });

    const response = await request(app).get('/movie/1').expect('Content-Type', /html/).expect(200);

    expect(response.text).toMatch('Encanto');
  });
});
