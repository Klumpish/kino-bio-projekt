export default async function createReview(cmsAdapter, review) {
  if (!cmsAdapter || !review) {
    throw new Error('Adaptor or review data is missing');
  }

  try {
    const response = await cmsAdapter.postReview(review);

    if (!response || !response.data) {
      throw new Error('Invalid response from CMS');
    }

    return response;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error(`Failed to create review: ${error.message}`);
  }
}
