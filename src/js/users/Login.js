export default class LogIn {
  constructor() {}

  initLogin(form) {
    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const userData = JSON.parse(localStorage.getItem('userData'));

      if (!userData) {
        alert('Inget konto hittades. Var vänlig registrera dig först.');
        return;
      }

      if (emailInput.value === userData.email && passwordInput.value === userData.password) {
        alert('Inloggning lyckades!');
        window.location.href = '/dashboard';
      } else {
        alert('Fel e-post eller lösenord. Försök igen.');
      }
    });
  }
}
