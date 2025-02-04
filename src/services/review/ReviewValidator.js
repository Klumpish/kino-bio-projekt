export class ReviewValidator {
  static validate(comment, rating) {
    if (!rating || rating < 1) {
      throw new Error('Please select a rating');
    }
    if (!comment?.trim()) {
      throw new Error('Please write a review');
    }
    return true;
  }
}
