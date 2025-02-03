export default async function getAverageRating(cmsAdapter, movieId) {
  try {
    const movieReviewsResponse = await cmsAdapter.fetchAverageRating(movieId);
    const movieReviews = movieReviewsResponse.data;

    if (movieReviews.length >= 5) {
      const totalRating = movieReviews.reduce((sum, review) => sum + review.attributes.rating, 0);
      const averageRating = totalRating / movieReviews.length;
      return averageRating;
    } else {
      const imdbID = await cmsAdapter.fetchIMDBID(movieId);
      const imdbRating = await cmsAdapter.fetchIMDBRating(imdbID);

      if (imdbRating === null) {
        throw new Error('Failed to fetch IMDB rating');
      }

      return imdbRating;
    }
  } catch (error) {
    console.error('Error in getAverageRating:', error);
    throw error;
  }
}
