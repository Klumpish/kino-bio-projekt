import fetch from 'node-fetch';

const API_URL = 'https://plankton-app-xhkom.ondigitalocean.app/api/reviews?populate=movie';
const PAGE_SIZE = 100; // Reviews per page, adjust if needed

// Fetch all pages with reviews
async function fetchAllReviews(page = 1, allReviews = []) {
  try {
    const response = await fetch(`${API_URL}&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`);

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText} (page ${page})`);
      return allReviews;
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return allReviews;
    }

    allReviews.push(...data.data);
    console.log(`Fetched page ${page}, number of reviews so far: ${allReviews.length}`);

    const totalPages = Math.ceil(data.meta.pagination.total / PAGE_SIZE);
    if (page < totalPages) {
      try {
        return await fetchAllReviews(page + 1, allReviews);
      } catch (error) {
        console.error(`Error fetching page ${page + 1}:`, error);
      }
    }

    console.log(`All reviews fetched: ${allReviews.length} reviews.`);
    return allReviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return allReviews;
  }
}

// Fetching reviews and returning top 5 movies based on rating the last 30 days.
export async function getTopMovies() {
  try {
    const reviews = await fetchAllReviews();
    if (!reviews.length) return [];

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const movieRatings = {};
    let excludedReviewsCount = 0;

    reviews.forEach((review) => {
      const createdAt = new Date(review.attributes.createdAt);
      const rating = review.attributes.rating;
      const movie = review.attributes.movie?.data;

      // Exclude review if terms not met
      if (!movie || createdAt < thirtyDaysAgo || rating === null) {
        excludedReviewsCount++;
        return;
      }

      const movieId = movie.id;
      if (!movieRatings[movieId]) {
        movieRatings[movieId] = {
          movie,
          ratings: [],
        };
      }
      movieRatings[movieId].ratings.push(rating);
    });

    console.log(`Excluded reviews: No movieID, +30 days ago, rating 'null': ${excludedReviewsCount}`);

    // Calculate average rounded movie rating and remove movies without rating
    const sortedMovies = Object.values(movieRatings)
      .reduce((accumulator, { movie, ratings }) => {
        if (!ratings || ratings.length === 0) return accumulator; // Ignore movies without rating
        const avgRating = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
        accumulator.push({ movie, avgRating });
        return accumulator;
      }, [])
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 5); // Take the top 5 highest rated movies

    console.log(
      `Top 5 movies fetched:`,
      sortedMovies.map((m) => `${m.movie.attributes.title} (Avg.Rating: ${m.avgRating})`)
    );

    return sortedMovies.map(({ movie, avgRating }) => ({
      id: movie.id,
      attributes: {
        ...movie.attributes,
        avgRating: avgRating,
      },
    }));
  } catch (error) {
    console.error('Error fetching top ranked movies:', error);
    return [];
  }
}
