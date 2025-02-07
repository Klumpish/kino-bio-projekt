class TopMoviesFetcher {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async fetchTopMovies() {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();

      if (!response.ok) {
        console.error('Serverfel vid hämtning:', response.status, response.statusText, data);
        throw new Error('Serverfel vid hämtning av topplistan.');
      }
      console.log('Hämtade toppfilmer:', data);

      return data;
    } catch (error) {
      console.error('Fel vid hämtning av topprankade filmer:', error);

      const errorMessage = document.createElement('span');
      errorMessage.textContent = 'Kunde inte hämta populära filmer. Försök igen senare.';
      errorMessage.style.color = 'white';
      errorMessage.style.textAlign = 'center';

      const movieSection = document.querySelector('.topmovies');
      if (movieSection) {
        movieSection.appendChild(errorMessage);
      }

      return []; // Return empty array when error
    }
  }
}

export default TopMoviesFetcher;
