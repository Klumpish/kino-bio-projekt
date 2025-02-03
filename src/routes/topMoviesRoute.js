import express from 'express';
import { getTopMovies } from '../../lib/topMovies.js';

const router = express.Router();

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

export default router;
