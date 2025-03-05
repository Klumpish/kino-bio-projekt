document.addEventListener('DOMContentLoaded', () => {
  const a = document.querySelector('.hamburger'),
    e = document.querySelector('.hamburger__items'),
    t = document.querySelector('.hamburger__close');
  a &&
    e &&
    a.addEventListener('click', () => {
      e.classList.toggle('active'), a.classList.toggle('open');
    }),
    t &&
      t.addEventListener('click', () => {
        e.classList.remove('active'), a.classList.remove('open');
      });
});
class w {
  constructor(e) {
    this.apiPath = e;
  }
  async fetchData() {
    try {
      return (await (await fetch(this.apiPath)).json()).liveEvents;
    } catch (e) {
      return console.error('Error fetching data:', e), [];
    }
  }
}
class f {
  constructor(e) {
    this.container = document.querySelector(e);
  }
  createLiveEvent({ title: e, description: t, image: n }) {
    const s = document.createElement('li');
    return (
      s.classList.add('live__list-item'),
      (s.innerHTML = `
        <div class="live__list-item-image-wrapper">
                <img src="${n}" class="live__list-item-image" alt="${e}" />
            </div>
            <div class="live__list-item-title">
                <h3>${e}</h3>
                <button class="live__list-item-btn" aria-label="Book ticket to live event">BOKA</button>
            </div>
            <div class="live__list-item-description">
                <p>${t}</p>
            </div>
            `),
      s
    );
  }
  renderLiveEvents(e) {
    if (!this.container) {
      console.error('Container element not found');
      return;
    }
    if (!Array.isArray(e) || e.length === 0) {
      this.container.innerHTML = '<p> No live events founds.</p>';
      return;
    }
    this.container.innerHTML = '';
    const t = document.createDocumentFragment();
    e.forEach((n) => {
      const s = this.createLiveEvent(n);
      t.appendChild(s);
    }),
      this.container.appendChild(t);
  }
}
async function E() {
  const a = './static/dist/json/liveEvents.json',
    e = new w(a),
    t = new f('.live__list');
  try {
    const n = await e.fetchData();
    t.renderLiveEvents(n);
  } catch (n) {
    console.error('Error initializing live events:', n);
  }
}
const S = async () => {
  if (window.location.pathname.startsWith('/movie/')) {
    const e = (function () {
      const n = window.location.pathname.match(/\/movie\/(\d+)/);
      return n ? n[1] : null;
    })();
    if (e)
      try {
        const n = await (await fetch(`/api/screenings/${e}/movie`)).json();
        return !n || n.length === 0
          ? (console.warn('No screening available for this movie'), [])
          : n.map((o) => {
              const r = new Date(o.start_time),
                i = r.getFullYear(),
                l = (r.getMonth() + 1).toString().padStart(2, '0'),
                c = r.getDate().toString().padStart(2, '0'),
                d = r.getHours().toString().padStart(2, '0'),
                u = r.getMinutes().toString().padStart(2, '0');
              return { formattedTime: `${i}-${l}-${c} ${d}:${u}`, room: o.room };
            });
      } catch (t) {
        return console.error('Error fetching screenings:', t), null;
      }
    else return console.error('No movie ID found in the url'), null;
  }
  return null;
};
async function L() {
  if (window.location.pathname.startsWith('/movie/')) {
    const a = await S(),
      e = document.querySelector('.screening__info-list');
    if (!a || a.length === 0) {
      console.log('No screening data available.');
      const t = document.createElement('li');
      (t.innerHTML = ' <span class="screening-time">Listan är tom</span>'), e.appendChild(t);
      return;
    }
    a.sort((t, n) => {
      const s = new Date(t.formattedTime),
        o = new Date(n.formattedTime);
      return s - o;
    }),
      (e.innerHTML = ''),
      a.forEach(({ formattedTime: t, room: n }) => {
        const s = document.createElement('li');
        (s.innerHTML = ` <span class="screening-time">Tid: ${t}</span>
  <span class="screening-room">Sal: ${n}</span>`),
          e.appendChild(s);
      });
  }
}
L();
const g = async (a) => {
  const e = `/movie/${a}/screenings/upcoming`;
  return await (await fetch(e)).json();
};
async function y() {
  const a = document.querySelectorAll('.movie-link'),
    e = Array.prototype.map.call(a, (s) => s.id);
  let t = 0;
  const n = [];
  for (const s of e)
    try {
      const o = await g(s);
      console.log(`Upcoming screenings for movie ID ${s}:`, o);
      const r = document.getElementById(s);
      if (!r) {
        console.error(`No movie container found for movie ID ${s}`);
        continue;
      }
      if (o.length > 0) {
        const i = o[0],
          l = new Date(i.attributes.start_time),
          c = i.attributes.room;
        if (l && c) {
          const d = document.createElement('p');
          d.classList.add('showings'),
            (d.textContent = `${c} - ${l.toLocaleString()}`),
            r.appendChild(d),
            t++,
            n.push(i);
        } else console.error(`Invalid screening data for movie ID ${s}:`, i);
      } else {
        const i = document.createElement('p');
        (i.textContent = 'Inga visningar'), i.classList.add('no-showings'), r.appendChild(i);
      }
      if (t >= 10) break;
    } catch (o) {
      console.error(`Error fetching screenings for movie ID ${s}:`, o);
    }
  if (t < 10)
    for (const s of e)
      try {
        const r = (await g(s)).filter((i) => !n.includes(i));
        for (const i of r) {
          if (t >= 10) break;
          const l = new Date(i.attributes.start_time),
            c = i.attributes.room;
          if (l && c) {
            const d = document.getElementById(s),
              u = document.createElement('p');
            u.classList.add('showings'),
              (u.textContent = `${c} - ${l.toLocaleString()}`),
              d.appendChild(u),
              t++,
              n.push(i);
          } else console.error(`Invalid screening data for movie ID ${s}:`, i);
        }
        if (t >= 10) break;
      } catch (o) {
        console.error(`Error fetching screenings for movie ID ${s}:`, o);
      }
}
class v {
  static getMovieIdFromPath() {
    const t = window.location.pathname.match(/\/movie\/(\d+)/);
    if (!t || !t[1]) throw new Error('Movie ID not found in URL');
    return t[1];
  }
}
class C {
  static validate(e, t, n) {
    if (!t || t < 1) throw new Error('Please select a rating');
    if (!(e != null && e.trim())) throw new Error('Please write a review');
    if (!n.authBtnClick && !n.isLoggedIn) throw new Error('Wrong password');
    return !0;
  }
}
class I {
  static format(e, t, n, s) {
    return {
      data: {
        comment: e,
        rating: t,
        author: s.username,
        verified: s.status,
        movie: n,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }
}
class b {
  static async submit(e, t) {
    const n = await fetch('/movie/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t),
    });
    if (!n.ok) throw new Error('Failed to submit review');
    return n.json();
  }
}
class _ extends EventTarget {
  constructor(e) {
    super(),
      (this.api = e),
      (this.result = 'Guest'),
      (this.status = !1),
      (this.dialog = null),
      (this.isLoggedIn = !1),
      (this.authBtnClick = !1);
  }
  render() {
    (this.dialog = document.createElement('dialog')), (this.dialog.className = 'auth-dialog');
    const e = document.createElement('span');
    (e.className = 'auth-guest'), (e.innerHTML = 'Submit as a guest');
    const t = document.createElement('span');
    (t.className = 'hint'), (t.innerHTML = 'The default password is: default');
    const n = document.createElement('form');
    (n.method = 'dialog'), (n.className = 'auth-form');
    const s = document.createElement('div');
    s.className = 'input-group';
    const o = document.createElement('label');
    (o.className = 'auth-label'), (o.htmlFor = 'username'), (o.textContent = 'Username:');
    const r = document.createElement('input');
    (r.className = 'auth-input'), (r.type = 'text'), (r.id = 'username'), (r.required = !0);
    const i = document.createElement('div');
    i.className = 'input-group';
    const l = document.createElement('label');
    (l.className = 'auth-label'), (l.htmlFor = 'password'), (l.textContent = 'Password:');
    const c = document.createElement('input');
    (c.className = 'auth-input'), (c.type = 'password'), (c.id = 'password'), (c.required = !0);
    const d = document.createElement('button');
    return (
      (d.className = 'submit-button'),
      (d.type = 'submit'),
      (d.textContent = 'Login'),
      e.addEventListener('click', () => {
        (this.authBtnClick = !0), this.dispatchEvent(new Event('auth')), this.dialog.close();
      }),
      n.addEventListener('submit', async (u) => {
        u.preventDefault();
        try {
          const m = await this.api.login(r.value, c.value),
            h = await this.api.getUserData(m.token);
          (this.result = h.user.username),
            (this.status = h.user.isVerified),
            (this.isLoggedIn = h.user.isLoggedIn),
            this.dispatchEvent(new Event('auth')),
            this.dialog.close();
        } catch {
          this.dialog.close(), this.dispatchEvent(new Event('auth'));
        }
      }),
      s.append(o, r),
      i.append(l, c),
      n.append(s, i, d, t, e),
      this.dialog.append(n),
      this.dialog
    );
  }
}
class x {
  constructor(e) {
    this.apiUrl = e;
  }
  async login(e, t) {
    const n = `${e}:${t}`,
      s = btoa(n),
      o = await fetch(this.apiUrl + '/login', { method: 'POST', headers: { Authorization: 'Basic ' + s } });
    if (!o.ok) throw new Error('Login failed');
    return await o.json();
  }
  async getUserData(e) {
    const t = await fetch(this.apiUrl + '/user', { headers: { Authorization: 'Bearer ' + e } });
    if (!t.ok) throw new Error('Failed to get user data');
    return await t.json();
  }
}
class M {
  constructor() {}
  static async showAuthDialog() {
    const e = new x(''),
      t = new _(e),
      n = t.render();
    return (
      document.body.appendChild(n),
      n.showModal(),
      await new Promise((s) => {
        t.addEventListener('auth', s, { once: !0 });
      }),
      n.close(),
      n.remove(),
      { username: t.result, status: t.status, isLoggedIn: t.isLoggedIn, authBtnClick: t.authBtnClick }
    );
  }
}
class k {
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
    for (let e = 1; e <= 5; e++) {
      const t = document.createElement('span');
      (t.className = 'review__star'), (t.dataset.value = e), (t.textContent = '★'), this.stars.appendChild(t);
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
    const e = document.querySelector('.review');
    if (!e) throw new Error('Review container not found');
    e.appendChild(this.container);
  }
  attachEventListeners() {
    this.stars.querySelectorAll('.review__star').forEach((e) => {
      e.addEventListener('click', () => this.handleStarClick(e));
    }),
      this.submit.addEventListener('click', () => this.handleSubmit());
  }
  handleStarClick(e) {
    (this.selectedRating = parseInt(e.dataset.value)), this.updateStars();
  }
  updateStars() {
    this.stars.querySelectorAll('.review__star').forEach((e) => {
      const t = parseInt(e.dataset.value);
      e.classList.toggle('active', t <= this.selectedRating);
    });
  }
  async validateReview() {
    const e = this.textarea.value.trim(),
      t = v.getMovieIdFromPath(),
      n = await M.showAuthDialog();
    return console.log('author:', n), C.validate(e, this.selectedRating, n), I.format(e, this.selectedRating, t, n);
  }
  async handleSubmit() {
    try {
      const e = await this.validateReview();
      console.log(`Film id: ${e.data.movie}`),
        console.log(`Film data: ${e}`),
        await b.submit(e.data.movie, e),
        this.resetForm(),
        this.showSuccess('Review submitted successfully!');
    } catch (e) {
      this.showError(e.message);
    }
  }
  resetForm() {
    (this.selectedRating = 0), (this.textarea.value = ''), this.updateStars();
  }
  showSuccess(e) {
    this.showFeedback(e, 'success');
  }
  showError(e) {
    this.showFeedback(e, 'error');
  }
  showFeedback(e, t) {
    const n = document.createElement('div');
    (n.className = `review__feedback review__feedback--${t}`),
      (n.textContent = e),
      this.container.appendChild(n),
      setTimeout(() => n.remove(), 5e3);
  }
}
class R {
  constructor(e, t, n = 1, s = 5) {
    (this.url = e), (this.movieId = t), (this.page = n), (this.pageSize = s);
  }
  async fetchReviews() {
    try {
      const e = await fetch(`${this.url}/movie/${this.movieId}/reviews?page=${this.page}&pageSize=${this.pageSize}`);
      if (!e.ok) throw new Error('Failed to fetch reviews');
      return await e.json();
    } catch (e) {
      return console.error('Error fetching movie reviews:', e), { data: [], meta: { currentPage: 1, totalPages: 1 } };
    }
  }
  setPage(e) {
    this.page = e;
  }
}
class D {
  constructor(e) {
    this.data = e;
  }
  render() {
    const e = document.createElement('div');
    e.classList.add('review');
    const t = document.createElement('span');
    (t.textContent = this.data.rating), e.appendChild(t);
    const n = document.createElement('p');
    (n.textContent = this.data.comment), e.appendChild(n);
    const s = document.createElement('h4');
    return (s.textContent = this.data.author), e.appendChild(s), e;
  }
}
class $ {
  constructor(e) {
    (this.backend = e), (this.currentPage = 1), (this.totalPages = 1);
  }
  async initReviews(e) {
    const { reviews: t, meta: n } = await this.backend.fetchReviews();
    (this.totalPages = n.totalPages),
      (this.reviewsContainer = document.createElement('div')),
      e.appendChild(this.reviewsContainer),
      (this.paginationContainer = document.createElement('div')),
      this.paginationContainer.classList.add('pagination'),
      e.appendChild(this.paginationContainer),
      this.renderReviews(t),
      this.renderPagination();
  }
  renderReviews(e) {
    (this.reviewsContainer.innerHTML = ''),
      e.forEach((t) => {
        const n = new D(t);
        this.reviewsContainer.append(n.render());
      });
  }
  renderPagination() {
    this.paginationContainer.innerHTML = '';
    const e = document.createElement('button');
    (e.textContent = 'Föregående'),
      (e.disabled = this.currentPage === 1),
      e.addEventListener('click', () => this.changePage(this.currentPage - 1));
    const t = document.createElement('button');
    (t.textContent = 'Nästa'),
      (t.disabled = this.currentPage === this.totalPages),
      t.addEventListener('click', () => this.changePage(this.currentPage + 1));
    const n = document.createElement('span');
    (n.textContent = `Sida ${this.currentPage} av ${this.totalPages}`),
      this.paginationContainer.appendChild(e),
      this.paginationContainer.appendChild(n),
      this.paginationContainer.appendChild(t);
  }
  async changePage(e) {
    if (e < 1 || e > this.totalPages) return;
    (this.currentPage = e), this.backend.setPage(e);
    const { reviews: t } = await this.backend.fetchReviews();
    this.renderReviews(t), this.updatePagination();
  }
  updatePagination() {
    const e = this.paginationContainer.querySelector('button:first-child'),
      t = this.paginationContainer.querySelector('button:last-child'),
      n = this.paginationContainer.querySelector('span');
    (e.disabled = this.currentPage === 1),
      (t.disabled = this.currentPage === this.totalPages),
      (n.textContent = `Sida ${this.currentPage} av ${this.totalPages}`);
  }
}
class P {
  constructor(e, t) {
    (this.url = e), (this.movieId = t);
  }
  async fetchAverageRating() {
    try {
      const e = await fetch(`${this.url}/movie/${this.movieId}/ratings/average`);
      if (!e.ok) throw new Error('Failed to fetch average rating');
      return (await e.json()).averageRating;
    } catch (e) {
      return console.error('Error fetching average rating:', e), null;
    }
  }
}
class q {
  constructor(e) {
    this.ratingValue = e;
  }
  render() {
    const e = document.createElement('div');
    e.classList.add('rating');
    const t = document.createElement('span');
    return t.classList.add('rating__value'), (t.textContent = this.ratingValue.toFixed(1)), e.appendChild(t), e;
  }
}
class F {
  constructor(e, t) {
    (this.backend = e), (this.movieId = t);
  }
  async renderAvRating(e) {
    const t = await this.backend.fetchAverageRating();
    if (t !== null) {
      const n = new q(t);
      e.appendChild(n.render());
    }
  }
}
class B {
  constructor(e) {
    this.apiUrl = e;
  }
  async fetchTopMovies() {
    try {
      const e = await fetch(this.apiUrl),
        t = await e.json();
      if (!e.ok)
        throw (
          (console.error('Serverfel vid hämtning:', e.status, e.statusText, t),
          new Error('Serverfel vid hämtning av topplistan.'))
        );
      return console.log('Hämtade toppfilmer:', t), t;
    } catch (e) {
      console.error('Fel vid hämtning av topprankade filmer:', e);
      const t = document.createElement('span');
      (t.textContent = 'Kunde inte hämta populära filmer. Försök igen senare.'),
        (t.style.color = 'white'),
        (t.style.textAlign = 'center');
      const n = document.querySelector('.topmovies');
      return n && n.appendChild(t), [];
    }
  }
}
class T {
  constructor(e) {
    this.moviesList = document.querySelector(e);
  }
  clearList() {
    for (; this.moviesList.firstChild; ) this.moviesList.removeChild(this.moviesList.firstChild);
  }
  renderLoadingMessage() {
    this.clearList();
    const e = document.createElement('li');
    e.classList.add('loading__top_movies'), (e.textContent = 'Laddar topplistan...'), this.moviesList.appendChild(e);
  }
  renderErrorMessage() {
    this.clearList();
    const e = document.createElement('li');
    (e.textContent = 'Kunde inte ladda populära filmer.'),
      (e.style.color = 'white'),
      (e.style.textAlign = 'center'),
      this.moviesList.appendChild(e);
  }
  renderMovies(e) {
    if ((this.clearList(), !e.length)) {
      const t = document.createElement('li');
      (t.textContent = 'Inga topprankade filmer hittades.'), this.moviesList.appendChild(t);
      return;
    }
    e.forEach((t) => {
      var c;
      const n = document.createElement('li'),
        s = document.createElement('a');
      (s.href = `/movie/${t.id}`), (s.id = t.id);
      const o = document.createElement('article');
      o.classList.add('topmovie-card');
      const r = document.createElement('img');
      r.classList.add('topmovie-card__image'),
        (r.src = ((c = t.attributes.image) == null ? void 0 : c.url) || '/static/dist/images/Kino_doors.png'),
        (r.alt = `Movie title: ${t.attributes.title}`);
      const i = document.createElement('h3');
      i.classList.add('topmovie-card_title'), (i.textContent = t.attributes.title);
      const l = document.createElement('span');
      l.classList.add('topmovie-card_rating'),
        (l.textContent = `⭐ Rating: ${t.attributes.avgRating}/5`),
        o.appendChild(r),
        o.appendChild(i),
        o.appendChild(l),
        s.appendChild(o),
        n.appendChild(s),
        this.moviesList.appendChild(n);
    });
  }
}
class A {
  constructor() {}
  initSignUp(e) {
    const t = e.querySelector('#namn'),
      n = e.querySelector('#efternamn'),
      s = e.querySelector('#anvandarnamn'),
      o = e.querySelector('#email'),
      r = e.querySelector('#phone-input'),
      i = e.querySelector('#password'),
      l = e.querySelector('#confirm-password'),
      c = e.querySelector('#passwordWarning'),
      d = document.createElement('p');
    d.classList.add('text-sm', 'mt-2'),
      i.insertAdjacentElement('afterend', d),
      this.loadFromLocalStorage(t, 'namn'),
      this.loadFromLocalStorage(n, 'efternamn'),
      this.loadFromLocalStorage(s, 'anvandarnamn'),
      this.loadFromLocalStorage(o, 'email'),
      this.loadFromLocalStorage(r, 'phone'),
      i.addEventListener('input', () => {
        localStorage.setItem('password', i.value), this.updatePasswordStrength(i.value, d);
      }),
      e.addEventListener('submit', async (u) => {
        if ((u.preventDefault(), i.value !== l.value)) {
          (c.innerText = 'Lösenordet matchar inte'), c.classList.remove('hidden');
          return;
        } else (c.innerText = ''), c.classList.add('hidden');
        const m = {
          namn: t.value,
          efternamn: n.value,
          anvandarnamn: s.value,
          email: o.value,
          phone: r.value,
          password: i.value,
        };
        console.log('Sending data to localStorage:', m),
          localStorage.setItem('userData', JSON.stringify(m)),
          this.showCustomModal(),
          this.resetForm(e);
      });
  }
  loadFromLocalStorage(e, t) {
    e &&
      ((e.value = localStorage.getItem(t) || ''),
      e.addEventListener('input', () => {
        localStorage.setItem(t, e.value);
      }));
  }
  updatePasswordStrength(e, t) {
    let n = { text: 'Svagt lösenord', color: 'red' };
    const s = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      o = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    s.test(e)
      ? (n = { text: 'Starkt lösenord', color: 'green' })
      : o.test(e) && (n = { text: 'Medelstarkt lösenord', color: 'orange' }),
      (t.textContent = n.text),
      (t.style.color = n.color);
  }
  showCustomModal() {
    const e = document.getElementById('customModal');
    e.classList.remove('hidden');
    const t = document.getElementById('closeModal'),
      n = document.getElementById('loginButton');
    t.addEventListener('click', () => {
      e.classList.add('hidden'), (window.location.href = '/login');
    }),
      n.addEventListener('click', () => {
        e.classList.add('hidden'), (window.location.href = '/login');
      });
  }
  resetForm(e) {
    e.reset(),
      localStorage.removeItem('namn'),
      localStorage.removeItem('efternamn'),
      localStorage.removeItem('anvandarnamn'),
      localStorage.removeItem('email'),
      localStorage.removeItem('phone'),
      localStorage.removeItem('password');
  }
}
class N {
  constructor() {}
  initLogin(e) {
    const t = e.querySelector('#email'),
      n = e.querySelector('#password');
    document.createElement('p').classList.add('text-sm', 'mt-2');
    const o = JSON.parse(localStorage.getItem('userData'));
    e.addEventListener('submit', (r) => {
      r.preventDefault();
      let i = !1;
      if (
        (document.querySelectorAll('.error-message').forEach((l) => l.remove()),
        t.classList.remove('border-red-500'),
        n.classList.remove('border-red-500'),
        !o)
      ) {
        this.showError(t, 'Inget konto hittades. Var vänlig registrera dig först.');
        return;
      }
      t.value !== o.email && (this.showError(t, 'Fel e-postadress.'), (i = !0)),
        n.value !== o.password && (this.showError(n, 'Fel lösenord.'), (i = !0)),
        i || this.showSuccess(e),
        console.log(o);
    });
  }
  showError(e, t) {
    const n = document.createElement('p');
    (n.innerText = t),
      n.classList.add('text-red-500', 'text-sm', 'mt-1', 'error-message'),
      e.classList.add('border-red-500'),
      e.parentNode.appendChild(n);
  }
  showSuccess(e) {
    const t = document.getElementById('successModal');
    t.classList.remove('hidden'),
      document.getElementById('redirectButton').addEventListener('click', () => {
        window.location.href = '/userprofile';
      }),
      document.getElementById('closeModal').addEventListener('click', () => {
        t.classList.add('hidden');
      });
  }
}
class U {
  constructor() {}
  initProfile(e) {
    const t = JSON.parse(localStorage.getItem('userData')),
      n = document.querySelector('#username');
    n.textContent = `${t.anvandarnamn}`;
    const s = document.querySelector('#fullName');
    s.textContent = `${t.namn} ${t.efternamn}`;
    const o = document.querySelector('#phone');
    o.textContent = `${t.phone}`;
    const r = document.querySelector('#email');
    r.textContent = `${t.email}`;
  }
  logout() {
    localStorage.removeItem('userData'), (window.location.href = '/login');
  }
}
if (document.querySelector('.reviews__container')) {
  const a = 'http://localhost:5080',
    e = v.getMovieIdFromPath(),
    t = new R(a, e),
    n = new P(a, e);
  new $(t).initReviews(document.querySelector('.reviews__container')),
    new F(n).renderAvRating(document.querySelector('.averageRating__container'));
} else console.log('Not on a movie page, skipping reviews.');
const p = document.querySelector('.review');
console.log(p);
try {
  p ? new k().render() : console.log('No review element found');
} catch (a) {
  console.error('Error initializing review service:', a);
}
window.location.pathname === '/' &&
  document.addEventListener('DOMContentLoaded', async () => {
    E();
    const a = new B('/api/top-movies'),
      e = new T('.topmovies__list');
    e.renderLoadingMessage();
    const t = await a.fetchTopMovies();
    t.length ? e.renderMovies(t) : (e.renderErrorMessage(), console.log('No movies received, showing error message'));
  });
window.location.pathname === '/' &&
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.movie-card')) y();
    else {
      const a = document.querySelector('.movies__header'),
        e = document.createElement('p');
      (e.textContent = 'Inga visningar för tillfället...'),
        e.classList.add('no-showings'),
        a.insertAdjacentElement('afterend', e);
    }
  });
document.addEventListener('DOMContentLoaded', () => {
  const a = document.querySelector('#signupForm');
  a && new A().initSignUp(a);
  const e = document.querySelector('#loginForm');
  e && new N().initLogin(e);
  const t = document.querySelector('#userProfile');
  if (t) {
    const n = new U();
    n.initProfile(t);
    const s = document.querySelector('#logoutButton');
    s &&
      s.addEventListener('click', () => {
        n.logout();
      });
  }
});
