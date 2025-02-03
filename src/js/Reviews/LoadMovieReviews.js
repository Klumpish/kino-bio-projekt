// LoadMovieReviews.js
export default class LoadMovieReviews {
  constructor(url, movieId, page = 1, pageSize = 5) {
    this.url = url;
    this.movieId = movieId;
    this.page = page;
    this.pageSize = pageSize;
  }

  async fetchReviews() {
    try {
      const response = await fetch(
        `${this.url}/movie/${this.movieId}/reviews?page=${this.page}&pageSize=${this.pageSize}`
      );

      if (!response.ok) throw new Error('Failed to fetch reviews');

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movie reviews:', error);
      return { data: [], meta: { currentPage: 1, totalPages: 1 } };
    }
  }

  setPage(newPage) {
    this.page = newPage;
  }
}
