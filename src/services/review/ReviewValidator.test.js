import { ReviewValidator } from './ReviewValidator';

describe('ReviewValidator', () => {
  test('Should throw error for missing rating', () => {
    const author = { authBtnClick: true, isLoggedIn: true };
    expect(() => {
      ReviewValidator.validate('Great movie!', null, author);
    }).toThrow('Please select a rating');
  });

  test('Should throw error for empty comment', () => {
    const author = { authBtnClick: true, isLoggedIn: true };
    expect(() => {
      ReviewValidator.validate('', 5, author);
    }).toThrow('Please write a review');
  });

  test('Should throw error for wrong password', () => {
    const author = { authBtnClick: false, isLoggedIn: false };
    expect(() => {
      ReviewValidator.validate('Great movie!', 5, author);
    }).toThrow('Wrong password');
  });
});
