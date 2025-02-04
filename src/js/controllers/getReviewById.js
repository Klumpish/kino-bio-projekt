export default async function getReviewById(cmsAdapter, id) {
  const reviews = await cmsAdapter.loadReviewById(id);
  return reviews;
}
