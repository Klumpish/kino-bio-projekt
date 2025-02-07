export default class LoadAverageRating {
  constructor(url, movieId) {
    this.url = url;
    this.movieId = movieId;
  }

  async fetchAverageRating() {
    try {
      const response = await fetch(`${this.url}/movie/${this.movieId}/ratings/average`);

      if (!response.ok) throw new Error('Failed to fetch average rating');

      const data = await response.json();
      return data.averageRating;
    } catch (error) {
      console.error('Error fetching average rating:', error);
      return null;
    }
  }
}
