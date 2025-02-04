import screenings from '../../lib/screenings';

const checkMovieScreenInfo = async () => {
  if (window.location.pathname.startsWith('/movie/')) {
    const getMovieIDfromUrl = function () {
      const path = window.location.pathname;
      const match = path.match(/\/movie\/(\d+)/); // Fixed regex
      return match ? match[1] : null;
    };

    const movieID = getMovieIDfromUrl();

    if (movieID) {
      try {
        const response = await fetch(`/api/screenings/${movieID}/movie`);
        const screeningData = await response.json();

        // check if there is data
        if (!screeningData || screeningData.length === 0) {
          console.warn('No screening available for this movie');
          return [];
        }

        const formattedData = screeningData.map((screening) => {
          const screeningTime = new Date(screening.start_time);
          const year = screeningTime.getFullYear();
          const month = (screeningTime.getMonth() + 1).toString().padStart(2, '0');
          const day = screeningTime.getDate().toString().padStart(2, '0');
          const hours = screeningTime.getHours().toString().padStart(2, '0');
          const minutes = screeningTime.getMinutes().toString().padStart(2, '0');

          const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

          return {
            formattedTime,
            room: screening.room,
          };
        });

        return formattedData;
      } catch (error) {
        console.error('Error fetching screenings:', error);
        return null;
      }
    } else {
      console.error('No movie ID found in the url');
      return null;
    }
  }
  return null; // Added return for when not on a movie page
};

async function buildScreeningInfo() {
  if (window.location.pathname.startsWith('/movie/')) {
    const screeningInfo = await checkMovieScreenInfo();
    // get ul from DOM
    const screeningList = document.querySelector('.screening__info-list');

    if (!screeningInfo || screeningInfo.length === 0) {
      console.log('No screening data available.');
      const listItem = document.createElement('li');
      listItem.innerHTML = ` <span class="screening-time">Listan är tom</span>`;

      screeningList.appendChild(listItem);
      return;
    }
    // sort based on time
    const sortedScreenings = screeningInfo.sort((a, b) => {
      const dateA = new Date(a.formattedTime);
      const dateB = new Date(b.formattedTime);
      return dateA - dateB;
    });

    screeningList.innerHTML = '';

    // create li elements
    screeningInfo.forEach(({ formattedTime, room }) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = ` <span class="screening-time">Tid: ${formattedTime}</span>
  <span class="screening-room">Sal: ${room}</span>`;

      screeningList.appendChild(listItem);
    });
  }
}
buildScreeningInfo();

export default buildScreeningInfo;
