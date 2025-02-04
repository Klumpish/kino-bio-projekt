export class IdUtils {
  static getMovieIdFromPath() {
    const path = window.location.pathname;
    const matches = path.match(/\/movie\/(\d+)/);

    if (!matches || !matches[1]) {
      throw new Error('Movie ID not found in URL');
    }
    return matches[1];
  }
}
