// vite will now compile our scss
import './styles/styles.scss';
//JS Import
import MovieCardGenerator from './js/_frontpage_movie_cards.js';
// import LoadAllFilmsPage from './js/LoadAllFilmsPage.js';
import MobileMenu from './js/MobileMenu.js';
import initLiveEvents from './js/_initLiveEvents.js';

import buildScreeningInfo from './js/_initScreenings';

import checkMovieScreenInfo from './js/_initScreenings';
import screeningDOMinfo from './js/Screenings/screeningDOMInfo.js';

// import { fetchAndDisplayScreenings } from './lib/fetchScreenings.js';

import ReviewService from './services/review/ReviewService.js';

import LoadMovieReviews from './js/Reviews/LoadMovieReviews.js';
import PaginatedMovieReviews from './js/Reviews/PaginatedMovieReviews.js';
import LoadAverageRating from './js/Reviews/LoadAverageRating.js';
import AverageRating from './js/Reviews/AverageRating.js';
import { IdUtils } from './services/utils/IdUtils.js';

if (document.querySelector('.reviews__container')) {
  const apiBase = 'http://localhost:5080';
  const movieId = IdUtils.getMovieIdFromPath();
  const reviewBackend = new LoadMovieReviews(apiBase, movieId);
  const avRatingBackend = new LoadAverageRating(apiBase, movieId);

  const movieReviews = new PaginatedMovieReviews(reviewBackend);
  movieReviews.initReviews(document.querySelector('.reviews__container'));

  const movieAvRating = new AverageRating(avRatingBackend);
  movieAvRating.renderAvRating(document.querySelector('.averageRating__container'));
} else {
  console.log('No reviews container found.');
}

const review = document.querySelector('.review');
console.log(review);

const MYAPI = 'localhost:5080';

try {
  if (review) {
    const reviewService = new ReviewService();
    reviewService.render();
  } else {
    console.log('No review element found');
  }
} catch (error) {
  console.error('Error initializing review service:', error);
}

if (window.location.pathname === '/') {
  document.addEventListener('DOMContentLoaded', initLiveEvents);
}

if (window.location.pathname === '/') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.movie-card')) {
      screeningDOMinfo();
    } else {
      const test = document.querySelector('.movies__header');
      const noShowingElement = document.createElement('p');
      noShowingElement.textContent = 'Inga visningar för tillfället...';
      noShowingElement.classList.add('no-showings');
      test.insertAdjacentElement('afterend', noShowingElement);
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const moviesList = document.querySelector('.movies__list');
  moviesList.innerHTML = '<li>Laddar populära filmer...</li>';

  try {
    const response = await fetch('/api/top-movies');
    const movies = await response.json();

    moviesList.innerHTML = '';

    if (!movies.length) {
      moviesList.innerHTML = '<li>Inga topprankade filmer hittades.</li>';
      return;
    }

    movies.forEach((movie) => {
      const movieItem = document.createElement('li');
      movieItem.innerHTML = `
              <a href="/movie/${movie.id}" id="${movie.id}">
                  <article class="movie-card">
                      <img class="movie-card__image" src="${movie.attributes.image.url}" alt="Movie title: ${movie.attributes.title}">
                      <h3 class="movie-card_title">${movie.attributes.title}</h3>
                      <span class="movie-card_rating">⭐ Rating: ${movie.attributes.avgRating}/5</span>
                  </article>
              </a>
          `;
      moviesList.appendChild(movieItem);
    });
  } catch (error) {
    console.error('Fel vid hämtning av topprankade filmer:', error);
    moviesList.innerHTML = '<li>Kunde inte ladda populära filmer.</li>';
  }
});
