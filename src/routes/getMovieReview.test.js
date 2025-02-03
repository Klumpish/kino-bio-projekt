import getMovieReviews from './getMovieReview.js';
import { it, describe, expect, jest, beforeEach } from '@jest/globals';

describe('getMovieReviews()', () => {
  it('returns reviews with pagination metadata for a valid movieId', async () => {
    const cmsAdapter = {
      fetchMovieReviews: async () => ({
        data: [
          {
            id: 1,
            attributes: {
              rating: 5,
              comment: 'Great movie!',
              author: 'Alice',
            },
          },
          {
            id: 2,
            attributes: {
              rating: 4,
              comment: 'Really enjoyed it.',
              author: 'Bob',
            },
          },
        ],
        meta: {
          pagination: {
            total: 10,
          },
        },
      }),
    };

    const movieId = 123;
    const page = 1;
    const pageSize = 2;

    const result = await getMovieReviews(cmsAdapter, movieId, page, pageSize);

    expect(result.reviews).toHaveLength(2);
    expect(result.reviews[0]).toEqual({
      id: 1,
      rating: 5,
      comment: 'Great movie!',
      author: 'Alice',
    });
    expect(result.meta).toEqual({
      currentPage: 1,
      totalPages: 5,
    });
  });
});
