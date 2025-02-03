import Review from './Review.js';

export default class PaginatedMovieReviews {
  constructor(backend) {
    this.backend = backend;
    this.currentPage = 1;
    this.totalPages = 1;
  }

  async initReviews(container) {
    const { reviews, meta } = await this.backend.fetchReviews();
    this.totalPages = meta.totalPages;

    this.reviewsContainer = document.createElement('div');
    container.appendChild(this.reviewsContainer);

    this.paginationContainer = document.createElement('div');
    this.paginationContainer.classList.add('pagination');
    container.appendChild(this.paginationContainer);

    this.renderReviews(reviews);
    this.renderPagination();
  }

  renderReviews(reviews) {
    this.reviewsContainer.innerHTML = '';
    reviews.forEach((reviewData) => {
      const review = new Review(reviewData);
      this.reviewsContainer.append(review.render());
    });
  }

  renderPagination() {
    this.paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Föregående';
    prevButton.disabled = this.currentPage === 1;
    prevButton.addEventListener('click', () => this.changePage(this.currentPage - 1));

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Nästa';
    nextButton.disabled = this.currentPage === this.totalPages;
    nextButton.addEventListener('click', () => this.changePage(this.currentPage + 1));

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Sida ${this.currentPage} av ${this.totalPages}`;

    this.paginationContainer.appendChild(prevButton);
    this.paginationContainer.appendChild(pageInfo);
    this.paginationContainer.appendChild(nextButton);
  }

  async changePage(newPage) {
    if (newPage < 1 || newPage > this.totalPages) return;

    this.currentPage = newPage;
    this.backend.setPage(newPage);
    const { reviews } = await this.backend.fetchReviews();
    this.renderReviews(reviews);
    this.updatePagination();
  }

  updatePagination() {
    const prevButton = this.paginationContainer.querySelector('button:first-child');
    const nextButton = this.paginationContainer.querySelector('button:last-child');
    const pageInfo = this.paginationContainer.querySelector('span');

    prevButton.disabled = this.currentPage === 1;
    nextButton.disabled = this.currentPage === this.totalPages;
    pageInfo.textContent = `Sida ${this.currentPage} av ${this.totalPages}`;
  }
}
