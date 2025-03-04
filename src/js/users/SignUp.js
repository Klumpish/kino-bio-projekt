export default class SignUp {
  constructor() {}

  initSignUp(form) {
    const namnInput = form.querySelector('#namn');
    const efternamnInput = form.querySelector('#efternamn');
    const anvandarnamnInput = form.querySelector('#anvandarnamn');
    const emailInput = form.querySelector('#email');
    const phoneInput = form.querySelector('#phone-input');
    const passwordInput = form.querySelector('#password');
    const confirmPasswordInput = form.querySelector('#confirm-password');
    const passwordWarning = form.querySelector('#passwordWarning');
    const passwordStrengthIndicator = document.createElement('p'); // Skapa en ny indikator
    passwordStrengthIndicator.classList.add('text-sm', 'mt-2');
    passwordInput.insertAdjacentElement('afterend', passwordStrengthIndicator); // Lägg den efter lösenordsfältet

    // Ladda sparade fält från localStorage
    this.loadFromLocalStorage(namnInput, 'namn');
    this.loadFromLocalStorage(efternamnInput, 'efternamn');
    this.loadFromLocalStorage(anvandarnamnInput, 'anvandarnamn');
    this.loadFromLocalStorage(emailInput, 'email');
    this.loadFromLocalStorage(phoneInput, 'phone');

    // Hantera lösenordsinput
    passwordInput.addEventListener('input', () => {
      localStorage.setItem('password', passwordInput.value);
      this.updatePasswordStrength(passwordInput.value, passwordStrengthIndicator);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (passwordInput.value !== confirmPasswordInput.value) {
        passwordWarning.innerText = 'Lösenordet matchar inte';
        passwordWarning.classList.remove('hidden');
        return;
      } else {
        passwordWarning.innerText = '';
        passwordWarning.classList.add('hidden');
      }

      const userData = {
        namn: namnInput.value,
        efternamn: efternamnInput.value,
        anvandarnamn: anvandarnamnInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        password: passwordInput.value,
      };

      console.log('Sending data to localStorage:', userData);

      localStorage.setItem('userData', JSON.stringify(userData));

      this.showCustomModal();
      this.resetForm(form);
    });
  }

  loadFromLocalStorage(inputElement, key) {
    if (inputElement) {
      inputElement.value = localStorage.getItem(key) || '';
      inputElement.addEventListener('input', () => {
        localStorage.setItem(key, inputElement.value);
      });
    }
  }

  updatePasswordStrength(password, indicator) {
    let strength = { text: 'Svagt lösenord', color: 'red' };
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    if (strongRegex.test(password)) {
      strength = { text: 'Starkt lösenord', color: 'green' };
    } else if (mediumRegex.test(password)) {
      strength = { text: 'Medelstarkt lösenord', color: 'orange' };
    }

    indicator.textContent = strength.text;
    indicator.style.color = strength.color;
  }

  showCustomModal() {
    const modal = document.getElementById('customModal');
    modal.classList.remove('hidden');

    const closeButton = document.getElementById('closeModal');
    const loginButton = document.getElementById('loginButton');

    closeButton.addEventListener('click', () => {
      modal.classList.add('hidden');
      window.location.href = '/login';
    });

    loginButton.addEventListener('click', () => {
      modal.classList.add('hidden');
      window.location.href = '/login';
    });
  }

  resetForm(form) {
    form.reset();
    localStorage.removeItem('namn');
    localStorage.removeItem('efternamn');
    localStorage.removeItem('anvandarnamn');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    localStorage.removeItem('password');
  }
}
