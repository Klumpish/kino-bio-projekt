import { ReviewFormatter } from './ReviewFormatter.js';

describe('ReviewFormatter', () => {
  test('should format review data correctly', () => {
    const comment = 'Great movie!';
    const rating = 5;
    const movieId = '123';
    const author = 'JohnDoe';

    const formattedData = ReviewFormatter.format(comment, rating, movieId, author);

    expect(formattedData).toEqual({
      data: {
        comment,
        rating,
        author,
        verified: true,
        movie: movieId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  test('should return true if author is not Guest', () => {
    expect(ReviewFormatter.isLoggedIn('JohnDoe')).toBe(true);
  });

  test('should return false if author is Guest', () => {
    expect(ReviewFormatter.isLoggedIn('Guest')).toBe(false);
  });
});
