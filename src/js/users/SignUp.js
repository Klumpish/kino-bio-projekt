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

    if (namnInput) {
      namnInput.value = localStorage.getItem('namn') || '';
      namnInput.addEventListener('input', () => {
        localStorage.setItem('namn', namnInput.value);
      });
    }

    if (efternamnInput) {
      efternamnInput.value = localStorage.getItem('efternamn') || '';
      efternamnInput.addEventListener('input', () => {
        localStorage.setItem('efternamn', efternamnInput.value);
      });
    }

    if (anvandarnamnInput) {
      anvandarnamnInput.value = localStorage.getItem('anvandarnamn') || '';
      anvandarnamnInput.addEventListener('input', () => {
        localStorage.setItem('anvandarnamn', anvandarnamnInput.value);
      });
    }

    if (emailInput) {
      emailInput.value = localStorage.getItem('email') || '';
      emailInput.addEventListener('input', () => {
        localStorage.setItem('email', emailInput.value);
      });
    }

    if (phoneInput) {
      phoneInput.value = localStorage.getItem('phone') || '';
      phoneInput.addEventListener('input', () => {
        localStorage.setItem('phone', phoneInput.value);
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener('input', () => {
        localStorage.setItem('password', passwordInput.value);
      });
    }

    form.addEventListener('submit', async (event) => {
      if (passwordInput.value !== confirmPasswordInput.value) {
        passwordWarning.innerText = 'Lösenordet matchar inte';
        passwordWarning.classList.remove('hidden');
        return;
      } else {
        passwordWarning.innerText = ''; // Clear the warning
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

      // Store data in localStorage
      localStorage.setItem('userData', JSON.stringify(userData));

      // Display the custom modal
      this.showCustomModal();
      this.resetForm(form);
      event.preventDefault();
    });
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
