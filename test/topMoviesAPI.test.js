import request from 'supertest';
import { initApp } from '../src/js/app';
import { describe, expect, test } from '@jest/globals';

describe('API /api/top-movies', () => {
  test('Returns top 5 movies sorted by avgRating', async () => {
    const app = initApp({
      getTopMovies: async () => [
        { id: 1, attributes: { title: 'Movie A', avgRating: 4.8 } },
        { id: 2, attributes: { title: 'Movie B', avgRating: 4.5 } },
        { id: 3, attributes: { title: 'Movie C', avgRating: 4.3 } },
        { id: 4, attributes: { title: 'Movie D', avgRating: 4.2 } },
        { id: 5, attributes: { title: 'Movie E', avgRating: 4.1 } },
      ],
    });

    const response = await request(app).get('/api/top-movies');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(5);
    expect(response.body[0].attributes.title).toBe('Movie A');
    expect(response.body[4].attributes.title).toBe('Movie E');
  });

  test('Returns empty array if no movies qualify', async () => {
    const app = initApp({
      getTopMovies: async () => [],
    });

    const response = await request(app).get('/api/top-movies');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('Handles server error correctly', async () => {
    const app = initApp({
      getTopMovies: async () => {
        throw new Error('Database error');
      },
    });

    const response = await request(app).get('/api/top-movies');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Could not get top rated movies' });
  });
});
