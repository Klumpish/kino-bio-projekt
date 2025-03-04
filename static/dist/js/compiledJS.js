document.addEventListener('DOMContentLoaded', () => {
  const o = document.querySelector('.hamburger'),
    t = document.querySelector('.hamburger__items'),
    e = document.querySelector('.hamburger__close');
  o &&
    t &&
    o.addEventListener('click', () => {
      t.classList.toggle('active'), o.classList.toggle('open');
    }),
    e &&
      e.addEventListener('click', () => {
        t.classList.remove('active'), o.classList.remove('open');
      });
});
class ve {
  constructor(t) {
    this.apiPath = t;
  }
  async fetchData() {
    try {
      return (await (await fetch(this.apiPath)).json()).liveEvents;
    } catch (t) {
      return console.error('Error fetching data:', t), [];
    }
  }
}
class be {
  constructor(t) {
    this.container = document.querySelector(t);
  }
  createLiveEvent({ title: t, description: e, image: r }) {
    const i = document.createElement('li');
    return (
      i.classList.add('live__list-item'),
      (i.innerHTML = `
        <div class="live__list-item-image-wrapper">
                <img src="${r}" class="live__list-item-image" alt="${t}" />
            </div>
            <div class="live__list-item-title">
                <h3>${t}</h3>
                <button class="live__list-item-btn" aria-label="Book ticket to live event">BOKA</button>
            </div>
            <div class="live__list-item-description">
                <p>${e}</p>
            </div>
            `),
      i
    );
  }
  renderLiveEvents(t) {
    if (!this.container) {
      console.error('Container element not found');
      return;
    }
    if (!Array.isArray(t) || t.length === 0) {
      this.container.innerHTML = '<p> No live events founds.</p>';
      return;
    }
    this.container.innerHTML = '';
    const e = document.createDocumentFragment();
    t.forEach((r) => {
      const i = this.createLiveEvent(r);
      e.appendChild(i);
    }),
      this.container.appendChild(e);
  }
}
async function ye() {
  const o = './static/dist/json/liveEvents.json',
    t = new ve(o),
    e = new be('.live__list');
  try {
    const r = await t.fetchData();
    e.renderLiveEvents(r);
  } catch (r) {
    console.error('Error initializing live events:', r);
  }
}
const we = async () => {
  if (window.location.pathname.startsWith('/movie/')) {
    const t = (function () {
      const r = window.location.pathname.match(/\/movie\/(\d+)/);
      return r ? r[1] : null;
    })();
    if (t)
      try {
        const r = await (await fetch(`/api/screenings/${t}/movie`)).json();
        return !r || r.length === 0
          ? (console.warn('No screening available for this movie'), [])
          : r.map((n) => {
              const s = new Date(n.start_time),
                a = s.getFullYear(),
                l = (s.getMonth() + 1).toString().padStart(2, '0'),
                u = s.getDate().toString().padStart(2, '0'),
                p = s.getHours().toString().padStart(2, '0'),
                h = s.getMinutes().toString().padStart(2, '0');
              return { formattedTime: `${a}-${l}-${u} ${p}:${h}`, room: n.room };
            });
      } catch (e) {
        return console.error('Error fetching screenings:', e), null;
      }
    else return console.error('No movie ID found in the url'), null;
  }
  return null;
};
async function _e() {
  if (window.location.pathname.startsWith('/movie/')) {
    const o = await we(),
      t = document.querySelector('.screening__info-list');
    if (!o || o.length === 0) {
      console.log('No screening data available.');
      const e = document.createElement('li');
      (e.innerHTML = ' <span class="screening-time">Listan är tom</span>'), t.appendChild(e);
      return;
    }
    o.sort((e, r) => {
      const i = new Date(e.formattedTime),
        n = new Date(r.formattedTime);
      return i - n;
    }),
      (t.innerHTML = ''),
      o.forEach(({ formattedTime: e, room: r }) => {
        const i = document.createElement('li');
        (i.innerHTML = ` <span class="screening-time">Tid: ${e}</span>
  <span class="screening-room">Sal: ${r}</span>`),
          t.appendChild(i);
      });
  }
}
_e();
const At = async (o) => {
  const t = `/movie/${o}/screenings/upcoming`;
  return await (await fetch(t)).json();
};
async function $e() {
  const o = document.querySelectorAll('.movie-link'),
    t = Array.prototype.map.call(o, (i) => i.id);
  let e = 0;
  const r = [];
  for (const i of t)
    try {
      const n = await At(i);
      console.log(`Upcoming screenings for movie ID ${i}:`, n);
      const s = document.getElementById(i);
      if (!s) {
        console.error(`No movie container found for movie ID ${i}`);
        continue;
      }
      if (n.length > 0) {
        const a = n[0],
          l = new Date(a.attributes.start_time),
          u = a.attributes.room;
        if (l && u) {
          const p = document.createElement('p');
          p.classList.add('showings'),
            (p.textContent = `${u} - ${l.toLocaleString()}`),
            s.appendChild(p),
            e++,
            r.push(a);
        } else console.error(`Invalid screening data for movie ID ${i}:`, a);
      } else {
        const a = document.createElement('p');
        (a.textContent = 'Inga visningar'), a.classList.add('no-showings'), s.appendChild(a);
      }
      if (e >= 10) break;
    } catch (n) {
      console.error(`Error fetching screenings for movie ID ${i}:`, n);
    }
  if (e < 10)
    for (const i of t)
      try {
        const s = (await At(i)).filter((a) => !r.includes(a));
        for (const a of s) {
          if (e >= 10) break;
          const l = new Date(a.attributes.start_time),
            u = a.attributes.room;
          if (l && u) {
            const p = document.getElementById(i),
              h = document.createElement('p');
            h.classList.add('showings'),
              (h.textContent = `${u} - ${l.toLocaleString()}`),
              p.appendChild(h),
              e++,
              r.push(a);
          } else console.error(`Invalid screening data for movie ID ${i}:`, a);
        }
        if (e >= 10) break;
      } catch (n) {
        console.error(`Error fetching screenings for movie ID ${i}:`, n);
      }
}
class Kt {
  static getMovieIdFromPath() {
    const e = window.location.pathname.match(/\/movie\/(\d+)/);
    if (!e || !e[1]) throw new Error('Movie ID not found in URL');
    return e[1];
  }
}
class Ce {
  static validate(t, e, r) {
    if (!e || e < 1) throw new Error('Please select a rating');
    if (!(t != null && t.trim())) throw new Error('Please write a review');
    if (!r.authBtnClick && !r.isLoggedIn) throw new Error('Wrong password');
    return !0;
  }
}
class Ee {
  static format(t, e, r, i) {
    return {
      data: {
        comment: t,
        rating: e,
        author: i.username,
        verified: i.status,
        movie: r,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }
}
class xe {
  static async submit(t, e) {
    const r = await fetch('/movie/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(e),
    });
    if (!r.ok) throw new Error('Failed to submit review');
    return r.json();
  }
}
class ke extends EventTarget {
  constructor(t) {
    super(),
      (this.api = t),
      (this.result = 'Guest'),
      (this.status = !1),
      (this.dialog = null),
      (this.isLoggedIn = !1),
      (this.authBtnClick = !1);
  }
  render() {
    (this.dialog = document.createElement('dialog')), (this.dialog.className = 'auth-dialog');
    const t = document.createElement('span');
    (t.className = 'auth-guest'), (t.innerHTML = 'Submit as a guest');
    const e = document.createElement('span');
    (e.className = 'hint'), (e.innerHTML = 'The default password is: default');
    const r = document.createElement('form');
    (r.method = 'dialog'), (r.className = 'auth-form');
    const i = document.createElement('div');
    i.className = 'input-group';
    const n = document.createElement('label');
    (n.className = 'auth-label'), (n.htmlFor = 'username'), (n.textContent = 'Username:');
    const s = document.createElement('input');
    (s.className = 'auth-input'), (s.type = 'text'), (s.id = 'username'), (s.required = !0);
    const a = document.createElement('div');
    a.className = 'input-group';
    const l = document.createElement('label');
    (l.className = 'auth-label'), (l.htmlFor = 'password'), (l.textContent = 'Password:');
    const u = document.createElement('input');
    (u.className = 'auth-input'), (u.type = 'password'), (u.id = 'password'), (u.required = !0);
    const p = document.createElement('button');
    return (
      (p.className = 'submit-button'),
      (p.type = 'submit'),
      (p.textContent = 'Login'),
      t.addEventListener('click', () => {
        (this.authBtnClick = !0), this.dispatchEvent(new Event('auth')), this.dialog.close();
      }),
      r.addEventListener('submit', async (h) => {
        h.preventDefault();
        try {
          const y = await this.api.login(s.value, u.value),
            b = await this.api.getUserData(y.token);
          (this.result = b.user.username),
            (this.status = b.user.isVerified),
            (this.isLoggedIn = b.user.isLoggedIn),
            this.dispatchEvent(new Event('auth')),
            this.dialog.close();
        } catch {
          this.dialog.close(), this.dispatchEvent(new Event('auth'));
        }
      }),
      i.append(n, s),
      a.append(l, u),
      r.append(i, a, p, e, t),
      this.dialog.append(r),
      this.dialog
    );
  }
}
class Se {
  constructor(t) {
    this.apiUrl = t;
  }
  async login(t, e) {
    const r = `${t}:${e}`,
      i = btoa(r),
      n = await fetch(this.apiUrl + '/login', { method: 'POST', headers: { Authorization: 'Basic ' + i } });
    if (!n.ok) throw new Error('Login failed');
    return await n.json();
  }
  async getUserData(t) {
    const e = await fetch(this.apiUrl + '/user', { headers: { Authorization: 'Bearer ' + t } });
    if (!e.ok) throw new Error('Failed to get user data');
    return await e.json();
  }
}
class Ae {
  constructor() {}
  static async showAuthDialog() {
    const t = new Se(''),
      e = new ke(t),
      r = e.render();
    return (
      document.body.appendChild(r),
      r.showModal(),
      await new Promise((i) => {
        e.addEventListener('auth', i, { once: !0 });
      }),
      r.close(),
      r.remove(),
      { username: e.result, status: e.status, isLoggedIn: e.isLoggedIn, authBtnClick: e.authBtnClick }
    );
  }
}
class Le {
  constructor() {
    (this.selectedRating = 0), this.createReview(), this.attachEventListeners();
  }
  render() {
    (this.selectedRating = 0), this.initializeUI(), this.attachEventListeners();
  }
  initializeUI() {
    this.createReview(), this.appendToDOM();
  }
  createReview() {
    (this.container = document.createElement('section')),
      (this.container.className = 'review__form'),
      (this.stars = document.createElement('div')),
      (this.stars.className = 'review__stars'),
      (this.stars.id = 'stars');
    for (let t = 1; t <= 5; t++) {
      const e = document.createElement('span');
      (e.className = 'review__star'), (e.dataset.value = t), (e.textContent = '★'), this.stars.appendChild(e);
    }
    this.container.appendChild(this.stars),
      (this.textarea = document.createElement('textarea')),
      (this.textarea.className = 'review__textarea'),
      (this.textarea.placeholder = 'Write your review here'),
      this.container.appendChild(this.textarea),
      (this.submit = document.createElement('button')),
      (this.submit.className = 'review__submit'),
      (this.submit.textContent = 'Submit'),
      this.container.appendChild(this.submit);
  }
  appendToDOM() {
    const t = document.querySelector('.review');
    if (!t) throw new Error('Review container not found');
    t.appendChild(this.container);
  }
  attachEventListeners() {
    this.stars.querySelectorAll('.review__star').forEach((t) => {
      t.addEventListener('click', () => this.handleStarClick(t));
    }),
      this.submit.addEventListener('click', () => this.handleSubmit());
  }
  handleStarClick(t) {
    (this.selectedRating = parseInt(t.dataset.value)), this.updateStars();
  }
  updateStars() {
    this.stars.querySelectorAll('.review__star').forEach((t) => {
      const e = parseInt(t.dataset.value);
      t.classList.toggle('active', e <= this.selectedRating);
    });
  }
  async validateReview() {
    const t = this.textarea.value.trim(),
      e = Kt.getMovieIdFromPath(),
      r = await Ae.showAuthDialog();
    return console.log('author:', r), Ce.validate(t, this.selectedRating, r), Ee.format(t, this.selectedRating, e, r);
  }
  async handleSubmit() {
    try {
      const t = await this.validateReview();
      console.log(`Film id: ${t.data.movie}`),
        console.log(`Film data: ${t}`),
        await xe.submit(t.data.movie, t),
        this.resetForm(),
        this.showSuccess('Review submitted successfully!');
    } catch (t) {
      this.showError(t.message);
    }
  }
  resetForm() {
    (this.selectedRating = 0), (this.textarea.value = ''), this.updateStars();
  }
  showSuccess(t) {
    this.showFeedback(t, 'success');
  }
  showError(t) {
    this.showFeedback(t, 'error');
  }
  showFeedback(t, e) {
    const r = document.createElement('div');
    (r.className = `review__feedback review__feedback--${e}`),
      (r.textContent = t),
      this.container.appendChild(r),
      setTimeout(() => r.remove(), 5e3);
  }
}
class Ie {
  constructor(t, e, r = 1, i = 5) {
    (this.url = t), (this.movieId = e), (this.page = r), (this.pageSize = i);
  }
  async fetchReviews() {
    try {
      const t = await fetch(`${this.url}/movie/${this.movieId}/reviews?page=${this.page}&pageSize=${this.pageSize}`);
      if (!t.ok) throw new Error('Failed to fetch reviews');
      return await t.json();
    } catch (t) {
      return console.error('Error fetching movie reviews:', t), { data: [], meta: { currentPage: 1, totalPages: 1 } };
    }
  }
  setPage(t) {
    this.page = t;
  }
}
class Te {
  constructor(t) {
    this.data = t;
  }
  render() {
    const t = document.createElement('div');
    t.classList.add('review');
    const e = document.createElement('span');
    (e.textContent = this.data.rating), t.appendChild(e);
    const r = document.createElement('p');
    (r.textContent = this.data.comment), t.appendChild(r);
    const i = document.createElement('h4');
    return (i.textContent = this.data.author), t.appendChild(i), t;
  }
}
class Me {
  constructor(t) {
    (this.backend = t), (this.currentPage = 1), (this.totalPages = 1);
  }
  async initReviews(t) {
    const { reviews: e, meta: r } = await this.backend.fetchReviews();
    (this.totalPages = r.totalPages),
      (this.reviewsContainer = document.createElement('div')),
      t.appendChild(this.reviewsContainer),
      (this.paginationContainer = document.createElement('div')),
      this.paginationContainer.classList.add('pagination'),
      t.appendChild(this.paginationContainer),
      this.renderReviews(e),
      this.renderPagination();
  }
  renderReviews(t) {
    (this.reviewsContainer.innerHTML = ''),
      t.forEach((e) => {
        const r = new Te(e);
        this.reviewsContainer.append(r.render());
      });
  }
  renderPagination() {
    this.paginationContainer.innerHTML = '';
    const t = document.createElement('button');
    (t.textContent = 'Föregående'),
      (t.disabled = this.currentPage === 1),
      t.addEventListener('click', () => this.changePage(this.currentPage - 1));
    const e = document.createElement('button');
    (e.textContent = 'Nästa'),
      (e.disabled = this.currentPage === this.totalPages),
      e.addEventListener('click', () => this.changePage(this.currentPage + 1));
    const r = document.createElement('span');
    (r.textContent = `Sida ${this.currentPage} av ${this.totalPages}`),
      this.paginationContainer.appendChild(t),
      this.paginationContainer.appendChild(r),
      this.paginationContainer.appendChild(e);
  }
  async changePage(t) {
    if (t < 1 || t > this.totalPages) return;
    (this.currentPage = t), this.backend.setPage(t);
    const { reviews: e } = await this.backend.fetchReviews();
    this.renderReviews(e), this.updatePagination();
  }
  updatePagination() {
    const t = this.paginationContainer.querySelector('button:first-child'),
      e = this.paginationContainer.querySelector('button:last-child'),
      r = this.paginationContainer.querySelector('span');
    (t.disabled = this.currentPage === 1),
      (e.disabled = this.currentPage === this.totalPages),
      (r.textContent = `Sida ${this.currentPage} av ${this.totalPages}`);
  }
}
class Pe {
  constructor(t, e) {
    (this.url = t), (this.movieId = e);
  }
  async fetchAverageRating() {
    try {
      const t = await fetch(`${this.url}/movie/${this.movieId}/ratings/average`);
      if (!t.ok) throw new Error('Failed to fetch average rating');
      return (await t.json()).averageRating;
    } catch (t) {
      return console.error('Error fetching average rating:', t), null;
    }
  }
}
class Re {
  constructor(t) {
    this.ratingValue = t;
  }
  render() {
    const t = document.createElement('div');
    t.classList.add('rating');
    const e = document.createElement('span');
    return e.classList.add('rating__value'), (e.textContent = this.ratingValue.toFixed(1)), t.appendChild(e), t;
  }
}
class ze {
  constructor(t, e) {
    (this.backend = t), (this.movieId = e);
  }
  async renderAvRating(t) {
    const e = await this.backend.fetchAverageRating();
    if (e !== null) {
      const r = new Re(e);
      t.appendChild(r.render());
    }
  }
}
class Ne {
  constructor(t) {
    this.apiUrl = t;
  }
  async fetchTopMovies() {
    try {
      const t = await fetch(this.apiUrl),
        e = await t.json();
      if (!t.ok)
        throw (
          (console.error('Serverfel vid hämtning:', t.status, t.statusText, e),
          new Error('Serverfel vid hämtning av topplistan.'))
        );
      return console.log('Hämtade toppfilmer:', e), e;
    } catch (t) {
      console.error('Fel vid hämtning av topprankade filmer:', t);
      const e = document.createElement('span');
      (e.textContent = 'Kunde inte hämta populära filmer. Försök igen senare.'),
        (e.style.color = 'white'),
        (e.style.textAlign = 'center');
      const r = document.querySelector('.topmovies');
      return r && r.appendChild(e), [];
    }
  }
}
class De {
  constructor(t) {
    this.moviesList = document.querySelector(t);
  }
  clearList() {
    for (; this.moviesList.firstChild; ) this.moviesList.removeChild(this.moviesList.firstChild);
  }
  renderLoadingMessage() {
    this.clearList();
    const t = document.createElement('li');
    t.classList.add('loading__top_movies'), (t.textContent = 'Laddar topplistan...'), this.moviesList.appendChild(t);
  }
  renderErrorMessage() {
    this.clearList();
    const t = document.createElement('li');
    (t.textContent = 'Kunde inte ladda populära filmer.'),
      (t.style.color = 'white'),
      (t.style.textAlign = 'center'),
      this.moviesList.appendChild(t);
  }
  renderMovies(t) {
    if ((this.clearList(), !t.length)) {
      const e = document.createElement('li');
      (e.textContent = 'Inga topprankade filmer hittades.'), this.moviesList.appendChild(e);
      return;
    }
    t.forEach((e) => {
      var u;
      const r = document.createElement('li'),
        i = document.createElement('a');
      (i.href = `/movie/${e.id}`), (i.id = e.id);
      const n = document.createElement('article');
      n.classList.add('topmovie-card');
      const s = document.createElement('img');
      s.classList.add('topmovie-card__image'),
        (s.src = ((u = e.attributes.image) == null ? void 0 : u.url) || '/static/dist/images/Kino_doors.png'),
        (s.alt = `Movie title: ${e.attributes.title}`);
      const a = document.createElement('h3');
      a.classList.add('topmovie-card_title'), (a.textContent = e.attributes.title);
      const l = document.createElement('span');
      l.classList.add('topmovie-card_rating'),
        (l.textContent = `⭐ Rating: ${e.attributes.avgRating}/5`),
        n.appendChild(s),
        n.appendChild(a),
        n.appendChild(l),
        i.appendChild(n),
        r.appendChild(i),
        this.moviesList.appendChild(r);
    });
  }
}
function Be() {
  const o = document.querySelector('.login__container'),
    t = document.createElement('h1');
  (t.textContent = 'Logga in'), (t.className = 'login__text');
  const e = document.createElement('div');
  (e.className = 'error-message'), (e.style.color = 'red');
  const r = document.createElement('form');
  r.id = 'loginForm';
  const i = document.createElement('sl-input');
  (i.placeholder = 'E-post eller telefonnummer'), (i.className = 'userField');
  const n = document.createElement('sl-input');
  n.setAttribute('type', 'password'),
    n.setAttribute('password-toggle', ''),
    (n.className = 'passwordField'),
    (n.placeholder = 'Lösenord');
  const s = document.createElement('h2');
  (s.textContent = 'Glömt lösenordet?'), (s.className = 'forgotPassword__text');
  const a = document.createElement('sl-button');
  (a.className = 'yellow'), a.setAttribute('variant', 'default'), (a.type = 'submit'), (a.textContent = 'Logga in');
  const l = document.createElement('h2');
  (l.textContent = 'Inte medlem? Registrera dig '), (l.className = 'login__msg');
  const u = document.createElement('a');
  (u.textContent = 'här!'),
    l.append(u),
    (u.href = '/registerM'),
    r.addEventListener('submit', async (p) => {
      p.preventDefault(), (e.textContent = '');
      const h = i.value,
        y = n.value,
        b = { email: h, password: y };
      try {
        const w = await fetch('/newLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(b),
          }),
          M = await w.json();
        w.ok
          ? (console.log('Login success:', M),
            localStorage.setItem('token', M.token),
            (window.location.href = '/profile'))
          : (console.error('Login failed:', M), (e.textContent = M.message));
      } catch (w) {
        console.error('Error during login:', w), (e.textContent = 'An error occurred during login.');
      }
    }),
    r.append(t, i, n, s, e, a, l),
    o.append(r);
}
function Oe() {
  const o = document.querySelector('.login__container');
  o.className = 'login__container';
  const t = document.createElement('form');
  t.id = 'registerForm';
  const e = document.createElement('h1');
  (e.textContent = 'Registrering'), (e.className = 'login__text');
  const r = document.createElement('sl-input');
  (r.type = 'email'),
    (r.placeholder = 't.ex användare@mail.com'),
    (r.className = 'userField'),
    (r.required = !0),
    (r.name = 'username');
  const i = document.createElement('sl-input');
  (i.placeholder = 'Telefonnummer'), (i.className = 'userField'), (i.required = !0), (i.name = 'telefonnummer');
  const n = document.createElement('sl-input');
  n.setAttribute('type', 'password'),
    n.setAttribute('password-toggle', ''),
    (n.className = 'passwordField'),
    (n.placeholder = 'Lösenord'),
    (n.required = !0),
    (n.name = 'password');
  const s = document.createElement('sl-input');
  s.setAttribute('type', 'password'),
    s.setAttribute('password-toggle', ''),
    (s.className = 'passwordField'),
    (s.placeholder = 'Bekräfta lösenord'),
    (s.required = !0),
    (s.name = 'password2');
  const a = document.createElement('div');
  (a.className = 'error-message'), (a.style.color = 'red');
  const l = document.createElement('sl-button');
  (l.className = 'yellow'), l.setAttribute('variant', 'default'), (l.type = 'submit'), (l.textContent = 'Skapa konto');
  const u = document.createElement('h2');
  (u.textContent = 'Redan medlem? Logga in '), (u.className = 'login__msg');
  const p = document.createElement('a');
  (p.textContent = 'här!'),
    u.append(p),
    (p.href = '/loginM'),
    t.addEventListener('submit', async (h) => {
      h.preventDefault(), (a.textContent = '');
      const y = i.value,
        b = r.value,
        w = n.value,
        M = s.value;
      if (w !== M) {
        a.textContent = 'Lösenord inte stämmer';
        return;
      }
      const fe = { email: b, number: y, password: w };
      try {
        const X = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fe),
          }),
          at = await X.json();
        X.ok
          ? (console.log('Registration success:', at), (window.location.href = '/loginM'))
          : (console.error('Registration failed:', at), (a.textContent = at.message));
      } catch (X) {
        console.error('Error during registration:', X), (a.textContent = 'An error occurred during registration.');
      }
    }),
    t.append(e, r, i, n, s, a, l),
    o.append(t, u);
}
function Ue() {
  const o = document.querySelector('.profile__container');
  if (!o) return;
  const t = localStorage.getItem('token');
  if (!t || t === '' || t === 'undefined' || t === null) {
    (o.innerHTML = '<p>Du är inte inloggad.</p>'),
      setTimeout(() => {
        window.location.href = '/loginM';
      }, 2e3);
    return;
  }
  fetch('/current', { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` } })
    .then((e) => {
      if (!e.ok) throw new Error('Failed to fetch user profile');
      return e.json();
    })
    .then((e) => {
      const r = document.createElement('button');
      (r.textContent = 'Logga ut'),
        r.classList.add('logout__button'),
        r.addEventListener('click', () => {
          localStorage.removeItem('token'), (window.location.href = '/loginM');
        }),
        (o.innerHTML = `
        <h2>Välkommen!</h2>
        <p>Din e-post: ${e.email}</p>
        <p>Ditt telefonnummer: ${e.number}</p>
      `),
        o.appendChild(r);
    })
    .catch((e) => {
      console.error('Error fetching user profile:', e),
        (o.innerHTML = '<p>Kunde inte hämta din profil.</p>'),
        setTimeout(() => {
          window.location.href = '/loginM';
        }, 2e3);
    });
}
function Gt() {
  localStorage.getItem('token') && (window.location.href = '/profile');
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const et = globalThis,
  wt =
    et.ShadowRoot &&
    (et.ShadyCSS === void 0 || et.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype,
  _t = Symbol(),
  Lt = new WeakMap();
let Zt = class {
  constructor(t, e, r) {
    if (((this._$cssResult$ = !0), r !== _t))
      throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    (this.cssText = t), (this.t = e);
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (wt && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = Lt.get(e)),
        t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && Lt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ve = (o) => new Zt(typeof o == 'string' ? o : o + '', void 0, _t),
  D = (o, ...t) => {
    const e =
      o.length === 1
        ? o[0]
        : t.reduce(
            (r, i, n) =>
              r +
              ((s) => {
                if (s._$cssResult$ === !0) return s.cssText;
                if (typeof s == 'number') return s;
                throw Error(
                  "Value passed to 'css' function must be a 'css' function result: " +
                    s +
                    ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security."
                );
              })(i) +
              o[n + 1],
            o[0]
          );
    return new Zt(e, o, _t);
  },
  Fe = (o, t) => {
    if (wt) o.adoptedStyleSheets = t.map((e) => (e instanceof CSSStyleSheet ? e : e.styleSheet));
    else
      for (const e of t) {
        const r = document.createElement('style'),
          i = et.litNonce;
        i !== void 0 && r.setAttribute('nonce', i), (r.textContent = e.cssText), o.appendChild(r);
      }
  },
  It = wt
    ? (o) => o
    : (o) =>
        o instanceof CSSStyleSheet
          ? ((t) => {
              let e = '';
              for (const r of t.cssRules) e += r.cssText;
              return Ve(e);
            })(o)
          : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const {
    is: He,
    defineProperty: qe,
    getOwnPropertyDescriptor: je,
    getOwnPropertyNames: We,
    getOwnPropertySymbols: Ke,
    getPrototypeOf: Ge,
  } = Object,
  x = globalThis,
  Tt = x.trustedTypes,
  Ze = Tt ? Tt.emptyScript : '',
  lt = x.reactiveElementPolyfillSupport,
  q = (o, t) => o,
  z = {
    toAttribute(o, t) {
      switch (t) {
        case Boolean:
          o = o ? Ze : null;
          break;
        case Object:
        case Array:
          o = o == null ? o : JSON.stringify(o);
      }
      return o;
    },
    fromAttribute(o, t) {
      let e = o;
      switch (t) {
        case Boolean:
          e = o !== null;
          break;
        case Number:
          e = o === null ? null : Number(o);
          break;
        case Object:
        case Array:
          try {
            e = JSON.parse(o);
          } catch {
            e = null;
          }
      }
      return e;
    },
  },
  $t = (o, t) => !He(o, t),
  Mt = { attribute: !0, type: String, converter: z, reflect: !1, hasChanged: $t };
Symbol.metadata ?? (Symbol.metadata = Symbol('metadata')),
  x.litPropertyMetadata ?? (x.litPropertyMetadata = new WeakMap());
class P extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Mt) {
    if ((e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor)) {
      const r = Symbol(),
        i = this.getPropertyDescriptor(t, r, e);
      i !== void 0 && qe(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: i, set: n } = je(this.prototype, t) ?? {
      get() {
        return this[e];
      },
      set(s) {
        this[e] = s;
      },
    };
    return {
      get() {
        return i == null ? void 0 : i.call(this);
      },
      set(s) {
        const a = i == null ? void 0 : i.call(this);
        n.call(this, s), this.requestUpdate(t, a, r);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Mt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(q('elementProperties'))) return;
    const t = Ge(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), (this.elementProperties = new Map(t.elementProperties));
  }
  static finalize() {
    if (this.hasOwnProperty(q('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(q('properties')))) {
      const e = this.properties,
        r = [...We(e), ...Ke(e)];
      for (const i of r) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, i] of e) this.elementProperties.set(r, i);
    }
    this._$Eh = new Map();
    for (const [e, r] of this.elementProperties) {
      const i = this._$Eu(e, r);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const i of r) e.unshift(It(i));
    } else t !== void 0 && e.push(It(t));
    return e;
  }
  static _$Eu(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == 'string' ? r : typeof t == 'string' ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), (this._$Ep = void 0), (this.isUpdatePending = !1), (this.hasUpdated = !1), (this._$Em = null), this._$Ev();
  }
  _$Ev() {
    var t;
    (this._$ES = new Promise((e) => (this.enableUpdating = e))),
      (this._$AL = new Map()),
      this._$E_(),
      this.requestUpdate(),
      (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = new Set())).add(t),
      this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = new Map(),
      e = this.constructor.elementProperties;
    for (const r of e.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Fe(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()),
      this.enableUpdating(!0),
      (t = this._$EO) == null ||
        t.forEach((e) => {
          var r;
          return (r = e.hostConnected) == null ? void 0 : r.call(e);
        });
  }
  enableUpdating(t) {}
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null ||
      t.forEach((e) => {
        var r;
        return (r = e.hostDisconnected) == null ? void 0 : r.call(e);
      });
  }
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$EC(t, e) {
    var n;
    const r = this.constructor.elementProperties.get(t),
      i = this.constructor._$Eu(t, r);
    if (i !== void 0 && r.reflect === !0) {
      const s = (((n = r.converter) == null ? void 0 : n.toAttribute) !== void 0 ? r.converter : z).toAttribute(
        e,
        r.type
      );
      (this._$Em = t), s == null ? this.removeAttribute(i) : this.setAttribute(i, s), (this._$Em = null);
    }
  }
  _$AK(t, e) {
    var n;
    const r = this.constructor,
      i = r._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const s = r.getPropertyOptions(i),
        a =
          typeof s.converter == 'function'
            ? { fromAttribute: s.converter }
            : ((n = s.converter) == null ? void 0 : n.fromAttribute) !== void 0
              ? s.converter
              : z;
      (this._$Em = i), (this[i] = a.fromAttribute(e, s.type)), (this._$Em = null);
    }
  }
  requestUpdate(t, e, r) {
    if (t !== void 0) {
      if ((r ?? (r = this.constructor.getPropertyOptions(t)), !(r.hasChanged ?? $t)(this[t], e))) return;
      this.P(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(t, e, r) {
    this._$AL.has(t) || this._$AL.set(t, e),
      r.reflect === !0 && this._$Em !== t && (this._$Ej ?? (this._$Ej = new Set())).add(t);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && (await t), !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if ((this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep)) {
        for (const [n, s] of this._$Ep) this[n] = s;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0)
        for (const [n, s] of i) s.wrapped !== !0 || this._$AL.has(n) || this[n] === void 0 || this.P(n, this[n], s);
    }
    let t = !1;
    const e = this._$AL;
    try {
      (t = this.shouldUpdate(e)),
        t
          ? (this.willUpdate(e),
            (r = this._$EO) == null ||
              r.forEach((i) => {
                var n;
                return (n = i.hostUpdate) == null ? void 0 : n.call(i);
              }),
            this.update(e))
          : this._$EU();
    } catch (i) {
      throw ((t = !1), this._$EU(), i);
    }
    t && this._$AE(e);
  }
  willUpdate(t) {}
  _$AE(t) {
    var e;
    (e = this._$EO) == null ||
      e.forEach((r) => {
        var i;
        return (i = r.hostUpdated) == null ? void 0 : i.call(r);
      }),
      this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
      this.updated(t);
  }
  _$EU() {
    (this._$AL = new Map()), (this.isUpdatePending = !1);
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((e) => this._$EC(e, this[e]))), this._$EU();
  }
  updated(t) {}
  firstUpdated(t) {}
}
(P.elementStyles = []),
  (P.shadowRootOptions = { mode: 'open' }),
  (P[q('elementProperties')] = new Map()),
  (P[q('finalized')] = new Map()),
  lt == null || lt({ ReactiveElement: P }),
  (x.reactiveElementVersions ?? (x.reactiveElementVersions = [])).push('2.0.4');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const j = globalThis,
  rt = j.trustedTypes,
  Pt = rt ? rt.createPolicy('lit-html', { createHTML: (o) => o }) : void 0,
  Jt = '$lit$',
  C = `lit$${Math.random().toFixed(9).slice(2)}$`,
  Yt = '?' + C,
  Je = `<${Yt}>`,
  T = document,
  K = () => T.createComment(''),
  G = (o) => o === null || (typeof o != 'object' && typeof o != 'function'),
  Ct = Array.isArray,
  Ye = (o) => Ct(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == 'function',
  ct = `[ 	
\f\r]`,
  O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  Rt = /-->/g,
  zt = />/g,
  S = RegExp(
    `>|${ct}(?:([^\\s"'>=/]+)(${ct}*=${ct}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,
    'g'
  ),
  Nt = /'/g,
  Dt = /"/g,
  Xt = /^(?:script|style|textarea|title)$/i,
  Xe =
    (o) =>
    (t, ...e) => ({ _$litType$: o, strings: t, values: e }),
  E = Xe(1),
  _ = Symbol.for('lit-noChange'),
  v = Symbol.for('lit-nothing'),
  Bt = new WeakMap(),
  I = T.createTreeWalker(T, 129);
function Qt(o, t) {
  if (!Ct(o) || !o.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return Pt !== void 0 ? Pt.createHTML(t) : t;
}
const Qe = (o, t) => {
  const e = o.length - 1,
    r = [];
  let i,
    n = t === 2 ? '<svg>' : t === 3 ? '<math>' : '',
    s = O;
  for (let a = 0; a < e; a++) {
    const l = o[a];
    let u,
      p,
      h = -1,
      y = 0;
    for (; y < l.length && ((s.lastIndex = y), (p = s.exec(l)), p !== null); )
      (y = s.lastIndex),
        s === O
          ? p[1] === '!--'
            ? (s = Rt)
            : p[1] !== void 0
              ? (s = zt)
              : p[2] !== void 0
                ? (Xt.test(p[2]) && (i = RegExp('</' + p[2], 'g')), (s = S))
                : p[3] !== void 0 && (s = S)
          : s === S
            ? p[0] === '>'
              ? ((s = i ?? O), (h = -1))
              : p[1] === void 0
                ? (h = -2)
                : ((h = s.lastIndex - p[2].length), (u = p[1]), (s = p[3] === void 0 ? S : p[3] === '"' ? Dt : Nt))
            : s === Dt || s === Nt
              ? (s = S)
              : s === Rt || s === zt
                ? (s = O)
                : ((s = S), (i = void 0));
    const b = s === S && o[a + 1].startsWith('/>') ? ' ' : '';
    n += s === O ? l + Je : h >= 0 ? (r.push(u), l.slice(0, h) + Jt + l.slice(h) + C + b) : l + C + (h === -2 ? a : b);
  }
  return [Qt(o, n + (o[e] || '<?>') + (t === 2 ? '</svg>' : t === 3 ? '</math>' : '')), r];
};
class Z {
  constructor({ strings: t, _$litType$: e }, r) {
    let i;
    this.parts = [];
    let n = 0,
      s = 0;
    const a = t.length - 1,
      l = this.parts,
      [u, p] = Qe(t, e);
    if (((this.el = Z.createElement(u, r)), (I.currentNode = this.el.content), e === 2 || e === 3)) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = I.nextNode()) !== null && l.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes())
          for (const h of i.getAttributeNames())
            if (h.endsWith(Jt)) {
              const y = p[s++],
                b = i.getAttribute(h).split(C),
                w = /([.?@])?(.*)/.exec(y);
              l.push({
                type: 1,
                index: n,
                name: w[2],
                strings: b,
                ctor: w[1] === '.' ? eo : w[1] === '?' ? oo : w[1] === '@' ? ro : it,
              }),
                i.removeAttribute(h);
            } else h.startsWith(C) && (l.push({ type: 6, index: n }), i.removeAttribute(h));
        if (Xt.test(i.tagName)) {
          const h = i.textContent.split(C),
            y = h.length - 1;
          if (y > 0) {
            i.textContent = rt ? rt.emptyScript : '';
            for (let b = 0; b < y; b++) i.append(h[b], K()), I.nextNode(), l.push({ type: 2, index: ++n });
            i.append(h[y], K());
          }
        }
      } else if (i.nodeType === 8)
        if (i.data === Yt) l.push({ type: 2, index: n });
        else {
          let h = -1;
          for (; (h = i.data.indexOf(C, h + 1)) !== -1; ) l.push({ type: 7, index: n }), (h += C.length - 1);
        }
      n++;
    }
  }
  static createElement(t, e) {
    const r = T.createElement('template');
    return (r.innerHTML = t), r;
  }
}
function N(o, t, e = o, r) {
  var s, a;
  if (t === _) return t;
  let i = r !== void 0 ? ((s = e._$Co) == null ? void 0 : s[r]) : e._$Cl;
  const n = G(t) ? void 0 : t._$litDirective$;
  return (
    (i == null ? void 0 : i.constructor) !== n &&
      ((a = i == null ? void 0 : i._$AO) == null || a.call(i, !1),
      n === void 0 ? (i = void 0) : ((i = new n(o)), i._$AT(o, e, r)),
      r !== void 0 ? ((e._$Co ?? (e._$Co = []))[r] = i) : (e._$Cl = i)),
    i !== void 0 && (t = N(o, i._$AS(o, t.values), i, r)),
    t
  );
}
class to {
  constructor(t, e) {
    (this._$AV = []), (this._$AN = void 0), (this._$AD = t), (this._$AM = e);
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const {
        el: { content: e },
        parts: r,
      } = this._$AD,
      i = ((t == null ? void 0 : t.creationScope) ?? T).importNode(e, !0);
    I.currentNode = i;
    let n = I.nextNode(),
      s = 0,
      a = 0,
      l = r[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let u;
        l.type === 2
          ? (u = new J(n, n.nextSibling, this, t))
          : l.type === 1
            ? (u = new l.ctor(n, l.name, l.strings, this, t))
            : l.type === 6 && (u = new io(n, this, t)),
          this._$AV.push(u),
          (l = r[++a]);
      }
      s !== (l == null ? void 0 : l.index) && ((n = I.nextNode()), s++);
    }
    return (I.currentNode = T), i;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV)
      r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), (e += r.strings.length - 2)) : r._$AI(t[e])), e++;
  }
}
class J {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, r, i) {
    (this.type = 2),
      (this._$AH = v),
      (this._$AN = void 0),
      (this._$AA = t),
      (this._$AB = e),
      (this._$AM = r),
      (this.options = i),
      (this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0);
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    (t = N(this, t, e)),
      G(t)
        ? t === v || t == null || t === ''
          ? (this._$AH !== v && this._$AR(), (this._$AH = v))
          : t !== this._$AH && t !== _ && this._(t)
        : t._$litType$ !== void 0
          ? this.$(t)
          : t.nodeType !== void 0
            ? this.T(t)
            : Ye(t)
              ? this.k(t)
              : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), (this._$AH = this.O(t)));
  }
  _(t) {
    this._$AH !== v && G(this._$AH) ? (this._$AA.nextSibling.data = t) : this.T(T.createTextNode(t)), (this._$AH = t);
  }
  $(t) {
    var n;
    const { values: e, _$litType$: r } = t,
      i =
        typeof r == 'number'
          ? this._$AC(t)
          : (r.el === void 0 && (r.el = Z.createElement(Qt(r.h, r.h[0]), this.options)), r);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(e);
    else {
      const s = new to(i, this),
        a = s.u(this.options);
      s.p(e), this.T(a), (this._$AH = s);
    }
  }
  _$AC(t) {
    let e = Bt.get(t.strings);
    return e === void 0 && Bt.set(t.strings, (e = new Z(t))), e;
  }
  k(t) {
    Ct(this._$AH) || ((this._$AH = []), this._$AR());
    const e = this._$AH;
    let r,
      i = 0;
    for (const n of t)
      i === e.length ? e.push((r = new J(this.O(K()), this.O(K()), this, this.options))) : (r = e[i]), r._$AI(n), i++;
    i < e.length && (this._$AR(r && r._$AB.nextSibling, i), (e.length = i));
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const i = t.nextSibling;
      t.remove(), (t = i);
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && ((this._$Cv = t), (e = this._$AP) == null || e.call(this, t));
  }
}
class it {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, i, n) {
    (this.type = 1),
      (this._$AH = v),
      (this._$AN = void 0),
      (this.element = t),
      (this.name = e),
      (this._$AM = i),
      (this.options = n),
      r.length > 2 || r[0] !== '' || r[1] !== ''
        ? ((this._$AH = Array(r.length - 1).fill(new String())), (this.strings = r))
        : (this._$AH = v);
  }
  _$AI(t, e = this, r, i) {
    const n = this.strings;
    let s = !1;
    if (n === void 0) (t = N(this, t, e, 0)), (s = !G(t) || (t !== this._$AH && t !== _)), s && (this._$AH = t);
    else {
      const a = t;
      let l, u;
      for (t = n[0], l = 0; l < n.length - 1; l++)
        (u = N(this, a[r + l], e, l)),
          u === _ && (u = this._$AH[l]),
          s || (s = !G(u) || u !== this._$AH[l]),
          u === v ? (t = v) : t !== v && (t += (u ?? '') + n[l + 1]),
          (this._$AH[l] = u);
    }
    s && !i && this.j(t);
  }
  j(t) {
    t === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? '');
  }
}
class eo extends it {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  j(t) {
    this.element[this.name] = t === v ? void 0 : t;
  }
}
class oo extends it {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== v);
  }
}
class ro extends it {
  constructor(t, e, r, i, n) {
    super(t, e, r, i, n), (this.type = 5);
  }
  _$AI(t, e = this) {
    if ((t = N(this, t, e, 0) ?? v) === _) return;
    const r = this._$AH,
      i = (t === v && r !== v) || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive,
      n = t !== v && (r === v || i);
    i && this.element.removeEventListener(this.name, this, r),
      n && this.element.addEventListener(this.name, this, t),
      (this._$AH = t);
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == 'function'
      ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t)
      : this._$AH.handleEvent(t);
  }
}
class io {
  constructor(t, e, r) {
    (this.element = t), (this.type = 6), (this._$AN = void 0), (this._$AM = e), (this.options = r);
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    N(this, t);
  }
}
const ut = j.litHtmlPolyfillSupport;
ut == null || ut(Z, J), (j.litHtmlVersions ?? (j.litHtmlVersions = [])).push('3.2.1');
const no = (o, t, e) => {
  const r = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = r._$litPart$;
  if (i === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    r._$litPart$ = i = new J(t.insertBefore(K(), n), n, void 0, e ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ let W = class extends P {
  constructor() {
    super(...arguments), (this.renderOptions = { host: this }), (this._$Do = void 0);
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
      super.update(t),
      (this._$Do = no(e, this.renderRoot, this.renderOptions));
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return _;
  }
};
var Wt;
(W._$litElement$ = !0),
  (W.finalized = !0),
  (Wt = globalThis.litElementHydrateSupport) == null || Wt.call(globalThis, { LitElement: W });
const dt = globalThis.litElementPolyfillSupport;
dt == null || dt({ LitElement: W });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push('4.1.1');
var so = D`
  :host {
    display: block;
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) border,
      var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: var(--sl-input-background-color-hover);
    border-color: var(--sl-input-border-color-hover);
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: var(--sl-input-color-focus);
  }

  .input--standard.input--disabled {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input--standard.input--disabled .input__control {
    color: var(--sl-input-color-disabled);
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: var(--sl-input-placeholder-color-disabled);
  }

  /* Filled inputs */
  .input--filled {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .input--filled:hover:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .input--filled.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .input--filled.input--disabled {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: var(--sl-input-color);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-background-color-hover) inset !important;
    -webkit-text-fill-color: var(--sl-color-primary-500);
    caret-color: var(--sl-input-color);
  }

  .input--filled .input__control:-webkit-autofill,
  .input--filled .input__control:-webkit-autofill:hover,
  .input--filled .input__control:-webkit-autofill:focus,
  .input--filled .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-filled-background-color) inset !important;
  }

  .input__control::placeholder {
    color: var(--sl-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: var(--sl-input-color-hover);
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  .input__prefix ::slotted(sl-icon),
  .input__suffix ::slotted(sl-icon) {
    color: var(--sl-input-icon-color);
  }

  /*
   * Size modifiers
   */

  .input--small {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    height: var(--sl-input-height-small);
  }

  .input--small .input__control {
    height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-small);
  }

  .input--small .input__clear,
  .input--small .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-small) * 2);
  }

  .input--small .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-small);
  }

  .input--small .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-small);
  }

  .input--medium {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    height: var(--sl-input-height-medium);
  }

  .input--medium .input__control {
    height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-medium);
  }

  .input--medium .input__clear,
  .input--medium .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-medium) * 2);
  }

  .input--medium .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-medium);
  }

  .input--medium .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-medium);
  }

  .input--large {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    height: var(--sl-input-height-large);
  }

  .input--large .input__control {
    height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-large);
  }

  .input--large .input__clear,
  .input--large .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-large) * 2);
  }

  .input--large .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-large);
  }

  .input--large .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-large);
  }

  /*
   * Pill modifier
   */

  .input--pill.input--small {
    border-radius: var(--sl-input-height-small);
  }

  .input--pill.input--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .input--pill.input--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Clearable + Password Toggle
   */

  .input__clear,
  .input__password-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--sl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--sl-transition-fast) color;
    cursor: pointer;
  }

  .input__clear:hover,
  .input__password-toggle:hover {
    color: var(--sl-input-icon-color-hover);
  }

  .input__clear:focus,
  .input__password-toggle:focus {
    outline: none;
  }

  /* Don't show the browser's password toggle in Edge */
  ::-ms-reveal {
    display: none;
  }

  /* Hide the built-in number spinner */
  .input--no-spin-buttons input[type='number']::-webkit-outer-spin-button,
  .input--no-spin-buttons input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
  }

  .input--no-spin-buttons input[type='number'] {
    -moz-appearance: textfield;
  }
`,
  ao =
    (o = 'value') =>
    (t, e) => {
      const r = t.constructor,
        i = r.prototype.attributeChangedCallback;
      r.prototype.attributeChangedCallback = function (n, s, a) {
        var l;
        const u = r.getPropertyOptions(o),
          p = typeof u.attribute == 'string' ? u.attribute : o;
        if (n === p) {
          const h = u.converter || z,
            b = (typeof h == 'function' ? h : (l = h == null ? void 0 : h.fromAttribute) != null ? l : z.fromAttribute)(
              a,
              u.type
            );
          this[o] !== b && (this[e] = b);
        }
        i.call(this, n, s, a);
      };
    },
  lo = D`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
    color: var(--sl-input-required-content-color);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
    margin-top: var(--sl-spacing-3x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--sl-spacing-2x-small);
  }
`,
  te = Object.defineProperty,
  co = Object.defineProperties,
  uo = Object.getOwnPropertyDescriptor,
  ho = Object.getOwnPropertyDescriptors,
  Ot = Object.getOwnPropertySymbols,
  po = Object.prototype.hasOwnProperty,
  mo = Object.prototype.propertyIsEnumerable,
  ee = (o) => {
    throw TypeError(o);
  },
  Ut = (o, t, e) => (t in o ? te(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (o[t] = e)),
  Y = (o, t) => {
    for (var e in t || (t = {})) po.call(t, e) && Ut(o, e, t[e]);
    if (Ot) for (var e of Ot(t)) mo.call(t, e) && Ut(o, e, t[e]);
    return o;
  },
  oe = (o, t) => co(o, ho(t)),
  c = (o, t, e, r) => {
    for (var i = r > 1 ? void 0 : r ? uo(t, e) : t, n = o.length - 1, s; n >= 0; n--)
      (s = o[n]) && (i = (r ? s(t, e, i) : s(i)) || i);
    return r && i && te(t, e, i), i;
  },
  re = (o, t, e) => t.has(o) || ee('Cannot ' + e),
  go = (o, t, e) => (re(o, t, 'read from private field'), t.get(o)),
  fo = (o, t, e) =>
    t.has(o) ? ee('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(o) : t.set(o, e),
  vo = (o, t, e, r) => (re(o, t, 'write to private field'), t.set(o, e), e),
  U = new WeakMap(),
  V = new WeakMap(),
  F = new WeakMap(),
  ht = new WeakSet(),
  Q = new WeakMap(),
  ie = class {
    constructor(o, t) {
      (this.handleFormData = (e) => {
        const r = this.options.disabled(this.host),
          i = this.options.name(this.host),
          n = this.options.value(this.host),
          s = this.host.tagName.toLowerCase() === 'sl-button';
        this.host.isConnected &&
          !r &&
          !s &&
          typeof i == 'string' &&
          i.length > 0 &&
          typeof n < 'u' &&
          (Array.isArray(n)
            ? n.forEach((a) => {
                e.formData.append(i, a.toString());
              })
            : e.formData.append(i, n.toString()));
      }),
        (this.handleFormSubmit = (e) => {
          var r;
          const i = this.options.disabled(this.host),
            n = this.options.reportValidity;
          this.form &&
            !this.form.noValidate &&
            ((r = U.get(this.form)) == null ||
              r.forEach((s) => {
                this.setUserInteracted(s, !0);
              })),
            this.form &&
              !this.form.noValidate &&
              !i &&
              !n(this.host) &&
              (e.preventDefault(), e.stopImmediatePropagation());
        }),
        (this.handleFormReset = () => {
          this.options.setValue(this.host, this.options.defaultValue(this.host)),
            this.setUserInteracted(this.host, !1),
            Q.set(this.host, []);
        }),
        (this.handleInteraction = (e) => {
          const r = Q.get(this.host);
          r.includes(e.type) || r.push(e.type),
            r.length === this.options.assumeInteractionOn.length && this.setUserInteracted(this.host, !0);
        }),
        (this.checkFormValidity = () => {
          if (this.form && !this.form.noValidate) {
            const e = this.form.querySelectorAll('*');
            for (const r of e) if (typeof r.checkValidity == 'function' && !r.checkValidity()) return !1;
          }
          return !0;
        }),
        (this.reportFormValidity = () => {
          if (this.form && !this.form.noValidate) {
            const e = this.form.querySelectorAll('*');
            for (const r of e) if (typeof r.reportValidity == 'function' && !r.reportValidity()) return !1;
          }
          return !0;
        }),
        (this.host = o).addController(this),
        (this.options = Y(
          {
            form: (e) => {
              const r = e.form;
              if (r) {
                const n = e.getRootNode().querySelector(`#${r}`);
                if (n) return n;
              }
              return e.closest('form');
            },
            name: (e) => e.name,
            value: (e) => e.value,
            defaultValue: (e) => e.defaultValue,
            disabled: (e) => {
              var r;
              return (r = e.disabled) != null ? r : !1;
            },
            reportValidity: (e) => (typeof e.reportValidity == 'function' ? e.reportValidity() : !0),
            checkValidity: (e) => (typeof e.checkValidity == 'function' ? e.checkValidity() : !0),
            setValue: (e, r) => (e.value = r),
            assumeInteractionOn: ['sl-input'],
          },
          t
        ));
    }
    hostConnected() {
      const o = this.options.form(this.host);
      o && this.attachForm(o),
        Q.set(this.host, []),
        this.options.assumeInteractionOn.forEach((t) => {
          this.host.addEventListener(t, this.handleInteraction);
        });
    }
    hostDisconnected() {
      this.detachForm(),
        Q.delete(this.host),
        this.options.assumeInteractionOn.forEach((o) => {
          this.host.removeEventListener(o, this.handleInteraction);
        });
    }
    hostUpdated() {
      const o = this.options.form(this.host);
      o || this.detachForm(),
        o && this.form !== o && (this.detachForm(), this.attachForm(o)),
        this.host.hasUpdated && this.setValidity(this.host.validity.valid);
    }
    attachForm(o) {
      o
        ? ((this.form = o),
          U.has(this.form) ? U.get(this.form).add(this.host) : U.set(this.form, new Set([this.host])),
          this.form.addEventListener('formdata', this.handleFormData),
          this.form.addEventListener('submit', this.handleFormSubmit),
          this.form.addEventListener('reset', this.handleFormReset),
          V.has(this.form) ||
            (V.set(this.form, this.form.reportValidity), (this.form.reportValidity = () => this.reportFormValidity())),
          F.has(this.form) ||
            (F.set(this.form, this.form.checkValidity), (this.form.checkValidity = () => this.checkFormValidity())))
        : (this.form = void 0);
    }
    detachForm() {
      if (!this.form) return;
      const o = U.get(this.form);
      o &&
        (o.delete(this.host),
        o.size <= 0 &&
          (this.form.removeEventListener('formdata', this.handleFormData),
          this.form.removeEventListener('submit', this.handleFormSubmit),
          this.form.removeEventListener('reset', this.handleFormReset),
          V.has(this.form) && ((this.form.reportValidity = V.get(this.form)), V.delete(this.form)),
          F.has(this.form) && ((this.form.checkValidity = F.get(this.form)), F.delete(this.form)),
          (this.form = void 0)));
    }
    setUserInteracted(o, t) {
      t ? ht.add(o) : ht.delete(o), o.requestUpdate();
    }
    doAction(o, t) {
      if (this.form) {
        const e = document.createElement('button');
        (e.type = o),
          (e.style.position = 'absolute'),
          (e.style.width = '0'),
          (e.style.height = '0'),
          (e.style.clipPath = 'inset(50%)'),
          (e.style.overflow = 'hidden'),
          (e.style.whiteSpace = 'nowrap'),
          t &&
            ((e.name = t.name),
            (e.value = t.value),
            ['formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget'].forEach((r) => {
              t.hasAttribute(r) && e.setAttribute(r, t.getAttribute(r));
            })),
          this.form.append(e),
          e.click(),
          e.remove();
      }
    }
    getForm() {
      var o;
      return (o = this.form) != null ? o : null;
    }
    reset(o) {
      this.doAction('reset', o);
    }
    submit(o) {
      this.doAction('submit', o);
    }
    setValidity(o) {
      const t = this.host,
        e = !!ht.has(t),
        r = !!t.required;
      t.toggleAttribute('data-required', r),
        t.toggleAttribute('data-optional', !r),
        t.toggleAttribute('data-invalid', !o),
        t.toggleAttribute('data-valid', o),
        t.toggleAttribute('data-user-invalid', !o && e),
        t.toggleAttribute('data-user-valid', o && e);
    }
    updateValidity() {
      const o = this.host;
      this.setValidity(o.validity.valid);
    }
    emitInvalidEvent(o) {
      const t = new CustomEvent('sl-invalid', { bubbles: !1, composed: !1, cancelable: !0, detail: {} });
      o || t.preventDefault(), this.host.dispatchEvent(t) || o == null || o.preventDefault();
    }
  },
  Et = Object.freeze({
    badInput: !1,
    customError: !1,
    patternMismatch: !1,
    rangeOverflow: !1,
    rangeUnderflow: !1,
    stepMismatch: !1,
    tooLong: !1,
    tooShort: !1,
    typeMismatch: !1,
    valid: !0,
    valueMissing: !1,
  });
Object.freeze(oe(Y({}, Et), { valid: !1, valueMissing: !0 }));
Object.freeze(oe(Y({}, Et), { valid: !1, customError: !0 }));
var ne = class {
  constructor(o, ...t) {
    (this.slotNames = []),
      (this.handleSlotChange = (e) => {
        const r = e.target;
        ((this.slotNames.includes('[default]') && !r.name) || (r.name && this.slotNames.includes(r.name))) &&
          this.host.requestUpdate();
      }),
      (this.host = o).addController(this),
      (this.slotNames = t);
  }
  hasDefaultSlot() {
    return [...this.host.childNodes].some((o) => {
      if (o.nodeType === o.TEXT_NODE && o.textContent.trim() !== '') return !0;
      if (o.nodeType === o.ELEMENT_NODE) {
        const t = o;
        if (t.tagName.toLowerCase() === 'sl-visually-hidden') return !1;
        if (!t.hasAttribute('slot')) return !0;
      }
      return !1;
    });
  }
  hasNamedSlot(o) {
    return this.host.querySelector(`:scope > [slot="${o}"]`) !== null;
  }
  test(o) {
    return o === '[default]' ? this.hasDefaultSlot() : this.hasNamedSlot(o);
  }
  hostConnected() {
    this.host.shadowRoot.addEventListener('slotchange', this.handleSlotChange);
  }
  hostDisconnected() {
    this.host.shadowRoot.removeEventListener('slotchange', this.handleSlotChange);
  }
};
const ft = new Set(),
  R = new Map();
let L,
  xt = 'ltr',
  kt = 'en';
const se = typeof MutationObserver < 'u' && typeof document < 'u' && typeof document.documentElement < 'u';
if (se) {
  const o = new MutationObserver(le);
  (xt = document.documentElement.dir || 'ltr'),
    (kt = document.documentElement.lang || navigator.language),
    o.observe(document.documentElement, { attributes: !0, attributeFilter: ['dir', 'lang'] });
}
function ae(...o) {
  o.map((t) => {
    const e = t.$code.toLowerCase();
    R.has(e) ? R.set(e, Object.assign(Object.assign({}, R.get(e)), t)) : R.set(e, t), L || (L = t);
  }),
    le();
}
function le() {
  se && ((xt = document.documentElement.dir || 'ltr'), (kt = document.documentElement.lang || navigator.language)),
    [...ft.keys()].map((o) => {
      typeof o.requestUpdate == 'function' && o.requestUpdate();
    });
}
let bo = class {
  constructor(t) {
    (this.host = t), this.host.addController(this);
  }
  hostConnected() {
    ft.add(this.host);
  }
  hostDisconnected() {
    ft.delete(this.host);
  }
  dir() {
    return `${this.host.dir || xt}`.toLowerCase();
  }
  lang() {
    return `${this.host.lang || kt}`.toLowerCase();
  }
  getTranslationData(t) {
    var e, r;
    const i = new Intl.Locale(t.replace(/_/g, '-')),
      n = i == null ? void 0 : i.language.toLowerCase(),
      s =
        (r = (e = i == null ? void 0 : i.region) === null || e === void 0 ? void 0 : e.toLowerCase()) !== null &&
        r !== void 0
          ? r
          : '',
      a = R.get(`${n}-${s}`),
      l = R.get(n);
    return { locale: i, language: n, region: s, primary: a, secondary: l };
  }
  exists(t, e) {
    var r;
    const { primary: i, secondary: n } = this.getTranslationData(
      (r = e.lang) !== null && r !== void 0 ? r : this.lang()
    );
    return (
      (e = Object.assign({ includeFallback: !1 }, e)),
      !!((i && i[t]) || (n && n[t]) || (e.includeFallback && L && L[t]))
    );
  }
  term(t, ...e) {
    const { primary: r, secondary: i } = this.getTranslationData(this.lang());
    let n;
    if (r && r[t]) n = r[t];
    else if (i && i[t]) n = i[t];
    else if (L && L[t]) n = L[t];
    else return console.error(`No translation found for: ${String(t)}`), String(t);
    return typeof n == 'function' ? n(...e) : n;
  }
  date(t, e) {
    return (t = new Date(t)), new Intl.DateTimeFormat(this.lang(), e).format(t);
  }
  number(t, e) {
    return (t = Number(t)), isNaN(t) ? '' : new Intl.NumberFormat(this.lang(), e).format(t);
  }
  relativeTime(t, e, r) {
    return new Intl.RelativeTimeFormat(this.lang(), r).format(t, e);
  }
};
var ce = {
  $code: 'en',
  $name: 'English',
  $dir: 'ltr',
  carousel: 'Carousel',
  clearEntry: 'Clear entry',
  close: 'Close',
  copied: 'Copied',
  copy: 'Copy',
  currentValue: 'Current value',
  error: 'Error',
  goToSlide: (o, t) => `Go to slide ${o} of ${t}`,
  hidePassword: 'Hide password',
  loading: 'Loading',
  nextSlide: 'Next slide',
  numOptionsSelected: (o) =>
    o === 0 ? 'No options selected' : o === 1 ? '1 option selected' : `${o} options selected`,
  previousSlide: 'Previous slide',
  progress: 'Progress',
  remove: 'Remove',
  resize: 'Resize',
  scrollToEnd: 'Scroll to end',
  scrollToStart: 'Scroll to start',
  selectAColorFromTheScreen: 'Select a color from the screen',
  showPassword: 'Show password',
  slideNum: (o) => `Slide ${o}`,
  toggleColorFormat: 'Toggle color format',
};
ae(ce);
var yo = ce,
  St = class extends bo {};
ae(yo);
var vt = '';
function Vt(o) {
  vt = o;
}
function wo(o = '') {
  if (!vt) {
    const t = [...document.getElementsByTagName('script')],
      e = t.find((r) => r.hasAttribute('data-shoelace'));
    if (e) Vt(e.getAttribute('data-shoelace'));
    else {
      const r = t.find(
        (n) => /shoelace(\.min)?\.js($|\?)/.test(n.src) || /shoelace-autoloader(\.min)?\.js($|\?)/.test(n.src)
      );
      let i = '';
      r && (i = r.getAttribute('src')), Vt(i.split('/').slice(0, -1).join('/'));
    }
  }
  return vt.replace(/\/$/, '') + (o ? `/${o.replace(/^\//, '')}` : '');
}
var _o = { name: 'default', resolver: (o) => wo(`assets/icons/${o}.svg`) },
  $o = _o,
  Ft = {
    caret: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,
    check: `
    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor">
          <g transform="translate(3.428571, 3.428571)">
            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,
    'chevron-down': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,
    'chevron-left': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  `,
    'chevron-right': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,
    copy: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
    </svg>
  `,
    eye: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  `,
    'eye-slash': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  `,
    eyedropper: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
    </svg>
  `,
    'grip-vertical': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
  `,
    indeterminate: `
    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor" stroke-width="2">
          <g transform="translate(2.285714, 6.857143)">
            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,
    'person-fill': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `,
    'play-fill': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
    </svg>
  `,
    'pause-fill': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
    </svg>
  `,
    radio: `
    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="currentColor">
          <circle cx="8" cy="8" r="3.42857143"></circle>
        </g>
      </g>
    </svg>
  `,
    'star-fill': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  `,
    'x-lg': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  `,
    'x-circle-fill': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
    </svg>
  `,
  },
  Co = { name: 'system', resolver: (o) => (o in Ft ? `data:image/svg+xml,${encodeURIComponent(Ft[o])}` : '') },
  Eo = Co,
  xo = [$o, Eo],
  bt = [];
function ko(o) {
  bt.push(o);
}
function So(o) {
  bt = bt.filter((t) => t !== o);
}
function Ht(o) {
  return xo.find((t) => t.name === o);
}
var Ao = D`
  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`;
function B(o, t) {
  const e = Y({ waitUntilFirstUpdate: !1 }, t);
  return (r, i) => {
    const { update: n } = r,
      s = Array.isArray(o) ? o : [o];
    r.update = function (a) {
      s.forEach((l) => {
        const u = l;
        if (a.has(u)) {
          const p = a.get(u),
            h = this[u];
          p !== h && (!e.waitUntilFirstUpdate || this.hasUpdated) && this[i](p, h);
        }
      }),
        n.call(this, a);
    };
  };
}
var nt = D`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Lo = { attribute: !0, type: String, converter: z, reflect: !1, hasChanged: $t },
  Io = (o = Lo, t, e) => {
    const { kind: r, metadata: i } = e;
    let n = globalThis.litPropertyMetadata.get(i);
    if ((n === void 0 && globalThis.litPropertyMetadata.set(i, (n = new Map())), n.set(e.name, o), r === 'accessor')) {
      const { name: s } = e;
      return {
        set(a) {
          const l = t.get.call(this);
          t.set.call(this, a), this.requestUpdate(s, l, o);
        },
        init(a) {
          return a !== void 0 && this.P(s, void 0, o), a;
        },
      };
    }
    if (r === 'setter') {
      const { name: s } = e;
      return function (a) {
        const l = this[s];
        t.call(this, a), this.requestUpdate(s, l, o);
      };
    }
    throw Error('Unsupported decorator location: ' + r);
  };
function d(o) {
  return (t, e) =>
    typeof e == 'object'
      ? Io(o, t, e)
      : ((r, i, n) => {
          const s = i.hasOwnProperty(n);
          return (
            i.constructor.createProperty(n, s ? { ...r, wrapped: !0 } : r),
            s ? Object.getOwnPropertyDescriptor(i, n) : void 0
          );
        })(o, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function st(o) {
  return d({ ...o, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const To = (o, t, e) => (
  (e.configurable = !0),
  (e.enumerable = !0),
  Reflect.decorate && typeof t != 'object' && Object.defineProperty(o, t, e),
  e
);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function ue(o, t) {
  return (e, r, i) => {
    const n = (s) => {
      var a;
      return ((a = s.renderRoot) == null ? void 0 : a.querySelector(o)) ?? null;
    };
    return To(e, r, {
      get() {
        return n(this);
      },
    });
  };
}
var ot,
  k = class extends W {
    constructor() {
      super(),
        fo(this, ot, !1),
        (this.initialReflectedProperties = new Map()),
        Object.entries(this.constructor.dependencies).forEach(([o, t]) => {
          this.constructor.define(o, t);
        });
    }
    emit(o, t) {
      const e = new CustomEvent(o, Y({ bubbles: !0, cancelable: !1, composed: !0, detail: {} }, t));
      return this.dispatchEvent(e), e;
    }
    static define(o, t = this, e = {}) {
      const r = customElements.get(o);
      if (!r) {
        try {
          customElements.define(o, t, e);
        } catch {
          customElements.define(o, class extends t {}, e);
        }
        return;
      }
      let i = ' (unknown version)',
        n = i;
      'version' in t && t.version && (i = ' v' + t.version),
        'version' in r && r.version && (n = ' v' + r.version),
        !(i && n && i === n) &&
          console.warn(`Attempted to register <${o}>${i}, but <${o}>${n} has already been registered.`);
    }
    attributeChangedCallback(o, t, e) {
      go(this, ot) ||
        (this.constructor.elementProperties.forEach((r, i) => {
          r.reflect && this[i] != null && this.initialReflectedProperties.set(i, this[i]);
        }),
        vo(this, ot, !0)),
        super.attributeChangedCallback(o, t, e);
    }
    willUpdate(o) {
      super.willUpdate(o),
        this.initialReflectedProperties.forEach((t, e) => {
          o.has(e) && this[e] == null && (this[e] = t);
        });
    }
  };
ot = new WeakMap();
k.version = '2.20.0';
k.dependencies = {};
c([d()], k.prototype, 'dir', 2);
c([d()], k.prototype, 'lang', 2);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Mo = (o, t) => (o == null ? void 0 : o._$litType$) !== void 0,
  Po = (o) => o.strings === void 0,
  Ro = {},
  zo = (o, t = Ro) => (o._$AH = t);
var H = Symbol(),
  tt = Symbol(),
  pt,
  mt = new Map(),
  $ = class extends k {
    constructor() {
      super(...arguments), (this.initialRender = !1), (this.svg = null), (this.label = ''), (this.library = 'default');
    }
    async resolveIcon(o, t) {
      var e;
      let r;
      if (t != null && t.spriteSheet)
        return (
          (this.svg = E`<svg part="svg">
        <use part="use" href="${o}"></use>
      </svg>`),
          this.svg
        );
      try {
        if (((r = await fetch(o, { mode: 'cors' })), !r.ok)) return r.status === 410 ? H : tt;
      } catch {
        return tt;
      }
      try {
        const i = document.createElement('div');
        i.innerHTML = await r.text();
        const n = i.firstElementChild;
        if (((e = n == null ? void 0 : n.tagName) == null ? void 0 : e.toLowerCase()) !== 'svg') return H;
        pt || (pt = new DOMParser());
        const a = pt.parseFromString(n.outerHTML, 'text/html').body.querySelector('svg');
        return a ? (a.part.add('svg'), document.adoptNode(a)) : H;
      } catch {
        return H;
      }
    }
    connectedCallback() {
      super.connectedCallback(), ko(this);
    }
    firstUpdated() {
      (this.initialRender = !0), this.setIcon();
    }
    disconnectedCallback() {
      super.disconnectedCallback(), So(this);
    }
    getIconSource() {
      const o = Ht(this.library);
      return this.name && o ? { url: o.resolver(this.name), fromLibrary: !0 } : { url: this.src, fromLibrary: !1 };
    }
    handleLabelChange() {
      typeof this.label == 'string' && this.label.length > 0
        ? (this.setAttribute('role', 'img'),
          this.setAttribute('aria-label', this.label),
          this.removeAttribute('aria-hidden'))
        : (this.removeAttribute('role'), this.removeAttribute('aria-label'), this.setAttribute('aria-hidden', 'true'));
    }
    async setIcon() {
      var o;
      const { url: t, fromLibrary: e } = this.getIconSource(),
        r = e ? Ht(this.library) : void 0;
      if (!t) {
        this.svg = null;
        return;
      }
      let i = mt.get(t);
      if ((i || ((i = this.resolveIcon(t, r)), mt.set(t, i)), !this.initialRender)) return;
      const n = await i;
      if ((n === tt && mt.delete(t), t === this.getIconSource().url)) {
        if (Mo(n)) {
          if (((this.svg = n), r)) {
            await this.updateComplete;
            const s = this.shadowRoot.querySelector("[part='svg']");
            typeof r.mutator == 'function' && s && r.mutator(s);
          }
          return;
        }
        switch (n) {
          case tt:
          case H:
            (this.svg = null), this.emit('sl-error');
            break;
          default:
            (this.svg = n.cloneNode(!0)),
              (o = r == null ? void 0 : r.mutator) == null || o.call(r, this.svg),
              this.emit('sl-load');
        }
      }
    }
    render() {
      return this.svg;
    }
  };
$.styles = [nt, Ao];
c([st()], $.prototype, 'svg', 2);
c([d({ reflect: !0 })], $.prototype, 'name', 2);
c([d()], $.prototype, 'src', 2);
c([d()], $.prototype, 'label', 2);
c([d({ reflect: !0 })], $.prototype, 'library', 2);
c([B('label')], $.prototype, 'handleLabelChange', 1);
c([B(['name', 'src', 'library'])], $.prototype, 'setIcon', 1);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const A = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 },
  de =
    (o) =>
    (...t) => ({ _$litDirective$: o, values: t });
let he = class {
  constructor(t) {}
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, r) {
    (this._$Ct = t), (this._$AM = e), (this._$Ci = r);
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const yt = de(
  class extends he {
    constructor(o) {
      var t;
      if ((super(o), o.type !== A.ATTRIBUTE || o.name !== 'class' || ((t = o.strings) == null ? void 0 : t.length) > 2))
        throw Error(
          '`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.'
        );
    }
    render(o) {
      return (
        ' ' +
        Object.keys(o)
          .filter((t) => o[t])
          .join(' ') +
        ' '
      );
    }
    update(o, [t]) {
      var r, i;
      if (this.st === void 0) {
        (this.st = new Set()),
          o.strings !== void 0 &&
            (this.nt = new Set(
              o.strings
                .join(' ')
                .split(/\s/)
                .filter((n) => n !== '')
            ));
        for (const n in t) t[n] && !((r = this.nt) != null && r.has(n)) && this.st.add(n);
        return this.render(t);
      }
      const e = o.element.classList;
      for (const n of this.st) n in t || (e.remove(n), this.st.delete(n));
      for (const n in t) {
        const s = !!t[n];
        s === this.st.has(n) ||
          ((i = this.nt) != null && i.has(n)) ||
          (s ? (e.add(n), this.st.add(n)) : (e.remove(n), this.st.delete(n)));
      }
      return _;
    }
  }
);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const f = (o) => o ?? v;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const No = de(
  class extends he {
    constructor(o) {
      if ((super(o), o.type !== A.PROPERTY && o.type !== A.ATTRIBUTE && o.type !== A.BOOLEAN_ATTRIBUTE))
        throw Error('The `live` directive is not allowed on child or event bindings');
      if (!Po(o)) throw Error('`live` bindings can only contain a single expression');
    }
    render(o) {
      return o;
    }
    update(o, [t]) {
      if (t === _ || t === v) return t;
      const e = o.element,
        r = o.name;
      if (o.type === A.PROPERTY) {
        if (t === e[r]) return _;
      } else if (o.type === A.BOOLEAN_ATTRIBUTE) {
        if (!!t === e.hasAttribute(r)) return _;
      } else if (o.type === A.ATTRIBUTE && e.getAttribute(r) === t + '') return _;
      return zo(o), t;
    }
  }
);
var m = class extends k {
  constructor() {
    super(...arguments),
      (this.formControlController = new ie(this, { assumeInteractionOn: ['sl-blur', 'sl-input'] })),
      (this.hasSlotController = new ne(this, 'help-text', 'label')),
      (this.localize = new St(this)),
      (this.hasFocus = !1),
      (this.title = ''),
      (this.__numberInput = Object.assign(document.createElement('input'), { type: 'number' })),
      (this.__dateInput = Object.assign(document.createElement('input'), { type: 'date' })),
      (this.type = 'text'),
      (this.name = ''),
      (this.value = ''),
      (this.defaultValue = ''),
      (this.size = 'medium'),
      (this.filled = !1),
      (this.pill = !1),
      (this.label = ''),
      (this.helpText = ''),
      (this.clearable = !1),
      (this.disabled = !1),
      (this.placeholder = ''),
      (this.readonly = !1),
      (this.passwordToggle = !1),
      (this.passwordVisible = !1),
      (this.noSpinButtons = !1),
      (this.form = ''),
      (this.required = !1),
      (this.spellcheck = !0);
  }
  get valueAsDate() {
    var o;
    return (
      (this.__dateInput.type = this.type),
      (this.__dateInput.value = this.value),
      ((o = this.input) == null ? void 0 : o.valueAsDate) || this.__dateInput.valueAsDate
    );
  }
  set valueAsDate(o) {
    (this.__dateInput.type = this.type), (this.__dateInput.valueAsDate = o), (this.value = this.__dateInput.value);
  }
  get valueAsNumber() {
    var o;
    return (
      (this.__numberInput.value = this.value),
      ((o = this.input) == null ? void 0 : o.valueAsNumber) || this.__numberInput.valueAsNumber
    );
  }
  set valueAsNumber(o) {
    (this.__numberInput.valueAsNumber = o), (this.value = this.__numberInput.value);
  }
  get validity() {
    return this.input.validity;
  }
  get validationMessage() {
    return this.input.validationMessage;
  }
  firstUpdated() {
    this.formControlController.updateValidity();
  }
  handleBlur() {
    (this.hasFocus = !1), this.emit('sl-blur');
  }
  handleChange() {
    (this.value = this.input.value), this.emit('sl-change');
  }
  handleClearClick(o) {
    o.preventDefault(),
      this.value !== '' && ((this.value = ''), this.emit('sl-clear'), this.emit('sl-input'), this.emit('sl-change')),
      this.input.focus();
  }
  handleFocus() {
    (this.hasFocus = !0), this.emit('sl-focus');
  }
  handleInput() {
    (this.value = this.input.value), this.formControlController.updateValidity(), this.emit('sl-input');
  }
  handleInvalid(o) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(o);
  }
  handleKeyDown(o) {
    const t = o.metaKey || o.ctrlKey || o.shiftKey || o.altKey;
    o.key === 'Enter' &&
      !t &&
      setTimeout(() => {
        !o.defaultPrevented && !o.isComposing && this.formControlController.submit();
      });
  }
  handlePasswordToggle() {
    this.passwordVisible = !this.passwordVisible;
  }
  handleDisabledChange() {
    this.formControlController.setValidity(this.disabled);
  }
  handleStepChange() {
    (this.input.step = String(this.step)), this.formControlController.updateValidity();
  }
  async handleValueChange() {
    await this.updateComplete, this.formControlController.updateValidity();
  }
  focus(o) {
    this.input.focus(o);
  }
  blur() {
    this.input.blur();
  }
  select() {
    this.input.select();
  }
  setSelectionRange(o, t, e = 'none') {
    this.input.setSelectionRange(o, t, e);
  }
  setRangeText(o, t, e, r = 'preserve') {
    const i = t ?? this.input.selectionStart,
      n = e ?? this.input.selectionEnd;
    this.input.setRangeText(o, i, n, r), this.value !== this.input.value && (this.value = this.input.value);
  }
  showPicker() {
    'showPicker' in HTMLInputElement.prototype && this.input.showPicker();
  }
  stepUp() {
    this.input.stepUp(), this.value !== this.input.value && (this.value = this.input.value);
  }
  stepDown() {
    this.input.stepDown(), this.value !== this.input.value && (this.value = this.input.value);
  }
  checkValidity() {
    return this.input.checkValidity();
  }
  getForm() {
    return this.formControlController.getForm();
  }
  reportValidity() {
    return this.input.reportValidity();
  }
  setCustomValidity(o) {
    this.input.setCustomValidity(o), this.formControlController.updateValidity();
  }
  render() {
    const o = this.hasSlotController.test('label'),
      t = this.hasSlotController.test('help-text'),
      e = this.label ? !0 : !!o,
      r = this.helpText ? !0 : !!t,
      n =
        this.clearable && !this.disabled && !this.readonly && (typeof this.value == 'number' || this.value.length > 0);
    return E`
      <div
        part="form-control"
        class=${yt({ 'form-control': !0, 'form-control--small': this.size === 'small', 'form-control--medium': this.size === 'medium', 'form-control--large': this.size === 'large', 'form-control--has-label': e, 'form-control--has-help-text': r })}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${e ? 'false' : 'true'}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${yt({ input: !0, 'input--small': this.size === 'small', 'input--medium': this.size === 'medium', 'input--large': this.size === 'large', 'input--pill': this.pill, 'input--standard': !this.filled, 'input--filled': this.filled, 'input--disabled': this.disabled, 'input--focused': this.hasFocus, 'input--empty': !this.value, 'input--no-spin-buttons': this.noSpinButtons })}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>

            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type === 'password' && this.passwordVisible ? 'text' : this.type}
              title=${this.title}
              name=${f(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${f(this.placeholder)}
              minlength=${f(this.minlength)}
              maxlength=${f(this.maxlength)}
              min=${f(this.min)}
              max=${f(this.max)}
              step=${f(this.step)}
              .value=${No(this.value)}
              autocapitalize=${f(this.autocapitalize)}
              autocomplete=${f(this.autocomplete)}
              autocorrect=${f(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${f(this.pattern)}
              enterkeyhint=${f(this.enterkeyhint)}
              inputmode=${f(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${
              n
                ? E`
                  <button
                    part="clear-button"
                    class="input__clear"
                    type="button"
                    aria-label=${this.localize.term('clearEntry')}
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      <sl-icon name="x-circle-fill" library="system"></sl-icon>
                    </slot>
                  </button>
                `
                : ''
            }
            ${
              this.passwordToggle && !this.disabled
                ? E`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.passwordVisible ? 'hidePassword' : 'showPassword')}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${
                      this.passwordVisible
                        ? E`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `
                        : E`
                          <slot name="hide-password-icon">
                            <sl-icon name="eye" library="system"></sl-icon>
                          </slot>
                        `
                    }
                  </button>
                `
                : ''
            }

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${r ? 'false' : 'true'}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
m.styles = [nt, lo, so];
m.dependencies = { 'sl-icon': $ };
c([ue('.input__control')], m.prototype, 'input', 2);
c([st()], m.prototype, 'hasFocus', 2);
c([d()], m.prototype, 'title', 2);
c([d({ reflect: !0 })], m.prototype, 'type', 2);
c([d()], m.prototype, 'name', 2);
c([d()], m.prototype, 'value', 2);
c([ao()], m.prototype, 'defaultValue', 2);
c([d({ reflect: !0 })], m.prototype, 'size', 2);
c([d({ type: Boolean, reflect: !0 })], m.prototype, 'filled', 2);
c([d({ type: Boolean, reflect: !0 })], m.prototype, 'pill', 2);
c([d()], m.prototype, 'label', 2);
c([d({ attribute: 'help-text' })], m.prototype, 'helpText', 2);
c([d({ type: Boolean })], m.prototype, 'clearable', 2);
c([d({ type: Boolean, reflect: !0 })], m.prototype, 'disabled', 2);
c([d()], m.prototype, 'placeholder', 2);
c([d({ type: Boolean, reflect: !0 })], m.prototype, 'readonly', 2);
c([d({ attribute: 'password-toggle', type: Boolean })], m.prototype, 'passwordToggle', 2);
c([d({ attribute: 'password-visible', type: Boolean })], m.prototype, 'passwordVisible', 2);
c([d({ attribute: 'no-spin-buttons', type: Boolean })], m.prototype, 'noSpinButtons', 2);
c([d({ reflect: !0 })], m.prototype, 'form', 2);
c([d({ type: Boolean, reflect: !0 })], m.prototype, 'required', 2);
c([d()], m.prototype, 'pattern', 2);
c([d({ type: Number })], m.prototype, 'minlength', 2);
c([d({ type: Number })], m.prototype, 'maxlength', 2);
c([d()], m.prototype, 'min', 2);
c([d()], m.prototype, 'max', 2);
c([d()], m.prototype, 'step', 2);
c([d()], m.prototype, 'autocapitalize', 2);
c([d()], m.prototype, 'autocorrect', 2);
c([d()], m.prototype, 'autocomplete', 2);
c([d({ type: Boolean })], m.prototype, 'autofocus', 2);
c([d()], m.prototype, 'enterkeyhint', 2);
c(
  [
    d({
      type: Boolean,
      converter: { fromAttribute: (o) => !(!o || o === 'false'), toAttribute: (o) => (o ? 'true' : 'false') },
    }),
  ],
  m.prototype,
  'spellcheck',
  2
);
c([d()], m.prototype, 'inputmode', 2);
c([B('disabled', { waitUntilFirstUpdate: !0 })], m.prototype, 'handleDisabledChange', 1);
c([B('step', { waitUntilFirstUpdate: !0 })], m.prototype, 'handleStepChange', 1);
c([B('value', { waitUntilFirstUpdate: !0 })], m.prototype, 'handleValueChange', 1);
m.define('sl-input');
var Do = D`
  :host {
    --track-width: 2px;
    --track-color: rgb(128 128 128 / 25%);
    --indicator-color: var(--sl-color-primary-600);
    --speed: 2s;

    display: inline-flex;
    width: 1em;
    height: 1em;
    flex: none;
  }

  .spinner {
    flex: 1 1 auto;
    height: 100%;
    width: 100%;
  }

  .spinner__track,
  .spinner__indicator {
    fill: none;
    stroke-width: var(--track-width);
    r: calc(0.5em - var(--track-width) / 2);
    cx: 0.5em;
    cy: 0.5em;
    transform-origin: 50% 50%;
  }

  .spinner__track {
    stroke: var(--track-color);
    transform-origin: 0% 0%;
  }

  .spinner__indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: 150% 75%;
    animation: spin var(--speed) linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      stroke-dasharray: 0.05em, 3em;
    }

    50% {
      transform: rotate(450deg);
      stroke-dasharray: 1.375em, 1.375em;
    }

    100% {
      transform: rotate(1080deg);
      stroke-dasharray: 0.05em, 3em;
    }
  }
