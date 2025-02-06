import { initApp, setupVite } from './src/js/app.js';
import { loadMovie, loadMovies } from './lib/movies.js';
// import { createServer as createViteServer } from 'vite';
import { cmsAdapter } from './src/js/adaptors/cmsAdapter.js'; //jenny

import { getTopMovies } from './lib/topMovies.js';
import { createServer as createViteServer } from 'vite'; // Add Vite

const api = {
  loadMovie,
  loadMovies,
  getTopMovies,
  loadAllScreenings: cmsAdapter.loadAllScreenings, //jenny
};
async function startServer() {
  const app = initApp(api);

  if (process.env.NODE_ENV !== 'production') {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: 'true' },
    });

    // Use Vite's middlewares
    app.use(vite.middlewares);

    // Call setupVite to tweak rendering behavior
    await setupVite(app, vite);
  }

  app.get('/', async (req, res) => {
    try {
      const movies = await api.loadMovies();

      res.render('index.ejs', {
        movies: movies,
      });
    } catch (err) {
      console.error('Error loading data', err);
      res.status(500).send('Error loading data');
    }
  });

  const PORT = 5080;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});

// const app = initApp(api);

// if (process.env.NODE_ENV !== 'test') {
//   app.listen(5080, () => {
//     console.log('Server running at http://localhost:5080');
//   });
// }
