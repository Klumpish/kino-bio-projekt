const API_MOVIES = 'https://plankton-app-xhkom.ondigitalocean.app/api';

export async function loadMovies() {
  const res = await fetch(API_MOVIES + '/movies');
  const payload = await res.json();
  return payload.data;
}

export async function loadMovie(id) {
  const res = await fetch(API_MOVIES + /movies/ + id);
  const payload = await res.json();
  return payload.data;
}
