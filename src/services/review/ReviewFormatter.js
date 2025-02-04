export class ReviewFormatter {
  static format(comment, rating, movieId, author) {
    return {
      data: {
        comment,
        rating,
        author,
        verified: this.isLoggedIn(author),
        movie: movieId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }
  static isLoggedIn(author) {
    return author !== 'Guest';
  }
}
