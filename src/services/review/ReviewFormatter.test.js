import { ReviewFormatter } from './ReviewFormatter.js';

describe('ReviewFormatter', () => {
  test('should format review data correctly', () => {
    const comment = 'Great movie!';
    const rating = 5;
    const movieId = '123';
    const author = {
      username: 'JohnDoe',
      status: true,
    };

    const formattedData = ReviewFormatter.format(comment, rating, movieId, author);

    expect(formattedData).toEqual({
      data: {
        comment,
        rating,
        author: author.username,
        verified: author.status,
        movie: movieId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });
});
