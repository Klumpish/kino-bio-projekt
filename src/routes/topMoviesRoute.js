import express from 'express';

const router = express.Router();

function createTopMoviesRoute(getTopMovies) {
  // API-endpoint to fetch most popular movies
  router.get('/top-movies', async (req, res) => {
    try {
      const topMovies = await getTopMovies();
      res.json(topMovies);
    } catch (error) {
      console.error('Error getting top rated movies:', error);
      res.status(500).json({ error: 'Could not get top rated movies' });
    }
  });
  return router;
}

export default createTopMoviesRoute;
