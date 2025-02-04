export default class UserService {
  constructor() {
    this.user = null;
  }

  async login(username, password) {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    this.user = await response.json();
    return this.user;
  }

  static getUserName() {
    return this.user ? this.user.username : 'Guest';
  }
}
