import '@shoelace-style/shoelace/dist/shoelace.js';

export function createLoginForm() {
  const logInContainer = document.querySelector('.login__container');
  logInContainer.className = 'login__container';

  const h1 = document.createElement('h1');
  h1.textContent = 'Logga in';
  h1.className = 'login__text';

  const userField = document.createElement('sl-input');
  userField.placeholder = 'E-post eller telefonnummer';
  userField.className = 'userField';

  const passwordField = document.createElement('sl-input');
  passwordField.setAttribute('type', 'password');
  passwordField.setAttribute('password-toggle', '');
  passwordField.className = 'passwordField';
  passwordField.placeholder = 'Lösenord';

  const h2_pswrd = document.createElement('h2');
  h2_pswrd.textContent = 'Glömt lösenordet?';
  h2_pswrd.className = 'forgotPassword__text';

  const button = document.createElement('sl-button');
  button.className = 'yellow';
  button.setAttribute('variant', 'default');
  button.textContent = 'Logga in';

  button.addEventListener('click', () => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    console.log(storedData.username);
  });

  const h2Msg = document.createElement('h2');
  h2Msg.textContent = 'Inte medlem? Registrera dig här!';
  h2Msg.className = 'login__msg';

  logInContainer.append(h1, userField, passwordField, h2_pswrd, button, h2Msg);
}
