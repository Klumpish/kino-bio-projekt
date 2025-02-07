class TopMoviesRenderer {
  constructor(containerSelector) {
    this.moviesList = document.querySelector(containerSelector);
  }

  clearList() {
    while (this.moviesList.firstChild) {
      this.moviesList.removeChild(this.moviesList.firstChild);
    }
  }

  renderLoadingMessage() {
    this.clearList();
    const loadingMessage = document.createElement('li');
    loadingMessage.classList.add('loading__top_movies');
    loadingMessage.textContent = 'Laddar topplistan...';
    this.moviesList.appendChild(loadingMessage);
  }

  renderErrorMessage() {
    this.clearList();
    const errorMessage = document.createElement('li');
    errorMessage.textContent = 'Kunde inte ladda populära filmer.';
    errorMessage.style.color = 'white';
    errorMessage.style.textAlign = 'center';
    this.moviesList.appendChild(errorMessage);
  }

  renderMovies(movies) {
    this.clearList();

    if (!movies.length) {
      const noMoviesMessage = document.createElement('li');
      noMoviesMessage.textContent = 'Inga topprankade filmer hittades.';
      this.moviesList.appendChild(noMoviesMessage);
      return;
    }

    movies.forEach((movie) => {
      const movieItem = document.createElement('li');

      const movieLink = document.createElement('a');
      movieLink.href = `/movie/${movie.id}`;
      movieLink.id = movie.id;

      const movieCard = document.createElement('article');
      movieCard.classList.add('topmovie-card');

      const movieImage = document.createElement('img');
      movieImage.classList.add('topmovie-card__image');
      movieImage.src = movie.attributes.image?.url || '/static/dist/images/Kino_doors.png';
      movieImage.alt = `Movie title: ${movie.attributes.title}`;

      const movieTitle = document.createElement('h3');
      movieTitle.classList.add('topmovie-card_title');
      movieTitle.textContent = movie.attributes.title;

      const movieRating = document.createElement('span');
      movieRating.classList.add('topmovie-card_rating');
      movieRating.textContent = `⭐ Rating: ${movie.attributes.avgRating}/5`;

      movieCard.appendChild(movieImage);
      movieCard.appendChild(movieTitle);
      movieCard.appendChild(movieRating);

      movieLink.appendChild(movieCard);
      movieItem.appendChild(movieLink);
      this.moviesList.appendChild(movieItem);
    });
  }
}

export default TopMoviesRenderer;
