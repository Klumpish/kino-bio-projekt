export default class MovieCardGenerator {
  constructor(apiBackend) {
    this.apiBackend = apiBackend;
  }

  async CardGenerator(count = 10) {
    const moviesList = document.querySelector('.movies__list');
    const movies = await this.apiBackend.loadAllFilms();
    const moviesToDisplay = movies.sort((a, b) => b.rating - a.rating).slice(0, count);

    moviesToDisplay.forEach((movie) => {
      const moviesListItem = document.createElement('li');
      moviesListItem.classList = 'movies__list-item';

      const movieCard = document.createElement('article');
      movieCard.classList = 'movie-card';
      movieCard.setAttribute('id', `${movie.id}`);
      movieCard.setAttribute('aria-label', `${movie.title}`);

      const movieCardImage = document.createElement('img');
      movieCardImage.classList = 'movie-card__image';
      movieCardImage.src = `${movie.image}`;
      movieCardImage.alt = `Omslag för filmen ${movie.title}`;
      movieCardImage.setAttribute('aria-hidden', 'false');

      const movieCardTitle = document.createElement('h3');
      movieCardTitle.classList = 'movie-card__title';
      movieCardTitle.textContent = `${movie.title}`;

      const movieCardDate = document.createElement('time');
      movieCardDate.classList = 'movie-card__date';
      movieCardDate.setAttribute('aria-label', `Premiär ${movie.date}`);
      movieCardDate.textContent = `${movie.date}`;

      const movieCardButton = document.createElement('button');
      movieCardButton.classList = 'movie-card__button';
      movieCardButton.textContent = 'Boka biljett';
      movieCardButton.setAttribute('aria-label', 'Boka biljett');

      const movieGenre = document.createElement('span');
      movieGenre.classList = 'movie-card__genre';
      movieGenre.textContent = `${movie.genre}`;
      movieGenre.setAttribute('aria-label', `Genre: ${movie.genre}`);

      movieCard.appendChild(movieCardImage);
      movieCard.appendChild(movieCardTitle);
      movieCard.appendChild(movieCardDate);
      movieCard.appendChild(movieGenre);
      movieCard.appendChild(movieCardButton);
      moviesListItem.appendChild(movieCard);
      moviesList.appendChild(moviesListItem);
    });
  }
}
