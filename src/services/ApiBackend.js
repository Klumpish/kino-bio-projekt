export default class ApiBackend {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async login(username, password) {
    const credentials = `${username}:${password}`;
    const b64credentials = btoa(credentials);

    const loginRes = await fetch(this.apiUrl + '/login', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + b64credentials,
      },
    });

    if (!loginRes.ok) {
      throw new Error('Login failed');
    }

    return await loginRes.json();
  }

  async getUserData(token) {
    const userRes = await fetch(this.apiUrl + '/user', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (!userRes.ok) {
      throw new Error('Failed to get user data');
    }

    return await userRes.json();
  }
}
