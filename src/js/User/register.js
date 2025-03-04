export function createRegisterForm() {
  const logInContainer = document.querySelector('.login__container');
  logInContainer.className = 'login__container';

  const form = document.createElement('form');
  form.id = 'registerForm';

  const h1 = document.createElement('h1');
  h1.textContent = 'Registrering';
  h1.className = 'login__text';

  const userField = document.createElement('sl-input');
  userField.type = 'email';
  userField.placeholder = 't.ex användare@mail.com';
  userField.className = 'userField';
  userField.required = true;
  userField.name = 'username';

  const userNumber = document.createElement('sl-input');
  userNumber.placeholder = 'Telefonnummer';
  userNumber.className = 'userField';
  userNumber.required = true;
  userNumber.name = 'telefonnummer';

  const passwordField = document.createElement('sl-input');
  passwordField.setAttribute('type', 'password');
  passwordField.setAttribute('password-toggle', '');
  passwordField.className = 'passwordField';
  passwordField.placeholder = 'Lösenord';
  passwordField.required = true;
  passwordField.name = 'password';

  const passwordField2 = document.createElement('sl-input');
  passwordField2.setAttribute('type', 'password');
  passwordField2.setAttribute('password-toggle', '');
  passwordField2.className = 'passwordField';
  passwordField2.placeholder = 'Bekräfta lösenord';
  passwordField2.required = true;
  passwordField2.name = 'password2';

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.color = 'red';

  const button = document.createElement('sl-button');
  button.className = 'yellow';
  button.setAttribute('variant', 'default');
  button.type = 'submit';
  button.textContent = 'Skapa konto';

  const h2Msg = document.createElement('h2');
  h2Msg.textContent = 'Redan medlem? Logga in ';
  h2Msg.className = 'login__msg';
  const h2Link = document.createElement('a');
  h2Link.textContent = 'här!';
  h2Msg.append(h2Link);
  h2Link.href = '/loginM';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    errorDiv.textContent = '';

    const telefonnummer = userNumber.value;
    const username = userField.value;
    const password = passwordField.value;
    const password2 = passwordField2.value;

    if (password !== password2) {
      errorDiv.textContent = 'Lösenord inte stämmer';
      return;
    }

    const formData = {
      email: username,
      number: telefonnummer,
      password: password,
    };

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Registration success:', result);
        window.location.href = '/loginM';
      } else {
        console.error('Registration failed:', result);
        errorDiv.textContent = result.message;
      }
    } catch (error) {
      console.error('Error during registration:', error);
      errorDiv.textContent = 'An error occurred during registration.';
    }
  });

  form.append(h1, userField, userNumber, passwordField, passwordField2, errorDiv, button);
  logInContainer.append(form, h2Msg);
}
