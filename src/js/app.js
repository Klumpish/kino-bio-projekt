import express from 'express';
import ejs from 'ejs';
// converts markdown text in to html
import * as marked from 'marked';
import getDisplayedScreenings from './Screenings/fetchAndDisplayScreenings.js';
import { loadMoviesAndFilter } from './Screenings/movieLoader.js';
import apiRouter from './API.js';
import cors from 'cors';
import createReview from './controllers/review.controller.js';
// change everything to this
import { cmsAdapter } from './adaptors/cmsAdapter.js';
import getMovieReviews from '../routes/getMovieReview.js';
import getAverageRating from '../routes/getAverageRating.js';
import createTopMoviesRoute from '../routes/topMoviesRoute.js';
import userRoutes from '../services/routes/user.route.js';

// vite
async function setupVite(app, vite) {
  // Set views directory
  app.set('views', './views');

  // Update app.render to include Vite transforms for EJS files
  const originalRender = app.render.bind(app);
  app.render = (view, data, callback) => {
    const filePath = `./views/${view}`;
    vite.transformIndexHtml(filePath, '').then(() => {
      originalRender(view, data, callback);
    });
  };
}
// vite

function initApp(api) {
  // create a new express application/server
  const app = express();

  app.use(express.json());
  // sets the view engine to EJS
  app.set('view engine', 'ejs');
  // sets view directory (the folder with EJS files)
  app.set('views', './views');

  app.use(cors());

  // Routes
  app.use('/', userRoutes);

  app.get('/', async (request, response) => {
    try {
      const movies = await loadMoviesAndFilter(cmsAdapter);
      response.render('index.ejs', { movies });
    } catch (err) {
      console.error('Error loading movies', err);
      response.status(500).send('Error loading movies');
    }
  });

  app.get('/movie/:movieId/screenings/upcoming', async (request, response) => {
    try {
      const movieId = request.params.movieId;
      const displayScreenings = await getDisplayedScreenings(cmsAdapter, movieId);
      response.json(displayScreenings);
    } catch (err) {
      console.error('Error getting screenings', err);
      response.status(500).json({ err: 'Internal Server Error', message: err.message });
    }
  });

  app.get('/about-us', async (request, response) => {
    response.render('about-us.ejs');
  });

  app.get('/movies', async (request, response) => {
    const movies = await api.loadMovies();
    response.render('movies.ejs', { movies });
  });

  // single movie page
  app.get('/movie/:movieId', async (request, response) => {
    try {
      const movie = await api.loadMovie(request.params.movieId);

      if (!movie) {
        return response.status(404).render('404');
      }
      // convert movie intro text from markdown to html
      if (movie && movie.attributes && movie.attributes.intro) {
        movie.attributes.intro = marked.marked(movie.attributes.intro);
      }
      response.render('movie', { movie });
    } catch (err) {
      console.error('Error loading movie', err);
      response.status(500).send('Error loading movie');
    }
  });

  app.use(apiRouter);

  app.post('/movie/reviews', async (request, response) => {
    try {
      const review = await createReview(cmsAdapter, request.body);
      response.status(201).json(review);
    } catch (error) {
      response.status(500).send('Error creating review');
    }
  });

  app.get('/movie/:movieId/reviews', async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;

      const { reviews, meta } = await getMovieReviews(cmsAdapter, movieId, page, pageSize);

      res.json({ reviews, meta });
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/movie/:movieId/ratings/average', async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const averageRating = await getAverageRating(cmsAdapter, movieId);
      res.json({ averageRating });
    } catch (error) {
      console.error('Error getting average rating:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });

  // Patrik
  // API-endpoint for most popular movies
  app.use('/api', createTopMoviesRoute(api.getTopMovies));

  // static assets
  app.use('/static', express.static('static'));

  // catch all 404
  app.use((request, response, next) => {
    response.status(404).render('404');
  });

  return app;
}

export { initApp, setupVite };
