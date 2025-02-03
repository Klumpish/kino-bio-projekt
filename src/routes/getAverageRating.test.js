import getAverageRating from './getAverageRating.js';

describe('getAverageRating()', () => {
  it('returns IMDB average rating when less than 5 or no valid reviews are found', async () => {
    const cmsAdapter = {
      fetchAverageRating: async () => ({ data: [] }),
      fetchIMDBRating: async () => 6.9,
      fetchIMDBID: async () => 'tt7631058',
    };

    const movieId = 123;
    const rating = await getAverageRating(cmsAdapter, movieId);

    expect(rating).toBe(6.9);
  });

  it('returns the average rating if there are 5 or more valid reviews', async () => {
    const cmsAdapter = {
      fetchAverageRating: async () => ({
        data: [
          { attributes: { rating: 4 } },
          { attributes: { rating: 5 } },
          { attributes: { rating: 3 } },
          { attributes: { rating: 4 } },
          { attributes: { rating: 5 } },
        ],
      }),
      fetchIMDBRating: async () => 6.9,
      fetchIMDBID: async () => 'tt7631058',
    };

    const movieId = 123;
    const rating = await getAverageRating(cmsAdapter, movieId);

    expect(rating).toBe(4.2);
  });

  it('throws an error if IMDB rating fetch fails', async () => {
    const cmsAdapter = {
      fetchAverageRating: async () => ({ data: [] }),
      fetchIMDBRating: async () => null,
      fetchIMDBID: async () => 'tt7631058',
    };

    const movieId = 123;
    await expect(getAverageRating(cmsAdapter, movieId)).rejects.toThrow('Failed to fetch IMDB rating');
  });
});
