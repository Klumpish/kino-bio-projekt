export default class LogIn {
  constructor() {}

  initLogin(form) {
    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');
    const loginMessage = document.createElement('p');
    loginMessage.classList.add('text-sm', 'mt-2');

    const userData = JSON.parse(localStorage.getItem('userData'));

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      let hasError = false;

      document.querySelectorAll('.error-message').forEach((el) => el.remove());
      emailInput.classList.remove('border-red-500');
      passwordInput.classList.remove('border-red-500');

      if (!userData) {
        this.showError(emailInput, 'Inget konto hittades. Var vänlig registrera dig först.');
        return;
      }

      if (emailInput.value !== userData.email) {
        this.showError(emailInput, 'Fel e-postadress.');
        hasError = true;
      }

      if (passwordInput.value !== userData.password) {
        this.showError(passwordInput, 'Fel lösenord.');
        hasError = true;
      }

      if (!hasError) {
        this.showSuccess(form);
      }

      console.log(userData);
    });
  }

  showError(inputElement, message) {
    const errorText = document.createElement('p');
    errorText.innerText = message;
    errorText.classList.add('text-red-500', 'text-sm', 'mt-1', 'error-message');
    inputElement.classList.add('border-red-500');
    inputElement.parentNode.appendChild(errorText);
  }

  showSuccess(form) {
    const successModal = document.getElementById('successModal');
    successModal.classList.remove('hidden');

    const redirectButton = document.getElementById('redirectButton');
    redirectButton.addEventListener('click', () => {
      window.location.href = '/userprofile';
    });

    const closeModal = document.getElementById('closeModal');
    closeModal.addEventListener('click', () => {
      successModal.classList.add('hidden');
    });
  }
}
