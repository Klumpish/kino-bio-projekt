import { getTopMovies } from '../lib/topMovies.js';
import { describe, expect, test } from '@jest/globals';

describe('getTopMovies()', () => {
  test('Returns movies with calculated average ratings', async () => {
    const mockFetch = async () => ({
      ok: true,
      json: async () => ({
        data: [
          {
            attributes: {
              createdAt: new Date().toISOString(),
              rating: 5,
              movie: { data: { id: 1, attributes: { title: 'Movie A' } } },
            },
          },
          {
            attributes: {
              createdAt: new Date().toISOString(),
              rating: 4,
              movie: { data: { id: 1, attributes: { title: 'Movie A' } } },
            },
          },
          {
            attributes: {
              createdAt: new Date().toISOString(),
              rating: 3,
              movie: { data: { id: 2, attributes: { title: 'Movie B' } } },
            },
          },
        ],
        meta: { pagination: { total: 3 } },
      }),
    });

    const topMovies = await getTopMovies(mockFetch);

    expect(topMovies.length).toBe(2);
    expect(topMovies[0].attributes.title).toBe('Movie A');
    expect(topMovies[0].attributes.avgRating).toBe(4.5);
    expect(topMovies[1].attributes.title).toBe('Movie B');
    expect(topMovies[1].attributes.avgRating).toBe(3);
  });

  test('Returns empty array if no reviews exist', async () => {
    const mockFetch = async () => ({
      ok: true,
      json: async () => ({
        data: [],
        meta: { pagination: { total: 0 } },
      }),
    });

    const topMovies = await getTopMovies(mockFetch);
    expect(topMovies).toEqual([]);
  });

  test('Handles API failure smooth', async () => {
    const failingMockFetch = async () => ({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('API Error');
      },
    });

    const topMovies = await getTopMovies(failingMockFetch);
    expect(topMovies).toEqual([]);
  });
});
