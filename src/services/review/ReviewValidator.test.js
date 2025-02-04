import { ReviewValidator } from './ReviewValidator';

describe('ReviewValidator', () => {
  test('should throw error for missing rating', () => {
    expect(() => {
      ReviewValidator.validate('Great movie!', null);
    }).toThrow('Please select a rating');
  });

  test('should throw error for empty comment', () => {
    expect(() => {
      ReviewValidator.validate('', 5);
    }).toThrow('Please write a review');
  });
});
