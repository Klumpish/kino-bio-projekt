import { initApp, setupVite } from './src/js/app.js';
import { loadMovie, loadMovies } from './lib/movies.js';
import { getTopMovies } from './lib/topMovies.js';
import { createServer as createViteServer } from 'vite'; // Add Vite

const api = {
  loadMovie,
  loadMovies,
  getTopMovies,
};
async function startServer() {
  const app = initApp(api);

  if (process.env.NODE_ENV !== 'production') {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: 'true' },
      // server: { middlewareMode: 'html' },
    });

    // Use Vite's middlewares
    app.use(vite.middlewares);

    // Call setupVite to tweak rendering behavior
    await setupVite(app, vite);
  }

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
