export class ReviewValidator {
  static validate(comment, rating, author) {
    if (!rating || rating < 1) {
      throw new Error('Please select a rating');
    }
    if (!comment?.trim()) {
      throw new Error('Please write a review');
    }
    if (!author.authBtnClick === true && !author.isLoggedIn) {
      throw new Error('Wrong password');
    }
    return true;
  }
}
