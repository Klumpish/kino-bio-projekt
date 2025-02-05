const API_MOVIES = 'https://plankton-app-xhkom.ondigitalocean.app/api';

const cmsAdapter = {

  loadMovies: async () => {
    const url = API_MOVIES + '/movies';
    try {
      const resp = await fetch(url, { cache: 'no-store' });

      if (!resp.ok) {
        console.error("Error fetching movies", resp.status);
        return [];
      }

      const fetchedMovies = await resp.json();

      if (fetchedMovies && Array.isArray(fetchedMovies.data)) {
        return fetchedMovies.data; 
      } else {
        console.error("Invalid data format:", fetchedMovies);
        return [];
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      return [];
    }
  },
  
loadAllScreenings: async () => {
    const url = API_MOVIES + '/screenings';
  
    try {
      const resp = await fetch(url, {
        cache: 'no-store',
      });
  
      if (!resp.ok) {
        console.error("Error fetching screenings", resp.status);
        return [];
      }
  
      const fetchedScreenings = await resp.json();
  
      if (fetchedScreenings && Array.isArray(fetchedScreenings.data)) {
        return fetchedScreenings.data;
      } else {
        console.error("Invalid data format:", fetchedScreenings);
        return [];
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      return [];
    }
  },


  loadScreeningsByMovieId: async (id) => {
    const url = API_MOVIES + `/screenings?filters[movie]=${id}`;
    const resp = await fetch(url);
    const fetchedScreenings = await resp.json();
    return fetchedScreenings.data;
  },
}

export default cmsAdapter;