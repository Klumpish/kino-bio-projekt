export default class Rating {
  constructor(ratingValue) {
    this.ratingValue = ratingValue;
  }

  render() {
    const ratingContainer = document.createElement('div');
    ratingContainer.classList.add('rating');

    const ratingText = document.createElement('span');
    ratingText.classList.add('rating__value');
    ratingText.textContent = this.ratingValue.toFixed(1);
    ratingContainer.appendChild(ratingText);

    return ratingContainer;
  }
}
