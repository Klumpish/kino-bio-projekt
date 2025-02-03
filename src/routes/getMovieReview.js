export default async function getMovieReviews(cmsAdapter, movieId, page = 1, pageSize = 5) {
  try {
    const reviews = await cmsAdapter.fetchMovieReviews(movieId, page, pageSize);

    return {
      reviews: reviews.data.map((item) => ({
        id: item.id,
        rating: item.attributes.rating,
        comment: item.attributes.comment,
        author: item.attributes.author,
      })),
      meta: {
        currentPage: page,
        totalPages: Math.ceil(reviews.meta.pagination.total / pageSize),
      },
    };
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    throw error;
  }
}
