import fetch from 'node-fetch';

const API_URL = 'https://plankton-app-xhkom.ondigitalocean.app/api/reviews?populate=movie&pagination[pageSize]=100';

export async function getTopMovies() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data.data) return [];

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const movieRatings = {};

    data.data.forEach((review) => {
      const createdAt = new Date(review.attributes.createdAt);
      if (createdAt >= thirtyDaysAgo) {
        const movie = review.attributes.movie.data;
        if (!movie) return;

        const movieId = movie.id;
        if (!movieRatings[movieId]) {
          movieRatings[movieId] = {
            movie,
            ratings: [],
          };
        }
        movieRatings[movieId].ratings.push(review.attributes.rating);
      }
    });

    // Calculate average rating and sort movies
    const sortedMovies = Object.values(movieRatings)
      .map(({ movie, ratings }) => ({
        movie,
        avgRating: Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length),
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 5); // Take the top 5 highest rated movies

    return sortedMovies.map(({ movie, avgRating }) => ({
      id: movie.id,
      attributes: {
        ...movie.attributes,
        avgRating: avgRating,
      },
    }));
  } catch (error) {
    console.error('Error getting top movies:', error);
    return [];
  }
}
