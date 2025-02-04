// vite will now compile our scss
import './styles/styles.scss';
//JS Import
import MovieCardGenerator from './js/_frontpage_movie_cards.js';
// import LoadAllFilmsPage from './js/LoadAllFilmsPage.js';
import MobileMenu from './js/MobileMenu.js';
import initLiveEvents from './js/_initLiveEvents.js';

import buildScreeningInfo from './js/_initScreenings';

import checkMovieScreenInfo from './js/_initScreenings';

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
  console.log('Not on a movie page, skipping reviews.');
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
