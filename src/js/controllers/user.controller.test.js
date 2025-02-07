import { login } from './user.controller.js';
import { describe, expect, it, jest } from '@jest/globals';

describe('User Authentication test', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      headers: {
        authorization: '',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('Failed to send data without authorization token', async () => {
    req.headers.authorization = undefined;

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      user: {
        username: 'Guest',
        isLoggedIn: false,
      },
      message: expect.any(String),
    });
  });

  test('Failed to send data with the wrong password (MOCK)', async () => {
    req.headers.authorization = `Basic ${btoa('user:somepassword')}`;

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      user: {
        username: 'Guest',
        isLoggedIn: false,
      },
      message: 'Invalid credentials',
    });
  });

  test('Successfully sent data with the right password (MOCK)', async () => {
    req.headers.authorization = `Basic ${btoa('user:default')}`;

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: expect.any(String),
      user: {
        username: 'user',
        verified: true,
        isLoggedIn: true,
      },
    });
  });
});
