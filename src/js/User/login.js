export function createLoginForm() {
  const logInContainer = document.querySelector('.login__container');

  const h1 = document.createElement('h1');
  h1.textContent = 'Logga in';
  h1.className = 'login__text';

  const errorDiv = document.createElement('div'); // Div for error messages
  errorDiv.className = 'error-message';
  errorDiv.style.color = 'red';

  const form = document.createElement('form');
  form.id = 'loginForm';

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
  button.type = 'submit';
  button.textContent = 'Logga in';

  const h2Msg = document.createElement('h2');
  h2Msg.textContent = 'Inte medlem? Registrera dig ';
  h2Msg.className = 'login__msg';
  const h2Link = document.createElement('a');
  h2Link.textContent = 'här!';
  h2Msg.append(h2Link);
  h2Link.href = '/registerM';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorDiv.textContent = '';

    const email = userField.value;
    const password = passwordField.value;

    const formData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('/newLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login success:', data);
        localStorage.setItem('token', data.token);
        window.location.href = '/profile';
      } else {
        console.error('Login failed:', data);
        errorDiv.textContent = data.message;
      }
    } catch (error) {
      console.error('Error during login:', error);
      errorDiv.textContent = 'An error occurred during login.';
    }
  });
  form.append(h1, userField, passwordField, h2_pswrd, errorDiv, button, h2Msg);
  logInContainer.append(form);
}
