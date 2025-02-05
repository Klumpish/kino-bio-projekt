const loadScreeningsByMovieId = async (id) => {
    const url = `/movie/${id}/screenings/upcoming`;
    const resp = await fetch(url);
    const fetchedScreenings = await resp.json();
    return fetchedScreenings;
};

export { loadScreeningsByMovieId };

export default async function screeningDOMinfo() {

    const moviesID = document.querySelectorAll(".movie-link");
    const IDs = Array.prototype.map.call(moviesID, (movies) => { return movies.id });

    let screeningsCount = 0;

    for (const id of IDs) {
        try {
            const screenings = await loadScreeningsByMovieId(id);
            console.log(`Upcoming screenings for movie ID ${id}:`, screenings);

            const movieContainer = document.getElementById(id);

            if (!movieContainer) {
                console.error(`No movie container found for movie ID ${id}`);
                continue;
            }

            const today = new Date();
            const fiveDaysLater = new Date();
            fiveDaysLater.setDate(today.getDate() + 5);

            const upcomingScreenings = screenings.filter(screening => {
                const screeningTime = new Date(screening.attributes.start_time);
                return screeningTime >= today && screeningTime <= fiveDaysLater;
            });

            const limitedScreenings = upcomingScreenings.slice(0, 10);

            limitedScreenings.forEach(screening => {
                if (screeningsCount >= 10) return;

                const movieCard = document.createElement('article');
                movieCard.classList.add('movie-card');
                movieCard.setAttribute('id', `${screening.id}`);
                movieCard.setAttribute('aria-label', `Movie Screening: ${screening.attributes.start_time}`);

                const movieCardImage = document.createElement('img');
                movieCardImage.classList.add('movie-card__image');
                movieCardImage.src = "${movie.attributes.image.url}";
                movieCardImage.alt = `Image for screening at ${screening.attributes.room}`;

                const movieCardTitle = document.createElement('h3');
                movieCardTitle.classList.add('movie-card__title');
                movieCardTitle.textContent = `Screening of Movie ${id}`;

                const movieCardDate = document.createElement('time');
                movieCardDate.classList.add('movie-card__date');
                const screeningTime = new Date(screening.attributes.start_time);
                movieCardDate.textContent = `Premiere: ${screeningTime.toLocaleString()}`;

                movieCard.appendChild(movieCardImage);
                movieCard.appendChild(movieCardTitle);
                movieCard.appendChild(movieCardDate);

                const moviesListItem = document.createElement('li');
                moviesListItem.classList.add('movies__list-item');
                moviesListItem.appendChild(movieCard);

                const moviesList = document.querySelector('.movies__list');
                moviesList.appendChild(moviesListItem);

                screeningsCount++;

                if (screeningsCount >= 10) {
                    return;
                }
            });

        } catch (error) {
            console.error(`Error fetching screenings for movie ID ${id}:`, error);
        }
    }
}