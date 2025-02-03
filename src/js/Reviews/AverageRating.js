import Rating from './Rating.js';

export default class AverageRating {
  constructor(backend, movieId) {
    this.backend = backend;
    this.movieId = movieId;
  }

  async renderAvRating(container) {
    const averageRating = await this.backend.fetchAverageRating();

    if (averageRating !== null) {
      const rating = new Rating(averageRating);
      container.appendChild(rating.render());
    }
  }
}
