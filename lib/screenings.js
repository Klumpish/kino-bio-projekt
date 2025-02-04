import { cmsAdapterScreenings } from '../src/js/cmsAdapter.js';

const screenings = async function (movieId) {
  try {
    const payload = await cmsAdapterScreenings.loadScreeningById(movieId);

    if (!payload) {
      console.error('No screenings found or invalid data:', payload);
      return [];
    }
    const now = new Date(); //gets current time

    return payload
      .filter((screening) => {
        const screeningTime = new Date(screening.attributes.start_time);
        // screeningTime.setFullYear(2025); //use until api is updated.
        return screeningTime >= now;
      })
      .map((screening) => ({
        start_time: screening.attributes.start_time,
        room: screening.attributes.room,
      }));
  } catch (error) {
    console.error('Error fetching screenings:', error);
    return [];
  }
};

export default screenings;
