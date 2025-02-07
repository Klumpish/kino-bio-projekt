import { IdUtils } from '../utils/IdUtils.js';
import { ReviewValidator } from './ReviewValidator.js';
import { ReviewFormatter } from './ReviewFormatter.js';
import { ReviewSubmitter } from './ReviewSubmitter.js';
import UserService from '../user/UserService.js';

export default class ReviewService {
  constructor() {
    this.selectedRating = 0;
    this.createReview();
    this.attachEventListeners();
  }

  render() {
    this.selectedRating = 0;
    this.initializeUI();
    this.attachEventListeners();
  }

  initializeUI() {
    this.createReview();
    this.appendToDOM();
  }

  createReview() {
    this.container = document.createElement('section');
    this.container.className = 'review__form';

    this.stars = document.createElement('div');
    this.stars.className = 'review__stars';
    this.stars.id = 'stars';

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'review__star';
      star.dataset.value = i;
      star.textContent = '★';
      this.stars.appendChild(star);
    }
    this.container.appendChild(this.stars);

    this.textarea = document.createElement('textarea');
    this.textarea.className = 'review__textarea';
    this.textarea.placeholder = 'Write your review here';
    this.container.appendChild(this.textarea);

    this.submit = document.createElement('button');
    this.submit.className = 'review__submit';
    this.submit.textContent = 'Submit';
    this.container.appendChild(this.submit);
  }

  appendToDOM() {
    const reviewContainer = document.querySelector('.review');
    if (!reviewContainer) {
      throw new Error('Review container not found');
    }
    reviewContainer.appendChild(this.container);
  }

  attachEventListeners() {
    this.stars.querySelectorAll('.review__star').forEach((star) => {
      star.addEventListener('click', () => this.handleStarClick(star));
    });
    this.submit.addEventListener('click', () => this.handleSubmit());
  }

  handleStarClick(star) {
    this.selectedRating = parseInt(star.dataset.value);
    this.updateStars();
  }

  updateStars() {
    this.stars.querySelectorAll('.review__star').forEach((star) => {
      const value = parseInt(star.dataset.value);
      star.classList.toggle('active', value <= this.selectedRating);
    });
  }

  async validateReview() {
    const comment = this.textarea.value.trim();
    const movieId = IdUtils.getMovieIdFromPath();
    const author = await UserService.showAuthDialog();
    console.log('author:', author);

    ReviewValidator.validate(comment, this.selectedRating, author);

    return ReviewFormatter.format(comment, this.selectedRating, movieId, author);
  }

  async handleSubmit() {
    try {
      const reviewData = await this.validateReview();
      console.log(`Film id: ${reviewData.data.movie}`);
      console.log(`Film data: ${reviewData}`);
      await ReviewSubmitter.submit(reviewData.data.movie, reviewData);
      this.resetForm();
      this.showSuccess('Review submitted successfully!');
    } catch (error) {
      this.showError(error.message);
    }
  }

  resetForm() {
    this.selectedRating = 0;
    this.textarea.value = '';
    this.updateStars();
  }

  showSuccess(message) {
    this.showFeedback(message, 'success');
  }

  showError(message) {
    this.showFeedback(message, 'error');
  }

  showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `review__feedback review__feedback--${type}`;
    feedback.textContent = message;
    this.container.appendChild(feedback);
    setTimeout(() => feedback.remove(), 5000);
  }
}