`,
  pe = class extends k {
    constructor() {
      super(...arguments), (this.localize = new St(this));
    }
    render() {
      return E`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term('loading')}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `;
    }
  };
pe.styles = [nt, Do];
var Bo = D`
  :host {
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
  }

  .button {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    border-style: solid;
    border-width: var(--sl-input-border-width);
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-font-weight-semibold);
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0;
    transition:
      var(--sl-transition-x-fast) background-color,
      var(--sl-transition-x-fast) color,
      var(--sl-transition-x-fast) border,
      var(--sl-transition-x-fast) box-shadow;
    cursor: inherit;
  }

  .button::-moz-focus-inner {
    border: 0;
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* When disabled, prevent mouse events from bubbling up from children */
  .button--disabled * {
    pointer-events: none;
  }

  .button__prefix,
  .button__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .button__label {
    display: inline-block;
  }

  .button__label::slotted(sl-icon) {
    vertical-align: -2px;
  }

  /*
   * Standard buttons
   */

  /* Default */
  .button--standard.button--default {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-input-border-color);
    color: var(--sl-color-neutral-700);
  }

  .button--standard.button--default:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-300);
    color: var(--sl-color-primary-700);
  }

  .button--standard.button--default:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-100);
    border-color: var(--sl-color-primary-400);
    color: var(--sl-color-primary-700);
  }

  /* Primary */
  .button--standard.button--primary {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--standard.button--success {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:hover:not(.button--disabled) {
    background-color: var(--sl-color-success-500);
    border-color: var(--sl-color-success-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:active:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--standard.button--neutral {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:hover:not(.button--disabled) {
    background-color: var(--sl-color-neutral-500);
    border-color: var(--sl-color-neutral-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:active:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--standard.button--warning {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }
  .button--standard.button--warning:hover:not(.button--disabled) {
    background-color: var(--sl-color-warning-500);
    border-color: var(--sl-color-warning-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--warning:active:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--standard.button--danger {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:hover:not(.button--disabled) {
    background-color: var(--sl-color-danger-500);
    border-color: var(--sl-color-danger-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:active:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /*
   * Outline buttons
   */

  .button--outline {
    background: none;
    border: solid 1px;
  }

  /* Default */
  .button--outline.button--default {
    border-color: var(--sl-input-border-color);
    color: var(--sl-color-neutral-700);
  }

  .button--outline.button--default:hover:not(.button--disabled),
  .button--outline.button--default.button--checked:not(.button--disabled) {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--default:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Primary */
  .button--outline.button--primary {
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-primary-600);
  }

  .button--outline.button--primary:hover:not(.button--disabled),
  .button--outline.button--primary.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--primary:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--outline.button--success {
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-success-600);
  }

  .button--outline.button--success:hover:not(.button--disabled),
  .button--outline.button--success.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--success:active:not(.button--disabled) {
    border-color: var(--sl-color-success-700);
    background-color: var(--sl-color-success-700);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--outline.button--neutral {
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-600);
  }

  .button--outline.button--neutral:hover:not(.button--disabled),
  .button--outline.button--neutral.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--neutral:active:not(.button--disabled) {
    border-color: var(--sl-color-neutral-700);
    background-color: var(--sl-color-neutral-700);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--outline.button--warning {
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-warning-600);
  }

  .button--outline.button--warning:hover:not(.button--disabled),
  .button--outline.button--warning.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--warning:active:not(.button--disabled) {
    border-color: var(--sl-color-warning-700);
    background-color: var(--sl-color-warning-700);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--outline.button--danger {
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-danger-600);
  }

  .button--outline.button--danger:hover:not(.button--disabled),
  .button--outline.button--danger.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--danger:active:not(.button--disabled) {
    border-color: var(--sl-color-danger-700);
    background-color: var(--sl-color-danger-700);
    color: var(--sl-color-neutral-0);
  }

  @media (forced-colors: active) {
    .button.button--outline.button--checked:not(.button--disabled) {
      outline: solid 2px transparent;
    }
  }

  /*
   * Text buttons
   */

  .button--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-600);
  }

  .button--text:hover:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:focus-visible:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:active:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-700);
  }

  /*
   * Size modifiers
   */

  .button--small {
    height: auto;
    min-height: var(--sl-input-height-small);
    font-size: var(--sl-button-font-size-small);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
  }

  .button--medium {
    height: auto;
    min-height: var(--sl-input-height-medium);
    font-size: var(--sl-button-font-size-medium);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
  }

  .button--large {
    height: auto;
    min-height: var(--sl-input-height-large);
    font-size: var(--sl-button-font-size-large);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
  }

  /*
   * Pill modifier
   */

  .button--pill.button--small {
    border-radius: var(--sl-input-height-small);
  }

  .button--pill.button--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .button--pill.button--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Circle modifier
   */

  .button--circle {
    padding-left: 0;
    padding-right: 0;
  }

  .button--circle.button--small {
    width: var(--sl-input-height-small);
    border-radius: 50%;
  }

  .button--circle.button--medium {
    width: var(--sl-input-height-medium);
    border-radius: 50%;
  }

  .button--circle.button--large {
    width: var(--sl-input-height-large);
    border-radius: 50%;
  }

  .button--circle .button__prefix,
  .button--circle .button__suffix,
  .button--circle .button__caret {
    display: none;
  }

  /*
   * Caret modifier
   */

  .button--caret .button__suffix {
    display: none;
  }

  .button--caret .button__caret {
    height: auto;
  }

  /*
   * Loading modifier
   */

  .button--loading {
    position: relative;
    cursor: wait;
  }

  .button--loading .button__prefix,
  .button--loading .button__label,
  .button--loading .button__suffix,
  .button--loading .button__caret {
    visibility: hidden;
  }

  .button--loading sl-spinner {
    --indicator-color: currentColor;
    position: absolute;
    font-size: 1em;
    height: 1em;
    width: 1em;
    top: calc(50% - 0.5em);
    left: calc(50% - 0.5em);
  }

  /*
   * Badges
   */

  .button ::slotted(sl-badge) {
    position: absolute;
    top: 0;
    right: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  .button--rtl ::slotted(sl-badge) {
    right: auto;
    left: 0;
    translate: -50% -50%;
  }

  /*
   * Button spacing
   */

  .button--has-label.button--small .button__label {
    padding: 0 var(--sl-spacing-small);
  }

  .button--has-label.button--medium .button__label {
    padding: 0 var(--sl-spacing-medium);
  }

  .button--has-label.button--large .button__label {
    padding: 0 var(--sl-spacing-large);
  }

  .button--has-prefix.button--small {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--small .button__label {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--medium {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--medium .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-suffix.button--small,
  .button--caret.button--small {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--small .button__label,
  .button--caret.button--small .button__label {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--medium,
  .button--caret.button--medium {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--medium .button__label,
  .button--caret.button--medium .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large,
  .button--caret.button--large {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large .button__label,
  .button--caret.button--large .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */

  :host([data-sl-button-group__button--first]:not([data-sl-button-group__button--last])) .button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-sl-button-group__button--inner]) .button {
    border-radius: 0;
  }

  :host([data-sl-button-group__button--last]:not([data-sl-button-group__button--first])) .button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host([data-sl-button-group__button]:not([data-sl-button-group__button--first])) {
    margin-inline-start: calc(-1 * var(--sl-input-border-width));
  }

  /* Add a visual separator between solid buttons */
  :host(
      [data-sl-button-group__button]:not(
          [data-sl-button-group__button--first],
          [data-sl-button-group__button--radio],
          [variant='default']
        ):not(:hover)
    )
    .button:after {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    border-left: solid 1px rgb(128 128 128 / 33%);
    mix-blend-mode: multiply;
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host([data-sl-button-group__button--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-sl-button-group__button--focus]),
  :host([data-sl-button-group__button][checked]) {
    z-index: 2;
  }
`;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const me = Symbol.for(''),
  Oo = (o) => {
    if ((o == null ? void 0 : o.r) === me) return o == null ? void 0 : o._$litStatic$;
  },
  qt = (o, ...t) => ({
    _$litStatic$: t.reduce(
      (e, r, i) =>
        e +
        ((n) => {
          if (n._$litStatic$ !== void 0) return n._$litStatic$;
          throw Error(`Value passed to 'literal' function must be a 'literal' result: ${n}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
        })(r) +
        o[i + 1],
      o[0]
    ),
    r: me,
  }),
  jt = new Map(),
  Uo =
    (o) =>
    (t, ...e) => {
      const r = e.length;
      let i, n;
      const s = [],
        a = [];
      let l,
        u = 0,
        p = !1;
      for (; u < r; ) {
        for (l = t[u]; u < r && ((n = e[u]), (i = Oo(n)) !== void 0); ) (l += i + t[++u]), (p = !0);
        u !== r && a.push(n), s.push(l), u++;
      }
      if ((u === r && s.push(t[r]), p)) {
        const h = s.join('$$lit$$');
        (t = jt.get(h)) === void 0 && ((s.raw = s), jt.set(h, (t = s))), (e = a);
      }
      return o(t, ...e);
    },
  gt = Uo(E);
var g = class extends k {
  constructor() {
    super(...arguments),
      (this.formControlController = new ie(this, { assumeInteractionOn: ['click'] })),
      (this.hasSlotController = new ne(this, '[default]', 'prefix', 'suffix')),
      (this.localize = new St(this)),
      (this.hasFocus = !1),
      (this.invalid = !1),
      (this.title = ''),
      (this.variant = 'default'),
      (this.size = 'medium'),
      (this.caret = !1),
      (this.disabled = !1),
      (this.loading = !1),
      (this.outline = !1),
      (this.pill = !1),
      (this.circle = !1),
      (this.type = 'button'),
      (this.name = ''),
      (this.value = ''),
      (this.href = ''),
      (this.rel = 'noreferrer noopener');
  }
  get validity() {
    return this.isButton() ? this.button.validity : Et;
  }
  get validationMessage() {
    return this.isButton() ? this.button.validationMessage : '';
  }
  firstUpdated() {
    this.isButton() && this.formControlController.updateValidity();
  }
  handleBlur() {
    (this.hasFocus = !1), this.emit('sl-blur');
  }
  handleFocus() {
    (this.hasFocus = !0), this.emit('sl-focus');
  }
  handleClick() {
    this.type === 'submit' && this.formControlController.submit(this),
      this.type === 'reset' && this.formControlController.reset(this);
  }
  handleInvalid(o) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(o);
  }
  isButton() {
    return !this.href;
  }
  isLink() {
    return !!this.href;
  }
  handleDisabledChange() {
    this.isButton() && this.formControlController.setValidity(this.disabled);
  }
  click() {
    this.button.click();
  }
  focus(o) {
    this.button.focus(o);
  }
  blur() {
    this.button.blur();
  }
  checkValidity() {
    return this.isButton() ? this.button.checkValidity() : !0;
  }
  getForm() {
    return this.formControlController.getForm();
  }
  reportValidity() {
    return this.isButton() ? this.button.reportValidity() : !0;
  }
  setCustomValidity(o) {
    this.isButton() && (this.button.setCustomValidity(o), this.formControlController.updateValidity());
  }
  render() {
    const o = this.isLink(),
      t = o ? qt`a` : qt`button`;
    return gt`
      <${t}
        part="base"
        class=${yt({ button: !0, 'button--default': this.variant === 'default', 'button--primary': this.variant === 'primary', 'button--success': this.variant === 'success', 'button--neutral': this.variant === 'neutral', 'button--warning': this.variant === 'warning', 'button--danger': this.variant === 'danger', 'button--text': this.variant === 'text', 'button--small': this.size === 'small', 'button--medium': this.size === 'medium', 'button--large': this.size === 'large', 'button--caret': this.caret, 'button--circle': this.circle, 'button--disabled': this.disabled, 'button--focused': this.hasFocus, 'button--loading': this.loading, 'button--standard': !this.outline, 'button--outline': this.outline, 'button--pill': this.pill, 'button--rtl': this.localize.dir() === 'rtl', 'button--has-label': this.hasSlotController.test('[default]'), 'button--has-prefix': this.hasSlotController.test('prefix'), 'button--has-suffix': this.hasSlotController.test('suffix') })}
        ?disabled=${f(o ? void 0 : this.disabled)}
        type=${f(o ? void 0 : this.type)}
        title=${this.title}
        name=${f(o ? void 0 : this.name)}
        value=${f(o ? void 0 : this.value)}
        href=${f(o && !this.disabled ? this.href : void 0)}
        target=${f(o ? this.target : void 0)}
        download=${f(o ? this.download : void 0)}
        rel=${f(o ? this.rel : void 0)}
        role=${f(o ? void 0 : 'button')}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? '-1' : '0'}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret ? gt` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> ` : ''}
        ${this.loading ? gt`<sl-spinner part="spinner"></sl-spinner>` : ''}
      </${t}>
    `;
  }
};
g.styles = [nt, Bo];
g.dependencies = { 'sl-icon': $, 'sl-spinner': pe };
c([ue('.button')], g.prototype, 'button', 2);
c([st()], g.prototype, 'hasFocus', 2);
c([st()], g.prototype, 'invalid', 2);
c([d()], g.prototype, 'title', 2);
c([d({ reflect: !0 })], g.prototype, 'variant', 2);
c([d({ reflect: !0 })], g.prototype, 'size', 2);
c([d({ type: Boolean, reflect: !0 })], g.prototype, 'caret', 2);
c([d({ type: Boolean, reflect: !0 })], g.prototype, 'disabled', 2);
c([d({ type: Boolean, reflect: !0 })], g.prototype, 'loading', 2);
c([d({ type: Boolean, reflect: !0 })], g.prototype, 'outline', 2);
c([d({ type: Boolean, reflect: !0 })], g.prototype, 'pill', 2);
c([d({ type: Boolean, reflect: !0 })], g.prototype, 'circle', 2);
c([d()], g.prototype, 'type', 2);
c([d()], g.prototype, 'name', 2);
c([d()], g.prototype, 'value', 2);
c([d()], g.prototype, 'href', 2);
c([d()], g.prototype, 'target', 2);
c([d()], g.prototype, 'rel', 2);
c([d()], g.prototype, 'download', 2);
c([d()], g.prototype, 'form', 2);
c([d({ attribute: 'formaction' })], g.prototype, 'formAction', 2);
c([d({ attribute: 'formenctype' })], g.prototype, 'formEnctype', 2);
c([d({ attribute: 'formmethod' })], g.prototype, 'formMethod', 2);
c([d({ attribute: 'formnovalidate', type: Boolean })], g.prototype, 'formNoValidate', 2);
c([d({ attribute: 'formtarget' })], g.prototype, 'formTarget', 2);
c([B('disabled', { waitUntilFirstUpdate: !0 })], g.prototype, 'handleDisabledChange', 1);
g.define('sl-button');
if (document.querySelector('.reviews__container')) {
  const o = '',
    t = Kt.getMovieIdFromPath(),
    e = new Ie(o, t),
    r = new Pe(o, t);
  new Me(e).initReviews(document.querySelector('.reviews__container')),
    new ze(r).renderAvRating(document.querySelector('.averageRating__container'));
} else console.log('Not on a movie page, skipping reviews.');
const ge = document.querySelector('.review');
console.log(ge);
try {
  ge ? new Le().render() : console.log('No review element found');
} catch (o) {
  console.error('Error initializing review service:', o);
}
window.location.pathname === '/' &&
  document.addEventListener('DOMContentLoaded', async () => {
    ye();
    const o = new Ne('/api/top-movies'),
      t = new De('.topmovies__list');
    t.renderLoadingMessage();
    const e = await o.fetchTopMovies();
    e.length ? t.renderMovies(e) : (t.renderErrorMessage(), console.log('No movies received, showing error message'));
  });
window.location.pathname === '/' &&
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.movie-card')) $e();
    else {
      const o = document.querySelector('.movies__header'),
        t = document.createElement('p');
      (t.textContent = 'Inga visningar för tillfället...'),
        t.classList.add('no-showings'),
        o.insertAdjacentElement('afterend', t);
    }
  });
window.location.pathname === '/loginM' && (Be(), Gt());
window.location.pathname === '/registerM' && (Oe(), Gt());
window.location.pathname === '/profile' && Ue();
