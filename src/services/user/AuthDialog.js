export default class AuthDialog extends EventTarget {
  constructor(api) {
    super();
    this.api = api;
    this.result = 'Guest';
    this.status = false;
    this.dialog = null;
    this.isLoggedIn = false;
    this.authBtnClick = false;
  }

  render() {
    this.dialog = document.createElement('dialog');
    this.dialog.className = 'auth-dialog';

    const guestSubmit = document.createElement('span');
    guestSubmit.className = 'auth-guest';
    guestSubmit.innerHTML = 'Submit as a guest';

    const hint = document.createElement('span');
    hint.className = 'hint';
    hint.innerHTML = 'The default password is: default';

    const form = document.createElement('form');
    form.method = 'dialog';
    form.className = 'auth-form';

    const usernameDiv = document.createElement('div');
    usernameDiv.className = 'input-group';
    const usernameLabel = document.createElement('label');
    usernameLabel.className = 'auth-label';
    usernameLabel.htmlFor = 'username';
    usernameLabel.textContent = 'Username:';
    const usernameInput = document.createElement('input');
    usernameInput.className = 'auth-input';
    usernameInput.type = 'text';
    usernameInput.id = 'username';
    usernameInput.required = true;

    const passwordDiv = document.createElement('div');
    passwordDiv.className = 'input-group';
    const passwordLabel = document.createElement('label');
    passwordLabel.className = 'auth-label';
    passwordLabel.htmlFor = 'password';
    passwordLabel.textContent = 'Password:';
    const passwordInput = document.createElement('input');
    passwordInput.className = 'auth-input';
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.className = 'submit-button';
    submitButton.type = 'submit';
    submitButton.textContent = 'Login';

    guestSubmit.addEventListener('click', () => {
      this.authBtnClick = true;
      this.dispatchEvent(new Event('auth'));
      this.dialog.close();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const loginPayload = await this.api.login(usernameInput.value, passwordInput.value);
        const userData = await this.api.getUserData(loginPayload.token);
        this.result = userData.user.username;
        this.status = userData.user.isVerified;
        this.isLoggedIn = userData.user.isLoggedIn;
        this.dispatchEvent(new Event('auth'));
        this.dialog.close();
      } catch (error) {
        this.dialog.close();
        this.dispatchEvent(new Event('auth'));
      }
    });

    usernameDiv.append(usernameLabel, usernameInput);
    passwordDiv.append(passwordLabel, passwordInput);
    form.append(usernameDiv, passwordDiv, submitButton, hint, guestSubmit);
    this.dialog.append(form);

    return this.dialog;
  }
}
