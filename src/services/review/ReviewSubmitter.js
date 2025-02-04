export class ReviewSubmitter {
  static async submit(movieId, reviewData) {
    const response = await fetch(`/movie/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit review');
    }

    return response.json();
  }
}
