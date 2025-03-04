export function showProfile() {
  const profileContainer = document.querySelector('.profile__container');
  if (!profileContainer) return;

  const token = localStorage.getItem('token');

  if (!token || token === '' || token === 'undefined' || token === null) {
    profileContainer.innerHTML = '<p>Du är inte inloggad.</p>';
    // Redirect to login page
    setTimeout(() => {
      window.location.href = '/loginM';
    }, 2000);
    return;
  }

  fetch('/current', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      return response.json();
    })
    .then((user) => {
      // Create logout button
      const logoutButton = document.createElement('button');
      logoutButton.textContent = 'Logga ut';
      logoutButton.classList.add('logout__button');

      // Add event listener to handle logout
      logoutButton.addEventListener('click', () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        // Redirect to main page
        window.location.href = '/loginM';
      });

      profileContainer.innerHTML = `
        <h2>Välkommen!</h2>
        <p>Din e-post: ${user.email}</p>
        <p>Ditt telefonnummer: ${user.number}</p>
      `;

      // Append the button to the profile container
      profileContainer.appendChild(logoutButton);
    })
    .catch((error) => {
      console.error('Error fetching user profile:', error);
      profileContainer.innerHTML = '<p>Kunde inte hämta din profil.</p>';
      setTimeout(() => {
        window.location.href = '/loginM';
      }, 2000);
    });
}

export function loginCheck() {
  if (localStorage.getItem('token')) {
    window.location.href = '/profile';
  }
}
