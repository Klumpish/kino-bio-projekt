export default class Review {
  constructor(data) {
    this.data = data;
  }

  render() {
    const reviewContainer = document.createElement('div');
    reviewContainer.classList.add('review');

    const rating = document.createElement('span');
    rating.textContent = this.data.rating;
    reviewContainer.appendChild(rating);

    const comment = document.createElement('p');
    comment.textContent = this.data.comment;
    reviewContainer.appendChild(comment);

    const author = document.createElement('h4');
    author.textContent = this.data.author;
    reviewContainer.appendChild(author);

    return reviewContainer;
  }
}
