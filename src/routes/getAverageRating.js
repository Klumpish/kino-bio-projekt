export default async function getAverageRating(cmsAdapter, movieId) {
  try {
    const movieReviews = await cmsAdapter.fetchAverageRating(movieId);
    const validReviews = movieReviews.filter((review) => review.attributes.rating > 0);

    if (validReviews.length >= 5) {
      const totalRating = validReviews.reduce((sum, review) => sum + review.attributes.rating, 0);
      const averageRating = totalRating / validReviews.length;
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
