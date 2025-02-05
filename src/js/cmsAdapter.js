const API_MOVIES = 'https://plankton-app-xhkom.ondigitalocean.app/api';

const cmsAdapter = {

  // Load movie data
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

  // Load screenings data for a specific movie ID, including title and image
  loadScreeningsByMovieId: async (id) => {
    const url = API_MOVIES + `/screenings?filters[movie]=${id}`;
    
    try {
      const resp = await fetch(url);
      const fetchedScreenings = await resp.json();
      
      if (!fetchedScreenings || !Array.isArray(fetchedScreenings.data)) {
        console.error(`No screenings found for movie ID: ${id}`);
        return [];
      }

      // Now, also retrieve the movie details (title and image) based on the movie ID
      const movieUrl = API_MOVIES + `/movies/${id}`;
      const movieResp = await fetch(movieUrl);
      const fetchedMovie = await movieResp.json();

      if (fetchedMovie && fetchedMovie.data) {
        const movieData = fetchedMovie.data.attributes;

        // Add movie title and image to each screening
        const screeningsWithMovieInfo = fetchedScreenings.data.map(screening => ({
          ...screening,
          movieTitle: movieData.title,
          movieImage: movieData.image.url,
        }));

        return screeningsWithMovieInfo;
      } else {
        console.error(`No movie found for movie ID: ${id}`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching screenings for movie ID ${id}:`, error);
      return [];
    }
  },

  loadAllScreenings: async () => {
    const url = API_MOVIES + '/screenings';
    try {
      const resp = await fetch(url, { cache: 'no-store' });

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

};

export default cmsAdapter;