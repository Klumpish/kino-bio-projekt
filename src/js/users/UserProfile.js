export default class UserProfile {
  constructor() {}

  initProfile(page) {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const userName = document.querySelector('#username');
    userName.textContent = `${userData.anvandarnamn}`;

    const fullName = document.querySelector('#fullName');
    fullName.textContent = `${userData.namn} ${userData.efternamn}`;

    const phone = document.querySelector('#phone');
    phone.textContent = `${userData.phone}`;

    const email = document.querySelector('#email');
    email.textContent = `${userData.email}`;
  }

  logout() {
    localStorage.removeItem('userData');

    window.location.href = '/login';
  }
}
