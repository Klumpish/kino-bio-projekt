import { getDisplayedScreenings } from './fetchAndDisplayScreenings';
import { cmsAdapter } from '../adaptors/cmsAdapter.js';

const loadScreeningsByMovieId = async (id) => {
  const url = `/movie/${id}/screenings/upcoming`;
  const resp = await fetch(url);
  const fetchedScreenings = await resp.json();
  return fetchedScreenings;
};

export { loadScreeningsByMovieId };

export default async function screeningDOMinfo() {
  const moviesID = document.querySelectorAll('.movie-link');
  const IDs = Array.prototype.map.call(moviesID, (movies) => {
    return movies.id;
  });
  let screeningsAdded = 0;
  const allScreenings = [];

  for (const id of IDs) {
    try {
      const screenings = await loadScreeningsByMovieId(id);
      console.log(`Upcoming screenings for movie ID ${id}:`, screenings);

      const movieContainer = document.getElementById(id);

      if (!movieContainer) {
        console.error(`No movie container found for movie ID ${id}`);
        continue;
      }

      if (screenings.length > 0) {
        const screening = screenings[0];
        const screeningTime = new Date(screening.attributes.start_time);
        const screeningRoom = screening.attributes.room;

        if (screeningTime && screeningRoom) {
          const screeningEntry = document.createElement('p');
          screeningEntry.classList.add('showings');
          screeningEntry.textContent = `${screeningRoom} - ${screeningTime.toLocaleString()}`;
          movieContainer.appendChild(screeningEntry);
          screeningsAdded++;
          allScreenings.push(screening);
        } else {
          console.error(`Invalid screening data for movie ID ${id}:`, screening);
        }
      } else {
        const noShowingElement = document.createElement('p');
        noShowingElement.textContent = 'Inga visningar';
        noShowingElement.classList.add('no-showings');
        movieContainer.appendChild(noShowingElement);
      }

      if (screeningsAdded >= 10) {
        break;
      }
    } catch (error) {
      console.error(`Error fetching screenings for movie ID ${id}:`, error);
    }
  }

  if (screeningsAdded < 10) {
    for (const id of IDs) {
      try {
        const screenings = await loadScreeningsByMovieId(id);
        const remainingScreenings = screenings.filter((screening) => !allScreenings.includes(screening));

        for (const screening of remainingScreenings) {
          if (screeningsAdded >= 10) {
            break;
          }

          const screeningTime = new Date(screening.attributes.start_time);
          const screeningRoom = screening.attributes.room;

          if (screeningTime && screeningRoom) {
            const movieContainer = document.getElementById(id);
            const screeningEntry = document.createElement('p');
            screeningEntry.classList.add('showings');
            screeningEntry.textContent = `${screeningRoom} - ${screeningTime.toLocaleString()}`;
            movieContainer.appendChild(screeningEntry);
            screeningsAdded++;
            allScreenings.push(screening);
          } else {
            console.error(`Invalid screening data for movie ID ${id}:`, screening);
          }
        }

        if (screeningsAdded >= 10) {
          break;
        }
      } catch (error) {
        console.error(`Error fetching screenings for movie ID ${id}:`, error);
      }
    }
  }
}
