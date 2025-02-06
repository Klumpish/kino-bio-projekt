// bör vara tom.

// const API_MOVIES = 'https://plankton-app-xhkom.ondigitalocean.app/api';

// <<<<<<< HEAD
// const cmsAdapter = {

//   loadMovies: async () => {
//     const url = API_MOVIES + '/movies';
//     try {
//       const resp = await fetch(url, { cache: 'no-store' });

//       if (!resp.ok) {
//         console.error("Error fetching movies", resp.status);
//         return [];
//       }

//       const fetchedMovies = await resp.json();

//       if (fetchedMovies && Array.isArray(fetchedMovies.data)) {
//         return fetchedMovies.data;
//       } else {
//         console.error("Invalid data format:", fetchedMovies);
//         return [];
//       }
//     } catch (error) {
//       console.error("Error during fetch:", error);
//       return [];
//     }
//   },

// loadAllScreenings: async () => {
//     const url = API_MOVIES + '/screenings';

//     try {
//       const resp = await fetch(url, {
//         cache: 'no-store',
//       });

//       if (!resp.ok) {
//         console.error("Error fetching screenings", resp.status);
//         return [];
//       }

//       const fetchedScreenings = await resp.json();

//       if (fetchedScreenings && Array.isArray(fetchedScreenings.data)) {
//         return fetchedScreenings.data;
//       } else {
//         console.error("Invalid data format:", fetchedScreenings);
//         return [];
//       }
//     } catch (error) {
//       console.error("Error during fetch:", error);
//       return [];
//     }
//   },

//   loadScreeningsByMovieId: async (id) => {
//     const url = API_MOVIES + `/screenings?filters[movie]=${id}`;
//     const resp = await fetch(url);
//     const fetchedScreenings = await resp.json();
//     return fetchedScreenings.data;
//   },
// }

// export default cmsAdapter;
// =======
// export const cmsAdapter = {
//   loadAllReviews: async () => {
//     const url = API_MOVIES + '/reviews';
//     const resp = await fetch(url);
//     const payload = await resp.json();
//     return payload.data;
//   },
//   postReview: async () => {
//     const res = await fetch(API_MOVIES + '/reviews', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });
//     return res.json();
//   },
//   loadReviewById: async (id) => {
//     const url = API_MOVIES + '/reviews?filters[movie]=' + id;
//     const resp = await fetch(url);
//     const payload = await resp.json();
//     return payload.data;
//   },
//   fetchMovieReviews: async (movieId, page = 1, pageSize = 5) => {
//     const url = `${API_MOVIES}/reviews?filters[movie]=${movieId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
//     const resp = await fetch(url);

//     if (!resp.ok) {
//       throw new Error(`API request failed with status ${resp.status}`);
//     }

//     const payload = await resp.json();
//     return {
//       data: payload.data,
//       meta: payload.meta,
//     };
//   },

//   fetchAverageRating: async (movieId) => {
//     const url = `${API_MOVIES}/reviews?filters[movie]=${movieId}`;
//     const resp = await fetch(url);

//     if (!resp.ok) {
//       throw new Error(`API request failed with status ${resp.status}`);
//     }

//     const payload = await resp.json();
//     return payload.data;
//   },

//   fetchIMDBID: async (movieId) => {
//     const url = `${API_MOVIES}/movies/${movieId}`;
//     const resp = await fetch(url);

//     if (!resp.ok) {
//       throw new Error(`API request failed with status ${resp.status}`);
//     }

//     const payload = await resp.json();
//     return payload.data.attributes.imdbId;
//   },

//   fetchIMDBRating: async (imdbID) => {
//     const url = `https://imdb236.p.rapidapi.com/imdb/${imdbID}/rating`;
//     const options = {
//       method: 'GET',
//       headers: {
//         'x-rapidapi-key': '57763d6cecmsh9862634f85e08abp10a43djsn3545f097437b',
//         'x-rapidapi-host': 'imdb236.p.rapidapi.com',
//       },
//     };

//     try {
//       const resp = await fetch(url, options);

//       if (!resp.ok) {
//         throw new Error(`IMDB API request failed with status ${resp.status}`);
//       }

//       const data = await resp.json();
//       return data.averageRating;
//     } catch (error) {
//       console.error('Error fetching IMDB rating:', error);
//       return null;
//     }
//   },
// };
// export const cmsAdapterScreenings = {
//   loadAllScreenings: async () => {
//     const url = API_MOVIES + '/screenings';
//     const resp = await fetch(url);
//     const payload = await resp.json();
//     return payload.data;
//   },
//   loadScreeningById: async (id) => {
//     const url = API_MOVIES + '/screenings?filters[movie]=' + id;
//     const resp = await fetch(url);
//     const payload = await resp.json();
//     return payload.data;
//   },
// };
// export default { cmsAdapter, cmsAdapterScreenings };
// >>>>>>> master
